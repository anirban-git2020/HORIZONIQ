"use client";

import Link from "next/link";
import { useCallback, type HTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { PremiumCard } from "@/components/ui/premium-card";
import { ChangeBadge } from "@/components/dashboard/change-badge";
import { ProvenanceBadge } from "@/components/trust/provenance-badge";
import { STORY_ACTS } from "@/lib/copy";
import { getDataProvenance } from "@/lib/data/access";
import {
  rememberSignalSource,
  track,
  useTrackOnVisible,
} from "@/lib/analytics";
import type { SignalSource } from "@/lib/analytics";
import type { ChangeItem, SignalChangeGroup, WhatChangedBriefing } from "@/lib/types";
import { cn } from "@/lib/utils";

function trackSignalClick(item: ChangeItem, source: SignalSource) {
  rememberSignalSource(source);
  track("signal_click", {
    signalId: item.signal.id,
    source,
    changeType: item.signal.change.type,
  });
}

function CompactChangeRow({ item }: { item: ChangeItem }) {
  return (
    <Link
      href={`/signals/${item.signal.id}`}
      onClick={() => trackSignalClick(item, "change-hero")}
      className="group flex items-start gap-4 px-6 py-4 transition-colors duration-200 hover:bg-secondary/25 md:px-10 md:py-5"
    >
      <ChangeBadge type={item.signal.change.type} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-primary">
          {item.signal.name}
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.signal.intelligence.whatHappened}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function ChangeGroupSection({ group }: { group: SignalChangeGroup }) {
  return (
    <div>
      <div className="hairline-b bg-secondary/15 px-6 py-3 md:px-10">
        <h3 className="label-caps">{group.label}</h3>
      </div>
      <div className="divide-y divide-border/40">
        {group.items.map((item) => (
          <CompactChangeRow key={item.signal.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function StoryAct({
  act,
  children,
  className,
  ...props
}: {
  act: keyof typeof STORY_ACTS;
  children: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("hairline-b px-6 py-8 md:px-10 md:py-10", className)} {...props}>
      <p className="label-caps text-primary">{STORY_ACTS[act]}</p>
      <div className="mt-4">{children}</div>
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
  const leadChange = changes[0];

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
        <PremiumCard flat className="overflow-hidden">
          <header className="px-6 py-10 md:px-10 md:py-12 lg:py-14">
            <p className="label-caps text-primary">{STORY_ACTS.changed}</p>
            <h2
              id="what-changed-heading"
              className="display-title mt-3 text-3xl md:text-4xl lg:text-[2.75rem]"
            >
              {title}
            </h2>
            <p className="prose-lead mt-4 max-w-2xl">{subtitle}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
              <ProvenanceBadge provenance={provenance} />
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>{briefingLabel}</span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>Updated {updatedLabel}</span>
            </div>
          </header>

          {(hasGroups || changes.length > 0) && (
            <div className="border-t border-border/60" data-tour="signals">
              <div className="hairline-b px-6 py-3.5 md:px-10">
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  {hasGroups
                    ? "Signals that moved this period"
                    : "Top changes in your briefing"}
                </p>
              </div>
              {hasGroups ? (
                <div className="divide-y divide-border/40">
                  {groups.map((group) => (
                    <ChangeGroupSection key={group.bucket} group={group} />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {changes.map((item) => (
                    <CompactChangeRow key={item.signal.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {leadChange && (
            <StoryAct act="matters">
              <p className="max-w-3xl text-base leading-[1.7] text-foreground md:text-lg md:leading-[1.75]">
                {leadChange.signal.intelligence.whyYouShouldCare}
              </p>
              {changes.length > 1 && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {changes.length - 1} more{" "}
                  {changes.length === 2 ? "change" : "changes"} below — open any
                  signal for full analysis.
                </p>
              )}
            </StoryAct>
          )}

          {primaryAction && (
            <StoryAct
              act="action"
              className="border-b-0 bg-primary/[0.03]"
              data-tour="recommended-actions"
            >
              <p className="text-lg font-semibold tracking-[-0.02em] text-foreground md:text-xl">
                {primaryAction.title}
              </p>
              <p className="prose-lead mt-3 max-w-2xl text-sm md:text-base">
                {primaryAction.detail}
              </p>
              {leadChange && (
                <Link
                  href={`/signals/${leadChange.signal.id}`}
                  onClick={() => trackSignalClick(leadChange, "change-hero-cta")}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                >
                  See intelligence behind this action
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </StoryAct>
          )}
        </PremiumCard>
      </FadeIn>
    </section>
  );
}
