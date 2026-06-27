"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { formatTodayLabel } from "@/lib/utils";

export function BaselineBriefingBanner() {
  const todayLabel = formatTodayLabel();

  return (
    <FadeIn>
      <p
        role="status"
        className="text-sm text-muted-foreground md:text-base"
      >
        <span className="font-medium text-foreground">Week 1 baseline.</span>{" "}
        We saved {todayLabel} as your starting point — your next visit shows
        what changed.
      </p>
    </FadeIn>
  );
}
