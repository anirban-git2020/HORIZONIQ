import {
  bootstrapOnboardingState,
  getActivePhase,
  isStrictlyOnboardingComplete,
  wipeIncompleteOnboardingData,
} from "@/lib/onboarding-state";
import { getPathForPhase } from "@/lib/onboarding-phase";
import { setOnboardingPhaseCookie } from "@/lib/onboarding-cookie";

export function getFirstTimeOnboardingPath(): string {
  return getPathForPhase(getActivePhase());
}

export function hasCompletedIdentityOnboarding(): boolean {
  const phase = getActivePhase();
  return phase === "profile" || phase === "complete";
}

export function isFullyOnboarded(): boolean {
  return getActivePhase() === "complete";
}

export function getOnboardingRedirectPath(): string {
  return getFirstTimeOnboardingPath();
}

export function ensureOnboardingReady(): void {
  bootstrapOnboardingState();
}

/** Returning users with valid saved data — skip re-onboarding once. */
export function migrateCompleteUserIfValid(): boolean {
  bootstrapOnboardingState();
  if (isStrictlyOnboardingComplete() && getActivePhase() !== "complete") {
    setOnboardingPhaseCookie("complete");
    return true;
  }
  return false;
}

export {
  bootstrapOnboardingState,
  clearAllHorizonIQClientState,
  getActivePhase,
  advanceOnboardingPhase,
  isProfileComplete,
  readOnboardingRecord,
  readPreferencesFromStorage,
  wipeIncompleteOnboardingData,
} from "@/lib/onboarding-state";

export { getPathForPhase } from "@/lib/onboarding-phase";
