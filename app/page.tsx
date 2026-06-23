import Link from "next/link";

import { IntelligenceBackground } from "@/components/layout/intelligence-background";
import { TopBar } from "@/components/layout/top-bar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPillars } from "@/components/landing/landing-pillars";
import { WhyHorizonIQ } from "@/components/landing/why-horizoniq";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh">
      <IntelligenceBackground variant="hero" />
      <div className="relative">
        <TopBar
          right={
            <Link
              href="/onboarding/role"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Get started
            </Link>
          }
        />

        <main>
          <LandingHero />
          <LandingPillars />
          <div className="container max-w-4xl pb-28 md:pb-32">
            <WhyHorizonIQ />
          </div>
        </main>

        <footer className="border-t border-border/50">
          <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} HorizonIQ</span>
            <span>Intelligence, not noise.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
