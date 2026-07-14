/**
 * World Intelligence Pulse tile shapes + adapter.
 *
 * The tile is a presentation projection of a canonical domain Signal. Content
 * now originates entirely from `@/lib/domain` (the single source); this module
 * only maps a Signal into the shape the Pulse UI renders. No mock content lives
 * here anymore.
 */

import { getSignalRepository } from "@/lib/domain/live-repository";
import type { Signal, Trajectory } from "@/lib/domain";

export type PulseTileTier = "hero" | "featured" | "compact";

export type PulseCta =
  | "Why it Matters"
  | "See the Evidence"
  | "Explore the Trend"
  | "Understand the Shift";

export type IntelligencePulseTile = {
  id: string;
  technology: string;
  headline: string;
  supporting: string;
  momentum: number;
  momentumChange: number;
  forecastNarrative: string;
  /** Real observed evidence: the sources tracking this signal + their deltas. */
  evidence: readonly { label: string; delta?: string }[];
  updated: string;
  tier: PulseTileTier;
  cta: PulseCta;
  sparkline: readonly number[];
};

function ctaFor(trajectory: Trajectory): PulseCta {
  switch (trajectory) {
    case "accelerating":
      return "Explore the Trend";
    case "steady":
      return "Understand the Shift";
    case "cooling":
      return "See the Evidence";
    default:
      return "Why it Matters";
  }
}

/**
 * Map a canonical Signal to a Pulse tile. Tier is assigned by position, so the
 * caller controls prominence through ordering. Supporting text is the Signal's
 * editorial summary — identical for every user, never a personalized claim.
 */
export function toPulseTile(signal: Signal, index: number): IntelligencePulseTile {
  const tier: PulseTileTier =
    index === 0 ? "hero" : index < 4 ? "featured" : "compact";
  const spark = signal.presentation.sparkline ?? [];
  // Net change across the whole tracked window (newest − oldest). The sparkline
  // colours itself the same way, so the arrow, its colour and the chart line
  // always agree (flat series → +0 → flat, neutral line).
  const momentumChange =
    spark.length >= 2 ? Math.round(spark[spark.length - 1] - spark[0]) : 0;
  return {
    id: signal.identity.id,
    technology: signal.identity.title,
    headline: signal.identity.headline,
    supporting: signal.identity.summary,
    momentum: Math.round(signal.momentum.momentumScore),
    momentumChange,
    forecastNarrative: signal.presentation.narrative ?? "",
    evidence: signal.evidence.sources.map((s) => ({ label: s.label, delta: s.delta })),
    updated: "Signal detected",
    tier,
    cta: ctaFor(signal.momentum.trajectory),
    sparkline: signal.presentation.sparkline ?? [],
  };
}

/** All tiles in default (momentum) order, sourced from the domain. */
export const INTELLIGENCE_PULSE_TILES: IntelligencePulseTile[] = getSignalRepository()
  .getAll()
  .map((signal, index) => toPulseTile(signal, index));

export function getPulseTilesByTier() {
  const hero = INTELLIGENCE_PULSE_TILES.find((t) => t.tier === "hero");
  const featured = INTELLIGENCE_PULSE_TILES.filter((t) => t.tier === "featured");
  const compact = INTELLIGENCE_PULSE_TILES.filter((t) => t.tier === "compact");
  return { hero, featured, compact };
}
