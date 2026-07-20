/** Roadmap timeline data for /roadmap — outward-facing themes only. */

export type RoadmapMilestone = {
  id: string;
  title: string;
  status: "complete" | "current" | "upcoming" | "future";
  items: string[];
};

// Deliberately high-level and brief. No internal sprint names, tools, data
// sources, architecture, or monetization — this page is public.
export const ROADMAP_PHASES: RoadmapMilestone[] = [
  {
    id: "now",
    title: "Now",
    status: "current",
    items: [
      "Personalized, change-first intelligence — what shifted in your fields since your last visit",
      "Clear reasoning behind every signal, with a trend you can watch over time",
      "Your focus, synced across every device you sign in on",
    ],
  },
  {
    id: "next",
    title: "Next",
    status: "upcoming",
    items: [
      "A weekly email digest that comes to you",
      "Follow-through on the actions you take from a briefing",
    ],
  },
  {
    id: "later",
    title: "Later",
    status: "future",
    items: [
      "A connected view of how signals relate to one another",
      "More ways to make HorizonIQ your own",
    ],
  },
];

export const ROADMAP_NORTH_STAR =
  "Help people understand what is changing, why it matters, and what to do next — before everyone else.";
