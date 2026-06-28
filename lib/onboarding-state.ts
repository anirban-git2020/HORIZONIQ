import type { Preferences } from "@/lib/types";
import type { TourChoice } from "@/lib/identity/types";
import type { OnboardingPhase } from "@/lib/onboarding-phase";
import {
  clearOnboardingPhaseCookie,
  readOnboardingPhaseCookie,
  setOnboardingPhaseCookie,
} from "@/lib/onboarding-cookie";

export type { OnboardingPhase };
export { getPathForPhase } from "@/lib/onboarding-phase";

const STORAGE_KEY = "horizoniq.onboarding.v1";
const PREFS_KEY = "horizoniq.preferences.v2";

const LEGACY_COOKIES = [
  "horizoniq_phase",
  "horizoniq_phase_v1",
  "horizoniq_phase_v2",
];

const LEGACY_STORAGE = [
  "horizoniq.identity.v1",
  "horizoniq.onboarding.flowVersion",
  "horizoniq.preferences.v1",
];

export interface OnboardingRecord {
  displayName: string | null;
  welcomeCompletedAt: string | null;
  welcomeSkipped: boolean;
  landingAcknowledgedAt: string | null;
  tourChoice: TourChoice | null;
  guidedTourCompletedAt: string | null;
}

export const EMPTY_ONBOARDING: OnboardingRecord = {
  displayName: null,
  welcomeCompletedAt: null,
  welcomeSkipped: false,
  landingAcknowledgedAt: null,
  tourChoice: null,
  guidedTourCompletedAt: null,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readPreferencesFromStorage(): Preferences {
  const empty: Preferences = { role: null, region: null, interests: [] };
  if (!isBrowser()) return empty;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      role: parsed.role ?? null,
      region: parsed.region ?? null,
      interests: Array.isArray(parsed.interests) ? parsed.interests : [],
    };
  } catch {
    return empty;
  }
}

export function isProfileComplete(prefs: Preferences): boolean {
  return (
    prefs.role !== null &&
    prefs.region !== null &&
    prefs.interests.length > 0
  );
}

/** True only when every onboarding step was finished in a prior session. */
export function isStrictlyOnboardingComplete(): boolean {
  const record = readOnboardingRecord();
  const prefs = readPreferencesFromStorage();
  return (
    record.welcomeCompletedAt !== null &&
    record.displayName !== null &&
    record.landingAcknowledgedAt !== null &&
    isProfileComplete(prefs)
  );
}

export function readOnboardingRecord(): OnboardingRecord {
  if (!isBrowser()) return { ...EMPTY_ONBOARDING };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_ONBOARDING };
    const parsed = JSON.parse(raw) as Partial<OnboardingRecord>;
    return {
      ...EMPTY_ONBOARDING,
      ...parsed,
      displayName:
        typeof parsed.displayName === "string"
          ? parsed.displayName.trim() || null
          : null,
    };
  } catch {
    return { ...EMPTY_ONBOARDING };
  }
}

export function writeOnboardingRecord(record: OnboardingRecord): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

/** Cookie is the only routing authority — never derived from localStorage. */
export function getActivePhase(): OnboardingPhase {
  return readOnboardingPhaseCookie() ?? "welcome";
}

export function advanceOnboardingPhase(phase: OnboardingPhase): void {
  setOnboardingPhaseCookie(phase);
}

function clearLegacyArtifacts(): void {
  if (!isBrowser()) return;
  for (const key of LEGACY_STORAGE) {
    window.localStorage.removeItem(key);
  }
  for (const name of LEGACY_COOKIES) {
    document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
  }
}

/** Wipe partial onboarding data so stale prefs cannot skip steps. */
export function wipeIncompleteOnboardingData(): void {
  if (!isBrowser()) return;
  if (isStrictlyOnboardingComplete()) return;

  writeOnboardingRecord({ ...EMPTY_ONBOARDING });
  window.localStorage.removeItem(PREFS_KEY);
  window.localStorage.removeItem("horizoniq-visit-snapshot");
  clearLegacyArtifacts();
}

let bootstrapRan = false;

/**
 * One-time client init: clear legacy artifacts, ensure cookie exists.
 * Does NOT sync phase from localStorage (that caused skip-ahead bugs).
 */
export function bootstrapOnboardingState(): OnboardingPhase {
  if (!isBrowser()) return "welcome";
  if (bootstrapRan) return getActivePhase();
  bootstrapRan = true;

  clearLegacyArtifacts();

  const cookie = readOnboardingPhaseCookie();
  if (!cookie) {
    if (isStrictlyOnboardingComplete()) {
      setOnboardingPhaseCookie("complete");
    } else {
      wipeIncompleteOnboardingData();
      setOnboardingPhaseCookie("welcome");
    }
  }

  return getActivePhase();
}

export function clearAllHorizonIQClientState(): void {
  if (!isBrowser()) return;

  for (let i = window.localStorage.length - 1; i >= 0; i--) {
    const key = window.localStorage.key(i);
    if (key?.startsWith("horizoniq.") || key === "horizoniq-visit-snapshot") {
      window.localStorage.removeItem(key);
    }
  }

  try {
    window.sessionStorage.clear();
  } catch {
    // Ignore.
  }

  clearOnboardingPhaseCookie();
  clearLegacyArtifacts();
  bootstrapRan = false;
  setOnboardingPhaseCookie("welcome");
}

export function clearOnboardingState(): void {
  writeOnboardingRecord({ ...EMPTY_ONBOARDING });
  clearOnboardingPhaseCookie();
  bootstrapRan = false;
}
