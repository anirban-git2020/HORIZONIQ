/**
 * Onboarding phase + reconcile tests — run with: npx tsx scripts/test-onboarding-state.ts
 */
import assert from "node:assert/strict";

import {
  isPathAllowedForPhase,
  parsePhaseCookie,
  ONBOARDING_COOKIE_NAME,
} from "../lib/onboarding-phase";
import {
  deriveCanonicalPhase,
  isValidOnboardingChain,
  reconcileState,
} from "../lib/onboarding-reconcile";
import { EMPTY_ONBOARDING } from "../lib/onboarding-state";
import type { Preferences } from "../lib/types";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

const completeRecord = {
  ...EMPTY_ONBOARDING,
  welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
  displayName: "Alex",
  landingAcknowledgedAt: "2026-01-01T00:00:01.000Z",
};

const completePrefs: Preferences = {
  role: "student",
  region: "north-america",
  interests: ["artificial-intelligence"],
};

console.log("onboarding phase tests\n");

test("new cookie name is v3", () => {
  assert.equal(ONBOARDING_COOKIE_NAME, "hziq_ob_v3");
});

test("missing cookie → welcome", () => {
  assert.equal(parsePhaseCookie(undefined), "welcome");
});

test("legacy profile cookie value ignored → welcome", () => {
  assert.equal(parsePhaseCookie("profile"), "profile");
  assert.equal(parsePhaseCookie("garbage"), "welcome");
});

test("middleware blocks role during welcome", () => {
  assert.equal(isPathAllowedForPhase("/onboarding/role", "welcome"), false);
  assert.equal(isPathAllowedForPhase("/onboarding/welcome", "welcome"), true);
});

test("middleware blocks role during landing", () => {
  assert.equal(isPathAllowedForPhase("/onboarding/role", "landing"), false);
});

test("middleware allows role only in profile phase", () => {
  assert.equal(isPathAllowedForPhase("/onboarding/role", "profile"), true);
});

test("public site paths allowed during welcome", () => {
  assert.equal(isPathAllowedForPhase("/privacy", "welcome"), true);
  assert.equal(isPathAllowedForPhase("/about", "welcome"), true);
  assert.equal(isPathAllowedForPhase("/contact", "welcome"), true);
});

console.log("\nonboarding reconcile tests\n");

test("invalid chain → welcome + wipe", () => {
  const record = {
    ...EMPTY_ONBOARDING,
    displayName: "Alex",
  };
  assert.equal(isValidOnboardingChain(record), false);
  const result = deriveCanonicalPhase(record, {
    role: null,
    region: null,
    interests: [],
  });
  assert.equal(result.phase, "welcome");
  assert.equal(result.wipePrefs, true);
});

test("stale profile cookie + empty prefs → welcome", () => {
  const result = reconcileState(
    "profile",
    EMPTY_ONBOARDING,
    { role: null, region: null, interests: [] },
    "/onboarding/role"
  );
  assert.equal(result.phase, "welcome");
  assert.equal(result.repaired, true);
  assert.equal(result.redirectTo, "/onboarding/welcome");
  assert.equal(result.wipePrefs, false);
});

test("stale profile cookie + only displayName → landing", () => {
  const record = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
    displayName: "Alex",
  };
  const result = reconcileState(
    "profile",
    record,
    { role: null, region: null, interests: [] },
    "/onboarding/role"
  );
  assert.equal(result.phase, "landing");
  assert.equal(result.repaired, true);
  assert.equal(result.redirectTo, "/");
});

test("valid complete storage + missing cookie → complete", () => {
  const result = reconcileState(null, completeRecord, completePrefs, "/");
  assert.equal(result.phase, "complete");
  assert.equal(result.repaired, true);
});

test("valid complete storage + profile cookie → complete", () => {
  const result = reconcileState(
    "profile",
    completeRecord,
    completePrefs,
    "/onboarding/role"
  );
  assert.equal(result.phase, "complete");
  assert.equal(result.repaired, true);
  assert.equal(result.redirectTo, "/dashboard");
});

test("welcomeCompleted only → name phase", () => {
  const record = {
    ...EMPTY_ONBOARDING,
    welcomeCompletedAt: "2026-01-01T00:00:00.000Z",
  };
  const result = deriveCanonicalPhase(record, {
    role: null,
    region: null,
    interests: [],
  });
  assert.equal(result.phase, "name");
});

console.log("\nAll onboarding tests passed.");
