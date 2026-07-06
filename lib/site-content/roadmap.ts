/** Roadmap timeline data for /roadmap (Sprint 3.9). */

export type RoadmapMilestone = {
  id: string;
  title: string;
  status: "complete" | "current" | "upcoming" | "future";
  items: string[];
};

export const ROADMAP_PHASES: RoadmapMilestone[] = [
  {
    id: "phase-0",
    title: "Phase 0 — Foundation",
    status: "complete",
    items: [
      "Product vision and positioning",
      "User personas and design principles",
      "Role-first onboarding flow",
      "Initial dashboard shell",
    ],
  },
  {
    id: "phase-1",
    title: "Phase 1 — MVP V1.1: Change-First",
    status: "current",
    items: [
      "What Changed Since Your Last Visit intelligence layer",
      "Seven-section IntelligenceCard analyst contract",
      "Living Intelligence Core immersive experience",
      "Live five-source weekly briefing pipeline",
      "Product analytics foundation (Sprint 4A)",
      "Brand, legal, and trust pages (Sprint 3.9)",
      "Trust interaction analytics",
      "PostHog retention funnels",
    ],
  },
  {
    id: "phase-2",
    title: "Phase 2 — Retention & Habit",
    status: "upcoming",
    items: [
      "Email weekly digest",
      "Action follow-up from prior briefings",
      "Expanded signal library with change history",
      "Display name identity loop on dashboard",
      "A/B test change hero formats",
    ],
  },
  {
    id: "phase-3",
    title: "Phase 3 — Live Data Expansion",
    status: "future",
    items: [
      "Job board integrations",
      "Patent and funding data sources",
      "Automated change detection beyond weekly cadence",
      "Real momentum and confidence scoring at scale",
    ],
  },
  {
    id: "phase-4",
    title: "Phase 4 — Platform Expansion",
    status: "future",
    items: [
      "User accounts and saved preferences",
      "Premium intelligence tier",
      "Enterprise API and white-label",
      "Living Intelligence Network relationship graphs",
    ],
  },
];

export const ROADMAP_NORTH_STAR =
  "Help people understand what is changing, why it matters, and what to do next — before everyone else.";
