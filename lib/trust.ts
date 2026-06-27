import type { BriefingRecord } from "@/lib/data/schemas";

export type DataProvenance = BriefingRecord["dataProvenance"];

export const LIVE_PIPELINE_SOURCE_NAMES = [
  "Hacker News",
  "arXiv",
  "GitHub",
  "Wikimedia Pageviews",
  "Product Hunt",
] as const;

export function getProvenanceShortLabel(provenance: DataProvenance): string {
  switch (provenance) {
    case "pipeline":
      return "Live intelligence";
    case "pipeline-mock":
      return "Mixed live + sample data";
    default:
      return "Sample briefing";
  }
}

export function getProvenanceBadgeVariant(
  provenance: DataProvenance
): "success" | "warning" | "muted" {
  switch (provenance) {
    case "pipeline":
      return "success";
    case "pipeline-mock":
      return "warning";
    default:
      return "muted";
  }
}

export function getLandingSubheadline(provenance: DataProvenance): string {
  switch (provenance) {
    case "pipeline":
      return "HorizonIQ tracks public signals from Hacker News, arXiv, GitHub, Wikipedia pageviews, and Product Hunt — then shows what changed, why it matters, and what to do next.";
    case "pipeline-mock":
      return "HorizonIQ blends live public signals with curated explanations. When a source is unavailable, sample data is clearly labeled.";
    default:
      return "Preview the HorizonIQ experience with a curated sample briefing. Live weekly updates use public signals from trusted free sources.";
  }
}

export function getLandingCtaNote(provenance: DataProvenance): string {
  if (provenance === "pipeline") {
    return "Personalized briefing from this week's live data — under 60 seconds.";
  }
  return "Preview with sample data — under 60 seconds.";
}

export function getTrustDisclaimer(
  provenance: DataProvenance,
  refreshSchedule: string
): string {
  const sources = LIVE_PIPELINE_SOURCE_NAMES.join(", ");
  switch (provenance) {
    case "pipeline":
      return `Live public data from ${sources}. Refreshes ${refreshSchedule.toLowerCase()}. Explanations are curated; activity metrics come from real sources.`;
    case "pipeline-mock":
      return `Blends live data (${sources}) with sample sections where a source failed. Refreshes ${refreshSchedule.toLowerCase()}.`;
    default:
      return "Curated sample briefing for demonstration. Scores and summaries are illustrative, not live market data.";
  }
}

export function getSourceTypeLabel(type: "mock" | "live"): string {
  return type === "live" ? "Live" : "Sample";
}

export function getSourceBadgeVariant(
  type: "mock" | "live"
): "success" | "muted" {
  return type === "live" ? "success" : "muted";
}
