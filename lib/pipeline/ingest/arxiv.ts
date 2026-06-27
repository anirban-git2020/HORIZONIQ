import { INTEREST_QUERIES } from "@/lib/pipeline/config/interest-queries";
import type {
  InterestObservation,
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import { getComparisonRanges } from "@/lib/pipeline/utils/periods";
import { fetchText, RateLimiter } from "@/lib/pipeline/utils/http";

const SOURCE: PipelineSourceId = "arxiv";
const ARXIV_BASE = "https://export.arxiv.org/api/query";
const PAGE_SIZE = 100;
const MAX_PAGES = 2;
const rateLimiter = new RateLimiter(3_100);

function buildMetrics(current: number, previous: number | null) {
  const delta = previous === null ? null : current - previous;
  const deltaPercent =
    previous === null || previous === 0 || delta === null
      ? null
      : Math.round((delta / previous) * 100);
  return { current, previous, delta, deltaPercent };
}

function isArxivError(xml: string): boolean {
  return xml.includes("arxiv.org/api/errors");
}

function parseEntries(xml: string): Array<{ title: string; url: string; published: string }> {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries
    .filter((entry) => !entry.includes("arxiv.org/api/errors"))
    .map((entry) => ({
      title:
        entry
          .match(/<title>([\s\S]*?)<\/title>/)?.[1]
          ?.replace(/\s+/g, " ")
          .trim() ?? "Untitled",
      url: entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() ?? "https://arxiv.org",
      published:
        entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() ??
        entry.match(/<updated>([\s\S]*?)<\/updated>/)?.[1]?.trim() ??
        "",
    }));
}

function inRange(isoDate: string, start: Date, end: Date): boolean {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  return date >= start && date <= end;
}

async function fetchRecentEntries(
  searchQuery: string,
  pages = MAX_PAGES
): Promise<Array<{ title: string; url: string; published: string }>> {
  const all: Array<{ title: string; url: string; published: string }> = [];

  for (let page = 0; page < pages; page += 1) {
    const start = page * PAGE_SIZE;
    const query = encodeURIComponent(searchQuery);
    const url =
      `${ARXIV_BASE}?search_query=${query}` +
      `&start=${start}&max_results=${PAGE_SIZE}` +
      `&sortBy=submittedDate&sortOrder=descending`;

    const xml = await rateLimiter.schedule(() =>
      fetchText(url, { timeoutMs: 60_000, retries: 3 })
    );
    if (isArxivError(xml)) {
      throw new Error("arXiv API returned an error response");
    }

    const entries = parseEntries(xml);
    if (entries.length === 0) break;
    all.push(...entries);
    if (entries.length < PAGE_SIZE) break;
  }

  return all;
}

function countInRange(
  entries: Array<{ published: string }>,
  start: Date,
  end: Date
): number {
  return entries.filter((entry) => inRange(entry.published, start, end)).length;
}

export async function ingestArxiv(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let failures = 0;
  let lastError: string | undefined;

  for (const config of INTEREST_QUERIES) {
    try {
      const entries = await fetchRecentEntries(config.arxiv.searchQuery);
      const currentCount = countInRange(entries, current.start, current.end);
      const previousCount = countInRange(entries, previous.start, previous.end);

      interests[config.interestId] = {
        interestId: config.interestId,
        metrics: buildMetrics(currentCount, previousCount),
        samples: entries.slice(0, 3).map((entry) => ({
          title: entry.title,
          url: entry.url,
        })),
      };
    } catch (error) {
      failures += 1;
      lastError =
        error instanceof Error ? error.message : "Unknown arXiv ingest error";
    }
  }

  const successCount = Object.keys(interests).length;
  if (successCount === INTEREST_QUERIES.length) {
    return { source: SOURCE, status: "ok", fetchedAt, interests };
  }
  if (successCount >= INTEREST_QUERIES.length * 0.5) {
    return {
      source: SOURCE,
      status: "stale",
      fetchedAt,
      error: lastError ?? `${failures} interests failed`,
      interests,
    };
  }

  return {
    source: SOURCE,
    status: "failed",
    fetchedAt,
    error: lastError ?? "arXiv ingest failed",
    interests,
  };
}
