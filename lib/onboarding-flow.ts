import {
  bootstrapOnboardingState,
  getActivePhase,
} from "@/lib/onboarding-state";
import { getPathForPhase } from "@/lib/onboarding-phase";

export function getFirstTimeOnboardingPath(): string {
  bootstrapOnboardingState();
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

export {
  bootstrapOnboardingState,
  clearAllHorizonIQClientState,
  getActivePhase,
  advanceOnboardingPhase,
  isProfileComplete,
  readOnboardingRecord,
  readPreferencesFromStorage,
} from "@/lib/onboarding-state";

export { getPathForPhase } from "@/lib/onboarding-phase";
