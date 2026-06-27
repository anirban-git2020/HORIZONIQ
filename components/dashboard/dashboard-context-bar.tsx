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
      <div className="hairline-b border-b border-border/60 pb-6 md:pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="label-caps">Your briefing lens</p>
            <div className="flex flex-wrap items-center gap-2">
              {role && <Badge variant="default">{ROLE_LABEL[role]}</Badge>}
              {region && <Badge variant="default">{REGION_LABEL[region]}</Badge>}
            </div>
            {interests.length > 0 && (
              <div>
                <p className="label-caps mb-2">{INTELLIGENCE_FOCUS_AREAS_LABEL}</p>
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
