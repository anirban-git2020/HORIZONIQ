/**
 * Domain-purity guardrail.
 *
 * Enforces the product invariant: every Signal stays inside its own subject.
 * Non-technical interests (arts, healthcare, finance, biology, …) must not be
 * framed as, related to, or adjacent to Artificial Intelligence. AI language is
 * only allowed where AI *is* the subject (the AI-native interests below).
 *
 * It also catches the silent-staleness trap that made earlier content fixes
 * appear to do nothing: if the shipped snapshot (generated-signals.ts) has
 * drifted from the editorial source (mock-intelligence.ts), that is a hard
 * error telling you to run `pipeline:signals`.
 *
 * Run: `npm run verify:domain` (also runs automatically before every build).
 *
 * Exit code 1 = a hard violation in the live domain dataset, relationships,
 * adjacency, or a stale snapshot.
 */

import { MOCK_SIGNALS } from "@/lib/domain/mock-intelligence";
import { GENERATED_SIGNALS } from "@/lib/intelligence/generated-signals";
import { ADJACENCY } from "@/lib/exchange/personalized-pulse";
import type { Signal } from "@/lib/domain/signal";
import type { InterestId } from "@/lib/types";

/** Interests where AI language is legitimate because AI is the subject. */
const AI_NATIVE: ReadonlySet<InterestId> = new Set<InterestId>([
  "artificial-intelligence",
  "cloud-computing",
  "cybersecurity",
  "robotics",
  "quantum-computing",
]);

/** Tokens that signal AI framing. Applied only to non-AI-native subjects. */
const FORBIDDEN: readonly { label: string; re: RegExp }[] = [
  { label: "AI", re: /\bAI\b/ },
  { label: "A.I.", re: /\bA\.I\.?/i },
  { label: "LLM", re: /\bLLMs?\b/ },
  { label: "GPT", re: /\bGPT/i },
  { label: "large language model", re: /\blarge language models?\b/i },
  { label: "machine learning", re: /\bmachine learning\b/i },
  { label: "deep learning", re: /\bdeep learning\b/i },
  { label: "neural network", re: /\bneural (net|network)/i },
  { label: "agentic", re: /\bagentic\b/i },
  { label: "generative AI/model", re: /\bgenerative (ai|models?)\b/i },
  { label: "chatbot", re: /\bchatbot/i },
];

type Violation = { kind: string; where: string; detail: string };
const errors: Violation[] = [];

function scanText(text: string): string[] {
  return FORBIDDEN.filter((f) => f.re.test(text)).map((f) => f.label);
}

function signalText(s: Signal): string {
  return [
    s.identity.title,
    s.identity.headline,
    s.identity.summary,
    s.reading.brief,
    s.forecast.forecast,
  ].join(" • ");
}

// ── Check A: live domain dataset text purity ────────────────────────────────
const mockById = new Map<string, Signal>(
  MOCK_SIGNALS.map((s) => [s.identity.id, s])
);

for (const s of MOCK_SIGNALS) {
  const interest = s.classification.interest;
  if (AI_NATIVE.has(interest)) continue;
  const hits = scanText(signalText(s));
  if (hits.length > 0) {
    errors.push({
      kind: "text",
      where: `${s.identity.id} (${interest})`,
      detail: `AI framing in a non-AI subject: ${hits.join(", ")}`,
    });
  }
}

// ── Check B: relationship purity (no non-AI subject links into AI) ──────────
for (const s of MOCK_SIGNALS) {
  const interest = s.classification.interest;
  if (AI_NATIVE.has(interest)) continue;
  for (const relId of s.relationships.relatedSignals) {
    const target = mockById.get(relId);
    if (target && target.classification.interest === "artificial-intelligence") {
      errors.push({
        kind: "relationship",
        where: `${s.identity.id} (${interest})`,
        detail: `relatedSignals → "${relId}" is an artificial-intelligence signal`,
      });
    }
  }
}

// ── Check C: adjacency purity (no non-AI subject adjacent to AI) ────────────
for (const [interest, adj] of Object.entries(ADJACENCY)) {
  if (AI_NATIVE.has(interest as InterestId)) continue;
  if ((adj ?? []).includes("artificial-intelligence")) {
    errors.push({
      kind: "adjacency",
      where: `${interest}`,
      detail: `adjacency includes "artificial-intelligence" — AI would appear in Related`,
    });
  }
}

// ── Check D: snapshot staleness (generated vs source editorial) ─────────────
if (GENERATED_SIGNALS.length > 0) {
  const genById = new Map<string, Signal>(
    GENERATED_SIGNALS.map((s) => [s.identity.id, s])
  );
  let stale = 0;
  for (const src of MOCK_SIGNALS) {
    const gen = genById.get(src.identity.id);
    if (!gen) continue;
    const drift =
      gen.identity.title !== src.identity.title ||
      gen.identity.headline !== src.identity.headline ||
      gen.identity.summary !== src.identity.summary ||
      gen.reading.brief !== src.reading.brief;
    if (drift) stale += 1;
  }
  if (stale > 0) {
    errors.push({
      kind: "stale-snapshot",
      where: "generated-signals.ts",
      detail: `${stale} signal(s) differ from the editorial source — run "npm run pipeline:signals" so edits actually ship`,
    });
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
function print(title: string, list: Violation[]): void {
  if (list.length === 0) return;
  console.log(`\n${title}`);
  for (const v of list) {
    console.log(`  • [${v.kind}] ${v.where}\n      ${v.detail}`);
  }
}

console.log("Domain-purity guardrail\n=======================");
console.log(
  `Scanned ${MOCK_SIGNALS.length} domain signals and ${GENERATED_SIGNALS.length} snapshot signals.`
);

print(`HARD violations (${errors.length}) — must fix:`, errors);

if (errors.length === 0) {
  console.log("\n✓ Live domain dataset is subject-pure. No AI leaks, no stale snapshot.");
}

process.exit(errors.length > 0 ? 1 : 0);
