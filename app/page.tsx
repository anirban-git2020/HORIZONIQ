import { IntelligenceFieldLayer } from "@/components/intelligence-field/intelligence-field-layer";
import { LandingEntryGuard } from "@/components/landing/landing-entry-guard";
import { OnboardingStartLink } from "@/components/onboarding/onboarding-start-link";
import { SiteFooter } from "@/components/layout/site-footer";
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
    <LandingEntryGuard>
      <div className="relative min-h-dvh bg-background">
      <section className="relative overflow-hidden">
        <IntelligenceFieldLayer variant="hero" mode="webgl" />
        <div className="relative z-10">
          <TopBar
            showBeta
            showNav
            right={
              <OnboardingStartLink
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Get started
              </OnboardingStartLink>
            }
          />
          <LandingHero provenance={provenance} />
        </div>
      </section>

      <div className="relative z-10 bg-background">
        <LandingPillars />
        <div className="container max-w-4xl space-y-10 pb-28 md:pb-32">
          <DataTrustPanel
            provenance={provenance}
            briefingLabel={meta.briefingLabel}
            refreshSchedule={refreshSchedule}
          />
          <WhyHorizonIQ />
        </div>

        <SiteFooter
          supplementary={
            <p>
              {meta.briefingLabel} · Refreshes {refreshSchedule.toLowerCase()}
            </p>
          }
        />
      </div>
      </div>
    </LandingEntryGuard>
  );
}
