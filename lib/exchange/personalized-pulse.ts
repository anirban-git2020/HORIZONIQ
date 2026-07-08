import { getSignalById, getTopSignals } from "@/lib/personalize";
import { INTERESTS } from "@/lib/options";
import type { Preferences, SignalView } from "@/lib/types";
import type { LandingJourney } from "@/hooks/use-landing-journey";
import type { IntelligencePulseBrief } from "@/lib/exchange/pulse-brief-data";
import type {
  IntelligencePulseTile,
  PulseCta,
  PulseTileTier,
} from "@/lib/exchange/pulse-mock-data";

/**
 * Personalized Pulse adapter.
 *
 * Bridges the existing personalization engine (getTopSignals(prefs)) to the
 * Intelligence Pulse UI. Presentation/layout is unchanged — only the data
 * source. Every field access is defensive: worst case is thinner content,
 * never a runtime crash.
 */

const ALL_INTEREST_IDS = INTERESTS.map((i) => i.id);
const GRID_SIZE = 12;

export function journeyToPreferences(journey: LandingJourney): Preferences {
  return {
    role: journey.selectedRole,
    region: journey.selectedRegion,
    interests: journey.selectedInterests,
  };
}

function ctaFor(changeType?: string): PulseCta {
  switch (changeType) {
    case "new":
      return "Explore the Trend";
    case "rising":
      return "Understand the Shift";
    case "falling":
      return "See the Evidence";
    default:
      return "Why it Matters";
  }
}

/** Deterministic 11-point sparkline from previous → current momentum. */
function sparkFrom(prev: number, cur: number): number[] {
  const from = Number.isFinite(prev) ? prev : cur;
  const to = Number.isFinite(cur) ? cur : 0;
  const span = Math.max(1, Math.abs(to - from));
  const pts: number[] = [];
  for (let i = 0; i < 11; i += 1) {
    const t = i / 10;
    const base = from + (to - from) * t;
    const wobble = Math.sin(i * 1.3) * span * 0.08;
    pts.push(Math.max(0, Math.round(base + wobble)));
  }
  pts[pts.length - 1] = Math.max(0, Math.round(to));
  return pts;
}

/** Evidence counts are derived deterministically from momentum (curated data). */
function deriveEvidence(view: SignalView): IntelligencePulseTile["evidence"] {
  const m = Math.max(1, Math.round(view.momentum ?? 0));
  return {
    signals: m * 13,
    newJobs: Math.round(m * 2.1),
    researchPapers: Math.round(m * 0.4) + 3,
    fundingEvents: Math.round(m * 0.18) + 1,
  };
}

function toTile(view: SignalView, index: number): IntelligencePulseTile {
  const tier: PulseTileTier =
    index === 0 ? "hero" : index < 4 ? "featured" : "compact";
  return {
    id: view.id,
    technology: view.interestLabel ?? view.category ?? "Signal",
    headline: view.name ?? "Signal detected",
    supporting: view.soWhatForYou ?? view.change?.summary ?? "",
    momentum: Math.round(view.momentum ?? 0),
    momentumChange: Math.max(0, Math.round(view.momentumDelta ?? 0)),
    forecastNarrative: view.intelligence?.outlook ?? "",
    evidence: deriveEvidence(view),
    updated: view.intelligence?.evidence?.lastUpdatedLabel ?? "Recently observed",
    tier,
    cta: ctaFor(view.change?.type),
    sparkline: sparkFrom(view.previousMomentum ?? view.momentum ?? 0, view.momentum ?? 0),
  };
}

/**
 * Tiles for the Pulse: the user's interests lead (hero + featured), then the
 * broader pulse fills the grid so the page stays rich even when few signals
 * match a narrow interest set.
 */
export function buildPersonalizedTiles(prefs: Preferences): {
  hero: IntelligencePulseTile | undefined;
  featured: IntelligencePulseTile[];
  compact: IntelligencePulseTile[];
} {
  const userViews = safeTop(prefs, GRID_SIZE);
  const fillViews = safeTop({ ...prefs, interests: ALL_INTEREST_IDS }, GRID_SIZE);

  const seen = new Set<string>();
  const ordered: SignalView[] = [];
  for (const view of [...userViews, ...fillViews]) {
    if (view && !seen.has(view.id)) {
      seen.add(view.id);
      ordered.push(view);
    }
  }

  const tiles = ordered.slice(0, GRID_SIZE).map((view, i) => toTile(view, i));
  return {
    hero: tiles.find((t) => t.tier === "hero"),
    featured: tiles.filter((t) => t.tier === "featured"),
    compact: tiles.filter((t) => t.tier === "compact"),
  };
}

function safeTop(prefs: Preferences, limit: number): SignalView[] {
  try {
    return getTopSignals(prefs, limit) ?? [];
  } catch {
    return [];
  }
}

/** Brief for an opened Signal, derived from the engine. Null if not an engine signal. */
export function getPersonalizedBrief(
  id: string,
  prefs: Preferences
): IntelligencePulseBrief | null {
  let view: SignalView | undefined;
  try {
    // Resolve against all interests so a filled (non-interest) tile still opens.
    view = getSignalById(id, { ...prefs, interests: ALL_INTEREST_IDS });
  } catch {
    view = undefined;
  }
  if (!view) return null;

  return {
    whyItMatters:
      view.intelligence?.whyYouShouldCare ?? view.soWhatForYou ?? "",
    evidence: (view.momentumDrivers ?? []).slice(0, 4).map((d) => ({
      label: d.label,
      change: `${d.value >= 0 ? "+" : ""}${d.value}${d.unit === "%" ? "%" : ""}`,
    })),
    drivers: (view.affectedIndustries ?? view.relatedSkills ?? []).slice(0, 4),
    relatedSignals: (view.relatedSkills ?? []).slice(0, 4),
    forecast: view.intelligence?.outlook ?? "",
  };
}
