"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Compass, Map } from "lucide-react";

import { FirstTimeShell } from "@/components/onboarding/first-time-shell";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { usePreferences } from "@/lib/preferences";
import { identityService } from "@/lib/identity";

export default function TourChoicePage() {
  const router = useRouter();
  const { isComplete, hydrated } = usePreferences();

  useEffect(() => {
    if (!hydrated) return;
    if (!isComplete) {
      router.replace("/onboarding/role");
    }
  }, [hydrated, isComplete, router]);

  const goToDashboard = (choice: "guided" | "solo") => {
    identityService.setTourChoice(choice);
    router.push("/dashboard");
  };

  if (!hydrated || !isComplete) {
    return null;
  }

  return (
    <FirstTimeShell
      footer={
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => goToDashboard("solo")}>
            I&apos;ll Explore Myself
          </Button>
          <Button onClick={() => goToDashboard("guided")}>
            <Compass />
            Start Guided Tour
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="space-y-3 text-center md:text-left">
          <p className="label-caps text-primary">Almost there</p>
          <h1 className="display-title text-3xl md:text-4xl">
            Would you like a guided tour?
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Your briefing is ready. Choose how you&apos;d like to explore your
            dashboard.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <PremiumCard className="p-6 md:p-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.06] text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Start Guided Tour</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Dashboard, What Changed, Signals, Opportunities, and Recommended
              Actions — in under a minute.
            </p>
          </PremiumCard>

          <PremiumCard className="p-6 md:p-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/50 text-muted-foreground">
              <Map className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">I&apos;ll Explore Myself</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Jump straight into your Week 1 briefing at your own pace.
            </p>
          </PremiumCard>
        </div>
      </div>
    </FirstTimeShell>
  );
}
