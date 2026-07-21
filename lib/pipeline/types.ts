import type { InterestId } from "@/lib/types";

// Re-exported so pipeline collectors can pull interest + source types from one
// module.
export type { InterestId } from "@/lib/types";

export type PipelineSourceId =
  | "hacker-news"
  | "arxiv"
  | "wikimedia"
  | "github"
  | "product-hunt"
  | "pubmed"
  | "gdelt"
  | "openalex"
  | "patents"
  | "edgar"
  | "clinical-trials";

export type SourceHealth = "ok" | "stale" | "failed";

export interface ObservationSample {
  title: string;
  url: string;
  score?: number;
}

export interface InterestMetrics {
  current: number;
  previous: number | null;
  delta: number | null;
  deltaPercent: number | null;
}

export interface InterestObservation {
  interestId: InterestId;
  metrics: InterestMetrics;
  samples: ObservationSample[];
}

export interface SourceObservation {
  source: PipelineSourceId;
  status: SourceHealth;
  fetchedAt: string;
  error?: string;
  interests: Partial<Record<InterestId, InterestObservation>>;
}

export interface ObservationBundle {
  version: 1;
  ingestedAt: string;
  period: string;
  periodLabel: string;
  sources: Partial<Record<PipelineSourceId, SourceObservation>>;
}

export interface ScoreDriver {
  label: string;
  value: number;
  unit: "%" | "score";
}

export interface InterestScore {
  interestId: InterestId;
  momentum: number;
  confidence: number;
  sourceAgreement: number;
  direction: "rising" | "falling" | "stable";
  drivers: ScoreDriver[];
}

export interface ScoreBundle {
  version: 1;
  scoredAt: string;
  period: string;
  observationIngestedAt: string;
  interests: InterestScore[];
}
