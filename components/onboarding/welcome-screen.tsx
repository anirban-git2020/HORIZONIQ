"use client";

import { BetaBadge } from "@/components/brand/beta-badge";
import { HorizonIQWordmark } from "@/components/brand/horizoniq-wordmark";
import { TaglineLockup } from "@/components/brand/tagline-lockup";
import { IntelligenceFieldCanvas } from "@/components/intelligence-field/intelligence-field-canvas";
import { Button } from "@/components/ui/button";
import { WELCOME_HEADLINE_PREFIX } from "@/lib/copy";
import { identityService } from "@/lib/identity";
import { NEUTRAL_FIELD_PARAMS } from "@/lib/intelligence-field/params";
import { navigateOnboarding } from "@/lib/onboarding-nav";

export function WelcomeScreen() {
  const advance = (skipped: boolean) => {
    identityService.markWelcomeComplete({ skipped });
    navigateOnboarding("/onboarding/name");
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <IntelligenceFieldCanvas
        params={NEUTRAL_FIELD_PARAMS}
        variant="welcome"
        mode="css"
        intensity={0.45}
        className="z-0"
      />

      <div className="relative z-10 flex justify-end p-6 md:p-8">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => advance(true)}
        >
          Skip
        </Button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center md:pb-20">
        <div className="flex max-w-4xl flex-col items-center">
          <div className="mb-8 flex flex-col items-center gap-3">
            <HorizonIQWordmark size="sm" adaptive={false} />
            <BetaBadge />
          </div>

          <h1 className="display-title text-balance text-4xl md:text-5xl lg:text-6xl">
            {WELCOME_HEADLINE_PREFIX}{" "}
            <HorizonIQWordmark
              size="inherit"
              adaptive={false}
              className="inline text-[1em] md:text-[1em] lg:text-[1em]"
            />
          </h1>

          <div className="mt-10 md:mt-12">
            <TaglineLockup size="lg" animated />
          </div>

          <Button
            size="lg"
            onClick={() => advance(false)}
            className="mt-12 min-w-[240px] font-bold md:mt-14"
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
}
