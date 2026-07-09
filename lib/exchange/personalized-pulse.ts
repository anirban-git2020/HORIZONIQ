/**
 * Personalized Pulse adapter.
 *
 * The main grid shows ONLY Signals that match the professional's chosen
 * interests (exact match). Signals in adjacent fields are returned separately
 * as `related` — a clearly-labeled, secondary strip, never mixed into the main
 * grid. Region orders within each set. Nothing irrelevant is ever padded in,
 * and no tile ever claims an interest the user did not choose.
 */

import { mockSignalRepository } from "@/lib/domain";
import type { Signal } from "@/lib/domain";
import { getPulseBrief } from "@/lib/exchange/pulse-brief-data";
import type { IntelligencePulseBrief } from "@/lib/exchange/pulse-brief-data";
import { toPulseTile } from "@/lib/exchange/pulse-mock-data";
import type { IntelligencePulseTile } from "@/lib/exchange/pulse-mock-data";
import type { InterestId, RegionId } from "@/lib/types";
import type { LandingJourney } from "@/hooks/use-landing-journey";

const GRID_SIZE = 12;
const RELATED_SIZE = 8;

/** Adjacent fields shown as clearly-labeled "Related", never as direct matches. */
const ADJACENCY: Partial<Record<InterestId, readonly InterestId[]>> = {
  manufacturing: ["robotics", "supply-chain"],
  "supply-chain": ["manufacturing", "robotics"],
  robotics: ["manufacturing", "supply-chain"],
  finance: ["venture-capital", "startups"],
  "venture-capital": ["finance", "startups"],
  startups: ["venture-capital", "finance", "commerce"],
  commerce: ["startups", "finance"],
  healthcare: ["biotechnology", "life-sciences"],
  biotechnology: ["healthcare", "life-sciences", "biochemistry"],
  "life-sciences": ["biotechnology", "healthcare", "biochemistry"],
  biochemistry: ["biotechnology", "life-sciences"],
  arts: ["commerce", "artificial-intelligence"],
  "artificial-intelligence": ["cloud-computing", "cybersecurity"],
  "cloud-computing": ["artificial-intelligence", "cybersecurity"],
  cybersecurity: ["artificial-intelligence", "cloud-computing"],
  energy: ["manufacturing", "supply-chain"],
};

export type PulseProfile = {
  readonly interests: readonly InterestId[];
  readonly region: RegionId | null;
};

export type PersonalizedPulse = {
  hero: IntelligencePulseTile | undefined;
  featured: IntelligencePulseTile[];
  compact: IntelligencePulseTile[];
  related: IntelligencePulseTile[];
};

export function journeyToPreferences(journey: LandingJourney): PulseProfile {
  return { interests: journey.selectedInterests, region: journey.selectedRegion };
}

function expand(interests: readonly InterestId[]): Set<InterestId> {
  const out = new Set<InterestId>();
  for (const i of interests) for (const adj of ADJACENCY[i] ?? []) out.add(adj);
  return out;
}

/** Exact interest match — the user chose it, or a Signal explicitly recommends it. */
function isDirect(signal: Signal, wanted: ReadonlySet<InterestId>): boolean {
  return (
    wanted.has(signal.classification.interest) ||
    signal.personalization.recommendedInterests.some((i) => wanted.has(i))
  );
}

/** Region-relevant Signals lead; then momentum. Ordering only — no filtering by region. */
function sortForRegion(signals: readonly Signal[], region: RegionId | null): Signal[] {
  return [...signals].sort((a, b) => {
    const ra = region && a.personalization.recommendedRegions.includes(region) ? 1 : 0;
    const rb = region && b.personalization.recommendedRegions.includes(region) ? 1 : 0;
    if (ra !== rb) return rb - ra;
    return b.momentum.momentumScore - a.momentum.momentumScore;
  });
}

export function buildPersonalizedTiles(profile: PulseProfile): PersonalizedPulse {
  const wanted = new Set<InterestId>(profile.interests);
  const adjacent = expand(profile.interests);
  const all = mockSignalRepository.getAll();

  const directSignals = sortForRegion(
    all.filter((s) => isDirect(s, wanted)),
    profile.region
  );
  const relatedSignals = sortForRegion(
    all.filter((s) => !isDirect(s, wanted) && adjacent.has(s.classification.interest)),
    profile.region
  );

  const main = directSignals.slice(0, GRID_SIZE).map((s, i) => toPulseTile(s, i));
  const related = relatedSignals
    .slice(0, RELATED_SIZE)
    .map((s, i) => toPulseTile(s, 4 + i)); // 4+ → rendered as uniform compact tiles

  return {
    hero: main.find((t) => t.tier === "hero"),
    featured: main.filter((t) => t.tier === "featured"),
    compact: main.filter((t) => t.tier === "compact"),
    related,
  };
}

/** Brief for an opened Signal — domain-sourced, identical for every user. */
export function getPersonalizedBrief(
  id: string,
  _profile: PulseProfile
): IntelligencePulseBrief | null {
  return getPulseBrief(id) ?? null;
}
