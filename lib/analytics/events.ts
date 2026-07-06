import type { ChangeType, InterestId, RegionId, RoleId } from "@/lib/types";

/** Whether this is the user's first dashboard visit or a return within the week. */
export type VisitType = "first" | "return";

/** Where a signal navigation originated, for depth-from-change metrics. */
export type SignalSource =
  | "change-hero"
  | "change-hero-cta"
  | "watchlist"
  | "dashboard-signals"
  | "signal-detail-related"
  | "direct";

export type OnboardingPath = "quick" | "custom";

export type SignalSurface = "card" | "detail" | "watchlist" | "hero";

/**
 * Sprint 4A product event taxonomy.
 *
 * Privacy: never include emails, passwords, or raw search queries.
 * All events are anonymous and product-scoped.
 */
export interface AnalyticsEventProps {
  app_opened: {
    path: string;
    referrer: string;
  };
  guided_tour_started: {
    stepsTotal: number;
  };
  guided_tour_skipped: {
    stepsCompleted: number;
  };
  guided_tour_completed: {
    stepsCompleted: number;
  };
  role_selected: {
    role: RoleId;
    surface: "onboarding";
  };
  region_selected: {
    region: RegionId;
    surface: "onboarding";
  };
  interest_selected: {
    interestCount: number;
    interests: InterestId[];
    path: OnboardingPath;
  };
  /** Profile + focus areas complete — activation funnel. */
  onboarding_completed: {
    role: RoleId;
    region: RegionId;
    interestCount: number;
    interests: InterestId[];
    durationMs: number | null;
    path: OnboardingPath;
  };
  dashboard_loaded: {
    visitType: VisitType;
    briefingPeriod: string;
    role: RoleId;
    region: RegionId;
    timeToValueMs: number | null;
  };
  return_visit: {
    briefingPeriod: string;
    daysSinceLastVisit: number | null;
  };
  /** Retention metric — user saw the change hero in view. */
  change_hero_viewed: {
    visitType: VisitType;
    briefingPeriod: string;
  };
  /** Infrastructure — wire when search ships. Never include query text. */
  search_executed: {
    resultCount: number;
  };
  signal_opened: {
    signalId: string;
    source: SignalSource;
    changeType: ChangeType;
    surface: SignalSurface;
  };
  /** Infrastructure — wire when recommendations become interactive. */
  recommendation_opened: {
    recommendationId: string;
    source: string;
  };
  /** Infrastructure — wire when outlook section becomes expandable. */
  forecast_opened: {
    signalId: string;
  };
  briefing_expanded: {
    section: string;
  };
  cta_clicked: {
    cta: string;
    surface: string;
  };
  footer_link_clicked: {
    link: string;
    surface: string;
  };
}

export type AnalyticsEventName = keyof AnalyticsEventProps;
