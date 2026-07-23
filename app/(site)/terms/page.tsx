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
  title: "Terms of Use",
  description:
    "HorizonIQ Beta Preview terms of use — beta software disclaimer, accounts, acceptable use, and limitation of liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="Last updated: July 23, 2026. By using HorizonIQ during the Beta Preview, you agree to these terms."
    >
      <ContentSection title="Beta software disclaimer">
        <p>
          <BrandName /> is provided as{" "}
          <strong className="text-foreground">Beta Preview</strong> software.
          Features, intelligence content, data sources, and user experience may
          change without notice. The product is under active development and may
          contain errors or incomplete functionality.
        </p>
      </ContentSection>

      <ContentSection title="Accounts">
        <p>
          You may use <BrandName /> without an account. If you create one — by email
          magic link or Google — you are responsible for keeping access to your email
          or Google account secure, and for activity that occurs under your account.
          You must be at least 18, or the age of majority where you live, to create
          an account. You can stop using <BrandName /> at any time and ask us to
          delete your account, as described in our{" "}
          <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="No warranty">
        <p>
          <BrandName /> is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, whether express or implied, including
          but not limited to implied warranties of merchantability, fitness for a
          particular purpose, or non-infringement.
        </p>
        <p>
          Intelligence outputs — including outlook projections, confidence levels,
          and recommended actions — are for informational purposes only. They are
          projections, not statements of fact, and do not constitute professional,
          financial, legal, or career advice.
        </p>
      </ContentSection>

      <ContentSection title="Features may change">
        <p>
          We may add, modify, or remove features during beta. Briefing data, signal
          coverage, and presentation may change as we improve the product and
          pipeline. We may also suspend or discontinue the Beta Preview.
        </p>
      </ContentSection>

      <ContentSection title="Feedback">
        <p>
          If you submit feedback, bug reports, or suggestions, you grant{" "}
          <BrandName /> a non-exclusive right to use that feedback to improve the
          product without obligation to you. Feedback may be incorporated into
          future versions.
        </p>
      </ContentSection>

      <ContentSection title="Your information">
        <p>
          You retain ownership of information you submit (such as feedback emails
          or bug reports). By submitting information, you represent that you
          have the right to share it and that it does not violate third-party
          rights. Our handling of your information is described in the{" "}
          <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="Acceptable use">
        <ContentList
          items={[
            <>
              Do not attempt to disrupt, scrape, or overload <BrandName />{" "}
              services
            </>,
            <>
              Do not misrepresent <BrandName /> intelligence as guaranteed fact
            </>,
            "Do not use the product for unlawful purposes",
            "Respect source websites and APIs linked from intelligence cards",
          ]}
        />
      </ContentSection>

      <ContentSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by applicable law, <BrandName /> and its
          creator shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of profits, data, or
          goodwill arising from your use of the Beta Preview.
        </p>
      </ContentSection>

      <ContentSection title="Changes to these terms">
        <p>
          We may update these terms as <BrandName /> evolves. When we make a material
          change, we will revise the date above. Continued use after an update means
          you accept the revised terms.
        </p>
      </ContentSection>

      <ContentSection title="Contact">
        <p>
          Terms questions:{" "}
          <a
            href={`mailto:${FOUNDER.email}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            {FOUNDER.email}
          </a>
        </p>
      </ContentSection>
    </ContentPage>
  );
}
