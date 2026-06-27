import { generateBriefing } from "@/lib/pipeline/generate/briefing";
import {
  readLatestObservations,
  readLatestScores,
} from "@/lib/pipeline/store/observations";
import {
  wasPipelineBriefingBefore,
  writeBriefingArtifacts,
} from "@/lib/pipeline/store/briefing";

export interface GeneratePipelineResult {
  briefingPath: string;
  metaPath: string;
  briefingPeriod: string;
  dataProvenance: string;
  topRisingSignalId?: string;
  bucketCounts: Record<string, number>;
}

export async function runBriefingGenerator(): Promise<GeneratePipelineResult> {
  const observations = await readLatestObservations();
  const scores = await readLatestScores();

  if (!observations || !scores) {
    throw new Error(
      "No pipeline observations/scores found. Run npm run pipeline:ingest first."
    );
  }

  const hadPipelineBefore = await wasPipelineBriefingBefore(observations.period);
  const result = await generateBriefing({
    observations,
    scores,
    isFirstPipelineRun: !hadPipelineBefore,
  });

  const { briefingPath, metaPath } = await writeBriefingArtifacts(result);

  return {
    briefingPath,
    metaPath,
    briefingPeriod: result.briefing.briefingPeriod,
    dataProvenance: result.briefing.dataProvenance,
    topRisingSignalId: result.topRisingSignalId,
    bucketCounts: {
      new: result.briefing.buckets.new.length,
      rising: result.briefing.buckets.rising.length,
      falling: result.briefing.buckets.falling.length,
      stable: result.briefing.buckets.stable.length,
    },
  };
}
