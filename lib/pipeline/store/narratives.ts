import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SynthesisResult } from "@/lib/pipeline/synthesis/orchestrate";

/**
 * Store for auto-synthesized narratives. Written by `pipeline:synthesize` (CI)
 * and read by the signal generator at build time — so the LLM runs on a
 * schedule, never on every deploy. Keyed by signal id (identity.id) so signals
 * that share an interest each get their own narrative.
 */
const DIR = path.join(process.cwd(), "data", "pipeline", "narratives");

export type NarrativeBundle = {
  version: 1;
  generatedAt: string;
  narratives: Record<string, SynthesisResult>;
};

export async function readLatestNarratives(): Promise<NarrativeBundle | null> {
  try {
    const raw = await readFile(path.join(DIR, "latest.json"), "utf8");
    return JSON.parse(raw) as NarrativeBundle;
  } catch {
    return null;
  }
}

export async function writeNarratives(bundle: NarrativeBundle): Promise<string> {
  await mkdir(DIR, { recursive: true });
  const target = path.join(DIR, "latest.json");
  await writeFile(target, JSON.stringify(bundle, null, 2), "utf8");
  return target;
}
