import type { DataSource } from "@/lib/data/schemas";
import type { InterestId } from "@/lib/types";
import type { ObservationBundle, PipelineSourceId } from "@/lib/pipeline/types";

const SOURCE_LABELS: Record<PipelineSourceId, string> = {
  "hacker-news": "Hacker News",
  arxiv: "arXiv",
  wikimedia: "Wikimedia",
  github: "GitHub",
  "product-hunt": "Product Hunt",
};

export function buildLiveSources(
  bundle: ObservationBundle,
  interestId: InterestId,
  limit = 4
): DataSource[] {
  const sources: DataSource[] = [];
  const sourceIds: PipelineSourceId[] = [
    "hacker-news",
    "arxiv",
    "github",
    "product-hunt",
    "wikimedia",
  ];

  for (const sourceId of sourceIds) {
    const source = bundle.sources[sourceId];
    if (!source || source.status === "failed") continue;

    const observation = source.interests[interestId];
    if (!observation) continue;

    for (const sample of observation.samples) {
      if (sources.length >= limit) return sources;
      sources.push({
        label: `${SOURCE_LABELS[sourceId]}: ${sample.title}`,
        type: "live",
      });
    }
  }

  if (sources.length === 0) {
    sources.push({
      label: "HorizonIQ pipeline (limited live coverage this week)",
      type: "mock",
    });
  }

  return sources;
}

export function countHealthySources(bundle: ObservationBundle): number {
  return Object.values(bundle.sources).filter(
    (source) => source && (source.status === "ok" || source.status === "stale")
  ).length;
}
