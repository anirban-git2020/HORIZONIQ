import type { Preferences, RegionId, RoleId, SignalView } from "@/lib/types";

/** Visual uniforms driving the Living Intelligence Core (Sprint 3C). */
export interface IntelligenceFieldParams {
  /** Signal momentum / change intensity → motion energy (0–1). */
  energy: number;
  /** Average confidence → brightness (0–1). */
  confidence: number;
  /** Region drives field reorganization phase (0–1). */
  regionPhase: number;
  /** Role RGB tint (subtle). */
  roleTint: [number, number, number];
  /** Interest count → vertical field density (0–1). */
  interestDensity: number;
  /** Breathing amplitude multiplier (0–1). */
  breath: number;
}

const REGION_PHASE: Record<RegionId, number> = {
  "north-america": 0.0,
  europe: 0.125,
  india: 0.25,
  china: 0.375,
  "southeast-asia": 0.5,
  "middle-east": 0.625,
  africa: 0.75,
  "latin-america": 0.875,
};

const ROLE_TINT: Record<RoleId, [number, number, number]> = {
  student: [0.22, 0.62, 0.78],
  professional: [0.18, 0.58, 0.72],
  entrepreneur: [0.28, 0.55, 0.68],
  investor: [0.32, 0.52, 0.62],
};

const DEFAULT_TINT: [number, number, number] = [0.2, 0.58, 0.7];

const CONFIDENCE_SCORE: Record<string, number> = {
  high: 1,
  medium: 0.62,
  low: 0.35,
};

export const NEUTRAL_FIELD_PARAMS: IntelligenceFieldParams = {
  energy: 0.32,
  confidence: 0.5,
  regionPhase: 0,
  roleTint: DEFAULT_TINT,
  interestDensity: 0.35,
  breath: 0.85,
};

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function computeIntelligenceFieldParams(
  preferences: Preferences | null,
  signals?: SignalView[]
): IntelligenceFieldParams {
  const role = preferences?.role ?? null;
  const region = preferences?.region ?? null;
  const interests = preferences?.interests ?? [];

  let energy = 0.28;
  let confidence = 0.48;

  if (signals && signals.length > 0) {
    const momentumAvg =
      signals.reduce((sum, s) => sum + s.momentum, 0) / signals.length;
    const changeBoost =
      signals.filter(
        (s) => s.change.type === "rising" || s.change.type === "new"
      ).length / signals.length;

    energy = clamp01(momentumAvg / 100 + changeBoost * 0.45);

    const confAvg =
      signals.reduce(
        (sum, s) =>
          sum + (CONFIDENCE_SCORE[s.intelligence.confidenceTier] ?? 0.5),
        0
      ) / signals.length;
    confidence = clamp01(confAvg);
  }

  const regionPhase = region ? REGION_PHASE[region] : 0;
  const roleTint = role ? ROLE_TINT[role] : DEFAULT_TINT;
  const interestDensity = clamp01(interests.length / 6);
  const breath = clamp01(0.7 + energy * 0.3);

  return {
    energy,
    confidence,
    regionPhase,
    roleTint,
    interestDensity,
    breath,
  };
}
