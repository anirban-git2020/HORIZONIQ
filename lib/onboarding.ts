import type { InterestId, RegionId, RoleId } from "@/lib/types";
import { getSessionElapsedMs, track } from "@/lib/analytics";
import type { OnboardingPath } from "@/lib/analytics";

export type { OnboardingPath } from "@/lib/analytics";

export const ONBOARDING_TOUR_PATH = "/onboarding/tour";

export function trackOnboardingCompleted(params: {
  role: RoleId;
  region: RegionId;
  interests: InterestId[];
  path: OnboardingPath;
}): void {
  track("interest_selected", {
    interestCount: params.interests.length,
    interests: params.interests,
    path: params.path,
  });

  track("onboarding_completed", {
    role: params.role,
    region: params.region,
    interestCount: params.interests.length,
    interests: params.interests,
    durationMs: getSessionElapsedMs(),
    path: params.path,
  });
}
