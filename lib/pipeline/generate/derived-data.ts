import type {
  Demand,
  DemandChange,
  GrowthChange,
  InterestId,
} from "@/lib/types";
import type {
  JobRecord,
  RecommendationRecord,
  SkillRecord,
} from "@/lib/data/schemas";
import type {
  InterestScore,
  ObservationBundle,
  ScoreBundle,
} from "@/lib/pipeline/types";
import { INTEREST_LABEL } from "@/lib/options";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function scoreForInterest(
  scores: ScoreBundle,
  interestId: InterestId
): InterestScore | undefined {
  return scores.interests.find((entry) => entry.interestId === interestId);
}

function directionToDemandChange(
  direction: InterestScore["direction"] | undefined
): DemandChange {
  if (direction === "rising") return "rising";
  if (direction === "falling") return "falling";
  return "stable";
}

function directionToGrowthChange(
  direction: InterestScore["direction"] | undefined
): GrowthChange {
  if (direction === "rising") return "rising";
  if (direction === "falling") return "falling";
  return "stable";
}

function demandFromMomentum(momentum: number): Demand {
  if (momentum >= 75) return "Critical";
  if (momentum >= 55) return "High";
  return "Growing";
}

function changeSummaryForInterest(
  interestId: InterestId,
  scores: ScoreBundle,
  bundle: ObservationBundle,
  prefix: string
): string {
  const score = scoreForInterest(scores, interestId);
  const label = INTEREST_LABEL[interestId];
  const driver = score?.drivers[0];
  const githubSample = bundle.sources.github?.interests[interestId]
    ?.samples[0]?.title;
  const phSample = bundle.sources["product-hunt"]?.interests[interestId]
    ?.samples[0]?.title;

  if (phSample) {
    return `${prefix} — Product Hunt activity includes ${phSample}.`;
  }
  if (githubSample) {
    return `${prefix} — GitHub repos like ${githubSample} gained traction.`;
  }
  if (driver) {
    return `${prefix} — ${driver.label} ${driver.value > 0 ? "+" : ""}${driver.value}% this week in ${label}.`;
  }
  return `${prefix} — live pipeline signals updated for ${label}.`;
}

export function updateSkillsFromPipeline(
  skills: SkillRecord[],
  scores: ScoreBundle,
  bundle: ObservationBundle
): SkillRecord[] {
  return skills.map((skill) => {
    const matching = skill.interests
      .map((id) => scoreForInterest(scores, id))
      .filter((entry): entry is InterestScore => entry !== undefined);

    if (matching.length === 0) return skill;

    const top = matching.reduce((best, entry) =>
      entry.momentum > best.momentum ? entry : best
    );

    const demandChange = directionToDemandChange(top.direction);
    return {
      ...skill,
      demand: demandFromMomentum(top.momentum),
      demandChange,
      changeSummary: changeSummaryForInterest(
        top.interestId,
        scores,
        bundle,
        skill.demandChange === "rising"
          ? "Skills demand still rising"
          : "Skills demand shifted"
      ),
    };
  });
}

export function updateJobsFromPipeline(
  jobs: JobRecord[],
  scores: ScoreBundle,
  bundle: ObservationBundle
): JobRecord[] {
  return jobs.map((job) => {
    const matching = job.interests
      .map((id) => scoreForInterest(scores, id))
      .filter((entry): entry is InterestScore => entry !== undefined);

    if (matching.length === 0) return job;

    const top = matching.reduce((best, entry) =>
      entry.momentum > best.momentum ? entry : best
    );

    const growthChange = directionToGrowthChange(top.direction);
    const growth = clamp(Math.round(top.momentum * 0.85), 12, 96);

    return {
      ...job,
      growth,
      growthChange,
      changeSummary: changeSummaryForInterest(
        top.interestId,
        scores,
        bundle,
        growthChange === "new"
          ? "New opportunity signal this week"
          : growthChange === "rising"
            ? "Heating up"
            : "Market signal update"
      ),
    };
  });
}

export function updateRecommendationsFromPipeline(
  recommendations: RecommendationRecord[],
  scores: ScoreBundle,
  topRisingSignalName?: string
): RecommendationRecord[] {
  const topInterest = scores.interests.find((e) => e.direction === "rising");

  return recommendations.map((rec) => {
    const matchesTop =
      topInterest && rec.interests.includes(topInterest.interestId);

    if (!matchesTop) return rec;

    const reason = topRisingSignalName
      ? `Pipeline flagged ${topRisingSignalName} as rising this week.`
      : `Live pipeline shows rising momentum in ${INTEREST_LABEL[topInterest.interestId]}.`;

    return {
      ...rec,
      changeReason: reason,
      isPrimary: rec.isPrimary || matchesTop,
    };
  });
}
