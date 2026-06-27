"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button, buttonVariants } from "@/components/ui/button";
import { REGIONS } from "@/lib/options";
import { usePreferences } from "@/lib/preferences";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function RegionPage() {
  const router = useRouter();
  const { preferences, setRegion } = usePreferences();

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
          <Button
            onClick={() => router.push("/onboarding/interests")}
            disabled={!preferences.region}
          >
            Continue
            <ArrowRight />
          </Button>
        </>
      }
    >
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
