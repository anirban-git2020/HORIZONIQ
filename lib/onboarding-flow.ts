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
