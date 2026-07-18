"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
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
  const { user, loading } = useAuth();
  const initial = journey.displayName.trim().charAt(0).toUpperCase() || "U";
  const signedOut = !loading && !user;

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

          {signedOut && (
            <Link
              href="/account"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
            >
              Sign in
            </Link>
          )}

          <Link
            href="/account"
            aria-label={user ? "Your account" : "Set up cross-device sync"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-secondary text-xs font-semibold text-secondary-foreground transition-colors hover:border-border hover:bg-secondary/80"
            title="Account & sync"
          >
            {initial}
          </Link>
        </div>
      </div>
    </header>
  );
}
