import { getSessionElapsedMs, track } from "@/lib/analytics";
import type { InterestId, RegionId, RoleId } from "@/lib/types";

export const ONBOARDING_TOUR_PATH = "/onboarding/tour";

export type OnboardingPath = "quick" | "custom";

export function trackOnboardingCompleted(params: {
  role: RoleId;
  region: RegionId;
  interests: InterestId[];
  path: OnboardingPath;
}): void {
  track("onboarding_completed", {
    role: params.role,
    region: params.region,
    interestCount: params.interests.length,
    interests: params.interests,
    durationMs: getSessionElapsedMs(),
    path: params.path,
  });
}
