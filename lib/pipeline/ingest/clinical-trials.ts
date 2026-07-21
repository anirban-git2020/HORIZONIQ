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
 * ClinicalTrials.gov collector (v2 API, keyless) — trial activity for the
 * bio/health interests. Per interest: studies last updated in the current vs
 * previous week, plus a few representative trials. NIH-authoritative.
 */
const SOURCE: PipelineSourceId = "clinical-trials";
const BASE = "https://clinicaltrials.gov/api/v2/studies";
const rate = new RateLimiter(400);

const COVERED: InterestId[] = [
  "healthcare",
  "biotechnology",
  "biochemistry",
  "life-sciences",
];

interface StudiesResponse {
  totalCount?: number;
  studies?: Array<{
    protocolSection?: {
      identificationModule?: { briefTitle?: string; nctId?: string };
    };
  }>;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function query(
  term: string,
  start: Date,
  end: Date,
  pageSize: number
): Promise<StudiesResponse> {
  const range = `AREA[LastUpdatePostDate]RANGE[${isoDate(start)},${isoDate(end)}]`;
  const url =
    `${BASE}?query.term=${encodeURIComponent(term)}` +
    `&filter.advanced=${encodeURIComponent(range)}` +
    `&countTotal=true&pageSize=${pageSize}`;
  return rate.schedule(() =>
    fetchJson<StudiesResponse>(url, { timeoutMs: 30_000, retries: 3 })
  );
}

export async function ingestClinicalTrials(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let lastError: string | undefined;

  for (const interestId of COVERED) {
    const term = INTEREST_KEYWORDS[interestId];
    try {
      const [cur, prev] = await Promise.all([
        query(term, current.start, current.end, 3),
        query(term, previous.start, previous.end, 1),
      ]);
      const samples: ObservationSample[] = (cur.studies ?? [])
        .slice(0, 3)
        .map((s) => {
          const mod = s.protocolSection?.identificationModule;
          return {
            title: (mod?.briefTitle ?? "Untitled trial").replace(/\s+/g, " ").trim(),
            url: mod?.nctId
              ? `https://clinicaltrials.gov/study/${mod.nctId}`
              : "https://clinicaltrials.gov",
          };
        });
      interests[interestId] = {
        interestId,
        metrics: buildMetrics(cur.totalCount ?? 0, prev.totalCount ?? 0),
        samples,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "ClinicalTrials error";
    }
  }

  return finalizeSource(SOURCE, fetchedAt, interests, COVERED.length, lastError);
}
