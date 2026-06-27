"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { getFirstTimeOnboardingPath } from "@/lib/onboarding-flow";
import { identityService } from "@/lib/identity";

export default function WelcomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (identityService.hasCompletedWelcome()) {
      router.replace(getFirstTimeOnboardingPath());
    }
  }, [router]);

  if (!ready || identityService.hasCompletedWelcome()) {
    return null;
  }

  return <WelcomeScreen />;
}
