/**
 * HorizonIQ Motion Language v1.0 — Epic 8
 * Single source of timing values. Prefer CSS classes from globals.css in UI.
 */

export const MOTION_EASE = "ease-out" as const;

export const MOTION_DURATION_FAST_MS = 120;
export const MOTION_DURATION_MEDIUM_MS = 180;
export const MOTION_DURATION_SLOW_MS = 260;

export const MOTION_STAGGER_MS = 40;
export const MOTION_STAGGER_MAX_MS = 320;

export const MOTION_LIFT_PX = 2;
export const MOTION_CTA_SHIFT_PX = 4;

/** Reusable class names — defined in app/globals.css */
export const MOTION_CLASS = {
  button: "hq-motion-btn",
  signal: "hq-motion-signal",
  signalHeadline: "hq-motion-signal-headline",
  signalMomentum: "hq-motion-signal-momentum",
  signalCta: "hq-motion-signal-cta",
  heroEnter: "hq-motion-hero-enter",
  featuredEnter: "hq-motion-featured-enter",
  signalEnter: "hq-motion-signal-enter",
  signalsRevealed: "hq-motion-signals-revealed",
} as const;

/** Stagger delay for signal tile entrance (capped at 320ms). */
export function motionStaggerDelay(index: number): { animationDelay: string } {
  const delay = Math.min(index * MOTION_STAGGER_MS, MOTION_STAGGER_MAX_MS);
  return { animationDelay: `${delay}ms` };
}
