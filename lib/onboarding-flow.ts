import { identityService } from "@/lib/identity";

/** Resume path for first-time onboarding (Sprint 1). */
export function getFirstTimeOnboardingPath(): string {
  if (!identityService.hasCompletedWelcome()) {
    return "/onboarding/welcome";
  }
  if (!identityService.getDisplayName()) {
    return "/onboarding/name";
  }
  if (!identityService.hasCompletedGreeting()) {
    return "/onboarding/greeting";
  }
  return "/onboarding/role";
}

/** Welcome, name, and greeting steps before profile onboarding. */
export function hasCompletedIdentityOnboarding(): boolean {
  return (
    identityService.hasCompletedWelcome() &&
    identityService.getDisplayName() !== null &&
    identityService.hasCompletedGreeting()
  );
}

/**
 * Redirect target when a protected route requires setup.
 * Identity steps take priority over profile onboarding.
 */
export function getOnboardingRedirectPath(): string {
  const identityPath = getFirstTimeOnboardingPath();
  if (identityPath !== "/onboarding/role") {
    return identityPath;
  }
  return "/onboarding/role";
}
