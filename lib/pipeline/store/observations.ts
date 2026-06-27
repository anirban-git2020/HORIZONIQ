import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ObservationBundle, ScoreBundle } from "@/lib/pipeline/types";

const DATA_ROOT = path.join(process.cwd(), "data", "pipeline");

export const OBSERVATIONS_DIR = path.join(DATA_ROOT, "observations");
export const SCORES_DIR = path.join(DATA_ROOT, "scores");

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

function datedFilename(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export async function readLatestObservations(): Promise<ObservationBundle | null> {
  try {
    const raw = await readFile(
      path.join(OBSERVATIONS_DIR, "latest.json"),
      "utf8"
    );
    return JSON.parse(raw) as ObservationBundle;
  } catch {
    return null;
  }
}

export async function writeObservations(
  bundle: ObservationBundle
): Promise<{ latestPath: string; datedPath: string }> {
  await ensureDir(OBSERVATIONS_DIR);
  const datedPath = path.join(
    OBSERVATIONS_DIR,
    `${datedFilename(bundle.ingestedAt)}.json`
  );
  const latestPath = path.join(OBSERVATIONS_DIR, "latest.json");
  const payload = JSON.stringify(bundle, null, 2);

  await Promise.all([
    writeFile(latestPath, payload, "utf8"),
    writeFile(datedPath, payload, "utf8"),
  ]);

  return { latestPath, datedPath };
}

export async function writeScores(bundle: ScoreBundle): Promise<string> {
  await ensureDir(SCORES_DIR);
  const latestPath = path.join(SCORES_DIR, "latest.json");
  const datedPath = path.join(
    SCORES_DIR,
    `${datedFilename(bundle.scoredAt)}.json`
  );
  const payload = JSON.stringify(bundle, null, 2);

  await Promise.all([
    writeFile(latestPath, payload, "utf8"),
    writeFile(datedPath, payload, "utf8"),
  ]);

  return latestPath;
}
