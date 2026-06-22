"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { TopBar } from "@/components/layout/top-bar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StoryIntro } from "@/components/dashboard/story-intro";
import { RoleLens } from "@/components/dashboard/role-lens";
import { SignalMap } from "@/components/dashboard/signal-map";
import { Section } from "@/components/dashboard/section";
import { SignalCard } from "@/components/dashboard/signal-card";
import { SkillCard } from "@/components/dashboard/skill-card";
import { OpportunityCard } from "@/components/dashboard/opportunity-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { ROLE_EXPERIENCE } from "@/lib/options";
import { usePreferences } from "@/lib/preferences";
import type { DashboardSection, RoleId } from "@/lib/types";
import {
  getBriefing,
  getOpportunities,
  getRecommendations,
  getRecommendedSkills,
  getTopSignals,
} from "@/lib/personalize";

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

  const role = (preferences.role ?? "professional") as RoleId;
  const experience = ROLE_EXPERIENCE[role];
  const leadSignal = signals[0];
  const restSignals = signals.slice(1);

  if (!hydrated) {
    return <FullScreenLoader label="Loading your preferences…" />;
  }

  if (!isComplete) {
    return <FullScreenLoader label="Redirecting to setup…" />;
  }

  const handleReset = () => {
    reset();
    router.push("/");
  };

  const sections: Record<DashboardSection, React.ReactNode> = {
    map: <SignalMap key="map" signals={signals} />,
    signals: (
      <Section
        key="signals"
        step={sectionStep(experience.sectionOrder, "signals")}
        title="Top Signals"
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
            {actions.map((action, index) => (
              <StaggerItem key={action.id}>
                <ActionCard action={action} index={index} />
              </StaggerItem>
            ))}
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
      <DashboardHeader
        preferences={preferences}
        briefing={briefing}
        onReset={handleReset}
      />

      <main className="container space-y-12 py-12 md:space-y-16 md:py-16">
        <RoleLens role={role} />
        <StoryIntro lead={briefing.storyLead} />

        {experience.sectionOrder.map((key) => sections[key])}
      </main>

      <footer className="border-t border-border">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          HorizonIQ · Personalized intelligence based on curated demo data.
        </div>
      </footer>
    </div>
  );
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
