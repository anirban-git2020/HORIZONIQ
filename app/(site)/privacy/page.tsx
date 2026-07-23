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
    "HorizonIQ privacy practices — what we collect, what stays on your device, what is stored when you sign in, and the choices you have during the Beta Preview.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="Last updated: July 23, 2026. This policy describes how HorizonIQ handles information during the Beta Preview. We aim to describe our actual practices in plain language."
    >
      <ContentSection title="Overview">
        <p>
          <BrandName /> is committed to transparent data practices. You can use{" "}
          <BrandName /> without an account, in which case your preferences stay on
          your device. If you choose to sign in, we store a small profile so your
          focus follows you across devices. This policy explains both cases, what
          is collected, and the choices you have.
        </p>
      </ContentSection>

      <ContentSection title="Using HorizonIQ with or without an account">
        <p>
          Accounts are <strong className="text-foreground">optional</strong> during
          beta. Without one, your setup and history are held only in your browser.
          If you sign in — by email magic link or Google — we create a profile tied
          to your account so your preferences and saved signals sync across devices.
          Signing in means we hold your email address; see the sections below for
          exactly what is stored.
        </p>
      </ContentSection>

      <ContentSection title="Information stored on our servers (when you sign in)">
        <p>
          When you create an account, we store the following in our database, and
          access is restricted so that each record is readable and writable only by
          the account that owns it:
        </p>
        <ContentList
          items={[
            "Your email address (used to authenticate you and, if you opt in, to send the weekly digest)",
            "Your display name, if you set one",
            "Your role, region, and Intelligence Focus Areas",
            "Signals you follow, and the momentum score at the time you followed them",
            "Your weekly-digest preference (on or off) and a snapshot used to build that email",
          ]}
        />
        <p>
          If you sign in with Google, Google shares a basic identifier and your
          email with us to complete sign-in; we do not receive your Google password.
        </p>
      </ContentSection>

      <ContentSection title="The weekly email digest (opt-in)">
        <p>
          The weekly email digest is <strong className="text-foreground">off by
          default</strong> and is rolling out during beta. If you turn it on, we use
          your account email to send a short brief on the weeks your fields have
          moved. Every email includes a one-click unsubscribe, and you can turn the
          digest off in the product at any time.
        </p>
      </ContentSection>

      <ContentSection title="Feedback you send us">
        <p>
          If you submit feedback, a bug report, or a feature request, we store your
          message and — so we can reproduce and reply — a small amount of technical
          context. This is kept on our servers and is not publicly readable:
        </p>
        <ContentList
          items={[
            "Your message and the type of feedback",
            "Your email address, only if you choose to include it",
            "An optional screenshot, only if you attach one",
            "Technical context: the page you were on, your viewport size, and an anonymous visitor identifier",
          ]}
        />
      </ContentSection>

      <ContentSection title="Information stored on your device">
        <p>
          Whether or not you have an account, some information is kept locally in
          your browser so the product works and remembers where you left off:
        </p>
        <ContentList
          items={[
            "Display name and onboarding progress (localStorage)",
            "Role, region, and Intelligence Focus Areas (localStorage)",
            "Visit snapshot for “What Changed Since Your Last Visit” (localStorage)",
            "Onboarding routing phase (cookie: hziq_ob_v3)",
            "Anonymous analytics visitor and session identifiers (localStorage / sessionStorage)",
          ]}
        />
        <p>
          This on-device data stays on your device unless you clear site data or use
          Start over / Start fresh in the product. When you are signed in, your
          preferences are also mirrored to your profile as described above.
        </p>
      </ContentSection>

      <ContentSection title="Product analytics">
        <p>
          We use privacy-conscious analytics to measure activation, return visits,
          and feature engagement. Analytics events are tied to an anonymous visitor
          identifier, not to your name. If you are signed in, your account email is
          held in your profile and is not merged into these analytics events.
        </p>
        <ContentList
          items={[
            "Vercel Web Analytics and Speed Insights on production deployments",
            "Microsoft Clarity session-replay and heatmaps, when enabled — this can record on-screen interactions on a page, so treat it as more than aggregate counting",
            "PostHog product analytics, when enabled",
            "A local event buffer in your browser for debugging — not synced to a backend today",
          ]}
        />
      </ContentSection>

      <ContentSection title="Service providers">
        <p>
          We rely on a small set of vendors to run <BrandName />. Each processes data
          only to provide their service to us:
        </p>
        <ContentList
          items={[
            "Supabase — authentication and database (your profile, followed signals, and feedback)",
            "Vercel — hosting, plus Web Analytics and Speed Insights",
            "Google — sign-in, if you choose Google as your login method",
            "Resend — delivery of the weekly digest email, if you opt in",
            "Microsoft Clarity and PostHog — product analytics, when enabled",
          ]}
        />
      </ContentSection>

      <ContentSection title="What we do not do">
        <p>
          <BrandName /> does not sell personal information, does not operate an
          advertising business, and does not share identifiable user data with data
          brokers. We do not use advertising pixels or third-party ad networks, and
          our analytics exist to understand how <BrandName /> is used — not to
          profile you for ads.
        </p>
      </ContentSection>

      <ContentSection title="Your choices and rights">
        <p>
          You can review or change your preferences in the product at any time. If
          you have an account, you can ask us to access, correct, or delete the data
          associated with it — deleting your account removes your profile and
          followed signals. To make a request, email us at the address below and we
          will help. Depending on where you live, you may have additional rights
          under laws such as the GDPR or CCPA.
        </p>
      </ContentSection>

      <ContentSection title="Data security">
        <p>
          Access to stored profiles, followed signals, and feedback is restricted by
          database-level rules and server-side credentials. No system is perfectly
          secure, but we limit what we collect and who can read it. If you discover a
          security issue, please contact us with &quot;Security&quot; in the subject
          line.
        </p>
      </ContentSection>

      <ContentSection title="Children">
        <p>
          <BrandName /> is intended for professionals and is not directed to children
          under 16. We do not knowingly collect information from children.
        </p>
      </ContentSection>

      <ContentSection title="Transparent data practices">
        <p>
          <BrandName /> labels data provenance on signals and links to source
          material where available. We believe trust comes from showing evidence —
          not from hiding how intelligence is produced.
        </p>
      </ContentSection>

      <ContentSection title="Changes to this policy">
        <p>
          As <BrandName /> evolves during beta, we may update this policy. When we
          make a material change, we will revise the date above. Continued use after
          an update means you accept the revised policy.
        </p>
      </ContentSection>

      <ContentSection title="Contact">
        <p>
          Privacy questions or data requests:{" "}
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
