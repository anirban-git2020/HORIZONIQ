/** User-facing product copy (Sprint 3A+). */

export const TAGLINE_LINES = ["Observe.", "Predict.", "Lead."] as const;

export const BETA_PREVIEW_LABEL = "Beta Preview";

export const WELCOME_HEADLINE = "Welcome to HorizonIQ";

export const LANDING_HERO_HEADLINE =
  "See what is changing before everyone else does.";

export const INTELLIGENCE_FOCUS_AREAS_LABEL = "Intelligence Focus Areas";

/** Compact label for onboarding step progress (step 3). */
export const ONBOARDING_STEP_FOCUS_AREAS_LABEL = "Focus Areas";

export const ADJUST_FOCUS_AREAS_LABEL = "Adjust Intelligence Focus Areas";

export const STORY_ACTS = {
  changed: "What changed",
  matters: "Why it matters",
  action: "What to do",
} as const;

export type StoryAct = keyof typeof STORY_ACTS;
