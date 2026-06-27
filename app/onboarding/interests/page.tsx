"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button, buttonVariants } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import {
  ROLE_INTEREST_COPY,
  getDefaultInterestLabelsForRole,
  getDefaultInterestsForRole,
  getInterestDisplayForRole,
  getInterestsForRole,
  getStudentInterestSections,
} from "@/lib/options";
import { trackOnboardingCompleted, ONBOARDING_TOUR_PATH } from "@/lib/onboarding";
import { usePreferences } from "@/lib/preferences";
import type { InterestOption } from "@/lib/options";
import type { RoleId } from "@/lib/types";
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
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  const defaultsApplied = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!role) {
      router.replace("/onboarding/role");
      return;
    }
    if (!preferences.region) {
      router.replace("/onboarding/region");
    }
  }, [hydrated, role, preferences.region, router]);

  useEffect(() => {
    if (!role) return;
    const allowed = new Set(getInterestsForRole(role).map((i) => i.id));
    const valid = preferences.interests.filter((id) => allowed.has(id));
    if (valid.length !== preferences.interests.length) {
      setInterests(valid);
    }
  }, [role, preferences.interests, setInterests]);

  useEffect(() => {
    if (!hydrated || !role || defaultsApplied.current) return;
    if (preferences.interests.length > 0) return;
    setInterests(getDefaultInterestsForRole(role));
    defaultsApplied.current = true;
  }, [hydrated, role, preferences.interests.length, setInterests]);

  if (!role) {
    return null;
  }

  const copy = ROLE_INTEREST_COPY[role];
  const interestById = new Map(getInterestsForRole(role).map((i) => [i.id, i]));
  const defaultLabels = getDefaultInterestLabelsForRole(role);

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
          Recommended for you
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          We pre-selected {defaultLabels.join(", ")}. Adjust any time — or
          continue to your briefing now.
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
