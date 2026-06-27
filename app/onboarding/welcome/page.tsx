"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { getFirstTimeOnboardingPath } from "@/lib/onboarding-flow";
import { identityService } from "@/lib/identity";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    if (identityService.hasCompletedWelcome()) {
      router.replace(getFirstTimeOnboardingPath());
    }
  }, [router]);

  if (identityService.hasCompletedWelcome()) {
    return null;
  }

  return <WelcomeScreen />;
}
