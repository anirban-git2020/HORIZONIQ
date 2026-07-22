/**
 * Editorial synthesis orchestrator — the multi-role chain.
 *
 *   writer (LLM)  →  code gates (purity / no-numbers)  →  verifier (LLM)  →  accept
 *
 * Fail-closed at every step: any missing evidence, LLM error, unparseable
 * output, purity leak, fabricated figure, or failed verification returns a
 * rejection, and the caller keeps the curated editorial. Nothing unverified is
 * ever published.
 */

import {
  FORBIDDEN_AI_PATTERNS,
  type SynthesisConfig,
} from "@/lib/pipeline/config/synthesis";
import { chat } from "@/lib/pipeline/synthesis/llm";

export type EvidenceSample = { source: string; title: string; url: string };

export type EvidenceBundle = {
  interestId: string;
  /** Signal that owns this narrative — narratives are keyed per signal, not per interest. */
  signalId: string;
  label: string;
  domain: string;
  direction: string;
  confidence: number;
  /** Signal-specific angle (tags) so shared-interest signals get distinct headlines. */
  focus?: string;
  samples: EvidenceSample[];
};

export type Narrative = {
  title: string;
  headline: string;
  summary: string;
  brief: string;
  forecast: string;
};

export type SynthesisResult = {
  interestId: string;
  signalId: string;
  narrative: Narrative;
  sources: { label: string; url: string }[];
  model: string;
  provider: string;
  generatedAt: string;
};

export type OrchestrateOutcome =
  | { status: "accepted"; result: SynthesisResult }
  | { status: "skipped"; reason: string }
  | { status: "rejected"; reason: string };

