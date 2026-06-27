import { INTEREST_QUERIES } from "@/lib/pipeline/config/interest-queries";
import type {
  InterestObservation,
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import {
  getLaggedComparisonRanges,
  toWikimediaDate,
} from "@/lib/pipeline/utils/periods";
import { fetchJson } from "@/lib/pipeline/utils/http";

const SOURCE: PipelineSourceId = "wikimedia";
const WIKIMEDIA_BASE =
  "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user";

interface PageviewItem {
  views: number;
  timestamp: string;
}

interface PageviewResponse {
  items: PageviewItem[];
}

function buildMetrics(current: number, previous: number | null) {
  const delta = previous === null ? null : current - previous;
  const deltaPercent =
    previous === null || previous === 0 || delta === null
      ? null
      : Math.round((delta / previous) * 100);
  return { current, previous, delta, deltaPercent };
}

function sumViews(items: PageviewItem[]): number {
  return items.reduce((total, item) => total + (item.views ?? 0), 0);
}

async function fetchPageviews(
  article: string,
  start: Date,
  end: Date
): Promise<number> {
  const startStr = toWikimediaDate(start);
  const endStr = toWikimediaDate(end);
  const url = `${WIKIMEDIA_BASE}/${encodeURIComponent(article)}/daily/${startStr}/${endStr}`;
  const data = await fetchJson<PageviewResponse>(url);
  return sumViews(data.items ?? []);
}

export async function ingestWikimedia(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const interests: SourceObservation["interests"] = {};
  const lagAttempts = [7, 14, 365];
  let lastError: string | undefined;

  for (const lagDays of lagAttempts) {
    const { current, previous } = getLaggedComparisonRanges(lagDays);
    let failures = 0;

    try {
      for (const config of INTEREST_QUERIES) {
        try {
          const [currentViews, previousViews] = await Promise.all([
            fetchPageviews(config.wikimedia.article, current.start, current.end),
            fetchPageviews(
              config.wikimedia.article,
              previous.start,
              previous.end
            ),
          ]);

          const articleUrl = `https://en.wikipedia.org/wiki/${config.wikimedia.article}`;

          interests[config.interestId] = {
            interestId: config.interestId,
            metrics: buildMetrics(currentViews, previousViews),
            samples: [
              {
                title: `${config.label} — Wikipedia pageviews`,
                url: articleUrl,
                score: currentViews,
              },
            ],
          };
        } catch (error) {
          failures += 1;
          lastError =
            error instanceof Error ? error.message : "Wikimedia article fetch failed";
        }
      }

      const successCount = Object.keys(interests).length;
      if (successCount >= INTEREST_QUERIES.length * 0.8) {
        return { source: SOURCE, status: "ok", fetchedAt, interests };
      }
      if (successCount > 0 && failures > 0) {
        return {
          source: SOURCE,
          status: "stale",
          fetchedAt,
          error: `${failures} articles failed at lag ${lagDays}d`,
          interests,
        };
      }
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : "Unknown Wikimedia ingest error";
    }
  }

  const successCount = Object.keys(interests).length;
  if (successCount > 0) {
    return {
      source: SOURCE,
      status: "stale",
      fetchedAt,
      error: lastError,
      interests,
    };
  }

  return {
    source: SOURCE,
    status: "failed",
    fetchedAt,
    error: lastError ?? "Wikimedia ingest failed for all lag attempts",
    interests,
  };
}
