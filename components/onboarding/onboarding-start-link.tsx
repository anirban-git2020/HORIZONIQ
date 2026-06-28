"use client";

import type { ComponentProps } from "react";

import { identityService } from "@/lib/identity";
import { getPathForPhase } from "@/lib/onboarding-phase";
import {
  bootstrapOnboardingState,
  getActivePhase,
} from "@/lib/onboarding-state";
import { navigateOnboarding } from "@/lib/onboarding-nav";
import { usePreferences } from "@/lib/preferences";

type OnboardingStartLinkProps = ComponentProps<"a"> & {
  href?: string;
};

export function OnboardingStartLink({
  href: hrefProp,
  onClick,
  children,
  ...props
}: OnboardingStartLinkProps) {
  const { hydrated, isComplete } = usePreferences();

  const destination = (() => {
    if (hrefProp) return hrefProp;
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
    <a
      href={destination}
      onClick={(event) => {
        event.preventDefault();
        bootstrapOnboardingState();
        if (getActivePhase() === "landing") {
          identityService.markGreetingComplete();
        }
        onClick?.(event);
        navigateOnboarding(destination);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
