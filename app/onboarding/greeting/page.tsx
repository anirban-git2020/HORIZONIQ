"use client";

import { useEffect } from "react";

import { PageLoader } from "@/components/ui/page-loader";
import { getFirstTimeOnboardingPath } from "@/lib/onboarding-flow";
import { identityService } from "@/lib/identity";
import { navigateOnboarding } from "@/lib/onboarding-nav";

/** Legacy URL — personalized greeting now lives on the landing page. */
export default function GreetingPage() {
  useEffect(() => {
    if (!identityService.hasCompletedWelcome()) {
      navigateOnboarding("/onboarding/welcome");
      return;
    }
    if (!identityService.getDisplayName()) {
      navigateOnboarding("/onboarding/name");
      return;
    }
    navigateOnboarding(getFirstTimeOnboardingPath());
  }, []);

  return <PageLoader label="Continuing…" />;
}
