import { PUBMED_QUERIES } from "@/lib/pipeline/config/pubmed-queries";
import type {
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import { getLaggedComparisonRanges } from "@/lib/pipeline/utils/periods";
import { fetchJson, RateLimiter } from "@/lib/pipeline/utils/http";

/**
 * PubMed collector (NCBI E-utilities) — biomedical evidence for the
 * life-science interests. Keyless; an optional NCBI_API_KEY raises the rate
 * limit but is never required (unconfigured ≠ failed).
 *
 * Publication indexing lags real time, so both comparison windows are lagged a
 * week (`getLaggedComparisonRanges`) to compare fully-indexed periods. The delta
 * is what the scorer consumes, so the lag does not distort momentum.
 */
const SOURCE: PipelineSourceId = "pubmed";
const ESEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
const ESUMMARY = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";
// Keyless allows 3 req/s; 400ms keeps us comfortably under that.
const rateLimiter = new RateLimiter(400);

interface ESearchResponse {
  esearchresult?: { count?: string; idlist?: string[] };
}

interface ESummaryResponse {
  result?: Record<string, { title?: string } | string[] | undefined>;
}

function apiKeyParam(): string {
  const key = process.env.NCBI_API_KEY;
  return key ? `&api_key=${encodeURIComponent(key)}` : "";
}

function pubmedDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

function buildMetrics(current: number, previous: number | null) {
  const delta = previous === null ? null : current - previous;
  const deltaPercent =
    previous === null || previous === 0 || delta === null
      ? null
      : Math.round((delta / previous) * 100);
  return { current, previous, delta, deltaPercent };
}

async function esearch(
  term: string,
  start: Date,
  end: Date,
  retmax: number
): Promise<{ count: number; ids: string[] }> {
  const params =
    `?db=pubmed&retmode=json&datetype=edat` +
    `&mindate=${pubmedDate(start)}&maxdate=${pubmedDate(end)}` +
    `&retmax=${retmax}&term=${encodeURIComponent(term)}` +
    apiKeyParam();
  const data = await rateLimiter.schedule(() =>
    fetchJson<ESearchResponse>(`${ESEARCH}${params}`, {
      timeoutMs: 30_000,
      retries: 3,
    })
  );
  const count = Number(data.esearchresult?.count ?? "0");
  return {
    count: Number.isFinite(count) ? count : 0,
    ids: data.esearchresult?.idlist ?? [],
  };
}

async function esummaryTitles(
  ids: string[]
): Promise<Array<{ title: string; url: string }>> {
  if (ids.length === 0) return [];
  const params =
    `?db=pubmed&retmode=json&id=${ids.join(",")}` + apiKeyParam();
  try {
    const data = await rateLimiter.schedule(() =>
      fetchJson<ESummaryResponse>(`${ESUMMARY}${params}`, {
        timeoutMs: 30_000,
        retries: 2,
      })
    );
    return ids.map((id) => {
      const record = data.result?.[id];
      const title =
        record && !Array.isArray(record) ? record.title : undefined;
      return {
        title: (title ?? `PubMed record ${id}`).replace(/\s+/g, " ").trim(),
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      };
    });
  } catch {
    // Samples are non-critical; fall back to bare record links.
    return ids.map((id) => ({
      title: `PubMed record ${id}`,
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    }));
  }
}

export async function ingestPubMed(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getLaggedComparisonRanges(7);
  const interests: SourceObservation["interests"] = {};
  let failures = 0;
  let lastError: string | undefined;

  for (const config of PUBMED_QUERIES) {
    try {
      const currentResult = await esearch(config.term, current.start, current.end, 3);
      const previousResult = await esearch(
        config.term,
        previous.start,
        previous.end,
        0
      );
      const samples = await esummaryTitles(currentResult.ids.slice(0, 3));

      interests[config.interestId] = {
        interestId: config.interestId,
        metrics: buildMetrics(currentResult.count, previousResult.count),
        samples,
      };
    } catch (error) {
      failures += 1;
      lastError =
        error instanceof Error ? error.message : "Unknown PubMed ingest error";
    }
  }

  const successCount = Object.keys(interests).length;
  if (successCount === PUBMED_QUERIES.length) {
    return { source: SOURCE, status: "ok", fetchedAt, interests };
  }
  if (successCount >= PUBMED_QUERIES.length * 0.5) {
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
    error: lastError ?? "PubMed ingest failed",
    interests,
  };
}
