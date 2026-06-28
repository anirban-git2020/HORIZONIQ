"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { identityService } from "@/lib/identity";
import { usePreferences } from "@/lib/preferences";

type OnboardingStartLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: ComponentProps<typeof Link>["href"];
};

function resolveLandingCtaHref(isProfileComplete: boolean): string {
  if (!identityService.hasCompletedWelcome()) {
    return "/onboarding/welcome";
  }
  if (!identityService.getDisplayName()) {
    return "/onboarding/name";
  }
  if (!isProfileComplete) {
    return "/onboarding/role";
  }
  return "/dashboard";
}

/**
 * Landing CTA after Welcome + Name + greeting acknowledgment → profile or dashboard.
 */
export function OnboardingStartLink({
  href,
  onClick,
  ...props
}: OnboardingStartLinkProps) {
  const { hydrated, isComplete } = usePreferences();
  const destination =
    href ?? (hydrated ? resolveLandingCtaHref(isComplete) : "/onboarding/welcome");

  return (
    <Link
      href={destination}
      onClick={(event) => {
        if (
          (destination === "/onboarding/role" ||
            destination === "/dashboard") &&
          !identityService.hasCompletedGreeting()
        ) {
          identityService.markGreetingComplete();
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
