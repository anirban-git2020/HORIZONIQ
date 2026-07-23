import type { Metadata } from "next";

import { BrandName, HorizonIQWordmark } from "@/components/brand/horizoniq-wordmark";
import { ContentPage, ContentSection } from "@/components/layout/content-page";
import { FounderSection } from "@/components/site/founder-section";
import { pageMetadata } from "@/lib/seo";
import { SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "HorizonIQ helps you understand what is changing, why it matters, and what to do next — before it becomes mainstream.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      title={
        <>
          About <HorizonIQWordmark size="inherit" className="inline text-[1em]" />
        </>
      }
      description="A personalized intelligence platform for people who want to understand change before it becomes mainstream."
    >
      <FounderSection />

      <ContentSection title="Mission">
        <p>
          <BrandName /> turns fragmented signals into clear, personalized
          intelligence you can act on — helping you understand what is changing,
          why it matters, and what to do next, before everyone else.
        </p>
      </ContentSection>

      <ContentSection title={SITE_TAGLINE}>
        <p>
          <strong className="text-foreground">Observe.</strong> See what is
          shifting across technology, skills, markets, and industries.
        </p>
        <p>
          <strong className="text-foreground">Predict.</strong> Understand the
          directional outlook with a clearly labeled confidence level — shown as a
          projection, not fact.
        </p>
        <p>
          <strong className="text-foreground">Lead.</strong> Take one clear,
          recommended action tailored to your focus.
        </p>
      </ContentSection>

      <ContentSection title="Where we're headed">
        <p>
          See the{" "}
          <a href="/roadmap" className="text-primary underline-offset-4 hover:underline">
            roadmap
          </a>{" "}
          for where <BrandName /> is going next.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
