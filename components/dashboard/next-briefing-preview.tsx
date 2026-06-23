"use client";

import type { ComponentType } from "react";
import { ArrowRight, TrendingDown, TrendingUp, Sparkles, Briefcase } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { PremiumCard } from "@/components/ui/premium-card";
import type { OpportunityView, SignalView, SkillView } from "@/lib/types";
import { formatTodayLabel } from "@/lib/utils";

function PreviewList({
  icon: Icon,
  title,
  items,
  emptyHint,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  emptyHint: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card/50 px-4 py-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
      )}
    </div>
  );
}

export function NextBriefingPreview({
  signals,
  skills,
  opportunities,
}: {
  signals: SignalView[];
  skills: SkillView[];
  opportunities: OpportunityView[];
}) {
  const accelerated = signals
    .filter((s) => s.change.type === "rising")
    .slice(0, 3)
    .map((s) => s.name);
  const slowed = signals
    .filter((s) => s.change.type === "falling")
    .slice(0, 3)
    .map((s) => s.name);
  const emerged = opportunities
    .filter((o) => o.growthChange === "new" || o.growthChange === "rising")
    .slice(0, 3)
    .map((o) => o.title);
  const skillsRising = skills
    .filter((s) => s.demandChange === "rising" || s.demandChange === "new")
    .slice(0, 3)
    .map((s) => s.name);

  return (
    <FadeIn>
      <section aria-labelledby="next-briefing-preview-heading">
        <PremiumCard className="p-6 md:p-8">
          <p className="label-caps mb-2 text-primary">When you return</p>
          <h2
            id="next-briefing-preview-heading"
            className="section-title text-xl md:text-2xl"
          >
            Next Briefing Preview
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            Your baseline is set for {formatTodayLabel()}. On your next visit,
            HorizonIQ will compare against today and highlight:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PreviewList
              icon={TrendingUp}
              title="Signals that accelerated"
              items={accelerated}
              emptyHint="We'll flag signals whose momentum rises after today."
            />
            <PreviewList
              icon={TrendingDown}
              title="Signals that slowed down"
              items={slowed}
              emptyHint="We'll flag signals whose momentum falls after today."
            />
            <PreviewList
              icon={Briefcase}
              title="Opportunities that emerged"
              items={emerged}
              emptyHint="We'll surface new or heating-up opportunities in your interests."
            />
            <PreviewList
              icon={Sparkles}
              title="Skills that gained momentum"
              items={skillsRising}
              emptyHint="We'll highlight skills with rising demand in your profile."
            />
          </div>
        </PremiumCard>
      </section>
    </FadeIn>
  );
}
