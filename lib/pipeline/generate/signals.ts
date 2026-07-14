import { writeFile } from "node:fs/promises";
import path from "node:path";

import { MOCK_SIGNALS } from "@/lib/domain/mock-intelligence";
import type { ConfidenceTier, Signal, Trajectory } from "@/lib/domain/signal";
import type { SourceRef, SourceType } from "@/lib/domain/source";
import {
  readLatestObservations,
  readLatestScores,
  readScoreHistory,
} from "@/lib/pipeline/store/observations";
import { readLatestNarratives } from "@/lib/pipeline/store/narratives";
import type { SynthesisResult } from "@/lib/pipeline/synthesis/orchestrate";
import type {
  InterestObservation,
  InterestScore,
  ObservationBundle,
  PipelineSourceId,
} from "@/lib/pipeline/types";
import type { InterestId } from "@/lib/types";

/**
 * Canonical Signal generation — the pipeline's editorial-preparation + Signal
 * step for the domain model.
 *
 * Design: LIVE metrics + evidence come from the pipeline (momentum, confidence,
 * velocity, sources, freshness). EDITORIAL prose stays curated — it is the
 * protected editorial system, and we never fabricate it. So a live Signal is a
 * curated editorial shell wearing real, current evidence. Interests without
 * live data keep their curated values. Nothing is invented.
 */

function confidenceTier(confidence: number): ConfidenceTier {
  return confidence >= 70 ? "high" : confidence >= 45 ? "medium" : "low";
}

function trajectoryOf(
  direction: InterestScore["direction"],
  velocity: number
): Trajectory {
  if (direction === "falling") return "cooling";
  if (direction === "rising") return velocity >= 8 ? "accelerating" : "steady";
  return "emerging";
}

const SOURCE_TYPE: Record<PipelineSourceId, SourceType> = {
  github: "github",
  arxiv: "arxiv",
  "hacker-news": "hacker-news",
  wikimedia: "wikipedia",
  "product-hunt": "product-hunt",
  pubmed: "research-paper",
  gdelt: "news",
};

const SOURCE_LABEL: Record<PipelineSourceId, string> = {
  github: "GitHub Activity",
  arxiv: "Research Publications",
  "hacker-news": "Developer Discussion",
  wikimedia: "Public Attention",
  "product-hunt": "Product Launches",
  pubmed: "Medical Research",
  gdelt: "Global News",
};

/** Real evidence for an interest, from each healthy source's observation. */
function liveSources(interest: InterestId, obs: ObservationBundle): SourceRef[] {
  const refs: SourceRef[] = [];
  for (const src of Object.values(obs.sources)) {
    if (!src || src.status === "failed") continue;
    const io: InterestObservation | undefined = src.interests[interest];
    if (!io) continue;
    const dp = io.metrics.deltaPercent;
    refs.push({
      type: SOURCE_TYPE[src.source],
      label: SOURCE_LABEL[src.source],
      delta: dp != null ? `${dp >= 0 ? "+" : ""}${Math.round(dp)}%` : undefined,
    });
  }
  return refs.slice(0, 4);
}

/** Average observed delta% across sources → a simple, real velocity. */
function velocityFor(interest: InterestId, obs: ObservationBundle): number {
  const deltas: number[] = [];
  for (const src of Object.values(obs.sources)) {
    const dp = src?.interests[interest]?.metrics.deltaPercent;
    if (dp != null) deltas.push(dp);
  }
  if (deltas.length === 0) return 0;
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return Math.max(0, Math.round(avg));
}

/** True once the pipeline has prior-period data — i.e. change is measurable. */
function hasTrend(interest: InterestId, obs: ObservationBundle): boolean {
  for (const src of Object.values(obs.sources)) {
    const io = src?.interests[interest];
    if (io && (io.metrics.deltaPercent != null || io.metrics.previous != null)) {
      return true;
    }
  }
  return false;
}

