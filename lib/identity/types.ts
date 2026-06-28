/** Future auth providers — not implemented in Sprint 1. */
export type AuthProvider = "local" | "google" | "github" | "supabase";

export type TourChoice = "guided" | "solo";

export interface IdentityRecord {
  displayName: string | null;
  welcomeCompletedAt: string | null;
  welcomeSkipped: boolean;
  greetingCompletedAt: string | null;
  tourChoice: TourChoice | null;
  guidedTourCompletedAt: string | null;
}

export const EMPTY_IDENTITY: IdentityRecord = {
  displayName: null,
  welcomeCompletedAt: null,
  welcomeSkipped: false,
  greetingCompletedAt: null,
  tourChoice: null,
  guidedTourCompletedAt: null,
};

export interface IdentityService {
  getRecord(): IdentityRecord;
  getDisplayName(): string | null;
  setDisplayName(name: string): void;
  hasCompletedWelcome(): boolean;
  markWelcomeComplete(options?: { skipped?: boolean }): void;
  hasCompletedGreeting(): boolean;
  markGreetingComplete(): void;
  getTourChoice(): TourChoice | null;
  setTourChoice(choice: TourChoice): void;
  shouldShowGuidedTour(): boolean;
  markGuidedTourComplete(): void;
  clear(): void;
  /** Normalize invalid flag combinations from stale or corrupt storage. */
  repair(): void;
  /** Replace the full identity record (used by bootstrap repair). */
  replaceRecord(record: IdentityRecord): void;
  /** Future: resolve auth provider when accounts ship. */
  getAuthProvider(): AuthProvider;
}
