/** Sprint 3.95 — Feedback system types (client + server + future admin). */

export const FEEDBACK_TYPES = [
  "bug_report",
  "feature_request",
  "improvement",
  "question",
  "general_feedback",
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const FEEDBACK_STATUSES = [
  "NEW",
  "OPEN",
  "RESOLVED",
  "ARCHIVED",
] as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export type FeedbackMetadata = {
  timestamp: string;
  visitorId: string | null;
  sessionId: string | null;
  url: string;
  page: string;
  appVersion: string;
  browser: string;
  operatingSystem: string;
  viewportWidth: number;
  viewportHeight: number;
  screenWidth: number;
  screenHeight: number;
  role: string | null;
  region: string | null;
  interests: string[];
};

export type FeedbackSubmission = {
  type: FeedbackType;
  message: string;
  email?: string | null;
  metadata: FeedbackMetadata;
};

export type FeedbackRecord = FeedbackSubmission & {
  id: string;
  screenshotUrl: string | null;
  status: FeedbackStatus;
  createdAt: string;
};

/** Future admin dashboard views — query presets only, no UI yet. */
export type FeedbackAdminView =
  | "newest"
  | "open"
  | "resolved"
  | "archived"
  | "feature_requests"
  | "bug_reports"
  | "most_requested";

export type FeedbackListFilters = {
  view: FeedbackAdminView;
  limit?: number;
  offset?: number;
};

export type FeedbackSubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string };