function parseJson<T>(text: string): T | null {
  try {
    let s = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    // Extract the first {...} block, tolerating stray prose around it.
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) s = s.slice(start, end + 1);
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

/** Generic filler / metric-describing headlines that read as "nothing happened". */
const VAGUE_HEADLINE =
  /\b(remains?|continue[sd]?|steady|steadily|stable|ongoing|unchanged|operates?|maintains?|study|studies|trends?)\b/i;

function narrativeText(n: Narrative): string {
  return [n.title, n.headline, n.summary, n.brief, n.forecast].join(" • ");
}

/** Plain-English movement phrase the writer/verifier reason about. */
function directionPhrase(direction: string): string {
  if (direction === "rising") return "RISING (momentum is up this period)";
  if (direction === "falling") return "FALLING / COOLING (momentum is down this period)";
  return "FLAT (no clear rise or fall this period)";
}

function evidenceForPrompt(ev: EvidenceBundle): string {
  const items = ev.samples
    .slice(0, 12)
    .map((s, i) => `${i + 1}. [${s.source}] ${s.title}`)
    .join("\n");
  const focus = ev.focus ? `\nAngle to emphasise: ${ev.focus}` : "";
  return `Subject: ${ev.label} (${ev.domain})${focus}\nTrend direction: ${directionPhrase(
    ev.direction
  )}\nRecent source items:\n${items}`;
}

function isCompleteNarrative(n: unknown): n is Narrative {
  const o = n as Record<string, unknown>;
  return (
    !!o &&
    typeof o.title === "string" &&
    typeof o.headline === "string" &&
    typeof o.summary === "string" &&
    typeof o.brief === "string" &&
    typeof o.forecast === "string"
  );
}

export async function orchestrateSignal(
  ev: EvidenceBundle,
  cfg: SynthesisConfig
): Promise<OrchestrateOutcome> {
  // ── Gate 0: enough real, confident evidence to bother ──
  if (ev.samples.length < cfg.minSamples) {
    return { status: "skipped", reason: `only ${ev.samples.length} samples` };
  }
  if (ev.confidence < cfg.minConfidence) {
    return { status: "skipped", reason: `confidence ${ev.confidence} < ${cfg.minConfidence}` };
  }
  // Every direction — including flat — is synthesized so the text always matches
  // the live momentum. A flat week gets steady-state framing (never a rise/fall
  // claim), enforced by the direction-consistency rule in writer + verifier.

  const aiNative = cfg.aiNativeInterests.has(ev.interestId);
  const evidence = evidenceForPrompt(ev);

  // ── Writer role ──
  const writerSystem =
    "You are an intelligence editor for HorizonIQ. Voice: The Economist / Bloomberg / Financial Times — " +
    "factual, precise, restrained. Write a short signal STRICTLY grounded in the SPECIFIC developments named " +
    "in the provided source titles. Name the concrete technology, finding, event, or shift — the headline must " +
    "convey a specific development a reader could not have guessed. BANNED filler: 'remains stable', 'continues', " +
    "'research continues', 'operates', 'steady', 'studies'. If you'd write those, be more specific about what the " +
    "sources actually say. Invent nothing (no facts, companies, quotes, or numbers); put no figures or percentages " +
    "in the prose (metrics are shown separately). " +
    "DIRECTION LOCK — the evidence states a Trend direction. Your headline MUST agree with it: " +
    "never call a subject accelerating, surging, soaring, booming, or rising when the trend is FALLING; " +
    "never call it cooling, slowing, fading, or declining when the trend is RISING; if the trend is FLAT, " +
    "state the specific development without implying any rise or fall. " +
    (aiNative
      ? ""
      : "This subject is NOT about artificial intelligence — write about the subject itself, never framing it as AI. ") +
    'Return ONLY JSON: {"title": "2-4 words", "headline": "one present-tense sentence, max 12 words", ' +
    '"summary": "one sentence", "brief": "two sentences", "forecast": "one sentence on what to watch"}.';

  let draftRaw: string;
  try {
    draftRaw = await chat(
      { system: writerSystem, user: evidence, model: cfg.writerModel, temperature: cfg.temperature, json: true },
      cfg.provider
    );
  } catch (e) {
    return { status: "rejected", reason: `writer error: ${(e as Error).message}` };
  }
  const draft = parseJson<Narrative>(draftRaw);
  if (!isCompleteNarrative(draft)) {
    return { status: "rejected", reason: "writer output not valid narrative JSON" };
  }

  const text = narrativeText(draft);

  // ── Code gate: reject vague / uninformative headlines ("remains stable" etc.) ──
  if (VAGUE_HEADLINE.test(draft.headline) || draft.headline.trim().split(/\s+/).length < 3) {
    return { status: "rejected", reason: `vague headline: "${draft.headline}"` };
  }

  // ── Code gate: subject purity (no AI framing in non-AI subjects) ──
  if (!aiNative) {
    const leak = FORBIDDEN_AI_PATTERNS.find((re) => re.test(text));
    if (leak) return { status: "rejected", reason: `AI leak in non-AI subject: ${leak}` };
  }
  // ── Code gate: no fabricated figures in prose ──
  if (/\d+\s*%/.test(text) || /\$\s?\d/.test(text)) {
    return { status: "rejected", reason: "prose contains a specific figure/percentage" };
  }

  // ── Verifier role (independent pass) ──
  const verifierSystem =
    "You are a strict fact-checker and editor. Given a DRAFT signal and the EVIDENCE (which names the Subject) it " +
    "must be based on, set ok=false if ANY of these hold: a claim is unsupported by the evidence titles; " +
    "anything is invented or hyped; the draft is vague/generic/uninformative (e.g. 'remains stable', 'research " +
    "continues'); OR the development is not CENTRALLY about the stated Subject — reject stories that really " +
    "belong to a different field (for example, an energy story is NOT a commerce signal, even if a retailer is " +
    "mentioned); OR the headline's implied momentum direction CONTRADICTS the evidence's Trend direction " +
    "(e.g. it reads as accelerating/surging/rising while the trend is FALLING, or cooling/declining while the " +
    "trend is RISING, or claims a rise/fall while the trend is FLAT). " +
    'Only ok=true for a specific, on-subject, fully supported, direction-consistent signal. Return ONLY JSON: {"ok": boolean, "issues": ["..."]}.';
  const verifierUser = `EVIDENCE:\n${evidence}\n\nDRAFT:\n${JSON.stringify(draft)}`;

  let verdictRaw: string;
  try {
    verdictRaw = await chat(
      { system: verifierSystem, user: verifierUser, model: cfg.verifierModel, temperature: 0, json: true },
      cfg.provider
    );
  } catch (e) {
    return { status: "rejected", reason: `verifier error: ${(e as Error).message}` };
  }
  const verdict = parseJson<{ ok?: boolean; issues?: string[] }>(verdictRaw);
  if (!verdict || verdict.ok !== true) {
    return { status: "rejected", reason: `verifier failed: ${verdict?.issues?.join("; ") ?? "no verdict"}` };
  }

  // ── Accept ──
  const sources = ev.samples.slice(0, 5).map((s) => ({ label: `${s.source}: ${s.title}`, url: s.url }));
  return {
    status: "accepted",
    result: {
      interestId: ev.interestId,
      signalId: ev.signalId,
      narrative: draft,
      sources,
      model: cfg.writerModel,
      provider: cfg.provider,
      generatedAt: new Date().toISOString(),
    },
  };
}
