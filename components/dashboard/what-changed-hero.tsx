"use client";

import Link from "next/link";
import { useCallback } from "react";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
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
      className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30 md:px-8"
    >
      <ChangeBadge type={item.signal.change.type} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug group-hover:text-primary">
          {item.signal.name}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {item.signal.intelligence.whatHappened}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function ChangeGroupSection({ group }: { group: SignalChangeGroup }) {
  return (
    <div>
      <div className="bg-secondary/20 px-5 py-2.5 md:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.label}
        </h3>
      </div>
      <div className="divide-y divide-border/50">
        {group.items.map((item) => (
          <CompactChangeRow key={item.signal.id} item={item} />
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
        <PremiumCard glow className="overflow-hidden">
          {/* Act 1 — primary message */}
          <header className="border-b border-border/60 px-6 py-8 md:px-10 md:py-10">
            <p className="label-caps text-primary">{STORY_ACTS.changed}</p>
            <h2
              id="what-changed-heading"
              className="display-title mt-2 text-2xl md:text-3xl lg:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {subtitle}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <ProvenanceBadge provenance={provenance} />
              <span aria-hidden>·</span>
              <span>{briefingLabel}</span>
              <span aria-hidden>·</span>
              <span>Updated {updatedLabel}</span>
            </div>
          </header>

          {/* What changed — compact list */}
          {(hasGroups || changes.length > 0) && (
            <div data-tour="signals">
              <div className="border-b border-border/60 px-6 py-3 md:px-8">
                <p className="text-xs font-medium text-muted-foreground">
                  {hasGroups
                    ? "Signals that moved this period"
                    : "Top changes in your briefing"}
                </p>
              </div>
              {hasGroups ? (
                <div className="divide-y divide-border/50">
                  {groups.map((group) => (
                    <ChangeGroupSection key={group.bucket} group={group} />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {changes.map((item) => (
                    <CompactChangeRow key={item.signal.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Act 2 — why it matters (lead change only) */}
          {leadChange && (
            <div className="border-t border-border/60 bg-primary/[0.02] px-6 py-6 md:px-10 md:py-8">
              <p className="label-caps text-primary">{STORY_ACTS.matters}</p>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
                {leadChange.signal.intelligence.whyYouShouldCare}
              </p>
              {changes.length > 1 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {changes.length - 1} more{" "}
                  {changes.length === 2 ? "change" : "changes"} below — open any
                  signal for full analysis.
                </p>
              )}
            </div>
          )}

          {/* Act 3 — what to do */}
          {primaryAction && (
            <div
              className="border-t border-primary/20 bg-primary/[0.04] px-6 py-6 md:px-10 md:py-8"
              data-tour="recommended-actions"
            >
              <p className="label-caps text-primary">{STORY_ACTS.action}</p>
              <p className="mt-3 text-lg font-semibold text-foreground md:text-xl">
                {primaryAction.title}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {primaryAction.detail}
              </p>
              {leadChange && (
                <Link
                  href={`/signals/${leadChange.signal.id}`}
                  onClick={() => trackSignalClick(leadChange, "change-hero-cta")}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  See intelligence behind this action
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </PremiumCard>
      </FadeIn>
    </section>
  );
}
