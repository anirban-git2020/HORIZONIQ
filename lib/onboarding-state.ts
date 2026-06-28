import type { Preferences } from "@/lib/types";
import type { TourChoice } from "@/lib/identity/types";

/** Canonical onboarding progress — derived from timestamps + profile, never trusted alone. */
export type OnboardingPhase =
  | "welcome"
  | "name"
  | "landing"
  | "profile"
  | "complete";

export const ONBOARDING_SCHEMA_VERSION = 1;

const STORAGE_KEY = "horizoniq.onboarding.v1";

const LEGACY_IDENTITY_KEY = "horizoniq.identity.v1";
const LEGACY_FLOW_VERSION_KEY = "horizoniq.onboarding.flowVersion";

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

/** Single source of truth — recomputed on every read after bootstrap. */
export function derivePhase(
  record: OnboardingRecord,
  prefs = readPreferencesFromStorage()
): OnboardingPhase {
  if (!record.welcomeCompletedAt) return "welcome";
  if (!record.displayName) return "name";
  if (!record.landingAcknowledgedAt) return "landing";
  if (!isProfileComplete(prefs)) return "profile";
  return "complete";
}

export function getPathForPhase(phase: OnboardingPhase): string {
  switch (phase) {
    case "welcome":
      return "/onboarding/welcome";
    case "name":
      return "/onboarding/name";
    case "landing":
      return "/";
    case "profile":
      return "/onboarding/role";
    case "complete":
      return "/dashboard";
  }
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

/** Strip impossible downstream timestamps so phase derivation stays consistent. */
export function reconcileRecord(record: OnboardingRecord): OnboardingRecord {
  if (!record.welcomeCompletedAt) {
    return { ...EMPTY_ONBOARDING };
  }

  if (!record.displayName) {
    return {
      ...record,
      landingAcknowledgedAt: null,
      tourChoice: null,
      guidedTourCompletedAt: null,
    };
  }

  if (!record.landingAcknowledgedAt) {
    return {
      ...record,
      tourChoice: null,
      guidedTourCompletedAt: null,
    };
  }

  if (record.guidedTourCompletedAt && record.tourChoice !== "guided") {
    return { ...record, guidedTourCompletedAt: null };
  }

  return { ...record };
}

function readLegacyIdentity(): Partial<OnboardingRecord> | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_IDENTITY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      displayName?: string | null;
      welcomeCompletedAt?: string | null;
      welcomeSkipped?: boolean;
      greetingCompletedAt?: string | null;
      tourChoice?: TourChoice | null;
      guidedTourCompletedAt?: string | null;
    };
    return {
      displayName:
        typeof parsed.displayName === "string" ? parsed.displayName.trim() : null,
      welcomeCompletedAt: parsed.welcomeCompletedAt ?? null,
      welcomeSkipped: parsed.welcomeSkipped ?? false,
      landingAcknowledgedAt: parsed.greetingCompletedAt ?? null,
      tourChoice: parsed.tourChoice ?? null,
      guidedTourCompletedAt: parsed.guidedTourCompletedAt ?? null,
    };
  } catch {
    return null;
  }
}

export function readOnboardingRecord(): OnboardingRecord {
  if (!isBrowser()) return { ...EMPTY_ONBOARDING };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeRecord(JSON.parse(raw) as Partial<OnboardingRecord>);
    }
  } catch {
    // Fall through to legacy migration.
  }

  const legacy = readLegacyIdentity();
  if (legacy) {
    return normalizeRecord(legacy);
  }

  return { ...EMPTY_ONBOARDING };
}

export function writeOnboardingRecord(record: OnboardingRecord): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

function cleanupLegacyKeys(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LEGACY_IDENTITY_KEY);
  window.localStorage.removeItem(LEGACY_FLOW_VERSION_KEY);
}

let bootstrapRan = false;

/**
 * Load unified onboarding state, reconcile timestamps, persist, and remove legacy keys.
 * Must run once before any route guard reads storage.
 */
export function bootstrapOnboardingState(): OnboardingRecord {
  if (!isBrowser()) return { ...EMPTY_ONBOARDING };
  if (bootstrapRan) return readOnboardingRecord();
  bootstrapRan = true;

  const reconciled = reconcileRecord(readOnboardingRecord());
  writeOnboardingRecord(reconciled);
  cleanupLegacyKeys();
  return reconciled;
}

export function clearOnboardingState(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_IDENTITY_KEY);
  window.localStorage.removeItem(LEGACY_FLOW_VERSION_KEY);
  bootstrapRan = false;
}

/** Clear all HorizonIQ client storage (Start over). */
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

  try {
    window.sessionStorage.clear();
  } catch {
    // Ignore.
  }

  bootstrapRan = false;
}
