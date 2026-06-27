"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { formatPersonalizedGreeting } from "@/lib/identity/greeting";
import { formatTodayLabel } from "@/lib/utils";

export function BaselineBriefingBanner({
  displayName,
}: {
  displayName?: string | null;
}) {
  const todayLabel = formatTodayLabel();
  const greeting = displayName
    ? formatPersonalizedGreeting(displayName).salutation
    : null;

  return (
    <FadeIn>
      <p role="status" className="text-sm text-muted-foreground md:text-base">
        {greeting && (
          <>
            <span className="font-medium text-foreground">{greeting}</span>
            <span aria-hidden className="mx-2 text-border">
              ·
            </span>
          </>
        )}
        <span className="font-medium text-foreground">Week 1 baseline.</span>{" "}
        We saved {todayLabel} as your starting point — your next visit shows
        what changed.
      </p>
    </FadeIn>
  );
}
