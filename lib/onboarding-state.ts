import type { Preferences } from "@/lib/types";
import type { TourChoice } from "@/lib/identity/types";
import type { OnboardingPhase } from "@/lib/onboarding-phase";
import { getPathForPhase } from "@/lib/onboarding-phase";
import {
  clearOnboardingPhaseCookie,
  hasOnboardingPhaseCookie,
  readOnboardingPhaseCookie,
  setOnboardingPhaseCookie,
} from "@/lib/onboarding-cookie";

export type { OnboardingPhase };
export { getPathForPhase };

export const ONBOARDING_SCHEMA_VERSION = 1;

const STORAGE_KEY = "horizoniq.onboarding.v1";

const LEGACY_KEYS = [
  "horizoniq.identity.v1",
  "horizoniq.onboarding.flowVersion",
  "horizoniq_phase",
  "horizoniq_phase_v1",
];

export interface OnboardingRecord {
  schemaVersion: number;
  displayName: string | null;
  welcomeCompletedAt: string | null;
  welcomeSkipped: boolean;
  landingAcknowledgedAt: string | null;
  tourChoice: TourChoice | null;
  guidedTourCompletedAt: string | null;
}

export const EMPTY_ONBOARDING: OnboardingRecord = {
  schemaVersion: ONBOARDING_SCHEMA_VERSION,
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
    const raw =
      window.localStorage.getItem("horizoniq.preferences.v2") ??
      window.localStorage.getItem("horizoniq.preferences.v1");
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

/** Derive phase from persisted data — used only for migration, not routing. */
export function derivePhaseFromStorage(
  record: OnboardingRecord,
  prefs = readPreferencesFromStorage()
): OnboardingPhase {
  if (!record.welcomeCompletedAt) return "welcome";
  if (!record.displayName) return "name";
  if (!record.landingAcknowledgedAt) return "landing";
  if (!isProfileComplete(prefs)) return "profile";
  return "complete";
}

/** Active routing phase — cookie first, always. */
export function getActivePhase(): OnboardingPhase {
  const cookiePhase = readOnboardingPhaseCookie();
  if (cookiePhase) return cookiePhase;
  return "welcome";
}

function normalizeRecord(raw: Partial<OnboardingRecord>): OnboardingRecord {
  return {
    ...EMPTY_ONBOARDING,
    ...raw,
    schemaVersion: ONBOARDING_SCHEMA_VERSION,
    displayName:
      typeof raw.displayName === "string" ? raw.displayName.trim() || null : null,
  };
}

export function readOnboardingRecord(): OnboardingRecord {
  if (!isBrowser()) return { ...EMPTY_ONBOARDING };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeRecord(JSON.parse(raw) as Partial<OnboardingRecord>);
    }
  } catch {
    // Ignore corrupt storage.
  }

  return { ...EMPTY_ONBOARDING };
}

export function writeOnboardingRecord(record: OnboardingRecord): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

function cleanupLegacyStorageKeys(): void {
  if (!isBrowser()) return;
  for (const key of LEGACY_KEYS) {
    window.localStorage.removeItem(key);
  }
  const legacyCookies = ["horizoniq_phase", "horizoniq_phase_v1"];
  for (const name of legacyCookies) {
    document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
  }
}

let bootstrapRan = false;

/**
 * Sync cookie + storage on first client load.
 * Cookie is routing authority; storage holds user data only.
 */
export function bootstrapOnboardingState(): OnboardingPhase {
  if (!isBrowser()) return "welcome";
  if (bootstrapRan) return getActivePhase();
  bootstrapRan = true;

  cleanupLegacyStorageKeys();

  const record = readOnboardingRecord();
  const prefs = readPreferencesFromStorage();
  const storedPhase = derivePhaseFromStorage(record, prefs);

  if (!hasOnboardingPhaseCookie()) {
    if (storedPhase === "complete") {
      setOnboardingPhaseCookie("complete");
    } else {
      writeOnboardingRecord({ ...EMPTY_ONBOARDING });
      setOnboardingPhaseCookie("welcome");
    }
    return getActivePhase();
  }

  const cookiePhase = readOnboardingPhaseCookie()!;

  if (cookiePhase === "complete" && storedPhase !== "complete") {
    setOnboardingPhaseCookie(storedPhase);
    return storedPhase;
  }

  if (cookiePhase !== "complete" && storedPhase === "complete") {
    setOnboardingPhaseCookie("complete");
    return "complete";
  }

  return cookiePhase;
}

export function advanceOnboardingPhase(phase: OnboardingPhase): void {
  setOnboardingPhaseCookie(phase);
}

export function clearOnboardingState(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  clearOnboardingPhaseCookie();
  bootstrapRan = false;
}

export function clearAllHorizonIQClientState(): void {
  if (!isBrowser()) return;

  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith("horizoniq.")) {
      keys.push(key);
    }
  }
  for (const key of keys) {
    window.localStorage.removeItem(key);
  }
  window.localStorage.removeItem("horizoniq-visit-snapshot");

  clearOnboardingPhaseCookie();
  cleanupLegacyStorageKeys();

  try {
    window.sessionStorage.clear();
  } catch {
    // Ignore.
  }

  bootstrapRan = false;
  setOnboardingPhaseCookie("welcome");
}
