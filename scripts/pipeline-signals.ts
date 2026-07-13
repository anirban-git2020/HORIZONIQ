import { writeGeneratedSignals } from "@/lib/pipeline/generate/signals";

/**
 * Generates canonical live Signals from the latest pipeline observations and
 * writes lib/intelligence/generated-signals.ts. Run after `pipeline:ingest`.
 * Safe to run with no data: it keeps the curated fallback.
 */
writeGeneratedSignals()
  .then((liveCount) => {
    console.log(
      liveCount > 0
        ? `pipeline:signals — generated ${liveCount} live Signal overlays.`
        : "pipeline:signals — no observations found; kept curated fallback (run pipeline:ingest first)."
    );
  })
  .catch((error) => {
    console.error("pipeline:signals failed:", error);
    process.exit(1);
  });
