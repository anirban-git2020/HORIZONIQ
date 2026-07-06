import { isPublicSitePath } from "@/lib/site";

/** Shared onboarding phase — used by middleware (server) and client. */
export type OnboardingPhase =
  | "welcome"
  | "name"
  | "landing"
  | "profile"
  | "complete";

/**
 * Bump version suffix to invalidate all prior cookies on deploy.
 * Old names: horizoniq_phase, horizoniq_phase_v1, horizoniq_phase_v2
 */
export const ONBOARDING_COOKIE_NAME = "hziq_ob_v3";

export const ONBOARDING_PHASES: OnboardingPhase[] = [
  "welcome",
  "name",
  "landing",
  "profile",
  "complete",
];

export function isOnboardingPhase(value: string): value is OnboardingPhase {
  return (ONBOARDING_PHASES as string[]).includes(value);
}

export function getPathForPhase(phase: OnboardingPhase): string {
  switch (phase) {
    case "welcome":
      return "/onboarding/welcome";
    case "name":
      return "/onboarding/name";
    case "landing":
      return "/";
    case "profile":
      return "/onboarding/role";
    case "complete":
      return "/dashboard";
  }
}

export function getAllowedPathPrefixes(phase: OnboardingPhase): string[] {
  switch (phase) {
    case "welcome":
      return ["/onboarding/welcome"];
    case "name":
      return ["/onboarding/name"];
    case "landing":
      return ["/"];
    case "profile":
      return [
        "/onboarding/greeting",
        "/onboarding/role",
        "/onboarding/region",
        "/onboarding/interests",
        "/onboarding/tour",
      ];
    case "complete":
      return ["/", "/dashboard", "/signals", "/onboarding/interests"];
  }
}

export function isPathAllowedForPhase(
  pathname: string,
  phase: OnboardingPhase
): boolean {
  if (isPublicSitePath(pathname)) return true;
  return getAllowedPathPrefixes(phase).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** Unknown or legacy cookie → welcome (never skip ahead). */
export function parsePhaseCookie(value: string | undefined): OnboardingPhase {
  if (value && isOnboardingPhase(value)) return value;
  return "welcome";
}
