import type { OnboardingPhase } from "@/lib/onboarding-phase";
import { ONBOARDING_COOKIE_NAME } from "@/lib/onboarding-phase";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Set onboarding phase cookie — routing authority for middleware. */
export function setOnboardingPhaseCookie(phase: OnboardingPhase): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ONBOARDING_COOKIE_NAME}=${phase};path=/;max-age=${ONE_YEAR_SECONDS};SameSite=Lax`;
}

export function clearOnboardingPhaseCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ONBOARDING_COOKIE_NAME}=;path=/;max-age=0;SameSite=Lax`;
}

export function readOnboardingPhaseCookie(): OnboardingPhase | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ONBOARDING_COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.split("=")[1];
  if (
    value === "welcome" ||
    value === "name" ||
    value === "landing" ||
    value === "profile" ||
    value === "complete"
  ) {
    return value;
  }
  return null;
}

export function hasOnboardingPhaseCookie(): boolean {
  return readOnboardingPhaseCookie() !== null;
}
