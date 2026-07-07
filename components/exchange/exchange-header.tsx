"use client";

import { Bell, ChevronDown, Globe2 } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { TaglineLockup } from "@/components/brand/tagline-lockup";
import { cn } from "@/lib/utils";

/**
 * Intelligence Exchange header — distinct from the marketing `TopBar`.
 * Layout only: region selector, notifications, and avatar are static.
 */
export function ExchangeHeader({ className }: { className?: string }) {
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
          <div className="hidden lg:block">
            <TaglineLockup size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg border border-border/80 bg-secondary/60 px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary sm:inline-flex"
            aria-label="Region selector"
          >
            <Globe2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Global</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent/70"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span
              className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-secondary text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            aria-label="Account menu"
          >
            U
          </button>
        </div>
      </div>
    </header>
  );
}
