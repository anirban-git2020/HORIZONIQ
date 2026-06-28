/**
 * Onboarding state machine tests — run with: npx tsx scripts/test-onboarding-state.ts
 */
import assert from "node:assert/strict";

import {
  EMPTY_ONBOARDING,
  derivePhase,
  getPathForPhase,
  reconcileRecord,
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

console.log("onboarding-state tests\n");

test("empty state → welcome", () => {
  assert.equal(derivePhase(EMPTY_ONBOARDING, emptyPrefs), "welcome");
  assert.equal(getPathForPhase("welcome"), "/onboarding/welcome");
});

test("welcome done, no name → name", () => {
  const r: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
  };
  assert.equal(derivePhase(r, emptyPrefs), "name");
});

test("welcome + name, no landing ack → landing", () => {
  const r: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    displayName: "Alex",
  };
  assert.equal(derivePhase(r, emptyPrefs), "landing");
  assert.equal(getPathForPhase("landing"), "/");
});

test("stale greeting flag without name → reconcile resets to welcome", () => {
  const corrupt: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    landingAcknowledgedAt: "2026-01-01T00:00:00.000Z",
    displayName: null,
  };
  const fixed = reconcileRecord(corrupt);
  assert.equal(fixed.landingAcknowledgedAt, null);
  assert.equal(derivePhase(fixed, emptyPrefs), "name");
});

test("stale profile prefs without landing ack → landing phase", () => {
  const r: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    displayName: "Alex",
  };
  assert.equal(derivePhase(r, completePrefs), "landing");
});

test("full chain → complete", () => {
  const r: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    displayName: "Alex",
    landingAcknowledgedAt: "2026-01-01T00:00:00.000Z",
  };
  assert.equal(derivePhase(r, completePrefs), "complete");
  assert.equal(getPathForPhase("complete"), "/dashboard");
});

test("landing ack + incomplete profile → profile", () => {
  const r: OnboardingRecord = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    displayName: "Alex",
    landingAcknowledgedAt: "2026-01-01T00:00:00.000Z",
  };
  assert.equal(derivePhase(r, emptyPrefs), "profile");
  assert.equal(getPathForPhase("profile"), "/onboarding/role");
});

console.log("\nAll onboarding-state tests passed.");
