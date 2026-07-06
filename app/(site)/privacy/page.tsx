import type { Metadata } from "next";

import { BrandName } from "@/components/brand/horizoniq-wordmark";
import {
  ContentList,
  ContentPage,
  ContentSection,
} from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/seo";
import { FOUNDER } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "HorizonIQ privacy practices — anonymous analytics, no advertising trackers, and transparent data handling during beta.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="Last updated: July 6, 2026. This policy describes how HorizonIQ handles information during the Beta Preview."
    >
      <ContentSection title="Overview">
        <p>
          <BrandName /> is committed to transparent data practices. During the Beta
          Preview, we collect only the minimum information needed to deliver
          personalized intelligence and understand anonymous product usage.
        </p>
      </ContentSection>

      <ContentSection title="Anonymous analytics only">
        <p>
          We use privacy-conscious analytics to measure activation, return
          visits, and feature engagement. Analytics are tied to an anonymous
          visitor identifier stored in your browser — not your name, email, or
          account (accounts are not required in beta).
        </p>
        <ContentList
          items={[
            "Vercel Web Analytics and Speed Insights on production deployments",
            "Optional Microsoft Clarity session replay when configured (production only)",
            "Optional PostHog product analytics when configured",
            "Local event buffer in your browser for debugging — not synced to a backend today",
          ]}
        />
      </ContentSection>

      <ContentSection title="No personal information sold">
        <p>
          <BrandName /> does not sell personal information. We do not operate an
          advertising business and do not share identifiable user data with data
          brokers.
        </p>
      </ContentSection>

      <ContentSection title="No advertising trackers">
        <p>
          We do not use advertising pixels or third-party ad networks. Product
          analytics are scoped to understanding how <BrandName /> is used — not to
          profile you for ads.
        </p>
      </ContentSection>

      <ContentSection title="Information stored on your device">
        <p>During beta, preferences and visit state are stored locally:</p>
        <ContentList
          items={[
            "Display name and onboarding progress (localStorage)",
            "Role, region, and Intelligence Focus Areas (localStorage)",
            "Visit snapshot for “What Changed Since Your Last Visit” (localStorage)",
            "Onboarding routing phase (cookie: hziq_ob_v3)",
            "Anonymous analytics visitor and session IDs (localStorage / sessionStorage)",
          ]}
        />
        <p>
          This data stays on your device unless you clear site data or use Start
          over / Start fresh in the product.
        </p>
      </ContentSection>

      <ContentSection title="Future login capabilities">
        <p>
          User accounts and cloud-synced preferences are planned for a future
          release. When login ships, this policy will be updated to describe
          what is stored server-side, retention periods, and your choices.
        </p>
      </ContentSection>

      <ContentSection title="Transparent data practices">
        <p>
          <BrandName /> labels data provenance on signals (Live / Mixed / Sample)
          and links to source material where available. We believe trust comes
          from showing evidence — not from hiding how intelligence is produced.
        </p>
      </ContentSection>

      <ContentSection title="Contact">
        <p>
          Privacy questions:{" "}
          <a
            href={`mailto:${FOUNDER.email}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            {FOUNDER.email}
          </a>
        </p>
      </ContentSection>

      <ContentSection title="Legal review">
        <p className="text-xs text-muted-foreground/80">
          This policy is written for beta transparency. Formal legal review may
          refine language before general availability.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
