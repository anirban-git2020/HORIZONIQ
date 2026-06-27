"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { TopBar } from "@/components/layout/top-bar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RoleLens } from "@/components/dashboard/role-lens";
import { BaselineBriefingBanner } from "@/components/dashboard/baseline-briefing-banner";
import { SignalsWeAreTracking } from "@/components/dashboard/signals-we-are-tracking";
import { WhatChangedHero } from "@/components/dashboard/what-changed-hero";
import { Section } from "@/components/dashboard/section";
import { SignalCard } from "@/components/dashboard/signal-card";
import { SkillCard } from "@/components/dashboard/skill-card";
import { OpportunityCard } from "@/components/dashboard/opportunity-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { getMeta, getDataProvenance, getRefreshSchedule } from "@/lib/data/access";
import { ROLE_EXPERIENCE } from "@/lib/options";
import {
  getBriefing,
  getOpportunities,
  getRecommendations,
  getRecommendedSkills,
  getTopSignals,
  getWhatChangedForYou,
} from "@/lib/personalize";
import { usePreferences } from "@/lib/preferences";
import type { DashboardSection, RoleId } from "@/lib/types";
import { formatBriefingUpdatedAt } from "@/lib/utils";
import {
  buildSignalSnapshot,
  clearVisitSnapshot,
  isReturnVisitForPeriod,
  loadVisitSnapshot,
  saveVisitSnapshot,
} from "@/lib/visit-snapshot";

function FullScreenLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { preferences, hydrated, isComplete, reset } = usePreferences();

  useEffect(() => {
    if (hydrated && !isComplete) {
      router.replace("/onboarding/role");
    }
  }, [hydrated, isComplete, router]);

  const briefing = useMemo(() => getBriefing(preferences), [preferences]);
  const signals = useMemo(() => getTopSignals(preferences), [preferences]);
  const skills = useMemo(
    () => getRecommendedSkills(preferences),
    [preferences]
  );
  const opportunities = useMemo(
    () => getOpportunities(preferences),
    [preferences]
  );
  const actions = useMemo(
    () => getRecommendations(preferences),
    [preferences]
  );

  const whatChanged = useMemo(() => {
    const meta = getMeta();
    const snapshot = loadVisitSnapshot();
    const isReturnVisit = isReturnVisitForPeriod(snapshot, meta.briefingPeriod);
    return getWhatChangedForYou(preferences, {
      isReturnVisit,
      previousSignals: snapshot?.signals ?? null,
      lastVisitAt: snapshot?.lastVisitAt ?? null,
    });
  }, [preferences]);

  useEffect(() => {
    if (!hydrated || !isComplete || signals.length === 0) return;
    const meta = getMeta();
    const existing = loadVisitSnapshot();
    saveVisitSnapshot({
      lastVisitAt: new Date().toISOString(),
      briefingPeriod: meta.briefingPeriod,
      signals: buildSignalSnapshot(signals, existing),
    });
  }, [hydrated, isComplete, signals]);

  const role = (preferences.role ?? "professional") as RoleId;
  const experience = ROLE_EXPERIENCE[role];
  const leadSignal = signals[0];
  const restSignals = signals.slice(1);
  const secondaryActions = actions.filter((a) => !a.isPrimary);

  if (!hydrated) {
    return <FullScreenLoader label="Loading your preferences…" />;
  }

  if (!isComplete) {
    return <FullScreenLoader label="Redirecting to setup…" />;
  }

  const isFirstVisit = !whatChanged.isReturnVisit;

  const handleReset = () => {
    clearVisitSnapshot();
    reset();
    router.push("/");
  };

  const sections: Record<DashboardSection, React.ReactNode> = {
    signals: (
      <Section
        key="signals"
        step={sectionStep(experience.sectionOrder, "signals")}
        title="Changed Signals"
        question={experience.signalsQuestion}
      >
        {signals.length > 0 ? (
          <div className="space-y-5">
            {leadSignal && <SignalCard signal={leadSignal} featured />}
            {restSignals.length > 0 && (
              <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {restSignals.map((signal) => (
                  <StaggerItem key={signal.id}>
                    <SignalCard signal={signal} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </Section>
    ),
    skills: (
      <Section
        key="skills"
        step={sectionStep(experience.sectionOrder, "skills")}
        title={experience.skillsTitle}
        question={experience.skillsQuestion}
      >
        {skills.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <StaggerItem key={skill.id}>
                <SkillCard skill={skill} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState />
        )}
      </Section>
    ),
    opportunities: (
      <Section
        key="opportunities"
        step={sectionStep(experience.sectionOrder, "opportunities")}
        title={experience.opportunitiesTitle}
        question={experience.opportunitiesQuestion}
      >
        {opportunities.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {opportunities.map((opportunity) => (
              <StaggerItem key={opportunity.id}>
                <OpportunityCard opportunity={opportunity} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState />
        )}
      </Section>
    ),
    actions: (
      <Section
        key="actions"
        step={sectionStep(experience.sectionOrder, "actions")}
        title={experience.actionsTitle}
        question={experience.actionsQuestion}
      >
        {actions.length > 0 ? (
          <Stagger className="grid gap-4">
            {actions
              .filter((a) => a.isPrimary)
              .map((action, index) => (
                <StaggerItem key={action.id}>
                  <ActionCard action={action} index={index} />
                </StaggerItem>
              ))}
            {secondaryActions.length > 0 && (
              <>
                <p className="label-caps pt-2 text-muted-foreground">
                  Also consider
                </p>
                {secondaryActions.map((action, index) => (
                  <StaggerItem key={action.id}>
                    <ActionCard action={action} index={index + 1} />
                  </StaggerItem>
                ))}
              </>
            )}
          </Stagger>
        ) : (
          <EmptyState />
        )}
      </Section>
    ),
  };

  return (
    <div className="min-h-dvh bg-background">
      <TopBar />

      <main>
        <div className="container space-y-12 pt-10 pb-12 md:space-y-12 md:pb-16">
          {isFirstVisit && <BaselineBriefingBanner />}
          <WhatChangedHero briefing={whatChanged} />
          {isFirstVisit && <SignalsWeAreTracking signals={signals} />}
        </div>

        {!isFirstVisit && (
          <>
            <DashboardHeader
              preferences={preferences}
              briefing={briefing}
              onReset={handleReset}
            />

            <div className="container space-y-12 pb-12 md:space-y-16 md:pb-16">
              <RoleLens role={role} />
              {experience.sectionOrder.map((key) => sections[key])}
            </div>
          </>
        )}

        {isFirstVisit && (
          <div className="container border-t border-border/50 pb-12 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <a
                href="/onboarding/interests"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Adjust interests
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="container space-y-1 py-8 text-center text-sm text-muted-foreground">
          <p>
            HorizonIQ · {provenanceFooterLabel()} · {briefing.briefingLabel}
          </p>
          <p className="text-xs">
            Briefing period {getMeta().briefingPeriod} · Last updated{" "}
            {formatBriefingUpdatedAt(getMeta().updatedAt)} ·{" "}
            {getRefreshSchedule()}
          </p>
        </div>
      </footer>
    </div>
  );
}

function provenanceFooterLabel(): string {
  switch (getDataProvenance()) {
    case "pipeline":
      return "Live intelligence";
    case "pipeline-mock":
      return "Mixed live + curated data";
    default:
      return "Curated demo data";
  }
}

function sectionStep(order: DashboardSection[], section: DashboardSection) {
  const idx = order.indexOf(section);
  return idx >= 0 ? idx + 1 : undefined;
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      Nothing here yet for this combination. Try adjusting your interests.
    </div>
  );
}
