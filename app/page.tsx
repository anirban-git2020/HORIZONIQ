import Link from "next/link";

import { IntelligenceBackground } from "@/components/layout/intelligence-background";
import { TopBar } from "@/components/layout/top-bar";
import { DataTrustPanel } from "@/components/landing/data-trust-panel";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPillars } from "@/components/landing/landing-pillars";
import { WhyHorizonIQ } from "@/components/landing/why-horizoniq";
import { buttonVariants } from "@/components/ui/button";
import {
  getDataProvenance,
  getMeta,
  getRefreshSchedule,
} from "@/lib/data/access";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const provenance = getDataProvenance();
  const meta = getMeta();
  const refreshSchedule = getRefreshSchedule();

  return (
    <div className="relative min-h-dvh">
      <IntelligenceBackground variant="hero" />
      <div className="relative">
        <TopBar
          right={
            <Link
              href="/onboarding/welcome"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Get started
            </Link>
          }
        />

        <main>
          <LandingHero provenance={provenance} />
          <LandingPillars />
          <div className="container max-w-4xl space-y-10 pb-28 md:pb-32">
            <DataTrustPanel
              provenance={provenance}
              briefingLabel={meta.briefingLabel}
              refreshSchedule={refreshSchedule}
            />
            <WhyHorizonIQ />
          </div>
        </main>

        <footer className="border-t border-border/50">
          <div className="container space-y-1 py-6 text-sm text-muted-foreground">
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <span>© {new Date().getFullYear()} HorizonIQ</span>
              <span>{meta.briefingLabel}</span>
            </div>
            <p className="text-center text-xs sm:text-right">
              Refreshes {refreshSchedule.toLowerCase()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
