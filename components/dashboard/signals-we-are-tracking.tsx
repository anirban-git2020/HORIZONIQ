"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { ChangeBadge } from "@/components/dashboard/change-badge";
import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import { rememberSignalSource, track } from "@/lib/analytics";
import type { SignalView } from "@/lib/types";
import { INTELLIGENCE_FOCUS_AREAS_LABEL } from "@/lib/copy";
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
        data-tour="signals"
      >
        <PremiumCard flat className="overflow-hidden">
          <div className="hairline-b px-6 py-8 md:px-10 md:py-10">
            <p className="label-caps mb-3 text-primary">Your watchlist</p>
            <h2 id="signals-tracking-heading" className="section-title">
              Signals We&apos;re Tracking For You
            </h2>
            <p className="prose-lead mt-3 text-sm md:text-base">
              Your baseline for next week. Each signal links to full intelligence.
            </p>
          </div>

          {tracked.length > 0 ? (
            <ul className="divide-y divide-border/60">
              {tracked.map((signal) => (
                <li key={signal.id}>
                  <Link
                    href={`/signals/${signal.id}`}
                    onClick={() => {
                      rememberSignalSource("watchlist");
                      track("signal_click", {
                        signalId: signal.id,
                        source: "watchlist",
                        changeType: signal.change.type,
                      });
                    }}
                    className="group block px-6 py-6 transition-colors duration-200 hover:bg-secondary/20 md:px-10 md:py-7"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <ChangeBadge type={signal.change.type} />
                      <Badge variant="muted">{signal.category}</Badge>
                    </div>
                    <h3 className="mt-2 text-base font-semibold leading-snug group-hover:text-primary">
                      {signal.name}
                    </h3>
                    <div className="mt-3">
                      <p className="label-caps mb-1.5 text-[10px] text-muted-foreground">
                        What happened?
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {signal.intelligence.whatHappened}
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      Full intelligence
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-sm text-muted-foreground md:px-8">
              No signals match your focus areas yet. Adjust your{" "}
              {INTELLIGENCE_FOCUS_AREAS_LABEL.toLowerCase()} to start tracking.
            </p>
          )}

          <div
            className="border-t border-border/60 bg-secondary/20 px-6 py-5 md:px-8 md:py-6"
            data-tour="opportunities"
          >
            <p className="text-sm font-semibold text-foreground">
              Your next briefing will reveal:
            </p>
            <ul className="mt-3 space-y-2">
              {NEXT_BRIEFING_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span
                    className="h-1 w-1 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
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
