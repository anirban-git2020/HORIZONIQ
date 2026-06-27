import type { BriefingRecord, DataSource } from "@/lib/data/schemas";

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

const SOURCE_SEARCH_URLS: Record<string, (title: string) => string> = {
  "Hacker News": (title) =>
    `https://hn.algolia.com/?dateRange=pastWeek&page=0&prefix&query=${encodeURIComponent(title)}`,
  arXiv: (title) =>
    `https://arxiv.org/search/?query=${encodeURIComponent(title)}&searchtype=all`,
  GitHub: (title) =>
    `https://github.com/search?q=${encodeURIComponent(title)}&type=repositories`,
  "Product Hunt": (title) =>
    `https://www.producthunt.com/search?q=${encodeURIComponent(title)}`,
  Wikimedia: (title) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${title} wikipedia`)}`,
};

function extractSampleTitle(label: string): string {
  const colon = label.indexOf(": ");
  return colon >= 0 ? label.slice(colon + 2).trim() : label;
}

function detectSourcePrefix(label: string): string | null {
  for (const prefix of Object.keys(SOURCE_SEARCH_URLS)) {
    if (label.startsWith(`${prefix}:`)) return prefix;
  }
  return null;
}

export function resolveSourceUrl(source: DataSource): string | undefined {
  if (source.url) return source.url;
  const prefix = detectSourcePrefix(source.label);
  if (!prefix) return undefined;
  const title = extractSampleTitle(source.label);
  if (!title) return undefined;
  return SOURCE_SEARCH_URLS[prefix](title);
}

export function buildConfidenceExplanation(
  confidence: number,
  factors: { label: string; value: number; unit: "%" | "score" }[],
  provenance: DataProvenance
): string {
  if (provenance === "curated-mock") {
    return "Sample briefing — confidence score is illustrative. Live briefings score agreement across public sources.";
  }

  const coverage = factors.find((f) => f.label === "Live source coverage");
  const agreement = factors.find((f) => f.label === "Cross-source agreement");
  const level =
    confidence >= 80 ? "High" : confidence >= 60 ? "Moderate" : "Early";

  const parts = [
    `${level} confidence (${confidence}/100).`,
    coverage
      ? `Live source coverage scored ${coverage.value}/100.`
      : null,
    agreement
      ? `Cross-source agreement at ${agreement.value}/100.`
      : null,
    provenance === "pipeline-mock"
      ? "Some sources were unavailable this week — mixed live and sample data."
      : "Multiple independent public feeds corroborate this signal.",
  ].filter(Boolean);

  return parts.join(" ");
}
