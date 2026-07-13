"use client";

import { RotateCcw } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import {
  clearLandingJourney,
  useLandingJourney,
} from "@/hooks/use-landing-journey";
import { cn } from "@/lib/utils";

/**
 * Intelligence Exchange header — distinct from the marketing `TopBar`.
 * Logo, Start over, and the professional's initial. No non-functional controls.
 */
export function ExchangeHeader({ className }: { className?: string }) {
  const { journey } = useLandingJourney();
  const initial = journey.displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <header
      id="exchange-header"
      className={cn(
        "sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm hairline-top",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <div className="flex items-center gap-4 md:gap-6">
          <Logo showBeta />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              clearLandingJourney();
              window.location.href = "/";
            }}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground sm:inline-flex"
            aria-label="Start over"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="font-medium">Start over</span>
          </button>

          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-secondary text-xs font-semibold text-secondary-foreground"
            aria-label="Your profile"
            title="Your profile"
          >
            {initial}
          </span>
        </div>
      </div>
    </header>
  );
}
