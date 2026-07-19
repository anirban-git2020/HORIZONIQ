import { INTERESTS } from "@/lib/options";
import type { NarrativeBundle } from "@/lib/pipeline/store/narratives";
import type { InterestScore } from "@/lib/pipeline/types";

/**
 * Digest composition — pure. Diffs a user's tracked interests against the
 * momentum they were last shown, using the latest score bundle. Prose reuses the
 * already-synthesized, machine-verified narrative for each interest; a plain
 * template is the fallback. Threshold matches the in-app digest (D1) for
 * consistency. No I/O, no side effects — trivially testable.
 */

const THRESHOLD = 3;
// Keyed by plain string — interest ids arrive from the DB as strings.
const LABEL = new Map<string, string>(INTERESTS.map((i) => [i.id, i.label]));

export type DigestBucket = "rising" | "falling" | "new";

export type DigestItem = {
  interestId: string;
  title: string;
  bucket: DigestBucket;
  delta: number;
  line: string;
};

/** interestId → momentum at the time of the last digest. */
export type DigestSnapshot = Record<string, number>;

export type ComposedDigest = {
  items: DigestItem[];
  steadyCount: number;
  /** Current momenta for every tracked interest — the next baseline. */
  snapshot: DigestSnapshot;
};

function narrativeSummary(
  narratives: NarrativeBundle | null,
  interestId: string
): string | undefined {
  const entry = narratives?.narratives[interestId] as
    | { narrative?: { summary?: string } }
    | undefined;
  const summary = entry?.narrative?.summary?.trim();
  return summary || undefined;
}

function templateLine(bucket: DigestBucket, delta: number): string {
  if (bucket === "new") return "Entered your radar this week.";
  if (bucket === "rising") return `Momentum climbed ${delta} points.`;
  return `Cooled ${Math.abs(delta)} points from last week.`;
}

export function composeDigest(
  interests: readonly string[],
  scores: readonly InterestScore[],
  prior: DigestSnapshot | null,
  narratives: NarrativeBundle | null
): ComposedDigest {
  const scoreById = new Map<string, number>(
    scores.map((s) => [s.interestId, Math.round(s.momentum)])
  );

  const snapshot: DigestSnapshot = {};
  const items: DigestItem[] = [];
  let steadyCount = 0;

  for (const id of interests) {
    const current = scoreById.get(id);
    if (current == null) continue; // no live score for this interest yet
    snapshot[id] = current;

    const title = LABEL.get(id) ?? id;
    const line = (bucket: DigestBucket, delta: number) =>
      narrativeSummary(narratives, id) ?? templateLine(bucket, delta);

    // First-ever run (no prior at all) only establishes the baseline — the
    // caller sends nothing. A field absent from an existing prior is genuinely
    // new to the user's tracked set since the last digest.
    if (!prior) continue;
    if (prior[id] == null) {
      items.push({ interestId: id, title, bucket: "new", delta: current, line: line("new", current) });
      continue;
    }

    const delta = current - prior[id];
    if (delta >= THRESHOLD) {
      items.push({ interestId: id, title, bucket: "rising", delta, line: line("rising", delta) });
    } else if (delta <= -THRESHOLD) {
      items.push({ interestId: id, title, bucket: "falling", delta, line: line("falling", delta) });
    } else {
      steadyCount += 1;
    }
  }

  items.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return { items, steadyCount, snapshot };
}
