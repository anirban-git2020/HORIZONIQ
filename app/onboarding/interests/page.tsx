"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { PremiumCard } from "@/components/ui/premium-card";
import {
  ROLE_INTEREST_COPY,
  getInterestDisplayForRole,
  getInterestsForRole,
  getStudentInterestSections,
} from "@/lib/options";
import { INTELLIGENCE_FOCUS_AREAS_LABEL } from "@/lib/copy";
import { trackOnboardingCompleted, ONBOARDING_TOUR_PATH } from "@/lib/onboarding";
import { usePreferences } from "@/lib/preferences";
import type { InterestOption } from "@/lib/options";
import type { RoleId } from "@/lib/types";
import { useRequireIdentityOnboarding } from "@/hooks/use-require-identity-onboarding";
import { cn } from "@/lib/utils";

function InterestGrid({
  role,
  interests,
  selected,
  onToggle,
}: {
  role: RoleId;
  interests: InterestOption[];
  selected: string[];
  onToggle: (id: InterestOption["id"]) => void;
}) {
  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" immediate>
      {interests.map((interest) => {
        const display = getInterestDisplayForRole(role, interest);
        return (
          <StaggerItem key={interest.id}>
            <OptionCard
              icon={interest.icon}
              label={display.label}
              description={display.description}
              selected={selected.includes(interest.id)}
              onSelect={() => onToggle(interest.id)}
            />
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

export default function InterestsPage() {
  const router = useRouter();
  const { preferences, toggleInterest, setInterests, hydrated } =
    usePreferences();
  const role = preferences.role;
  const count = preferences.interests.length;
  const identityReady = useRequireIdentityOnboarding(hydrated);

  useEffect(() => {
    if (!hydrated || !identityReady) return;
    if (!role) {
      router.replace("/onboarding/role");
      return;
    }
    if (!preferences.region) {
      router.replace("/onboarding/region");
    }
  }, [hydrated, identityReady, role, preferences.region, router]);

  useEffect(() => {
    if (!role) return;
    const allowed = new Set(getInterestsForRole(role).map((i) => i.id));
    const valid = preferences.interests.filter((id) => allowed.has(id));
    if (valid.length !== preferences.interests.length) {
      setInterests(valid);
    }
  }, [role, preferences.interests, setInterests]);

  if (!hydrated || !identityReady || !role) {
    return <PageLoader />;
  }

  const copy = ROLE_INTEREST_COPY[role];
  const interestById = new Map(getInterestsForRole(role).map((i) => [i.id, i]));

  const handleComplete = () => {
    if (!preferences.role || !preferences.region) return;
    trackOnboardingCompleted({
      role: preferences.role,
      region: preferences.region,
      interests: preferences.interests,
      path: "custom",
    });
    router.push(ONBOARDING_TOUR_PATH);
  };

  return (
    <OnboardingShell
      step={3}
      title={copy.title}
      subtitle={copy.subtitle}
      footer={
        <>
          <Link
            href="/onboarding/region"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
          >
            <ArrowLeft />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {count} selected
            </span>
            <Button onClick={handleComplete} disabled={count === 0}>
              <Sparkles />
              Build my dashboard
            </Button>
          </div>
        </>
      }
    >
      <PremiumCard className="mb-8 border-primary/20 bg-primary/[0.03] p-5 md:p-6">
        <p className="text-sm font-medium text-foreground">
          Choose your {INTELLIGENCE_FOCUS_AREAS_LABEL.toLowerCase()}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Select at least one topic to shape your briefing. Nothing is selected
          until you choose.
        </p>
      </PremiumCard>

      {role === "student" ? (
        <div className="space-y-10">
          {getStudentInterestSections().map((section) => {
            const interests = section.ids
              .map((id) => interestById.get(id))
              .filter((i): i is InterestOption => i !== undefined);
            if (interests.length === 0) return null;
            return (
              <div key={section.label}>
                <h2 className="label-caps mb-4 text-muted-foreground">
                  {section.label}
                </h2>
                <InterestGrid
                  role={role}
                  interests={interests}
                  selected={preferences.interests}
                  onToggle={toggleInterest}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h2 className="label-caps mb-4 text-muted-foreground">
            {copy.sectionLabel}
          </h2>
          <InterestGrid
            role={role}
            interests={getInterestsForRole(role)}
            selected={preferences.interests}
            onToggle={toggleInterest}
          />
        </div>
      )}
    </OnboardingShell>
  );
}
