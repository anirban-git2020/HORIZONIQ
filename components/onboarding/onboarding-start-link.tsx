"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { identityService } from "@/lib/identity";
import {
  derivePhase,
  getPathForPhase,
  readOnboardingRecord,
} from "@/lib/onboarding-state";
import { usePreferences } from "@/lib/preferences";

type OnboardingStartLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: ComponentProps<typeof Link>["href"];
};

/**
 * Landing CTA — advances from landing phase to profile (or dashboard when complete).
 */
export function OnboardingStartLink({
  href,
  onClick,
  ...props
}: OnboardingStartLinkProps) {
  const { hydrated, preferences } = usePreferences();

  const destination = (() => {
    if (href) return href;
    if (!hydrated) return "/onboarding/welcome";

    const record = readOnboardingRecord();
    const phase = derivePhase(record, preferences);

    if (phase === "landing") {
      return "/onboarding/role";
    }

    return getPathForPhase(phase);
  })();

  return (
    <Link
      href={destination}
      onClick={(event) => {
        const phase = derivePhase(readOnboardingRecord(), preferences);
        if (phase === "landing") {
          identityService.markGreetingComplete();
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
