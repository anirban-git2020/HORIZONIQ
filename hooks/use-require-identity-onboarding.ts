"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getFirstTimeOnboardingPath,
  hasCompletedIdentityOnboarding,
} from "@/lib/onboarding-flow";

/** Redirect to welcome / name / landing when identity onboarding is incomplete. */
export function useRequireIdentityOnboarding(hydrated = true): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!hasCompletedIdentityOnboarding()) {
      router.replace(getFirstTimeOnboardingPath());
      return;
    }
    setReady(true);
  }, [hydrated, router]);

  return ready;
}
