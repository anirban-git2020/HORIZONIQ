"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { TopBar } from "@/components/layout/top-bar";
import { IntelligenceFieldLayer } from "@/components/intelligence-field/intelligence-field-layer";
import { Section } from "@/components/dashboard/section";
import { ChangeBadge } from "@/components/dashboard/change-badge";
import { IntelligenceCard } from "@/components/intelligence/intelligence-card";
import { SkillCard } from "@/components/dashboard/skill-card";
import { OpportunityCard } from "@/components/dashboard/opportunity-card";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import {
  getSignalById as getRawSignal,
  getDataProvenance,
  getRefreshSchedule,
} from "@/lib/data/access";
import { getTrustDisclaimer } from "@/lib/trust";
import {
  getOpportunities,
  getRecommendedSkills,
  getSignalById,
} from "@/lib/personalize";
import { usePreferences } from "@/lib/preferences";
import { consumeSignalSource, track } from "@/lib/analytics";
import {
  getFirstTimeOnboardingPath,
  hasCompletedIdentityOnboarding,
} from "@/lib/onboarding-flow";
import { cn } from "@/lib/utils";
import { INTELLIGENCE_FOCUS_AREAS_LABEL } from "@/lib/copy";

export default function SignalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { preferences, hydrated, isComplete } = usePreferences();
  const signalId = params.id as string;

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

  const signal = useMemo(
    () => getSignalById(signalId, preferences),
    [signalId, preferences]
  );

  const detailTracked = useRef(false);
  useEffect(() => {
    if (detailTracked.current || !signal) return;
    detailTracked.current = true;
    track("signal_opened", {
      signalId: signal.id,
      source: consumeSignalSource(),
      changeType: signal.change.type,
      surface: "detail",
    });
  }, [signal]);

  const relatedSkills = useMemo(() => {
    if (!signal) return [];
    const all = getRecommendedSkills(preferences, 20);
    return all.filter((s) => signal.relatedSkills.includes(s.id));
  }, [signal, preferences]);

  const relatedOpportunities = useMemo(() => {
    if (!signal) return [];
    const all = getOpportunities(preferences, 20);
    return all.filter((o) => signal.relatedOpportunities.includes(o.id));
  }, [signal, preferences]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!signal) {
    const exists = getRawSignal(signalId);
    return (
      <div className="min-h-dvh bg-background">
        <TopBar showBeta showNav />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-semibold">Signal not found</h1>
          <p className="mt-2 text-muted-foreground">
            {exists
              ? `This signal isn't in your current ${INTELLIGENCE_FOCUS_AREAS_LABEL.toLowerCase()}. Adjust your briefing lens to see it.`
              : "This signal doesn't exist in our current briefing."}
          </p>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "secondary" }), "mt-6")}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const provenance = getDataProvenance();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <IntelligenceFieldLayer variant="ambient" mode="webgl" signals={[signal]} />
      <TopBar showBeta showNav />

      <div className="relative z-10 border-b border-border/60 bg-background/75 backdrop-blur-sm">
        <div className="container py-8 md:py-10">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-6"
            )}
          >
            <ArrowLeft />
            Back to briefing
          </Link>

          <FadeIn>
            <div className="flex flex-wrap items-center gap-2">
              <ChangeBadge type={signal.change.type} />
              <Badge variant="muted">{signal.category}</Badge>
              <Badge variant="primary">{signal.interestLabel}</Badge>
            </div>

            <h1 className="display-title mt-4 text-3xl md:text-4xl">
              {signal.name}
            </h1>
          </FadeIn>
        </div>
      </div>

      <main className="container relative z-10 space-y-10 py-10 md:space-y-12 md:py-12">
        <Section
          title="Intelligence Brief"
          question="Analyst reasoning for this signal"
        >
          <PremiumCard className="p-6 md:p-8">
            <IntelligenceCard
              intelligence={signal.intelligence}
              variant="full"
            />
          </PremiumCard>
        </Section>

        {(relatedSkills.length > 0 || relatedOpportunities.length > 0) && (
          <Section
            title="Related Moves"
            question="Skills and opportunities tied to this signal"
          >
            <div className="space-y-8">
              {relatedSkills.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
              {relatedOpportunities.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {relatedOpportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}

        <FadeIn>
          <div className="rounded-xl border border-border/70 bg-secondary/30 px-6 py-5 text-center md:px-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {getTrustDisclaimer(provenance, getRefreshSchedule())}
            </p>
          </div>
        </FadeIn>
      </main>

      <SiteFooter />
    </div>
  );
}
