"use client";

import Link from "next/link";
import { useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  ChangeBadge,
  DeltaIndicator,
} from "@/components/dashboard/change-badge";
import { ProvenanceBadge } from "@/components/trust/provenance-badge";
import { getDataProvenance } from "@/lib/data/access";
import {
  rememberSignalSource,
  track,
  useTrackOnVisible,
} from "@/lib/analytics";
import type { SignalSource } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { ChangeItem, SignalChangeGroup, WhatChangedBriefing } from "@/lib/types";

function trackSignalClick(item: ChangeItem, source: SignalSource) {
  rememberSignalSource(source);
  track("signal_click", {
    signalId: item.signal.id,
    source,
    changeType: item.signal.change.type,
  });
}

function SignalChangeRow({ item }: { item: ChangeItem }) {
  return (
    <div className="px-5 py-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <ChangeBadge type={item.signal.change.type} />
        <Badge variant="muted">{item.signal.category}</Badge>
        {item.visitChange && item.visitChange.momentumDelta !== 0 && (
          <DeltaIndicator
            delta={item.visitChange.momentumDelta}
            label="momentum"
          />
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            href={`/signals/${item.signal.id}`}
            onClick={() => trackSignalClick(item, "change-hero")}
            className="group inline-flex items-center gap-2"
          >
            <h4 className="text-base font-semibold leading-snug transition-colors group-hover:text-primary">
              {item.signal.name}
            </h4>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
          <p className="mt-1.5 text-sm text-foreground">
            {item.signal.change.summary}
          </p>
          <p className="label-caps mb-1.5 mt-3 text-xs">Why this matters to you</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.whyItMatters}
          </p>
        </div>
        <div className="lg:w-64 shrink-0">
          <p className="label-caps mb-1.5 text-xs">Recommended action</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.action}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChangeGroupSection({ group }: { group: SignalChangeGroup }) {
  return (
    <div>
      <div className="border-b border-border/60 bg-secondary/30 px-5 py-3 md:px-6">
        <h3 className="text-sm font-semibold tracking-tight">{group.label}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {group.items.length}{" "}
          {group.items.length === 1 ? "signal" : "signals"}
        </p>
      </div>
      <div className="divide-y divide-border/60">
        {group.items.map((item) => (
          <SignalChangeRow key={item.signal.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function WhatChangedHero({ briefing }: { briefing: WhatChangedBriefing }) {
  const {
    title,
    subtitle,
    groups,
    changes,
    primaryAction,
    isReturnVisit,
    briefingLabel,
    updatedLabel,
  } = briefing;

  const provenance = getDataProvenance();
  const hasGroups = groups.length > 0;

  const onHeroVisible = useCallback(() => {
    track("change_hero_viewed", {
      visitType: isReturnVisit ? "return" : "first",
      briefingPeriod: briefing.briefingPeriod,
    });
  }, [isReturnVisit, briefing.briefingPeriod]);

  const heroRef = useTrackOnVisible<HTMLElement>(onHeroVisible);

  return (
    <section ref={heroRef} aria-labelledby="what-changed-heading" data-tour="what-changed">
      <FadeIn>
        <PremiumCard glow className="overflow-hidden">
          <div className="border-b border-border/60 bg-primary/[0.03] px-6 py-5 md:px-8 md:py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="label-caps text-primary">
                    {isReturnVisit ? "Since your last visit" : "Week 1 Briefing"}
                  </p>
                  <ProvenanceBadge provenance={provenance} />
                  <span className="hidden text-muted-foreground/60 sm:inline" aria-hidden>
                    ·
                  </span>
                  <p className="text-xs font-medium text-foreground/80">
                    {briefingLabel}
                  </p>
                  <span className="hidden text-muted-foreground/60 sm:inline" aria-hidden>
                    ·
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Updated {updatedLabel}
                  </p>
                </div>
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
                <div className="w-full sm:w-auto sm:max-w-xs" data-tour="recommended-actions">
                  <p className="label-caps mb-2">Recommended action</p>
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

          {hasGroups ? (
            <div className="divide-y divide-border/60">
              {groups.map((group) => (
                <ChangeGroupSection key={group.bucket} group={group} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {changes.map((item) => (
                <SignalChangeRow key={item.signal.id} item={item} />
              ))}
            </div>
          )}

          {changes.length > 0 && (
            <div className="border-t border-border/60 px-6 py-4 md:px-8">
              <Link
                href={`/signals/${changes[0].signal.id}`}
                onClick={() => trackSignalClick(changes[0], "change-hero-cta")}
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
