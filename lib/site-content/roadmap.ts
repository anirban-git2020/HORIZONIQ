/** Roadmap timeline data for /roadmap — outward-facing themes only. */

export type RoadmapMilestone = {
  id: string;
  title: string;
  status: "complete" | "current" | "upcoming" | "future";
  items: string[];
};

// Deliberately high-level. No internal sprint names, tools, data sources,
// architecture, or monetization — this page is public.
export const ROADMAP_PHASES: RoadmapMilestone[] = [
  {
    id: "now",
    title: "Now",
    status: "current",
    items: [
      "Personalized, change-first intelligence — what shifted in your fields since your last visit",
      "Clear reasoning behind every signal: what happened, why it matters, and what to do next",
      "An immersive, focused reading experience built for clarity, not noise",
    ],
  },
  {
    id: "next",
    title: "Next",
    status: "upcoming",
    items: [
      "Intelligence that comes to you — a concise periodic digest",
      "Follow-through on the actions you took from earlier briefings",
      "Richer history so you can see how a trend has moved over time",
    ],
  },
  {
    id: "later",
    title: "Later",
    status: "future",
    items: [
      "Broader and deeper coverage across more fields and regions",
      "A more connected view of how signals relate to one another",
      "More ways to make HorizonIQ your own",
    ],
  },
];

export const ROADMAP_NORTH_STAR =
  "Help people understand what is changing, why it matters, and what to do next — before everyone else.";
