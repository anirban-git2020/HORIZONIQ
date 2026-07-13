"use client";

import { useMemo } from "react";

import { useLandingJourney } from "@/hooks/use-landing-journey";
import {
  getFeaturedSignal,
  journeyToPreferences,
} from "@/lib/exchange/personalized-pulse";
import type { Signal } from "@/lib/domain";
import type { ConfidenceTier, Trajectory } from "@/lib/domain/signal";
import { MOTION_CLASS } from "@/lib/motion-language";
import { cn } from "@/lib/utils";

const CONFIDENCE_LABEL: Record<ConfidenceTier, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
const FORECAST_LABEL: Record<ConfidenceTier, string> = {
  high: "Strong",
  medium: "Moderate",
  low: "Developing",
};
const VELOCITY_ARROWS: Record<Trajectory, string> = {
  accelerating: "▲▲▲",
  steady: "▲▲",
  emerging: "▲",
  cooling: "▼",
};

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function viewFor(signal: Signal) {
  return {
    title: signal.identity.title,
    momentum: Math.round(signal.momentum.momentumScore),
    metrics: [
      { label: "Confidence", value: CONFIDENCE_LABEL[signal.evidence.confidence] },
      { label: "Velocity", value: VELOCITY_ARROWS[signal.momentum.trajectory] },
      { label: "Forecast", value: FORECAST_LABEL[signal.forecast.forecastConfidence] },
      {
        label: "Evidence",
        value: `${signal.evidence.evidenceCount.toLocaleString()} Signals`,
      },
      { label: "Updated", value: formatUpdated(signal.evidence.lastObserved) },
    ],
    sources: Array.from(new Set(signal.evidence.sources.map((s) => s.label))).slice(0, 6),
  };
}

/**
 * Featured opportunity glass card — the top signal for the professional's
 * profile (chosen-interest match, or highest momentum overall), rendered from
 * real domain data. Refreshes with every pipeline run.
 */
export function FeaturedOpportunityCard({ className }: { className?: string }) {
  const { hydrated, journey } = useLandingJourney();

  const signal = useMemo(() => {
    const profile = hydrated
      ? journeyToPreferences(journey)
      : { interests: [], region: null };
    return getFeaturedSignal(profile);
  }, [hydrated, journey]);

  if (!signal) return null;
  const view = viewFor(signal);

  return (
    <article
      aria-label={`Featured opportunity: ${view.title}`}
      className={cn(
        "flex w-full max-w-[420px] flex-col rounded-3xl border border-border/50",
        "bg-card/35 shadow-premium backdrop-blur-md",
        MOTION_CLASS.featuredEnter,
        className
      )}
      style={{ minHeight: "520px" }}
    >
      <div className="flex flex-1 flex-col p-7 md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Featured Opportunity
        </p>

        <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">
          {view.title}
        </h2>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Momentum
          </p>
          <p
            className="mt-1 font-heading text-[5.5rem] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[6rem]"
            aria-label={`Momentum score ${view.momentum}`}
          >
            {view.momentum}
          </p>
        </div>

        <dl className="mt-8 space-y-3.5 border-t border-border/40 pt-6">
          {view.metrics.map(({ label, value }) => (
            <div key={label} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd
                className={cn(
                  "text-right text-sm font-medium text-foreground",
                  label === "Velocity" && "tracking-widest text-success"
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {view.sources.length > 0 && (
        <div className="border-t border-border/40 px-7 py-5 md:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Top Sources
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {view.sources.map((source) => (
              <li key={source}>
                <span className="inline-flex rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
                  {source}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
