"use client";

import Link from "next/link";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ADJUST_FOCUS_AREAS_LABEL,
  INTELLIGENCE_FOCUS_AREAS_LABEL,
} from "@/lib/copy";
import { INTEREST_LABEL, REGION_LABEL, ROLE_LABEL } from "@/lib/options";
import type { Preferences } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DashboardContextBar({
  preferences,
  onReset,
}: {
  preferences: Preferences;
  onReset: () => void;
}) {
  const { role, region, interests } = preferences;

  return (
    <FadeIn>
      <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-3 md:px-5 md:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="label-caps mb-2 text-[10px] text-muted-foreground">
              Your briefing lens
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {role && (
                <Badge variant="default">{ROLE_LABEL[role]}</Badge>
              )}
              {region && (
                <Badge variant="default">{REGION_LABEL[region]}</Badge>
              )}
            </div>
            {interests.length > 0 && (
              <div className="mt-2">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
                  {INTELLIGENCE_FOCUS_AREAS_LABEL}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((id) => (
                    <Badge key={id} variant="muted" className="text-xs">
                      {INTEREST_LABEL[id]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/onboarding/interests"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" })
              )}
            >
              <SlidersHorizontal />
              {ADJUST_FOCUS_AREAS_LABEL}
            </Link>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw />
              Start over
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
