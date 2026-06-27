"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { PageLoader } from "@/components/ui/page-loader";
import {
  getFirstTimeOnboardingPath,
  getOnboardingEntryPath,
} from "@/lib/onboarding-flow";
import { identityService } from "@/lib/identity";
import { usePreferences } from "@/lib/preferences";

export default function WelcomePage() {
  const router = useRouter();
  const { hydrated, isComplete } = usePreferences();
  const [redirecting, setRedirecting] = useState(
    () => identityService.hasCompletedWelcome()
  );

  useEffect(() => {
    if (!identityService.hasCompletedWelcome()) return;

    setRedirecting(true);

    const identityPath = getFirstTimeOnboardingPath();
    if (identityPath !== "/onboarding/role") {
      router.replace(identityPath);
      return;
    }

    if (!hydrated) return;
    router.replace(getOnboardingEntryPath(isComplete));
  }, [hydrated, isComplete, router]);

  if (redirecting) {
    return <PageLoader label="Continuing to your briefing…" />;
  }

  return <WelcomeScreen />;
}
