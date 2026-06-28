"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { identityService } from "@/lib/identity";
import { getPathForPhase } from "@/lib/onboarding-phase";
import {
  bootstrapOnboardingState,
  getActivePhase,
} from "@/lib/onboarding-state";
import { usePreferences } from "@/lib/preferences";

type OnboardingStartLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: ComponentProps<typeof Link>["href"];
};

export function OnboardingStartLink({
  href,
  onClick,
  ...props
}: OnboardingStartLinkProps) {
  const { hydrated, preferences, isComplete } = usePreferences();

  const destination = (() => {
    if (href) return href;
    if (!hydrated) return "/onboarding/welcome";

    bootstrapOnboardingState();
    const phase = getActivePhase();

    if (phase === "landing") {
      return "/onboarding/role";
    }

    if (phase === "complete" && isComplete) {
      return "/dashboard";
    }

    return getPathForPhase(phase);
  })();

  return (
    <Link
      href={destination}
      onClick={(event) => {
        bootstrapOnboardingState();
        if (getActivePhase() === "landing") {
          identityService.markGreetingComplete();
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
