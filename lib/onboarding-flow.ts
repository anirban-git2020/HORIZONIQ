import { identityService } from "@/lib/identity";

/**
 * Resume path for first-time identity onboarding.
 * Welcome → Name → Landing (greeting) → Profile.
 */
export function getFirstTimeOnboardingPath(): string {
  if (!identityService.hasCompletedWelcome()) {
    return "/onboarding/welcome";
  }
  if (!identityService.getDisplayName()) {
    return "/onboarding/name";
  }
  if (!identityService.hasCompletedGreeting()) {
    return "/";
  }
  return "/onboarding/role";
}

/** Welcome, name, and landing greeting before profile onboarding. */
export function hasCompletedIdentityOnboarding(): boolean {
  const displayName = identityService.getDisplayName();
  return (
    identityService.hasCompletedWelcome() &&
    displayName !== null &&
    displayName.length > 0 &&
    identityService.hasCompletedGreeting()
  );
}

/**
 * Redirect target when a protected route requires setup.
 * Identity steps take priority over profile onboarding.
 */
export function getOnboardingRedirectPath(): string {
  return getFirstTimeOnboardingPath();
}
