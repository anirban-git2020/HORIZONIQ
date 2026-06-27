import { INTEREST_QUERIES } from "@/lib/pipeline/config/interest-queries";
import type {
  InterestScore,
  ObservationBundle,
  PipelineSourceId,
  ScoreBundle,
} from "@/lib/pipeline/types";

const SOURCE_LABELS: Record<PipelineSourceId, string> = {
  "hacker-news": "Hacker News",
  arxiv: "arXiv",
  wikimedia: "Wikimedia Pageviews",
  github: "GitHub",
  "product-hunt": "Product Hunt",
};

const SOURCE_WEIGHTS: Record<PipelineSourceId, number> = {
  "hacker-news": 0.22,
  arxiv: 0.18,
  wikimedia: 0.15,
  github: 0.25,
  "product-hunt": 0.2,
};

type Direction = "rising" | "falling" | "stable";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function directionFromDelta(deltaPercent: number | null): Direction {
  if (deltaPercent === null) return "stable";
  if (deltaPercent >= 8) return "rising";
  if (deltaPercent <= -8) return "falling";
  return "stable";
}

function momentumFromDelta(deltaPercent: number | null): number {
  if (deltaPercent === null) return 50;
  const scaled = 50 + deltaPercent * 0.8;
  return clamp(Math.round(scaled), 5, 98);
}

function scoreInterest(
  bundle: ObservationBundle,
  interestId: (typeof INTEREST_QUERIES)[number]["interestId"]
): InterestScore {
  const drivers: InterestScore["drivers"] = [];
  const directions: Direction[] = [];
  let weightedMomentum = 0;
  let totalWeight = 0;
  let liveSources = 0;

  const sources: PipelineSourceId[] = [
    "hacker-news",
    "arxiv",
    "wikimedia",
    "github",
    "product-hunt",
  ];

  for (const sourceId of sources) {
    const source = bundle.sources[sourceId];
    if (!source || source.status === "failed") continue;

    const observation = source.interests[interestId];
    if (!observation) continue;

    liveSources += 1;
    const { deltaPercent } = observation.metrics;
    const direction = directionFromDelta(deltaPercent);
    directions.push(direction);

    const weight = SOURCE_WEIGHTS[sourceId];
    weightedMomentum += momentumFromDelta(deltaPercent) * weight;
    totalWeight += weight;

    if (deltaPercent !== null) {
      drivers.push({
        label: SOURCE_LABELS[sourceId],
        value: deltaPercent,
        unit: "%",
      });
    }
  }

  const momentum =
    totalWeight > 0 ? Math.round(weightedMomentum / totalWeight) : 50;

  const risingCount = directions.filter((d) => d === "rising").length;
  const fallingCount = directions.filter((d) => d === "falling").length;
  const stableCount = directions.filter((d) => d === "stable").length;

  let direction: Direction = "stable";
  if (risingCount > fallingCount && risingCount > stableCount) {
    direction = "rising";
  } else if (fallingCount > risingCount && fallingCount > stableCount) {
    direction = "falling";
  }

  const agreement = Math.max(risingCount, fallingCount, stableCount);
  const confidence = clamp(
    Math.round(35 + liveSources * 12 + agreement * 8),
    35,
    98
  );

  return {
    interestId,
    momentum,
    confidence,
    sourceAgreement: agreement,
    direction,
    drivers,
  };
}

export function scoreObservations(bundle: ObservationBundle): ScoreBundle {
  const interests = INTEREST_QUERIES.map((config) =>
    scoreInterest(bundle, config.interestId)
  ).sort((a, b) => b.momentum - a.momentum);

  return {
    version: 1,
    scoredAt: new Date().toISOString(),
    period: bundle.period,
    observationIngestedAt: bundle.ingestedAt,
    interests,
  };
}
