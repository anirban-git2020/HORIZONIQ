import type { ChangeType } from "@/lib/types";
import type {
  BriefingRecord,
  EvidenceDriverRaw,
  SignalBriefingState,
  SignalCatalogRecord,
  SignalChangeRaw,
} from "@/lib/data/schemas";
import type { InterestScore, ObservationBundle } from "@/lib/pipeline/types";
import { buildLiveSources } from "@/lib/pipeline/generate/sources";
import { INTEREST_LABEL } from "@/lib/options";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function classifyChange(
  momentum: number,
  previousMomentum: number,
  isNew: boolean
): ChangeType {
  if (isNew) return "new";
  const delta = momentum - previousMomentum;
  if (delta >= 4) return "rising";
  if (delta <= -4) return "falling";
  return "stable";
}

function buildChangeSummary(
  catalog: SignalCatalogRecord,
  changeType: ChangeType,
  interestScore: InterestScore | undefined,
  topSampleTitle?: string
): string {
  const interestLabel =
    INTEREST_LABEL[catalog.interest] ?? catalog.category;
  const driver = interestScore?.drivers[0];
  const driverText = driver
    ? `${driver.label} ${driver.value > 0 ? "+" : ""}${driver.value}%`
    : "mixed source signals";

  switch (changeType) {
    case "new":
      return `${catalog.name} enters this week's briefing — live activity detected in ${interestLabel}.`;
    case "rising":
      return `Live activity accelerating in ${interestLabel} (${driverText})${topSampleTitle ? ` — e.g. ${topSampleTitle}` : ""}.`;
    case "falling":
      return `Momentum cooled in ${interestLabel} this week (${driverText}).`;
    default:
      return `${catalog.name} held steady in ${interestLabel} with ${driverText}.`;
  }
}

function buildConfidenceFactors(
  interestScore: InterestScore | undefined,
  liveSourceCount: number
): EvidenceDriverRaw[] {
  const agreement = interestScore?.sourceAgreement ?? 1;
  const confidence = interestScore?.confidence ?? 50;
  return [
    { label: "Live source coverage", value: liveSourceCount * 20, unit: "score" },
    { label: "Cross-source agreement", value: agreement * 25, unit: "score" },
    { label: "Pipeline confidence", value: confidence, unit: "score" },
  ];
}

export function buildSignalState(
  catalog: SignalCatalogRecord,
  interestScore: InterestScore | undefined,
  rankInInterest: number,
  totalInInterest: number,
  previousState: SignalBriefingState | undefined,
  bundle: ObservationBundle,
  briefingPeriod: string,
  isFirstPipelineRun: boolean
): SignalBriefingState {
  const baseMomentum = interestScore?.momentum ?? 50;
  const spread =
    totalInInterest > 1
      ? (rankInInterest - (totalInInterest - 1) / 2) * 4
      : 0;
  const momentum = clamp(Math.round(baseMomentum + spread), 8, 98);
  const confidence = clamp(interestScore?.confidence ?? 55, 35, 95);

  const previousMomentum = previousState?.momentum ?? Math.max(40, momentum - 6);
  const previousConfidence =
    previousState?.confidence ?? Math.max(35, confidence - 4);

  const isNew =
    catalog.introducedInPeriod === briefingPeriod && !previousState;

  const changeType = isFirstPipelineRun
    ? (interestScore?.direction ?? "stable")
    : classifyChange(momentum, previousMomentum, isNew);

  const topSample = bundle.sources["hacker-news"]?.interests[catalog.interest]
    ?.samples[0]?.title;

  const change: SignalChangeRaw = {
    type: changeType,
    summary: buildChangeSummary(
      catalog,
      changeType,
      interestScore,
      topSample
    ),
  };

  const momentumDrivers: EvidenceDriverRaw[] =
    interestScore?.drivers.length
      ? interestScore.drivers.map((driver) => ({
          label: driver.label,
          value: Math.abs(driver.value),
          unit: driver.unit,
        }))
      : [{ label: "Pipeline activity", value: momentum, unit: "score" }];

  return {
    signalId: catalog.id,
    momentum,
    confidence,
    previousMomentum,
    previousConfidence,
    change,
    sources: buildLiveSources(bundle, catalog.interest),
    momentumDrivers,
    confidenceFactors: buildConfidenceFactors(
      interestScore,
      interestScore?.drivers.length ?? 1
    ),
  };
}

export function assignBuckets(
  signalStates: SignalBriefingState[]
): BriefingRecord["buckets"] {
  const buckets: BriefingRecord["buckets"] = {
    new: [],
    rising: [],
    falling: [],
    stable: [],
  };

  for (const state of signalStates) {
    buckets[state.change.type].push(state.signalId);
  }

  return buckets;
}
