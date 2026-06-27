import { readFile } from "node:fs/promises";
import path from "node:path";

import catalogSignalsJson from "@/data/catalog/signals.json";
import jobsJson from "@/data/jobs.json";
import recommendationsJson from "@/data/recommendations.json";
import skillsJson from "@/data/skills.json";

import type {
  BriefingRecord,
  JobRecord,
  MetaRecord,
  RecommendationRecord,
  SignalCatalogRecord,
  SignalBriefingState,
  SkillRecord,
} from "@/lib/data/schemas";
import {
  updateJobsFromPipeline,
  updateRecommendationsFromPipeline,
  updateSkillsFromPipeline,
} from "@/lib/pipeline/generate/derived-data";
import {
  assignBuckets,
  buildSignalState,
} from "@/lib/pipeline/generate/signal-state";
import { countHealthySources } from "@/lib/pipeline/generate/sources";
import type {
  ObservationBundle,
  ScoreBundle,
} from "@/lib/pipeline/types";
import {
  BRIEFING_REFRESH_SCHEDULE,
} from "@/lib/pipeline/config/schedule";
import {
  formatBriefingLabel,
  formatBriefingPeriod,
} from "@/lib/pipeline/utils/periods";

const DATA_ROOT = path.join(process.cwd(), "data");

export interface GenerateBriefingInput {
  observations: ObservationBundle;
  scores: ScoreBundle;
  /** When true, use interest direction instead of momentum delta for change types. */
  isFirstPipelineRun?: boolean;
}

export interface GenerateBriefingResult {
  briefing: BriefingRecord;
  meta: MetaRecord;
  skills: SkillRecord[];
  jobs: JobRecord[];
  recommendations: RecommendationRecord[];
  briefingFile: string;
  topRisingSignalId?: string;
}

async function loadPreviousBriefing(
  period: string
): Promise<BriefingRecord | null> {
  const filePath = path.join(DATA_ROOT, "briefings", `${period}.json`);
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as BriefingRecord;
  } catch {
    return null;
  }
}

function previousStateMap(
  briefing: BriefingRecord | null
): Map<string, SignalBriefingState> {
  const map = new Map<string, SignalBriefingState>();
  if (!briefing) return map;
  for (const state of briefing.signalStates) {
    map.set(state.signalId, state);
  }
  return map;
}

export async function generateBriefing(
  input: GenerateBriefingInput
): Promise<GenerateBriefingResult> {
  const { observations, scores, isFirstPipelineRun = false } = input;
  const catalog = (
    catalogSignalsJson as { signals: SignalCatalogRecord[] }
  ).signals.filter((entry) => entry.status === "active");

  const period = observations.period || formatBriefingPeriod();
  const briefingLabel = observations.periodLabel || formatBriefingLabel();
  const previousBriefing = await loadPreviousBriefing(period);
  const previousStates = previousStateMap(previousBriefing);

  const scoreByInterest = new Map(
    scores.interests.map((entry) => [entry.interestId, entry])
  );

  const byInterest = new Map<string, SignalCatalogRecord[]>();
  for (const entry of catalog) {
    const list = byInterest.get(entry.interest) ?? [];
    list.push(entry);
    byInterest.set(entry.interest, list);
  }

  const signalStates = catalog.map((entry) => {
    const siblings = byInterest.get(entry.interest) ?? [entry];
    const rank = siblings.findIndex((s) => s.id === entry.id);
    return buildSignalState(
      entry,
      scoreByInterest.get(entry.interest),
      rank,
      siblings.length,
      previousStates.get(entry.id),
      observations,
      period,
      isFirstPipelineRun
    );
  });

  const healthySources = countHealthySources(observations);
  const dataProvenance: BriefingRecord["dataProvenance"] =
    healthySources >= 4
      ? "pipeline"
      : healthySources >= 2
        ? "pipeline-mock"
        : "curated-mock";

  const briefing: BriefingRecord = {
    briefingPeriod: period,
    briefingLabel,
    publishedAt: new Date().toISOString(),
    dataProvenance,
    buckets: assignBuckets(signalStates),
    signalStates,
  };

  const topRising = [...signalStates]
    .filter((s) => s.change.type === "rising" || s.change.type === "new")
    .sort((a, b) => b.momentum - a.momentum)[0];

  const topRisingCatalog = topRising
    ? catalog.find((c) => c.id === topRising.signalId)
    : undefined;

  const skills = updateSkillsFromPipeline(
    (skillsJson as { skills: SkillRecord[] }).skills,
    scores,
    observations
  );
  const jobs = updateJobsFromPipeline(
    (jobsJson as { jobs: JobRecord[] }).jobs,
    scores,
    observations
  );
  const recommendations = updateRecommendationsFromPipeline(
    (recommendationsJson as { recommendations: RecommendationRecord[] })
      .recommendations,
    scores,
    topRisingCatalog?.name
  );

  const briefingFile = `${period}.json`;
  const meta: MetaRecord = {
    briefingPeriod: period,
    briefingLabel,
    updatedAt: briefing.publishedAt,
    activeBriefingFile: briefingFile,
    refreshSchedule: BRIEFING_REFRESH_SCHEDULE,
  };

  return {
    briefing,
    meta,
    skills,
    jobs,
    recommendations,
    briefingFile,
    topRisingSignalId: topRising?.signalId,
  };
}
