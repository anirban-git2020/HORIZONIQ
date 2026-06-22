import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";

import { PreferencesProvider } from "@/lib/preferences";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HorizonIQ — Observe. Predict. Lead.",
  description:
    "Understand what is changing in the world, why it matters, and what action to take next.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F1E" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <ThemeProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
