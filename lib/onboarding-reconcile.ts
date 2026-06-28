import type { Preferences } from "@/lib/types";
import type { OnboardingPhase } from "@/lib/onboarding-phase";
import {
  getPathForPhase,
  isPathAllowedForPhase,
} from "@/lib/onboarding-phase";
import { readOnboardingPhaseCookie, setOnboardingPhaseCookie } from "@/lib/onboarding-cookie";
import {
  EMPTY_ONBOARDING,
  type OnboardingRecord,
  isProfileComplete,
  readOnboardingRecord,
  readPreferencesFromStorage,
  writeOnboardingRecord,
} from "@/lib/onboarding-state";

/** Bump when onboarding storage or reconcile rules change materially. */
export const ONBOARDING_SCHEMA_VERSION = 4;
export const SCHEMA_VERSION_KEY = "horizoniq.onboarding.schemaVersion";

const PREFS_KEY = "horizoniq.preferences.v2";
const VISIT_SNAPSHOT_KEY = "horizoniq-visit-snapshot";

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

export const PHASE_ORDER: OnboardingPhase[] = [
  "welcome",
  "name",
  "landing",
  "profile",
  "complete",
];

export interface ReconcileResult {
  phase: OnboardingPhase;
  repaired: boolean;
  redirectTo?: string;
}

export function phaseIndex(phase: OnboardingPhase): number {
  return PHASE_ORDER.indexOf(phase);
}

export function isPhaseAhead(
  a: OnboardingPhase,
  b: OnboardingPhase
): boolean {
  return phaseIndex(a) > phaseIndex(b);
}

/** Welcome → name → landing → profile ordering must hold. */
export function isValidOnboardingChain(record: OnboardingRecord): boolean {
  if (record.displayName && !record.welcomeCompletedAt) {
    return false;
  }
  if (record.landingAcknowledgedAt && !record.welcomeCompletedAt) {
    return false;
  }
  if (record.landingAcknowledgedAt && !record.displayName) {
    return false;
  }
  if (record.tourChoice && !record.landingAcknowledgedAt) {
    return false;
  }
  if (record.guidedTourCompletedAt && record.tourChoice !== "guided") {
    return false;
  }
  return true;
}

/** Strip impossible downstream flags while preserving valid partial progress. */
export function repairOnboardingRecord(
  record: OnboardingRecord
): OnboardingRecord {
  if (!isValidOnboardingChain(record)) {
    return { ...EMPTY_ONBOARDING };
  }

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

  return { ...record };
}

export function isStrictlyOnboardingCompleteFrom(
  record: OnboardingRecord,
  prefs: Preferences
): boolean {
  return (
    record.welcomeCompletedAt !== null &&
    record.displayName !== null &&
    record.landingAcknowledgedAt !== null &&
    isProfileComplete(prefs)
  );
}

export interface CanonicalPhaseResult {
  phase: OnboardingPhase;
  record: OnboardingRecord;
  wipePrefs: boolean;
}

/** Derive routing phase from storage — never skip ahead of validated progress. */
export function deriveCanonicalPhase(
  record: OnboardingRecord,
  prefs: Preferences
): CanonicalPhaseResult {
  if (!isValidOnboardingChain(record)) {
    return { phase: "welcome", record: { ...EMPTY_ONBOARDING }, wipePrefs: true };
  }

  const repaired = repairOnboardingRecord(record);

  if (isStrictlyOnboardingCompleteFrom(repaired, prefs)) {
    return { phase: "complete", record: repaired, wipePrefs: false };
  }

  if (isProfileComplete(prefs)) {
    return { phase: "profile", record: repaired, wipePrefs: false };
  }

  if (repaired.landingAcknowledgedAt) {
    return { phase: "profile", record: repaired, wipePrefs: false };
  }

  if (repaired.displayName) {
    return { phase: "landing", record: repaired, wipePrefs: false };
  }

  if (repaired.welcomeCompletedAt) {
    return { phase: "name", record: repaired, wipePrefs: false };
  }

  return { phase: "welcome", record: repaired, wipePrefs: false };
}

/** Pure reconcile — used by tests and browser entry points. */
export function reconcileState(
  cookiePhase: OnboardingPhase | null,
  record: OnboardingRecord,
  prefs: Preferences,
  pathname?: string
): ReconcileResult & {
  record: OnboardingRecord;
  wipePrefs: boolean;
} {
  const { phase: canonical, record: canonicalRecord, wipePrefs } =
    deriveCanonicalPhase(record, prefs);

  const repaired = cookiePhase !== canonical;

  const redirectTo =
    pathname && !isPathAllowedForPhase(pathname, canonical)
      ? getPathForPhase(canonical)
      : undefined;

  return {
    phase: canonical,
    repaired,
    redirectTo,
    record: canonicalRecord,
    wipePrefs,
  };
}

export function clearLegacyOnboardingArtifacts(): void {
  if (typeof window === "undefined") return;

  for (const key of LEGACY_STORAGE) {
    window.localStorage.removeItem(key);
  }
  for (const name of LEGACY_COOKIES) {
    document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
  }
}

function applyReconcileWrites(
  result: ReturnType<typeof reconcileState>
): void {
  if (typeof window === "undefined") return;

  writeOnboardingRecord(result.record);

  if (result.wipePrefs) {
    window.localStorage.removeItem(PREFS_KEY);
    window.localStorage.removeItem(VISIT_SNAPSHOT_KEY);
  }

  if (result.repaired || cookiePhase === null) {
    setOnboardingPhaseCookie(result.phase);
  }

  window.localStorage.setItem(
    SCHEMA_VERSION_KEY,
    String(ONBOARDING_SCHEMA_VERSION)
  );
}

/**
 * Reconcile cookie phase with localStorage truth on every page load.
 * Repairs stale cookies (e.g. profile with empty prefs) without DevTools.
 */
export function reconcileOnboardingState(
  pathname?: string
): ReconcileResult {
  if (typeof window === "undefined") {
    return { phase: "welcome", repaired: false };
  }

  clearLegacyOnboardingArtifacts();

  const cookiePhase = readOnboardingPhaseCookie();
  const record = readOnboardingRecord();
  const prefs = readPreferencesFromStorage();
  const path = pathname ?? window.location.pathname;

  const result = reconcileState(cookiePhase, record, prefs, path);
  applyReconcileWrites(result);

  return {
    phase: result.phase,
    repaired: result.repaired,
    redirectTo: result.redirectTo,
  };
}
