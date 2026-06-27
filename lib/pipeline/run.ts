import { runPipelineIngest } from "@/lib/pipeline/ingest";
import type { PipelineSourceId } from "@/lib/pipeline/types";
import { scoreObservations } from "@/lib/pipeline/score/interest-scores";
import {
  readLatestObservations,
  writeObservations,
  writeScores,
} from "@/lib/pipeline/store/observations";

export interface PipelineRunResult {
  observationsPath: string;
  scoresPath: string;
  sourceStatus: Record<string, string>;
  sourceErrors: Partial<Record<PipelineSourceId, string>>;
  topRising: Array<{ interest: string; momentum: number; confidence: number }>;
}

export async function runPipeline(): Promise<PipelineRunResult> {
  const previousBundle = await readLatestObservations();
  const bundle = await runPipelineIngest({ previousBundle });
  const { latestPath } = await writeObservations(bundle);
  const scores = scoreObservations(bundle);
  const scoresPath = await writeScores(scores);

  const sourceStatus = Object.fromEntries(
    Object.entries(bundle.sources).map(([key, source]) => [
      key,
      source?.status ?? "missing",
    ])
  );

  const sourceErrors: Partial<Record<PipelineSourceId, string>> = {};
  for (const [key, source] of Object.entries(bundle.sources)) {
    if (source?.error) {
      sourceErrors[key as PipelineSourceId] = source.error;
    }
  }

  const topRising = scores.interests
    .filter((entry) => entry.direction === "rising")
    .slice(0, 5)
    .map((entry) => ({
      interest: entry.interestId,
      momentum: entry.momentum,
      confidence: entry.confidence,
    }));

  return {
    observationsPath: latestPath,
    scoresPath,
    sourceStatus,
    sourceErrors,
    topRising,
  };
}
