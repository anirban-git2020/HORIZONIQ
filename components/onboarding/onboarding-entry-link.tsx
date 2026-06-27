"use client";

import type { ComponentProps } from "react";

import { getOnboardingEntryPath } from "@/lib/onboarding-flow";
import { usePreferences } from "@/lib/preferences";

type OnboardingEntryLinkProps = Omit<ComponentProps<"a">, "href">;

/**
 * Full-page navigation avoids soft-route bugs that leave a blank screen.
 * Destination is resolved at click time when preferences are hydrated.
 */
export function OnboardingEntryLink({
  children,
  onClick,
  ...props
}: OnboardingEntryLinkProps) {
  const { hydrated, isComplete } = usePreferences();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    event.preventDefault();
    const destination = hydrated
      ? getOnboardingEntryPath(isComplete)
      : "/onboarding/welcome";
    window.location.assign(destination);
  };

  return (
    <a href="/onboarding/welcome" onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
