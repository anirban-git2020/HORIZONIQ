export type TimeOfDayPeriod = "morning" | "afternoon" | "evening";

export function getTimeOfDayPeriod(date = new Date()): TimeOfDayPeriod {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function getTimeOfDayGreeting(date = new Date()): string {
  const period = getTimeOfDayPeriod(date);
  if (period === "morning") return "Good Morning";
  if (period === "afternoon") return "Good Afternoon";
  return "Good Evening";
}

import { LANDING_HERO_HEADLINE } from "@/lib/copy";

export function formatPersonalizedGreeting(displayName: string, date = new Date()): {
  salutation: string;
  headline: string;
  subline: string;
} {
  const firstName = displayName.trim().split(/\s+/)[0] ?? displayName;
  return {
    salutation: `${getTimeOfDayGreeting(date)}, ${firstName}.`,
    headline: LANDING_HERO_HEADLINE,
    subline: "Let's build your personal intelligence profile.",
  };
}
