"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { PageLoader } from "@/components/ui/page-loader";
import { getFirstTimeOnboardingPath } from "@/lib/onboarding-flow";
import { identityService } from "@/lib/identity";

export default function WelcomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (identityService.hasCompletedWelcome()) {
      router.replace(getFirstTimeOnboardingPath());
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return <WelcomeScreen />;
}
