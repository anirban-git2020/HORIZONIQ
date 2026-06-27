import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

import { PreferencesProvider } from "@/lib/preferences";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { ScrollToTop } from "@/components/navigation/scroll-to-top";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "HorizonIQ — Observe. Predict. Lead.",
  description:
    "Understand what is changing in the world, why it matters, and what action to take next.",
};

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
      <body
        className="min-h-dvh bg-background font-sans text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <PreferencesProvider>
            <ScrollToTop />
            {children}
          </PreferencesProvider>
          <AnalyticsProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
