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
 * USPTO PatentsView collector — granted-patent volume per technology (an
 * innovation/IP signal). The current PatentsView Search API needs a free key
 * (X-Api-Key). Without PATENTSVIEW_API_KEY the source degrades to "failed" and
 * the run continues — exactly like the other optional-key sources.
 */
const SOURCE: PipelineSourceId = "patents";
const BASE = "https://search.patentsview.org/api/v1/patent/";
const rate = new RateLimiter(1500);

const COVERED: InterestId[] = [
  "artificial-intelligence",
  "robotics",
  "quantum-computing",
  "cybersecurity",
  "cloud-computing",
  "manufacturing",
  "supply-chain",
  "energy",
  "biotechnology",
  "biochemistry",
  "healthcare",
];

interface PatentsResponse {
  error?: boolean;
  total_hits?: number;
  patents?: Array<{ patent_id?: string; patent_title?: string }>;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function query(
  apiKey: string,
  keyword: string,
  start: Date,
  end: Date,
  size: number
): Promise<PatentsResponse> {
  const body = JSON.stringify({
    q: {
      _and: [
        { _text_phrase: { patent_abstract: keyword } },
        { _gte: { patent_date: isoDate(start) } },
        { _lte: { patent_date: isoDate(end) } },
      ],
    },
    f: ["patent_id", "patent_title"],
    o: { size },
  });
  return rate.schedule(() =>
    fetchJson<PatentsResponse>(BASE, {
      timeoutMs: 30_000,
      retries: 2,
      init: {
        method: "POST",
        body,
        headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
      },
    })
  );
}

export async function ingestPatents(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const apiKey = process.env.PATENTSVIEW_API_KEY;
  if (!apiKey) {
    return {
      source: SOURCE,
      status: "failed",
      fetchedAt,
      error: "PATENTSVIEW_API_KEY not set — get a free key at patentsview.org/api",
      interests: {},
    };
  }

  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let lastError: string | undefined;

  for (const interestId of COVERED) {
    const keyword = INTEREST_KEYWORDS[interestId];
    try {
      const [cur, prev] = await Promise.all([
        query(apiKey, keyword, current.start, current.end, 3),
        query(apiKey, keyword, previous.start, previous.end, 1),
      ]);
      const samples: ObservationSample[] = (cur.patents ?? [])
        .slice(0, 3)
        .map((p) => ({
          title: (p.patent_title ?? "Untitled patent").replace(/\s+/g, " ").trim(),
          url: p.patent_id
            ? `https://patents.google.com/patent/US${p.patent_id}`
            : "https://www.patentsview.org",
        }));
      interests[interestId] = {
        interestId,
        metrics: buildMetrics(cur.total_hits ?? 0, prev.total_hits ?? 0),
        samples,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "PatentsView error";
    }
  }

  return finalizeSource(SOURCE, fetchedAt, interests, COVERED.length, lastError);
}
