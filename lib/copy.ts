/** User-facing product copy (Sprint 3A). */

export const INTELLIGENCE_FOCUS_AREAS_LABEL = "Intelligence Focus Areas";

export const ADJUST_FOCUS_AREAS_LABEL = "Adjust Intelligence Focus Areas";

export const STORY_ACTS = {
  changed: "What changed",
  matters: "Why it matters",
  action: "What to do",
} as const;

export type StoryAct = keyof typeof STORY_ACTS;
