/**
 * Future identity providers (Sprint 1+).
 *
 * Not implemented — localStorage via `LocalIdentityService` is the only
 * active backend today. When adding Google, GitHub, or Supabase auth:
 *
 * 1. Implement `IdentityService` for the provider.
 * 2. Merge remote profile with local display name / tour state.
 * 3. Swap the exported `identityService` singleton in `index.ts`.
 */

import type { IdentityService } from "./types";

export type FutureAuthProvider = "google" | "github" | "supabase";

export interface FutureAuthIdentityService extends IdentityService {
  readonly provider: FutureAuthProvider;
  /** Future: sign-in redirect URL. */
  signIn(): Promise<void>;
  /** Future: sign-out and clear session. */
  signOut(): Promise<void>;
}
