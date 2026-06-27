import type { ChangeType, InterestId, RegionId, RoleId } from "@/lib/types";

/** Whether this is the user's first dashboard visit or a return within the week. */
export type VisitType = "first" | "return";

/** Where a signal-detail navigation originated, for the "depth from change" metric. */
export type SignalSource =
  | "change-hero"
  | "change-hero-cta"
  | "watchlist"
  | "dashboard-signals"
  | "signal-detail-related"
  | "direct";

/**
 * Typed event taxonomy for HorizonIQ.
 *
 * Each event maps to one of the MVP success metrics:
 * - onboarding_completed        → onboarding completion rate
 * - dashboard_viewed            → first vs return visit (Week 2 return)
 * - change_hero_viewed          → change hero engagement
 * - signal_detail_viewed (source) → did change drive depth?
 * - *_completed durationMs / timeToValueMs → time to first actionable insight (<60s)
 */
export interface AnalyticsEventProps {
  onboarding_started: Record<string, never>;
  onboarding_role_selected: { role: RoleId };
  onboarding_region_selected: { region: RegionId };
  onboarding_completed: {
    role: RoleId;
    region: RegionId;
    interestCount: number;
    interests: InterestId[];
    durationMs: number | null;
    path: "quick" | "custom";
  };
  dashboard_viewed: {
    visitType: VisitType;
    briefingPeriod: string;
    role: RoleId;
    region: RegionId;
    timeToValueMs: number | null;
  };
  change_hero_viewed: {
    visitType: VisitType;
    briefingPeriod: string;
  };
  signal_click: {
    signalId: string;
    source: SignalSource;
    changeType: ChangeType;
  };
  signal_detail_viewed: {
    signalId: string;
    source: SignalSource;
    changeType: ChangeType;
  };
  start_over: Record<string, never>;
}

export type AnalyticsEventName = keyof AnalyticsEventProps;
