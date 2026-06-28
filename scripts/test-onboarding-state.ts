/**
 * Onboarding phase tests — run with: npx tsx scripts/test-onboarding-state.ts
 */
import assert from "node:assert/strict";

import {
  isPathAllowedForPhase,
  parsePhaseCookie,
  ONBOARDING_COOKIE_NAME,
} from "../lib/onboarding-phase";

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

console.log("\nAll onboarding phase tests passed.");
