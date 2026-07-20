"use client";

import { useEffect, useState } from "react";

import { PageLoader } from "@/components/ui/page-loader";
import {
  bootstrapOnboardingState,
  resetOnboardingBootstrap,
} from "@/lib/onboarding-state";
import { navigateOnboarding } from "@/lib/onboarding-nav";

/** Cap consecutive phase redirects so a bad state can never brick the app. */
const LOOP_KEY = "horizoniq.ob.redirects";
const MAX_REDIRECTS = 2;

/**
 * Reconciles onboarding storage before a route reads it, and redirects when the
 * phase disagrees with the current path.
 *
 * Two safety rails, because this runs on every page and a stuck redirect strands
 * the user on a loader:
 *   1. Never redirect to the path we're already on (self-loop guard).
 *   2. Fail open — after MAX_REDIRECTS bounces in one session, stop redirecting
 *      and just render. A slightly wrong page beats an infinite "Loading…".
 */
export function OnboardingBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const result = bootstrapOnboardingState();
    const here = window.location.pathname;
    const target = result.redirectTo;

    let count = 0;
    try {
      count = Number(window.sessionStorage.getItem(LOOP_KEY) ?? "0");
    } catch {
      // sessionStorage unavailable — treat as no prior redirects.
    }

    if (target && target !== here && count < MAX_REDIRECTS) {
      try {
        window.sessionStorage.setItem(LOOP_KEY, String(count + 1));
      } catch {
        // ignore
      }
      resetOnboardingBootstrap();
      navigateOnboarding(target);
      return;
    }

    // Settled on a valid path — clear the counter and render.
    try {
      window.sessionStorage.removeItem(LOOP_KEY);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return <>{children}</>;
}
