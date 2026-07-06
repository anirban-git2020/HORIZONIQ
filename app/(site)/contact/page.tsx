import type { Metadata } from "next";

import {
  ContentList,
  ContentPage,
  ContentSection,
} from "@/components/layout/content-page";
import { FounderSection } from "@/components/site/founder-section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact HorizonIQ for questions, feedback, bug reports, partnerships, and beta feedback.",
  path: "/contact",
});

const CONTACT_PURPOSES = [
  "Questions",
  "Feedback",
  "Bug Reports",
  "Business Enquiries",
  "Partnership Opportunities",
  "Feature Requests",
  "Beta Feedback",
];

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      description="Reach out for product questions, beta feedback, or partnership conversations."
    >
      <FounderSection />

      <ContentSection title="How to reach us">
        <p>
          Email is the fastest way to reach the HorizonIQ team during beta. We
          read every message and use feedback to prioritize improvements.
        </p>
      </ContentSection>

      <ContentSection title="Purpose">
        <p>You can contact us for:</p>
        <ContentList items={CONTACT_PURPOSES} />
      </ContentSection>

      <ContentSection title="Response time">
        <p>
          HorizonIQ is in active beta development. We aim to respond to
          substantive enquiries within a few business days. For urgent security
          issues, please include &quot;Security&quot; in your subject line.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
