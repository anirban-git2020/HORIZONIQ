import type {
  AuthProvider,
  IdentityRecord,
  IdentityService,
  TourChoice,
} from "./types";
import { EMPTY_IDENTITY } from "./types";

const STORAGE_KEY = "horizoniq.identity.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readRecord(): IdentityRecord {
  if (!isBrowser()) return { ...EMPTY_IDENTITY };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_IDENTITY };
    const parsed = JSON.parse(raw) as Partial<IdentityRecord>;
    return {
      ...EMPTY_IDENTITY,
      ...parsed,
      displayName:
        typeof parsed.displayName === "string" ? parsed.displayName.trim() : null,
    };
  } catch {
    return { ...EMPTY_IDENTITY };
  }
}

function writeRecord(record: IdentityRecord): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export class LocalIdentityService implements IdentityService {
  getRecord(): IdentityRecord {
    return readRecord();
  }

  getDisplayName(): string | null {
    const name = readRecord().displayName;
    if (!name) return null;
    const trimmed = name.trim();
    return trimmed.length > 0 ? trimmed : null;
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
    return readRecord().greetingCompletedAt !== null;
  }

  markGreetingComplete(): void {
    writeRecord({
      ...readRecord(),
      greetingCompletedAt: new Date().toISOString(),
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

  clear(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(STORAGE_KEY);
  }

  getAuthProvider(): AuthProvider {
    return "local";
  }
}

export const identityService = new LocalIdentityService();
