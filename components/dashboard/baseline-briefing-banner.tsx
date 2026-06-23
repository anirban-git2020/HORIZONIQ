"use client";

import { CalendarDays } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { formatTodayLabel } from "@/lib/utils";

export function BaselineBriefingBanner() {
  const todayLabel = formatTodayLabel();

  return (
    <FadeIn>
      <div
        role="status"
        className="mb-6 rounded-xl border border-primary/25 bg-primary/[0.04] px-5 py-4 md:px-6 md:py-5"
      >
        <p className="text-sm leading-relaxed text-foreground md:text-base">
          This is your baseline briefing. When you return, HorizonIQ will show
          what changed since today.
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground md:text-sm">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>Baseline date: {todayLabel}</span>
        </p>
      </div>
    </FadeIn>
  );
}
