"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ObserveUnderstandActSteps } from "@/components/onboarding/observe-understand-act-steps";
import { OptionCard } from "@/components/onboarding/option-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { ROLES } from "@/lib/options";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export default function RolePage() {
  const router = useRouter();
  const { preferences, setRole } = usePreferences();

  return (
    <OnboardingShell
      step={1}
      title="Who are you here as?"
      subtitle="We tailor every signal, skill, and recommendation to your goals."
      footer={
        <>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
          >
            <ArrowLeft />
            Back
          </Link>
          <Button
            onClick={() => router.push("/onboarding/region")}
            disabled={!preferences.role}
          >
            Continue
            <ArrowRight />
          </Button>
        </>
      }
    >
      <ObserveUnderstandActSteps />
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((role) => (
          <StaggerItem key={role.id}>
            <OptionCard
              icon={role.icon}
              label={role.label}
              tagline={role.tagline}
              description={role.description}
              selected={preferences.role === role.id}
              onSelect={() => setRole(role.id)}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </OnboardingShell>
  );
}
