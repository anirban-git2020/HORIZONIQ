"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { TopBar } from "@/components/layout/top-bar";
import { Section } from "@/components/dashboard/section";
import { ChangeBadge, DeltaIndicator } from "@/components/dashboard/change-badge";
import { SignalEvidence } from "@/components/dashboard/signal-evidence";
import { SkillCard } from "@/components/dashboard/skill-card";
import { OpportunityCard } from "@/components/dashboard/opportunity-card";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { getSignalById as getRawSignal } from "@/lib/data/access";
import {
  getOpportunities,
  getRecommendedSkills,
  getSignalById,
} from "@/lib/personalize";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export default function SignalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { preferences, hydrated, isComplete } = usePreferences();
  const signalId = params.id as string;

  useEffect(() => {
    if (hydrated && !isComplete) {
      router.replace("/onboarding/role");
    }
  }, [hydrated, isComplete, router]);

  const signal = useMemo(
    () => getSignalById(signalId, preferences),
    [signalId, preferences]
  );

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
        <TopBar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-semibold">Signal not found</h1>
          <p className="mt-2 text-muted-foreground">
            {exists
              ? "This signal isn't in your current interests. Adjust your tracking preferences to see it."
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

  return (
    <div className="min-h-dvh bg-background">
      <TopBar />

      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
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

            <div className="mt-4 flex flex-wrap gap-4">
              <DeltaIndicator delta={signal.momentumDelta} label="momentum" />
              <DeltaIndicator delta={signal.confidenceDelta} label="confidence" />
            </div>
          </FadeIn>
        </div>
      </div>

      <main className="container space-y-12 py-12 md:space-y-16 md:py-16">
        <Section step={1} title="What Changed" question="What is happening?">
          <PremiumCard className="p-6 md:p-8">
            <p className="text-lg font-medium text-foreground">
              {signal.change.summary}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {signal.currentState}
            </p>
          </PremiumCard>
        </Section>

        <Section
          step={2}
          title="Why It Matters For You"
          question="Why does this change matter?"
        >
          <PremiumCard className="border-primary/20 bg-primary/[0.03] p-6 md:p-8">
            <p className="text-base leading-relaxed md:text-lg">
              {signal.soWhatForYou}
            </p>
          </PremiumCard>
        </Section>

        <Section
          step={3}
          title="Momentum Drivers"
          question="What is driving this change?"
        >
          <SignalEvidence
            momentum={signal.momentum}
            confidence={signal.confidence}
            momentumDrivers={signal.momentumDrivers}
            confidenceFactors={signal.confidenceFactors}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {signal.sources.map((source) => (
              <Badge key={source.label} variant="muted">
                {source.label}
                {source.type === "mock" ? " · mock" : ""}
              </Badge>
            ))}
          </div>
        </Section>

        <Section
          step={4}
          title="Affected Industries"
          question="What industries are affected?"
        >
          <div className="flex flex-wrap gap-2">
            {signal.affectedIndustries.map((industry) => (
              <Badge key={industry} variant="default">
                {industry}
              </Badge>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Roles most impacted: {signal.affectedRoles.join(", ")}
          </p>
        </Section>

        {relatedSkills.length > 0 && (
          <Section
            step={5}
            title="Recommended Skills"
            question="What skills are relevant?"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </Section>
        )}

        {relatedOpportunities.length > 0 && (
          <Section
            step={6}
            title="Opportunities"
            question="What opportunities are emerging?"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {relatedOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </Section>
        )}

        <Section
          step={7}
          title="Recommended Action"
          question="What should you do next?"
        >
          <PremiumCard glow className="p-6 md:p-8">
            <p className="text-base leading-relaxed md:text-lg">
              {signal.recommendedAction}
            </p>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "secondary" }), "mt-6 inline-flex")}
            >
              Return to your briefing
            </Link>
          </PremiumCard>
        </Section>

        <FadeIn>
          <div className="rounded-xl border border-border/70 bg-secondary/30 px-6 py-5 text-center md:px-8">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              We&apos;re tracking this signal for your next briefing.
            </p>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
