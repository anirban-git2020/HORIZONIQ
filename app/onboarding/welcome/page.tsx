"use client";

import { useEffect, useState } from "react";

import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { PageLoader } from "@/components/ui/page-loader";
import { getPathForPhase } from "@/lib/onboarding-phase";
import {
  bootstrapOnboardingState,
  getActivePhase,
  migrateCompleteUserIfValid,
} from "@/lib/onboarding-flow";

export default function WelcomePage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapOnboardingState();

    if (migrateCompleteUserIfValid()) {
      window.location.replace("/dashboard");
      return;
    }

    const phase = getActivePhase();
    if (phase !== "welcome") {
      window.location.replace(getPathForPhase(phase));
      return;
    }

    setReady(true);
  }, []);

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return <WelcomeScreen />;
}
