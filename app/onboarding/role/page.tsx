"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ObserveUnderstandActSteps } from "@/components/onboarding/observe-understand-act-steps";
import { OptionCard } from "@/components/onboarding/option-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { ROLES } from "@/lib/options";
import { getPathForPhase } from "@/lib/onboarding-phase";
import {
  bootstrapOnboardingState,
  getActivePhase,
} from "@/lib/onboarding-flow";
import { navigateOnboarding } from "@/lib/onboarding-nav";
import { usePreferences } from "@/lib/preferences";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function RolePage() {
  const router = useRouter();
  const { preferences, setRole, hydrated } = usePreferences();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    bootstrapOnboardingState();

    const phase = getActivePhase();
    if (phase !== "profile") {
      navigateOnboarding(getPathForPhase(phase));
      return;
    }

    setReady(true);
  }, [hydrated]);

  if (!hydrated || !ready) {
    return <PageLoader />;
  }

  return (
    <OnboardingShell
      step={1}
      title="Who are you here as?"
      subtitle="We tailor every signal, skill, and recommendation to your goals."
      footer={
        <>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
            onClick={() => router.push("/")}
          >
            <ArrowLeft />
            Back
          </button>
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
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" immediate>
        {ROLES.map((role) => (
          <StaggerItem key={role.id}>
            <OptionCard
              icon={role.icon}
              label={role.label}
              tagline={role.tagline}
              description={role.description}
              selected={preferences.role === role.id}
              onSelect={() => {
                setRole(role.id);
                track("role_selected", { role: role.id, surface: "onboarding" });
              }}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </OnboardingShell>
  );
}
