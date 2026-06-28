"use client";

import { useEffect, useState } from "react";

import { PageLoader } from "@/components/ui/page-loader";
import { bootstrapOnboardingState } from "@/lib/onboarding-state";

/**
 * Loads and reconciles unified onboarding state before any route reads storage.
 */
export function OnboardingBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapOnboardingState();
    setReady(true);
  }, []);

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return <>{children}</>;
}
