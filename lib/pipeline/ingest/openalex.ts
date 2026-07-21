import { INTEREST_KEYWORDS } from "@/lib/pipeline/config/interest-keywords";
import { buildMetrics, finalizeSource } from "@/lib/pipeline/ingest/collector-utils";
import type {
  InterestId,
  ObservationSample,
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import { getComparisonRanges } from "@/lib/pipeline/utils/periods";
import { fetchJson, RateLimiter } from "@/lib/pipeline/utils/http";

/**
 * OpenAlex collector — scholarly output across ALL fields, filling the research
 * gaps arXiv (CS/physics) and PubMed (biomedical) miss (energy, materials,
 * economics…). Keyless; `mailto` opts into the polite pool. Per interest: the
 * works count in the current vs previous week, plus a few representative titles.
 */
const SOURCE: PipelineSourceId = "openalex";
const BASE = "https://api.openalex.org/works";
const MAILTO = "pipeline@horizoniq.app";
const rate = new RateLimiter(250);

const COVERED: InterestId[] = [
  "artificial-intelligence",
  "robotics",
  "quantum-computing",
  "cybersecurity",
  "cloud-computing",
  "manufacturing",
  "supply-chain",
  "healthcare",
  "finance",
  "energy",
  "biotechnology",
  "biochemistry",
  "life-sciences",
];

interface OpenAlexResponse {
  meta?: { count?: number };
  results?: Array<{ title?: string; id?: string; doi?: string }>;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function query(
  keyword: string,
  start: Date,
  end: Date,
  perPage: number
): Promise<OpenAlexResponse> {
  const url =
    `${BASE}?search=${encodeURIComponent(keyword)}` +
    `&filter=${encodeURIComponent(
      `from_publication_date:${isoDate(start)},to_publication_date:${isoDate(end)}`
    )}` +
    `&per-page=${perPage}&mailto=${MAILTO}`;
  return rate.schedule(() =>
    fetchJson<OpenAlexResponse>(url, { timeoutMs: 30_000, retries: 3 })
  );
}

export async function ingestOpenAlex(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let lastError: string | undefined;

  for (const interestId of COVERED) {
    const keyword = INTEREST_KEYWORDS[interestId];
    try {
      const [cur, prev] = await Promise.all([
        query(keyword, current.start, current.end, 3),
        query(keyword, previous.start, previous.end, 1),
      ]);
      const samples: ObservationSample[] = (cur.results ?? [])
        .slice(0, 3)
        .map((r) => ({
          title: (r.title ?? "Untitled").replace(/\s+/g, " ").trim(),
          url: r.id ?? r.doi ?? "https://openalex.org",
        }));
      interests[interestId] = {
        interestId,
        metrics: buildMetrics(cur.meta?.count ?? 0, prev.meta?.count ?? 0),
        samples,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "OpenAlex error";
    }
  }

  return finalizeSource(SOURCE, fetchedAt, interests, COVERED.length, lastError);
}
