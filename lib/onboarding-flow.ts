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
  const displayName = identityService.getDisplayName();
  return (
    identityService.hasCompletedWelcome() &&
    displayName !== null &&
    displayName.length > 0 &&
    identityService.hasCompletedGreeting()
  );
}

/**
 * Smart entry when the user clicks Get started / Build my dashboard.
 * Resumes incomplete identity or profile steps; otherwise opens the dashboard.
 */
export function getOnboardingEntryPath(isProfileComplete: boolean): string {
  if (!hasCompletedIdentityOnboarding()) {
    return getFirstTimeOnboardingPath();
  }
  if (isProfileComplete) {
    return "/dashboard";
  }
  return "/onboarding/role";
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
