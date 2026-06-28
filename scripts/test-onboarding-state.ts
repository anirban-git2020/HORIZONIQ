/**
 * Onboarding phase tests — run with: npx tsx scripts/test-onboarding-state.ts
 */
import assert from "node:assert/strict";

import {
  isPathAllowedForPhase,
  parsePhaseCookie,
} from "../lib/onboarding-phase";
import {
  derivePhaseFromStorage,
  EMPTY_ONBOARDING,
  type OnboardingRecord,
} from "../lib/onboarding-state";
import type { Preferences } from "../lib/types";

const completePrefs: Preferences = {
  role: "professional",
  region: "north-america",
  interests: ["artificial-intelligence"],
};

const emptyPrefs: Preferences = { role: null, region: null, interests: [] };

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("onboarding phase tests\n");

test("missing cookie → welcome", () => {
  assert.equal(parsePhaseCookie(undefined), "welcome");
});

test("middleware blocks dashboard during welcome", () => {
  assert.equal(isPathAllowedForPhase("/dashboard", "welcome"), false);
  assert.equal(isPathAllowedForPhase("/onboarding/welcome", "welcome"), true);
});

test("middleware allows landing only in landing phase", () => {
  assert.equal(isPathAllowedForPhase("/", "landing"), true);
  assert.equal(isPathAllowedForPhase("/", "welcome"), false);
});

test("storage derive: empty → welcome", () => {
  assert.equal(derivePhaseFromStorage(EMPTY_ONBOARDING, emptyPrefs), "welcome");
});

test("storage derive: stale profile without landing ack → landing", () => {
  const r: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    displayName: "Alex",
  };
  assert.equal(derivePhaseFromStorage(r, completePrefs), "landing");
});

test("storage derive: full chain → complete", () => {
  const r: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    displayName: "Alex",
    landingAcknowledgedAt: "2026-01-01T00:00:00.000Z",
  };
  assert.equal(derivePhaseFromStorage(r, completePrefs), "complete");
});

console.log("\nAll onboarding phase tests passed.");