function overlay(
  base: Signal,
  score: InterestScore,
  obs: ObservationBundle,
  history: readonly number[] | undefined
): Signal {
  const trend = hasTrend(base.classification.interest, obs);
  const velocity = velocityFor(base.classification.interest, obs);
  const sources = liveSources(base.classification.interest, obs);
  const displayedMomentum = trend
    ? Math.round(score.momentum)
    : base.momentum.momentumScore;
  // Real momentum history (last ~12 runs) once change is measurable; otherwise a
  // flat line at the shown momentum, so a "+0" signal never fakes an upward trend.
  const sparkline =
    trend && history && history.length >= 2
      ? history.slice(-12)
      : Array.from({ length: 11 }, () => displayedMomentum);
  return {
    ...base,
    presentation: { ...base.presentation, sparkline },
    evidence: {
      ...base.evidence,
      sources: sources.length > 0 ? sources : base.evidence.sources,
      lastObserved: obs.ingestedAt,
      freshness: "live",
      confidence: confidenceTier(score.confidence),
    },
    // Momentum needs measurable change. Until the pipeline has a prior period,
    // hold the curated baseline; overlay live momentum only once trend exists.
    // (Evidence, freshness, and confidence above are always live.)
    momentum: trend
      ? {
          ...base.momentum,
          momentumScore: Math.round(score.momentum),
          velocity,
          trajectory: trajectoryOf(score.direction, velocity),
        }
      : base.momentum,
    versioning: {
      ...base.versioning,
      updatedAt: obs.ingestedAt,
      revision: base.versioning.revision + 1,
    },
  };
}

/**
 * Overlay a verified, auto-synthesized narrative onto a curated signal. The
 * stable title is kept; the evidence-grounded headline/summary/brief/forecast
 * replace the curated prose, and provenance is flagged for the UI badge.
 */
function applyNarrative(signal: Signal, result: SynthesisResult): Signal {
  const n = result.narrative;
  return {
    ...signal,
    identity: { ...signal.identity, headline: n.headline, summary: n.summary },
    forecast: { ...signal.forecast, forecast: n.forecast },
    reading: { ...signal.reading, brief: n.brief },
    presentation: { ...signal.presentation, provenance: "synthesized" },
  };
}

export async function generateCanonicalSignals(): Promise<{
  signals: Signal[];
  liveCount: number;
  generatedAt: string;
}> {
  const [obs, scores, scoreHistory, narrativeBundle] = await Promise.all([
    readLatestObservations(),
    readLatestScores(),
    readScoreHistory(),
    readLatestNarratives(),
  ]);
  const narratives = narrativeBundle?.narratives ?? {};

  const byInterest = new Map<InterestId, InterestScore>();
  if (scores) for (const s of scores.interests) byInterest.set(s.interestId, s);

  // Real momentum series per interest, chronological across dated score bundles.
  const historyByInterest = new Map<InterestId, number[]>();
  for (const bundle of scoreHistory) {
    for (const s of bundle.interests) {
      const series = historyByInterest.get(s.interestId) ?? [];
      series.push(Math.round(s.momentum));
      historyByInterest.set(s.interestId, series);
    }
  }

  let liveCount = 0;
  const signals = MOCK_SIGNALS.map((base) => {
    const score = byInterest.get(base.classification.interest);
    if (!obs || !score) return base; // no live data for this interest → curated
    liveCount += 1;
    const live = overlay(base, score, obs, historyByInterest.get(base.classification.interest));
    // A verified synthesized narrative (if any) replaces the curated prose.
    const narrative = narratives[base.classification.interest];
    return narrative ? applyNarrative(live, narrative) : live;
  });

  return { signals, liveCount, generatedAt: new Date().toISOString() };
}

/**
 * Writes lib/intelligence/generated-signals.ts. With live data present it emits
 * the overlaid Signals; otherwise it writes an empty export so the app falls
 * back to the curated dataset — never a fabricated live feed.
 */
export async function writeGeneratedSignals(): Promise<number> {
  const { signals, liveCount, generatedAt } = await generateCanonicalSignals();
  const target = path.join(process.cwd(), "lib/intelligence/generated-signals.ts");

  const header =
    "// Machine-generated by `npm run pipeline:signals`. Do not edit.\n" +
    'import type { Signal } from "@/lib/domain";\n\n';

  const body =
    liveCount > 0
      ? `${header}export const GENERATED_SIGNALS: readonly Signal[] = ${JSON.stringify(
          signals,
          null,
          2
        )} as const;\nexport const GENERATED_AT = ${JSON.stringify(generatedAt)};\n`
      : `${header}export const GENERATED_SIGNALS: readonly Signal[] = [];\nexport const GENERATED_AT: string | null = null;\n`;

  await writeFile(target, body, "utf8");
  return liveCount;
}
