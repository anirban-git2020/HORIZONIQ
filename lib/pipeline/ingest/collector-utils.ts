import type {
  InterestMetrics,
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";

/** Standard current-vs-previous metric from two window counts. */
export function buildMetrics(
  current: number,
  previous: number | null
): InterestMetrics {
  const delta = previous === null ? null : current - previous;
  const deltaPercent =
    previous === null || previous === 0 || delta === null
      ? null
      : Math.round((delta / previous) * 100);
  return { current, previous, delta, deltaPercent };
}

/**
 * Shared status roll-up so every collector degrades identically: all interests
 * present → ok, at least half → stale, otherwise failed. Never throws — a bad
 * source is reported, it doesn't break the run.
 */
export function finalizeSource(
  source: PipelineSourceId,
  fetchedAt: string,
  interests: SourceObservation["interests"],
  expected: number,
  lastError?: string
): SourceObservation {
  const successCount = Object.keys(interests).length;
  if (expected > 0 && successCount === expected) {
    return { source, status: "ok", fetchedAt, interests };
  }
  if (successCount >= Math.ceil(expected * 0.5) && successCount > 0) {
    return {
      source,
      status: "stale",
      fetchedAt,
      error: lastError ?? `${expected - successCount} interests failed`,
      interests,
    };
  }
  return {
    source,
    status: "failed",
    fetchedAt,
    error: lastError ?? `${source} ingest failed`,
    interests,
  };
}
