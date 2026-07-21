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
 * SEC EDGAR full-text search collector — how often a technology is named in
 * official corporate filings (a market-adoption signal). Keyless; SEC requires a
 * descriptive User-Agent, which the shared HTTP util already sends. Per interest:
 * filings matching the phrase in the current vs previous week, plus sample filers.
 */
const SOURCE: PipelineSourceId = "edgar";
const BASE = "https://efts.sec.gov/LATEST/search-index";
const rate = new RateLimiter(200);

const COVERED: InterestId[] = [
  "artificial-intelligence",
  "robotics",
  "quantum-computing",
  "cybersecurity",
  "cloud-computing",
  "manufacturing",
  "supply-chain",
  "finance",
  "energy",
  "biotechnology",
  "commerce",
  "healthcare",
];

interface EdgarResponse {
  hits?: {
    total?: { value?: number };
    hits?: Array<{
      _id?: string;
      _source?: { display_names?: string[]; ciks?: string[] };
    }>;
  };
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Best-effort link to the actual filing document; falls back to EDGAR search. */
function filingUrl(hit: { _id?: string; _source?: { ciks?: string[] } }): string {
  try {
    const [accession, file] = (hit._id ?? "").split(":");
    const cik = hit._source?.ciks?.[0];
    if (accession && file && cik) {
      return `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession.replace(/-/g, "")}/${file}`;
    }
  } catch {
    // fall through
  }
  return "https://www.sec.gov/cgi-bin/srqsb";
}

async function query(
  phrase: string,
  start: Date,
  end: Date
): Promise<EdgarResponse> {
  const url =
    `${BASE}?q=${encodeURIComponent(`"${phrase}"`)}` +
    `&dateRange=custom&startdt=${isoDate(start)}&enddt=${isoDate(end)}`;
  return rate.schedule(() =>
    fetchJson<EdgarResponse>(url, { timeoutMs: 30_000, retries: 3 })
  );
}

export async function ingestEdgar(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let lastError: string | undefined;

  for (const interestId of COVERED) {
    const phrase = INTEREST_KEYWORDS[interestId];
    try {
      const [cur, prev] = await Promise.all([
        query(phrase, current.start, current.end),
        query(phrase, previous.start, previous.end),
      ]);
      const samples: ObservationSample[] = (cur.hits?.hits ?? [])
        .slice(0, 3)
        .map((hit) => ({
          title: (hit._source?.display_names?.[0] ?? "SEC filing")
            .replace(/\s+/g, " ")
            .trim(),
          url: filingUrl(hit),
        }));
      interests[interestId] = {
        interestId,
        metrics: buildMetrics(
          cur.hits?.total?.value ?? 0,
          prev.hits?.total?.value ?? 0
        ),
        samples,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "EDGAR error";
    }
  }

  return finalizeSource(SOURCE, fetchedAt, interests, COVERED.length, lastError);
}
