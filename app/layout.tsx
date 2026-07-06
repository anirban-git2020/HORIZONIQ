import type { Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { JsonLd } from "@/components/seo/json-ld";
import { PreferencesProvider } from "@/lib/preferences";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { OnboardingBootstrap } from "@/components/onboarding/onboarding-bootstrap";
import { ONBOARDING_COOKIE_INIT_SCRIPT } from "@/components/onboarding/onboarding-cookie-init";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";
import { ScrollToTop } from "@/components/navigation/scroll-to-top";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = defaultMetadata;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F6F8" },
    { media: "(prefers-color-scheme: dark)", color: "#06080F" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`} suppressHydrationWarning>
      <head>
        <JsonLd />
        <script dangerouslySetInnerHTML={{ __html: ONBOARDING_COOKIE_INIT_SCRIPT }} />
      </head>
      <body
        className="min-h-dvh bg-background font-sans text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <PreferencesProvider>
            <OnboardingBootstrap>
              <ScrollToTop />
              {children}
              <FeedbackWidget />
            </OnboardingBootstrap>
          </PreferencesProvider>
          <AnalyticsProvider />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
