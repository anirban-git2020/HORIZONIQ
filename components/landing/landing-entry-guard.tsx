"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageLoader } from "@/components/ui/page-loader";
import {
  derivePhase,
  getPathForPhase,
  readOnboardingRecord,
} from "@/lib/onboarding-state";

/**
 * Landing is shown from the landing phase onward (after welcome + name).
 */
export function LandingEntryGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const phase = derivePhase(readOnboardingRecord());

    if (phase === "welcome" || phase === "name") {
      router.replace(getPathForPhase(phase));
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return <>{children}</>;
}
