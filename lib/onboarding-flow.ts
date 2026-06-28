import {
  bootstrapOnboardingState,
  derivePhase,
  getPathForPhase,
  isProfileComplete,
  readOnboardingRecord,
  readPreferencesFromStorage,
} from "@/lib/onboarding-state";

/**
 * Resume path from derived onboarding phase.
 * Welcome → Name → Landing → Profile → Dashboard.
 */
export function getFirstTimeOnboardingPath(): string {
  const record = readOnboardingRecord();
  const prefs = readPreferencesFromStorage();
  return getPathForPhase(derivePhase(record, prefs));
}

/** Landing acknowledged — user may enter profile setup. */
export function hasCompletedIdentityOnboarding(): boolean {
  const phase = derivePhase(
    readOnboardingRecord(),
    readPreferencesFromStorage()
  );
  return phase === "profile" || phase === "complete";
}

export function isFullyOnboarded(): boolean {
  return (
    derivePhase(readOnboardingRecord(), readPreferencesFromStorage()) ===
    "complete"
  );
}

export function getOnboardingRedirectPath(): string {
  return getFirstTimeOnboardingPath();
}

export function ensureOnboardingReady(): void {
  bootstrapOnboardingState();
}

export { isProfileComplete };
