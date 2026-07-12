import { GDELT_QUERIES } from "@/lib/pipeline/config/gdelt-queries";
import type {
  ObservationSample,
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import { getComparisonRanges } from "@/lib/pipeline/utils/periods";
import { fetchJson, RateLimiter } from "@/lib/pipeline/utils/http";

/**
 * GDELT 2.0 DOC collector — global news-attention volume for the non-developer
 * interests. Keyless and near real-time. One `timelinevolraw` call spans both
 * comparison windows; daily buckets are summed per window to form the metric.
 * A separate `artlist` call supplies representative headlines.
 */
const SOURCE: PipelineSourceId = "gdelt";
const BASE = "https://api.gdeltproject.org/api/v2/doc/doc";
const rateLimiter = new RateLimiter(1_200);

interface TimelineResponse {
  timeline?: Array<{ data?: Array<{ date?: string; value?: number }> }>;
}

interface ArtListResponse {
  articles?: Array<{ title?: string; url?: string }>;
}

function gdeltDateTime(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}${h}${min}${s}`;
}

/** Parse a GDELT bucket date ("20260706T000000Z" / ISO) into a UTC Date. */
function parseBucketDate(raw: string): Date | null {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  const hour = Number(digits.slice(8, 10) || "0");
  return new Date(Date.UTC(year, month - 1, day, hour));
}

function buildMetrics(current: number, previous: number | null) {
  const delta = previous === null ? null : current - previous;
  const deltaPercent =
    previous === null || previous === 0 || delta === null
      ? null
      : Math.round((delta / previous) * 100);
  return { current, previous, delta, deltaPercent };
}

async function fetchTimeline(
  query: string,
  spanStart: Date,
  spanEnd: Date
): Promise<Array<{ date: Date; value: number }>> {
  const params =
    `?query=${encodeURIComponent(query)}` +
    `&mode=timelinevolraw&format=json` +
    `&startdatetime=${gdeltDateTime(spanStart)}` +
    `&enddatetime=${gdeltDateTime(spanEnd)}`;
  const data = await rateLimiter.schedule(() =>
    fetchJson<TimelineResponse>(`${BASE}${params}`, {
      timeoutMs: 30_000,
      retries: 3,
    })
  );
  const series = data.timeline?.[0]?.data ?? [];
  const buckets: Array<{ date: Date; value: number }> = [];
  for (const point of series) {
    const date = parseBucketDate(point.date ?? "");
    if (!date) continue;
    buckets.push({ date, value: Number(point.value ?? 0) || 0 });
  }
  return buckets;
}

function sumInRange(
  buckets: Array<{ date: Date; value: number }>,
  start: Date,
  end: Date
): number {
  return buckets.reduce(
    (total, bucket) =>
      bucket.date >= start && bucket.date <= end ? total + bucket.value : total,
    0
  );
}

async function fetchSamples(
  query: string,
  start: Date,
  end: Date
): Promise<ObservationSample[]> {
  const params =
    `?query=${encodeURIComponent(query)}` +
    `&mode=artlist&format=json&maxrecords=3&sort=datedesc` +
    `&startdatetime=${gdeltDateTime(start)}` +
    `&enddatetime=${gdeltDateTime(end)}`;
  try {
    const data = await rateLimiter.schedule(() =>
      fetchJson<ArtListResponse>(`${BASE}${params}`, {
        timeoutMs: 30_000,
        retries: 2,
      })
    );
    return (data.articles ?? []).slice(0, 3).map((article) => ({
      title: (article.title ?? "Untitled").replace(/\s+/g, " ").trim(),
      url: article.url ?? "https://www.gdeltproject.org",
    }));
  } catch {
    return [];
  }
}

export async function ingestGdelt(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let failures = 0;
  let lastError: string | undefined;

  for (const config of GDELT_QUERIES) {
    try {
      const buckets = await fetchTimeline(
        config.query,
        previous.start,
        current.end
      );
      const currentVolume = sumInRange(buckets, current.start, current.end);
      const previousVolume = sumInRange(buckets, previous.start, previous.end);
      const samples = await fetchSamples(config.query, current.start, current.end);

      interests[config.interestId] = {
        interestId: config.interestId,
        metrics: buildMetrics(currentVolume, previousVolume),
        samples,
      };
    } catch (error) {
      failures += 1;
      lastError =
        error instanceof Error ? error.message : "Unknown GDELT ingest error";
    }
  }

  const successCount = Object.keys(interests).length;
  if (successCount === GDELT_QUERIES.length) {
    return { source: SOURCE, status: "ok", fetchedAt, interests };
  }
  if (successCount >= GDELT_QUERIES.length * 0.5) {
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
    error: lastError ?? "GDELT ingest failed",
    interests,
  };
}
