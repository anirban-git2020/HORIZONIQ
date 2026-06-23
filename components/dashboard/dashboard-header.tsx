"use client";

import Link from "next/link";
import { MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";

import { AnimatedCounter } from "@/components/motion/animated-counter";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  INTEREST_LABEL,
  REGION_LABEL,
  ROLE_EXPERIENCE,
  ROLE_LABEL,
} from "@/lib/options";
import type { Briefing, Preferences } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DashboardHeader({
  preferences,
  briefing,
  onReset,
}: {
  preferences: Preferences;
  briefing: Briefing;
  onReset: () => void;
}) {
  const role = preferences.role;
  const region = preferences.region;

  const stats = [
    { label: "signals", value: briefing.stats.signals },
    { label: "skills", value: briefing.stats.skills },
    { label: "opportunities", value: briefing.stats.opportunities },
    { label: "actions", value: briefing.stats.actions },
  ];

  return (
    <div className="relative border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container py-10 md:py-14">
        <FadeIn>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="label-caps mb-2 text-primary">
                {role ? ROLE_EXPERIENCE[role].greeting : "Your edge"}
              </p>
              <h1 className="display-title text-3xl md:text-4xl lg:text-[2.75rem]">
                What changed for you
              </h1>
              <p className="body-lg mt-4 text-balance">{briefing.summary}</p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {role && <Badge variant="default">{ROLE_LABEL[role]}</Badge>}
                {region && (
                  <Badge variant="default">{REGION_LABEL[region]}</Badge>
                )}
                {preferences.interests.map((id) => (
                  <Badge key={id} variant="muted">
                    {INTEREST_LABEL[id]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/onboarding/interests"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" })
                )}
              >
                <SlidersHorizontal />
                Adjust
              </Link>
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw />
                Start over
              </Button>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-col gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {stats.map((s) => (
                <span key={s.label} className="text-sm text-muted-foreground">
                  <span className="text-lg font-semibold tabular-nums text-foreground">
                    <AnimatedCounter value={s.value} />
                  </span>{" "}
                  {s.label}
                </span>
              ))}
              <span className="text-sm text-muted-foreground/80">
                tailored to you
              </span>
            </div>

            {briefing.hubs.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{briefing.regionContext}</span>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
