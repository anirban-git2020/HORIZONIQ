/**
 * Editorial synthesis config (Phase 1).
 *
 * Grounded, auto-published narratives are generated at pipeline time by a
 * multi-role LLM chain (writer → verifier), gated by code checks. Everything
 * here is conservative and fail-closed: a signal is only rewritten when it has
 * a real, verifiable trend AND every gate passes; otherwise the curated
 * editorial stands.
 */

import { getGeminiApiKey, getGroqApiKey } from "@/lib/pipeline/config/env";

export type LlmProvider = "groq" | "gemini";

export type SynthesisConfig = {
  readonly provider: LlmProvider;
  /** Strong free model drafts + verifies; a cheaper one could split later. */
  readonly writerModel: string;
  readonly verifierModel: string;
  /** Minimum real source samples required to attempt synthesis. */
  readonly minSamples: number;
  /** Minimum pipeline confidence (0..100) to attempt synthesis. */
  readonly minConfidence: number;
  readonly temperature: number;
  /** Interests where AI language is legitimate (mirrors the purity guard). */
  readonly aiNativeInterests: ReadonlySet<string>;
};

const GROQ_WRITER = "llama-3.3-70b-versatile";
const GROQ_VERIFIER = "llama-3.3-70b-versatile";
const GEMINI_WRITER = "gemini-1.5-flash";
const GEMINI_VERIFIER = "gemini-1.5-flash";

/** Resolves provider from whichever key is set. Groq preferred. */
export function resolveSynthesisConfig(): SynthesisConfig | null {
  const groq = getGroqApiKey();
  const gemini = getGeminiApiKey();
  const provider: LlmProvider | null = groq ? "groq" : gemini ? "gemini" : null;
  if (!provider) return null; // no key → synthesis disabled (fail-closed)

  return {
    provider,
    writerModel: provider === "groq" ? GROQ_WRITER : GEMINI_WRITER,
    verifierModel: provider === "groq" ? GROQ_VERIFIER : GEMINI_VERIFIER,
    // Broad coverage: synthesize wherever there is enough real evidence to
    // ground a headline. The floor stays high enough to prevent hallucination
    // (no evidence → no synthesis → curated + deterministic direction guard).
    minSamples: 3,
    minConfidence: 45,
    temperature: 0.2,
    aiNativeInterests: new Set([
      "artificial-intelligence",
      "cloud-computing",
      "cybersecurity",
      "robotics",
      "quantum-computing",
    ]),
  };
}

/** AI-framing tokens forbidden in non-AI-native subjects (mirrors the guard). */
export const FORBIDDEN_AI_PATTERNS: readonly RegExp[] = [
  /\bAI\b/,
  /\bLLMs?\b/,
  /\bGPT/i,
  /\bmachine learning\b/i,
  /\bdeep learning\b/i,
  /\bneural (net|network)/i,
  /\bagentic\b/i,
  /\bgenerative (ai|models?)\b/i,
  /\bchatbot/i,
];
