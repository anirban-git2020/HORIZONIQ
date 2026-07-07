"use client";

import { Button } from "@/components/ui/button";
import { FeaturedOpportunityCard } from "@/components/exchange/featured-opportunity-card";
import { MOTION_CLASS } from "@/lib/motion-language";
import { cn } from "@/lib/utils";

const BODY_COPY =
  "HorizonIQ continuously analyzes global public intelligence signals to surface emerging technologies, career opportunities, research breakthroughs and market shifts before they become mainstream.";

/**
 * Intelligence Exchange — Phase 1 Hero Experience.
 */
export function IntelligenceHero({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="intelligence-hero-heading"
      className={cn(
        "mx-auto w-full max-w-[1500px] px-6 pt-10",
        "min-h-[45vh] pb-16 md:pb-20",
        className
      )}
    >
      <div className="grid items-center gap-12 md:grid-cols-[60%_40%] md:gap-10 lg:grid-cols-[65%_35%] lg:gap-14">
        <div className={cn("flex flex-col", MOTION_CLASS.heroEnter)}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Live Global Intelligence
          </p>

          <h1
            id="intelligence-hero-heading"
            className={cn(
              "mt-5 max-w-[14ch] text-balance font-heading text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-foreground",
              "sm:text-5xl md:text-6xl lg:text-[4.5rem]"
            )}
          >
            The world is changing faster than ever.
          </h1>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Button type="button" variant="primary" size="lg">
              Explore Signals
            </Button>
            <Button type="button" variant="secondary" size="lg">
              Weekly Briefing
            </Button>
            <Button type="button" variant="outline" size="lg">
              Forecasts
            </Button>
          </div>

          <p className="mt-8 max-w-[650px] text-lg leading-[1.75] text-muted-foreground md:text-xl md:leading-[1.7]">
            {BODY_COPY}
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <FeaturedOpportunityCard />
        </div>
      </div>
    </section>
  );
}
