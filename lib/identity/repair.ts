import { EMPTY_IDENTITY, type IdentityRecord } from "./types";

/** True when identity flags follow Welcome → Name → Landing order. */
export function isValidIdentityChain(record: IdentityRecord): boolean {
  if (record.displayName && !record.welcomeCompletedAt) {
    return false;
  }
  if (record.greetingCompletedAt && !record.welcomeCompletedAt) {
    return false;
  }
  if (record.greetingCompletedAt && !record.displayName) {
    return false;
  }
  if (record.tourChoice && !record.greetingCompletedAt) {
    return false;
  }
  if (record.guidedTourCompletedAt && record.tourChoice !== "guided") {
    return false;
  }
  return true;
}

/**
 * Strip impossible downstream flags while preserving valid partial progress.
 * Invalid chains reset to empty so the welcome flow can run again.
 */
export function repairIdentityRecord(record: IdentityRecord): IdentityRecord {
  if (!isValidIdentityChain(record)) {
    return { ...EMPTY_IDENTITY };
  }

  if (!record.welcomeCompletedAt) {
    return { ...EMPTY_IDENTITY };
  }

  if (!record.displayName) {
    return {
      ...record,
      greetingCompletedAt: null,
      tourChoice: null,
      guidedTourCompletedAt: null,
    };
  }

  if (!record.greetingCompletedAt) {
    return {
      ...record,
      tourChoice: null,
      guidedTourCompletedAt: null,
    };
  }

  return { ...record };
}
