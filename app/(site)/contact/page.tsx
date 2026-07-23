import type { Metadata } from "next";

import { BrandName } from "@/components/brand/horizoniq-wordmark";
import { ContentPage, ContentSection } from "@/components/layout/content-page";
import { FooterLink } from "@/components/layout/footer-link";
import { pageMetadata } from "@/lib/seo";
import { FOUNDER } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact HorizonIQ for product questions, beta feedback, and partnership conversations.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      description="Reach out for product questions, beta feedback, or partnership conversations."
    >
      <ContentSection title="Email us">
        <p>
          Email is the fastest way to reach the <BrandName /> team during beta —
          for questions, feedback, bugs, partnerships, or feature requests. We
          read every message.
        </p>
        <p className="mt-4">
          <FooterLink
            href={`mailto:${FOUNDER.email}`}
            external
            surface="contact"
            className="text-primary underline-offset-4 hover:underline"
          >
            {FOUNDER.email}
          </FooterLink>
        </p>
      </ContentSection>

      <ContentSection title="Response time">
        <p>
          We aim to respond within a few business days. For urgent security
          issues, include &quot;Security&quot; in your subject line.
        </p>
      </ContentSection>

      <ContentSection title="Privacy and account requests">
        <p>
          To access, correct, or delete the data tied to your account, email us and
          we will help. See the{" "}
          <FooterLink
            href="/privacy"
            surface="contact"
            className="text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </FooterLink>{" "}
          for what we store and the choices you have.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
