import type { Metadata } from "next";

import {
  ContentList,
  ContentPage,
  ContentSection,
} from "@/components/layout/content-page";
import { FounderSection } from "@/components/site/founder-section";
import { BetaBadge } from "@/components/brand/beta-badge";
import { TaglineLockup } from "@/components/brand/tagline-lockup";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE, SITE_VERSION } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Learn about HorizonIQ — the Personal Intelligence Operating System that helps you understand what is changing, why it matters, and what to do next.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      title="About HorizonIQ"
      description="A personalized intelligence platform built for people who want to understand change before it becomes mainstream."
    >
      <div className="space-y-3">
        <TaglineLockup size="sm" />
        <BetaBadge />
      </div>

      <ContentSection title="Mission">
        <p>
          {SITE_NAME} helps people understand what is changing, why it matters,
          and what to do next — before everyone else. We turn fragmented signals
          into clear, personalized intelligence you can act on.
        </p>
      </ContentSection>

      <ContentSection title="Vision">
        <p>
          The world&apos;s first personalized intelligence platform — not a
          dashboard, not a trend tracker, and not an AI chatbot. HorizonIQ
          should feel like having a personal future analyst who tells you what
          changed.
        </p>
      </ContentSection>

      <ContentSection title="What HorizonIQ Is">
        <p>
          HorizonIQ is a <strong className="text-foreground">signal change platform</strong>.
          Users return because something changed for them — not because a static
          feed exists. Every briefing answers four questions: what happened, why
          it is happening, why you should care, and what to do next.
        </p>
      </ContentSection>

      <ContentSection title={SITE_TAGLINE}>
        <p>
          <strong className="text-foreground">Observe.</strong> See what is
          shifting across technology, skills, markets, and industries.
        </p>
        <p>
          <strong className="text-foreground">Predict.</strong> Understand
          directional outlook with calibrated confidence — clearly labeled as
          projection, not fact.
        </p>
        <p>
          <strong className="text-foreground">Lead.</strong> Take one clear
          recommended action tailored to your role, region, and Intelligence
          Focus Areas.
        </p>
      </ContentSection>

      <ContentSection title="Personal Intelligence Operating System">
        <p>
          HorizonIQ is designed as a Personal Intelligence Operating System —
          an environment where intelligence feels alive, trustworthy, and
          actionable. The Living Intelligence Core visual reflects momentum and
          confidence from your briefing; the dashboard tells one story: what
          changed, why it matters, what to do.
        </p>
      </ContentSection>

      <FounderSection />

      <ContentSection title="Current Status">
        <p>
          HorizonIQ is in <strong className="text-foreground">{SITE_VERSION}</strong>{" "}
          public beta. Features, data sources, and intelligence presentation
          continue to evolve weekly as we validate retention and trust with real
          users.
        </p>
      </ContentSection>

      <ContentSection title="Roadmap Summary">
        <p>Our current focus areas include:</p>
        <ContentList
          items={[
            "Validating Week 2 return with change-first intelligence",
            "Measuring product analytics and onboarding completion",
            "Expanding signal coverage across Intelligence Focus Areas",
            "Hardening immersive performance and guided tour polish",
            "Preparing retention mechanics for post-MVP (email digest, accounts)",
          ]}
        />
        <p>
          See the full{" "}
          <a href="/roadmap" className="text-primary underline-offset-4 hover:underline">
            product roadmap
          </a>{" "}
          for milestones and future vision.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
