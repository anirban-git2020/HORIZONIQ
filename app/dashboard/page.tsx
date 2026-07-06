"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { TopBar } from "@/components/layout/top-bar";
import { IntelligenceFieldLayer } from "@/components/intelligence-field/intelligence-field-layer";
import { GuidedTourOverlay } from "@/components/onboarding/guided-tour-overlay";
import { DashboardContextBar } from "@/components/dashboard/dashboard-context-bar";
import { DisclosurePanel } from "@/components/dashboard/disclosure-panel";
import { BaselineBriefingBanner } from "@/components/dashboard/baseline-briefing-banner";
import { SignalsWeAreTracking } from "@/components/dashboard/signals-we-are-tracking";
import { WhatChangedHero } from "@/components/dashboard/what-changed-hero";
import { StorySection } from "@/components/dashboard/story-section";
import { SignalCard } from "@/components/dashboard/signal-card";
import { SkillCard } from "@/components/dashboard/skill-card";
import { OpportunityCard } from "@/components/dashboard/opportunity-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { getMeta, getDataProvenance, getRefreshSchedule } from "@/lib/data/access";
import { getProvenanceShortLabel } from "@/lib/trust";
import { ADJUST_FOCUS_AREAS_LABEL } from "@/lib/copy";
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
import { getSessionElapsedMs, track } from "@/lib/analytics";
import type { DashboardSection, RoleId } from "@/lib/types";
import { formatBriefingUpdatedAt } from "@/lib/utils";
import {
  buildSignalSnapshot,
  clearVisitSnapshot,
  isReturnVisitForPeriod,
  loadVisitSnapshot,
  saveVisitSnapshot,
} from "@/lib/visit-snapshot";
import { clearAllHorizonIQClientState } from "@/lib/onboarding-bootstrap";
import { identityService } from "@/lib/identity";
import { formatPersonalizedGreeting } from "@/lib/identity/greeting";
import {
  getFirstTimeOnboardingPath,
  hasCompletedIdentityOnboarding,
} from "@/lib/onboarding-flow";

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
  const { preferences, hydrated, isComplete } = usePreferences();
  const [guidedTourActive, setGuidedTourActive] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!hasCompletedIdentityOnboarding()) {
      router.replace(getFirstTimeOnboardingPath());
      return;
    }
    if (!isComplete) {
      router.replace("/onboarding/role");
    }
  }, [hydrated, isComplete, router]);

  const briefing = useMemo(() => getBriefing(preferences), [preferences]);
  const signals = useMemo(() => getTopSignals(preferences), [preferences]);

  const persistVisitSnapshot = useCallback(() => {
    if (!hydrated || !isComplete || signals.length === 0) return;
    const meta = getMeta();
    const existing = loadVisitSnapshot();
    saveVisitSnapshot({
      lastVisitAt: new Date().toISOString(),
      briefingPeriod: meta.briefingPeriod,
      signals: buildSignalSnapshot(signals, existing),
    });
  }, [hydrated, isComplete, signals]);

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

  const viewTracked = useRef(false);
  useEffect(() => {
    if (viewTracked.current) return;
    if (!hydrated || !isComplete || !preferences.role || !preferences.region) {
      return;
    }
    viewTracked.current = true;
    const visitType = whatChanged.isReturnVisit ? "return" : "first";
    track("dashboard_loaded", {
      visitType,
      briefingPeriod: whatChanged.briefingPeriod,
      role: preferences.role,
      region: preferences.region,
      timeToValueMs: visitType === "first" ? getSessionElapsedMs() : null,
    });
    if (visitType === "return") {
      const snapshot = loadVisitSnapshot();
      const daysSinceLastVisit =
        snapshot?.lastVisitAt != null
          ? Math.floor(
              (Date.now() - Date.parse(snapshot.lastVisitAt)) / 86_400_000
            )
          : null;
      track("return_visit", {
        briefingPeriod: whatChanged.briefingPeriod,
        daysSinceLastVisit,
      });
    }
  }, [hydrated, isComplete, preferences.role, preferences.region, whatChanged]);

  useEffect(() => {
    if (!hydrated || !isComplete) return;
    if (!identityService.shouldShowGuidedTour()) return;

    const timer = window.setTimeout(() => {
      setGuidedTourActive(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [hydrated, isComplete]);

  useEffect(() => {
    if (!hydrated || !isComplete || signals.length === 0) return;
    if (guidedTourActive) return;
    persistVisitSnapshot();
  }, [hydrated, isComplete, signals, persistVisitSnapshot, guidedTourActive]);

  const role = (preferences.role ?? "professional") as RoleId;
  const experience = ROLE_EXPERIENCE[role];
  const secondaryActions = actions.filter((a) => !a.isPrimary);

  const supportingSections = experience.sectionOrder.filter(
    (key): key is Extract<DashboardSection, "skills" | "opportunities"> =>
      key === "skills" || key === "opportunities"
  );

  const hasSupportingContent =
    skills.length > 0 || opportunities.length > 0;

  if (!hydrated) {
    return <FullScreenLoader label="Loading your preferences…" />;
  }

  if (!isComplete) {
    return <FullScreenLoader label="Redirecting to setup…" />;
  }

  const isFirstVisit = !whatChanged.isReturnVisit;
  const displayName = identityService.getDisplayName();

  const handleReset = () => {
    track("cta_clicked", { cta: "start_over", surface: "dashboard" });
    clearVisitSnapshot();
    clearAllHorizonIQClientState();
    window.location.assign("/onboarding/welcome");
  };

  const handleTourComplete = () => {
    identityService.markGuidedTourComplete();
    setGuidedTourActive(false);
    persistVisitSnapshot();
  };

  return (
    <div className="relative min-h-dvh bg-background" data-tour="dashboard">
      <IntelligenceFieldLayer variant="ambient" mode="webgl" signals={signals} />
      <TopBar showBeta showNav />

      <main className="container relative z-10 space-y-12 pt-10 pb-14 md:space-y-16 md:pt-12 md:pb-20">
        {isFirstVisit && (
          <BaselineBriefingBanner displayName={displayName} />
        )}

        {!isFirstVisit && displayName && (
          <FadeIn>
            <p className="text-sm text-muted-foreground md:text-base">
              <span className="font-medium text-foreground">
                {formatPersonalizedGreeting(displayName).salutation}
              </span>
            </p>
          </FadeIn>
        )}

        <WhatChangedHero briefing={whatChanged} />

        <DashboardContextBar preferences={preferences} onReset={handleReset} />

        {!isFirstVisit && (
          <div className="space-y-16 md:space-y-20">
            {signals.length > 0 && (
              <StorySection
                act="matters"
                title="How each change affects you"
                question="Open any signal for the full intelligence brief."
              >
                <Stagger className="grid gap-4 md:grid-cols-2">
                  {signals.map((signal) => (
                    <StaggerItem key={signal.id}>
                      <SignalCard signal={signal} focus="why" />
                    </StaggerItem>
                  ))}
                </Stagger>
              </StorySection>
            )}

            {secondaryActions.length > 0 && (
              <StorySection
                act="action"
                title="Additional moves to consider"
                question="Your primary action is in the briefing above."
              >
                <Stagger className="grid gap-4 md:grid-cols-2">
                  {secondaryActions.map((action) => (
                    <StaggerItem key={action.id}>
                      <ActionCard action={action} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </StorySection>
            )}

            {hasSupportingContent && (
              <DisclosurePanel
                title="Supporting intelligence"
                description="Skills and opportunities connected to your focus areas."
                onExpanded={() =>
                  track("briefing_expanded", { section: "supporting_intelligence" })
                }
              >
                <div className="space-y-10">
                  {supportingSections.map((key) => {
                    if (key === "skills" && skills.length > 0) {
                      return (
                        <div key="skills">
                          <h3 className="mb-4 text-sm font-semibold text-foreground">
                            {experience.skillsTitle}
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {skills.map((skill) => (
                              <SkillCard key={skill.id} skill={skill} />
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (key === "opportunities" && opportunities.length > 0) {
                      return (
                        <div key="opportunities" data-tour="opportunities">
                          <h3 className="mb-4 text-sm font-semibold text-foreground">
                            {experience.opportunitiesTitle}
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {opportunities.map((opportunity) => (
                              <OpportunityCard
                                key={opportunity.id}
                                opportunity={opportunity}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </DisclosurePanel>
            )}

            {signals.length === 0 &&
              secondaryActions.length === 0 &&
              !hasSupportingContent && <EmptyState />}
          </div>
        )}

        {isFirstVisit && (
          <SignalsWeAreTracking signals={signals} />
        )}
      </main>

      <SiteFooter
        supplementary={
          <p>
            HorizonIQ · {getProvenanceShortLabel(getDataProvenance())} ·{" "}
            {briefing.briefingLabel} · Briefing period {getMeta().briefingPeriod}{" "}
            · Last updated {formatBriefingUpdatedAt(getMeta().updatedAt)} ·{" "}
            {getRefreshSchedule()}
          </p>
        }
      />

      <GuidedTourOverlay active={guidedTourActive} onComplete={handleTourComplete} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      Nothing here yet for this combination. Try adjusting your{" "}
      {ADJUST_FOCUS_AREAS_LABEL.toLowerCase()}.
    </div>
  );
}
