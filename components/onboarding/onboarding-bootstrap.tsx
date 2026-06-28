"use client";

import { useEffect, useState } from "react";

import { PageLoader } from "@/components/ui/page-loader";
import {
  bootstrapOnboardingState,
  resetOnboardingBootstrap,
} from "@/lib/onboarding-state";
import { navigateOnboarding } from "@/lib/onboarding-nav";

/**
 * Reconciles onboarding state before any route reads storage.
 * Redirects when cookie phase disagrees with localStorage truth.
 */
export function OnboardingBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const result = bootstrapOnboardingState();

    if (result.redirectTo) {
      resetOnboardingBootstrap();
      navigateOnboarding(result.redirectTo);
      return;
    }

    setReady(true);
  }, []);

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return <>{children}</>;
}
