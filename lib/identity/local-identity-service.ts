import type {
  AuthProvider,
  IdentityRecord,
  IdentityService,
  TourChoice,
} from "./types";
import { EMPTY_IDENTITY } from "./types";
import {
  bootstrapOnboardingState,
  clearOnboardingState,
  derivePhase,
  readOnboardingRecord,
  writeOnboardingRecord,
  type OnboardingRecord,
} from "@/lib/onboarding-state";

function toIdentityRecord(record: OnboardingRecord): IdentityRecord {
  return {
    displayName: record.displayName,
    welcomeCompletedAt: record.welcomeCompletedAt,
    welcomeSkipped: record.welcomeSkipped,
    greetingCompletedAt: record.landingAcknowledgedAt,
    tourChoice: record.tourChoice,
    guidedTourCompletedAt: record.guidedTourCompletedAt,
  };
}

function readRecord(): OnboardingRecord {
  return readOnboardingRecord();
}

function writeRecord(record: OnboardingRecord): void {
  writeOnboardingRecord(record);
}

export class LocalIdentityService implements IdentityService {
  getRecord(): IdentityRecord {
    return toIdentityRecord(readRecord());
  }

  getDisplayName(): string | null {
    return readRecord().displayName;
  }

  setDisplayName(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    writeRecord({ ...readRecord(), displayName: trimmed });
  }

  hasCompletedWelcome(): boolean {
    return readRecord().welcomeCompletedAt !== null;
  }

  markWelcomeComplete(options?: { skipped?: boolean }): void {
    writeRecord({
      ...readRecord(),
      welcomeCompletedAt: new Date().toISOString(),
      welcomeSkipped: options?.skipped ?? false,
    });
  }

  hasCompletedGreeting(): boolean {
    return readRecord().landingAcknowledgedAt !== null;
  }

  markGreetingComplete(): void {
    writeRecord({
      ...readRecord(),
      landingAcknowledgedAt: new Date().toISOString(),
    });
  }

  getTourChoice(): TourChoice | null {
    return readRecord().tourChoice;
  }

  setTourChoice(choice: TourChoice): void {
    writeRecord({ ...readRecord(), tourChoice: choice });
  }

  shouldShowGuidedTour(): boolean {
    const record = readRecord();
    return (
      record.tourChoice === "guided" && record.guidedTourCompletedAt === null
    );
  }

  markGuidedTourComplete(): void {
    writeRecord({
      ...readRecord(),
      guidedTourCompletedAt: new Date().toISOString(),
    });
  }

  repair(): void {
    bootstrapOnboardingState();
  }

  replaceRecord(record: IdentityRecord): void {
    writeRecord({
      ...readRecord(),
      displayName: record.displayName,
      welcomeCompletedAt: record.welcomeCompletedAt,
      welcomeSkipped: record.welcomeSkipped,
      landingAcknowledgedAt: record.greetingCompletedAt,
      tourChoice: record.tourChoice,
      guidedTourCompletedAt: record.guidedTourCompletedAt,
    });
    bootstrapOnboardingState();
  }

  clear(): void {
    clearOnboardingState();
  }

  getAuthProvider(): AuthProvider {
    return "local";
  }

  /** Current onboarding step derived from stored timestamps + profile. */
  getPhase() {
    return derivePhase(readRecord());
  }
}

export const identityService = new LocalIdentityService();
