/** Official release history for /changelog (Sprint 3.9). */

export type ChangelogEntry = {
  version: string;
  date: string;
  improvements: string[];
  fixes: string[];
  upcoming?: string[];
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "Beta Preview v0.1",
    date: "2026-07-06",
    improvements: [
      "Sprint 4A product analytics — Vercel Analytics, Speed Insights, anonymous visitor tracking",
      "Provider-agnostic analytics abstraction with typed product events",
      "Weekly pipeline deploy hardening — registry sync and build verification in CI",
      "Briefing period W28 with live five-source pipeline refresh",
    ],
    fixes: [
      "Weekly briefing Vercel deploy failures when briefings registry was not committed",
      "Week rollover bug when loading prior-week briefing data",
    ],
    upcoming: [
      "Week 2 return measurement funnels",
      "Guided tour step 4 spotlight reliability",
      "Shared WebGL canvas for Living Intelligence Core",
    ],
  },
  {
    version: "MVP V1.1 — Sprint 3C",
    date: "2026-06-27",
    improvements: [
      "Living Intelligence Core — data-reactive WebGL particle field",
      "Welcome phased experience with core reveal",
      "Ambient intelligence field on landing, dashboard, and signal detail",
      "CSS fallback for prefers-reduced-motion",
    ],
    fixes: [],
  },
  {
    version: "MVP V1.1 — Sprint 3B",
    date: "2026-06-27",
    improvements: [
      "Premium dark-first visual system — Outfit + Inter typography",
      "Beta Preview badge and Observe · Predict · Lead tagline lockup",
      "Calmer surfaces with hairline dividers and refined motion tokens",
    ],
    fixes: [],
  },
  {
    version: "MVP V1.1 — Sprint 3A",
    date: "2026-06-27",
    improvements: [
      "Story-driven dashboard — What changed → Why it matters → What to do",
      "Progressive disclosure for supporting intelligence",
      "Intelligence Focus Areas label across onboarding and dashboard",
    ],
    fixes: [],
  },
  {
    version: "MVP V1.1 — Intelligence Layer",
    date: "2026-06-27",
    improvements: [
      "IntelligenceCard seven-section analyst contract",
      "What Changed Since Your Last Visit hero with visit snapshot",
      "Live five-source data pipeline (Hacker News, arXiv, Wikimedia, GitHub, Product Hunt)",
      "Premium first-time onboarding with guided tour",
      "Cookie + middleware onboarding with auto-repair",
    ],
    fixes: [
      "Stale onboarding cookie mid-flow self-heal on every page load",
    ],
  },
];
