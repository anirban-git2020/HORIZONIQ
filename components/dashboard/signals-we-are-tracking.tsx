"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { ChangeBadge } from "@/components/dashboard/change-badge";
import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import type { SignalView } from "@/lib/types";
import { cn } from "@/lib/utils";

const NEXT_BRIEFING_POINTS = [
  "What accelerated",
  "What slowed down",
  "What opportunities emerged",
] as const;

function trackedSignalCount(signals: SignalView[]): SignalView[] {
  if (signals.length === 0) return [];
  const count = Math.min(5, Math.max(3, signals.length));
  return signals.slice(0, count);
}

export function SignalsWeAreTracking({
  signals,
  className,
}: {
  signals: SignalView[];
  className?: string;
}) {
  const tracked = trackedSignalCount(signals);

  return (
    <FadeIn>
      <section
        aria-labelledby="signals-tracking-heading"
        className={cn(className)}
      >
        <PremiumCard className="overflow-hidden">
          <div className="border-b border-border/60 px-6 py-5 md:px-8 md:py-6">
            <p className="label-caps mb-2 text-primary">Your watchlist</p>
            <h2
              id="signals-tracking-heading"
              className="section-title text-xl md:text-2xl"
            >
              Signals We&apos;re Tracking For You
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              These signals match your role, region, and interests. We saved
              today as your baseline.
            </p>
          </div>

          {tracked.length > 0 ? (
            <ul className="divide-y divide-border/60">
              {tracked.map((signal) => (
                <li key={signal.id}>
                  <Link
                    href={`/signals/${signal.id}`}
                    className="group flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-secondary/30 md:px-8 md:py-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <ChangeBadge type={signal.change.type} />
                      <Badge variant="muted">{signal.category}</Badge>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold leading-snug group-hover:text-primary">
                          {signal.name}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                          {signal.soWhatForYou}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-sm text-muted-foreground md:px-8">
              No signals match your interests yet. Adjust your focus areas to
              start tracking.
            </p>
          )}

          <div className="border-t border-border/60 bg-secondary/20 px-6 py-5 md:px-8 md:py-6">
            <p className="text-sm font-semibold text-foreground">
              Your next briefing will reveal:
            </p>
            <ul className="mt-3 space-y-2">
              {NEXT_BRIEFING_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </PremiumCard>
      </section>
    </FadeIn>
  );
}
