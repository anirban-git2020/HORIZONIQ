"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button, buttonVariants } from "@/components/ui/button";
import { INTERESTS } from "@/lib/options";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export default function InterestsPage() {
  const router = useRouter();
  const { preferences, toggleInterest } = usePreferences();
  const count = preferences.interests.length;

  return (
    <OnboardingShell
      step={3}
      title="What do you want to track?"
      subtitle="Pick the areas you care about. Choose as many as you like — you can change these later."
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
            <Button
              onClick={() => router.push("/dashboard")}
              disabled={count === 0}
            >
              <Sparkles />
              Build my dashboard
            </Button>
          </div>
        </>
      }
    >
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {INTERESTS.map((interest) => (
          <StaggerItem key={interest.id}>
            <OptionCard
              icon={interest.icon}
              label={interest.label}
              description={interest.description}
              selected={preferences.interests.includes(interest.id)}
              onSelect={() => toggleInterest(interest.id)}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </OnboardingShell>
  );
}
