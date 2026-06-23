"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChangeBadge, DeltaIndicator } from "@/components/dashboard/change-badge";
import { cn } from "@/lib/utils";
import type { WhatChangedBriefing } from "@/lib/types";

export function WhatChangedHero({ briefing }: { briefing: WhatChangedBriefing }) {
  const { title, subtitle, changes, primaryAction, isReturnVisit } = briefing;

  return (
    <section aria-labelledby="what-changed-heading">
      <FadeIn>
        <PremiumCard glow className="overflow-hidden">
          <div className="border-b border-border/60 bg-primary/[0.03] px-6 py-5 md:px-8 md:py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="label-caps mb-2 text-primary">
                  {isReturnVisit ? "Since your last visit" : "This week"}
                </p>
                <h2
                  id="what-changed-heading"
                  className="section-title text-2xl md:text-3xl"
                >
                  {title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  {subtitle}
                </p>
              </div>
              {primaryAction && (
                <div className="w-full sm:w-auto sm:max-w-xs">
                  <p className="label-caps mb-2">What to do</p>
                  <div className="rounded-xl border border-primary/20 bg-primary/[0.05] p-4">
                    <p className="text-sm font-semibold">{primaryAction.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {primaryAction.detail}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {changes.map((item) => (
              <div
                key={item.signal.id}
                className="px-6 py-5 md:px-8 md:py-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <ChangeBadge type={item.signal.change.type} />
                  <Badge variant="muted">{item.signal.category}</Badge>
                  {item.visitChange && (
                    <DeltaIndicator
                      delta={item.visitChange.momentumDelta}
                      label="momentum"
                    />
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/signals/${item.signal.id}`}
                      className="group inline-flex items-center gap-2"
                    >
                      <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                        {item.signal.name}
                      </h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>

                    <p className="mt-2 text-sm font-medium text-foreground">
                      {item.signal.change.summary}
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground/90">
                        Why it matters for you:{" "}
                      </span>
                      {item.whyItMatters}
                    </p>
                  </div>

                  <div className="lg:w-72 shrink-0">
                    <p className="label-caps mb-2">Recommended action</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {changes.length > 0 && (
            <div className="border-t border-border/60 px-6 py-4 md:px-8">
              <Link
                href={`/signals/${changes[0].signal.id}`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" })
                )}
              >
                <Sparkles />
                Explore top change in detail
              </Link>
            </div>
          )}
        </PremiumCard>
      </FadeIn>
    </section>
  );
}
