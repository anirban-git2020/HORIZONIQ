"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button, buttonVariants } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { getDefaultInterestsForRole, REGIONS } from "@/lib/options";
import { INTELLIGENCE_FOCUS_AREAS_LABEL } from "@/lib/copy";
import { ONBOARDING_TOUR_PATH, trackOnboardingCompleted } from "@/lib/onboarding";
import { usePreferences } from "@/lib/preferences";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function RegionPage() {
  const router = useRouter();
  const { preferences, setRegion, setInterests } = usePreferences();
  const role = preferences.role;

  useEffect(() => {
    if (!role) {
      router.replace("/onboarding/role");
    }
  }, [role, router]);

  const handleQuickStart = () => {
    if (!role || !preferences.region) return;
    const interests = getDefaultInterestsForRole(role);
    setInterests(interests);
    trackOnboardingCompleted({
      role,
      region: preferences.region,
      interests,
      path: "quick",
    });
    router.push(ONBOARDING_TOUR_PATH);
  };

  return (
    <OnboardingShell
      step={2}
      title="Where should we focus?"
      subtitle="We prioritize opportunities and trends most relevant to your region."
      footer={
        <>
          <Link
            href="/onboarding/role"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
          >
            <ArrowLeft />
            Back
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/onboarding/interests")}
              disabled={!preferences.region}
            >
              Customize {INTELLIGENCE_FOCUS_AREAS_LABEL.toLowerCase()}
            </Button>
            <Button onClick={handleQuickStart} disabled={!preferences.region}>
              <Sparkles />
              Start my briefing
              <ArrowRight />
            </Button>
          </div>
        </>
      }
    >
      {preferences.region && role && (
        <PremiumCard className="mb-8 border-primary/20 bg-primary/[0.03] p-5 md:p-6">
          <p className="text-sm font-medium text-foreground">
            Ready in under 60 seconds
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Start my briefing uses three recommended focus areas for your role.
            You can fine-tune {INTELLIGENCE_FOCUS_AREAS_LABEL.toLowerCase()} anytime from your dashboard.
          </p>
        </PremiumCard>
      )}

      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((region) => (
          <StaggerItem key={region.id}>
            <OptionCard
              icon={region.icon}
              label={region.label}
              description={region.description}
              selected={preferences.region === region.id}
              onSelect={() => {
                setRegion(region.id);
                track("onboarding_region_selected", { region: region.id });
              }}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </OnboardingShell>
  );
}
