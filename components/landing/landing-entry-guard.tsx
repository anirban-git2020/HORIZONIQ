"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageLoader } from "@/components/ui/page-loader";
import { identityService } from "@/lib/identity";

/**
 * Landing is shown only after Welcome and Name.
 * Greeting completion happens when the user continues to profile setup.
 */
export function LandingEntryGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!identityService.hasCompletedWelcome()) {
      router.replace("/onboarding/welcome");
      return;
    }
    if (!identityService.getDisplayName()) {
      router.replace("/onboarding/name");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return <>{children}</>;
}
