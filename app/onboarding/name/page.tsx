"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { FirstTimeShell } from "@/components/onboarding/first-time-shell";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { identityService } from "@/lib/identity";
import { getPathForPhase } from "@/lib/onboarding-phase";
import {
  advanceOnboardingPhase,
  bootstrapOnboardingState,
  getActivePhase,
} from "@/lib/onboarding-state";

export default function NamePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapOnboardingState();
    const phase = getActivePhase();

    if (phase === "welcome") {
      router.replace("/onboarding/welcome");
      return;
    }

    const existingName = identityService.getDisplayName();
    if (existingName) {
      setName(existingName);
    }

    if (phase !== "name") {
      router.replace(getPathForPhase(phase));
      return;
    }

    setReady(true);
  }, [router]);

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    identityService.setDisplayName(trimmed);
    advanceOnboardingPhase("landing");
    router.push("/");
  };

  if (!ready) {
    return <PageLoader label="Loading…" />;
  }

  return (
    <FirstTimeShell
      footer={
        <div className="flex justify-end">
          <Button onClick={handleContinue} disabled={name.trim().length === 0}>
            Continue
            <ArrowRight />
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="space-y-3 text-center md:text-left">
          <p className="label-caps text-primary">Personalize</p>
          <h1 className="display-title text-3xl md:text-4xl">
            What should we call you?
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            We&apos;ll use your first name in greetings and your briefing.
          </p>
        </div>

        <label className="block">
          <span className="sr-only">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) handleContinue();
            }}
            placeholder="Your first name"
            autoFocus
            maxLength={48}
            className="w-full rounded-xl border border-border bg-card px-5 py-4 text-lg font-medium shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>
    </FirstTimeShell>
  );
}
