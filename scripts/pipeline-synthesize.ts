/**
 * pipeline:synthesize — the editorial-synthesis step.
 *
 * For each interest with a real, confident trend, it builds an evidence bundle
 * from the latest observations and runs the multi-role orchestrator
 * (writer → gates → verifier). Accepted narratives are written to
 * data/pipeline/narratives/latest.json; the signal generator overlays them at
 * build time. Fail-closed: no key, no data, or any rejection → curated stands.
 *
 * Runs in CI (every 2 days) or locally: `npm run pipeline:synthesize`.
 */

import { MOCK_SIGNALS } from "@/lib/domain/mock-intelligence";
import { INTEREST_QUERY_BY_ID } from "@/lib/pipeline/config/interest-queries";
import { resolveSynthesisConfig } from "@/lib/pipeline/config/synthesis";
import {
  orchestrateSignal,
  type EvidenceBundle,
  type EvidenceSample,
  type SynthesisResult,
} from "@/lib/pipeline/synthesis/orchestrate";
import { writeNarratives } from "@/lib/pipeline/store/narratives";
import {
  readLatestObservations,
  readLatestScores,
} from "@/lib/pipeline/store/observations";

const SOURCE_LABEL: Record<string, string> = {
  github: "GitHub",
  arxiv: "arXiv",
  "hacker-news": "Hacker News",
  wikimedia: "Wikipedia",
  "product-hunt": "Product Hunt",
  pubmed: "PubMed",
  gdelt: "Global News",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const now = () => new Date().toISOString();
  const cfg = resolveSynthesisConfig();
  if (!cfg) {
    console.log(
      "pipeline:synthesize — no LLM key (GROQ_API_KEY / GEMINI_API_KEY) set; synthesis disabled, curated editorial kept."
    );
    await writeNarratives({ version: 1, generatedAt: now(), narratives: {} });
    return;
  }

  const [obs, scores] = await Promise.all([readLatestObservations(), readLatestScores()]);
  if (!obs || !scores) {
    console.log("pipeline:synthesize — no observations/scores found; run pipeline:ingest first.");
    await writeNarratives({ version: 1, generatedAt: now(), narratives: {} });
    return;
  }

  console.log(`pipeline:synthesize — provider=${cfg.provider} model=${cfg.writerModel}`);
  const scoreByInterest = new Map(scores.interests.map((s) => [s.interestId, s]));
  const domainByInterest = new Map(
    MOCK_SIGNALS.map((s) => [s.classification.interest, s.classification.domain])
  );
  // How many signals share each interest — interest-level evidence can't tell
  // them apart, so we only synthesize interests owned by a single signal.
  const interestCounts = new Map<string, number>();
  for (const s of MOCK_SIGNALS) {
    const i = s.classification.interest;
    interestCounts.set(i, (interestCounts.get(i) ?? 0) + 1);
  }

  const narratives: Record<string, SynthesisResult> = {};
  const acceptedWords: { interest: string; words: Set<string> }[] = [];
  let accepted = 0;
  let rejected = 0;
  let skipped = 0;

  const significantWords = (h: string) =>
    new Set(
      h
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
  const jaccard = (a: Set<string>, b: Set<string>) => {
    let inter = 0;
    for (const w of a) if (b.has(w)) inter += 1;
    const union = a.size + b.size - inter;
    return union === 0 ? 0 : inter / union;
  };

  for (const base of MOCK_SIGNALS) {
    const interestId = base.classification.interest;
    const score = scoreByInterest.get(interestId);
    if (!score) {
      skipped += 1;
      continue;
    }
    if ((interestCounts.get(interestId) ?? 0) > 1) {
      skipped += 1; // ambiguous: multiple signals share this interest
      continue;
    }

    const samples: EvidenceSample[] = [];
    const seen = new Set<string>();
    for (const src of Object.values(obs.sources)) {
      if (!src || src.status === "failed") continue;
      const io = src.interests[interestId];
      if (!io) continue;
      for (const s of io.samples) {
        const key = s.url || s.title;
        if (seen.has(key)) continue;
        seen.add(key);
        samples.push({ source: SOURCE_LABEL[src.source] ?? src.source, title: s.title, url: s.url });
      }
    }

    const ev: EvidenceBundle = {
      interestId,
      label: INTEREST_QUERY_BY_ID.get(interestId)?.label ?? base.identity.title,
      domain: domainByInterest.get(interestId) ?? base.classification.domain,
      direction: score.direction,
      confidence: score.confidence,
      samples,
    };

    const outcome = await orchestrateSignal(ev, cfg);
    if (outcome.status === "accepted") {
      const words = significantWords(outcome.result.narrative.headline);
      const dup = acceptedWords.find((a) => jaccard(a.words, words) > 0.6);
      if (dup) {
        rejected += 1;
        console.log(`  ✗ ${interestId}: rejected — duplicate of ${dup.interest}`);
        await sleep(4000);
        continue;
      }
      acceptedWords.push({ interest: interestId, words });
      narratives[interestId] = outcome.result;
      accepted += 1;
      console.log(`  ✓ ${interestId}: "${outcome.result.narrative.headline}"`);
      await sleep(4000); // stay under free-tier rate limits
    } else if (outcome.status === "rejected") {
      rejected += 1;
      console.log(`  ✗ ${interestId}: rejected — ${outcome.reason}`);
      await sleep(4000);
    } else {
      skipped += 1; // no LLM call was made
    }
  }

  await writeNarratives({ version: 1, generatedAt: now(), narratives });
  console.log(
    `pipeline:synthesize — ${accepted} published, ${rejected} rejected, ${skipped} skipped (of ${MOCK_SIGNALS.length}).`
  );
}

main().catch((error) => {
  console.error("pipeline:synthesize failed:", error);
  process.exit(1);
});
