/** Shared onboarding phase — used by middleware (server) and client. */
export type OnboardingPhase =
  | "welcome"
  | "name"
  | "landing"
  | "profile"
  | "complete";

/** Bump to invalidate all prior client storage/cookies and restart onboarding. */
export const ONBOARDING_COOKIE_NAME = "horizoniq_phase_v2";

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

/** Routes allowed while in each phase (middleware uses prefix matching for signals). */
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
      return [
        "/",
        "/dashboard",
        "/signals",
        "/onboarding/interests",
        "/onboarding/role",
        "/onboarding/region",
      ];
  }
}

export function isPathAllowedForPhase(
  pathname: string,
  phase: OnboardingPhase
): boolean {
  return getAllowedPathPrefixes(phase).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function parsePhaseCookie(value: string | undefined): OnboardingPhase {
  if (value && isOnboardingPhase(value)) return value;
  return "welcome";
}
