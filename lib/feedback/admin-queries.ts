/**
 * Future admin dashboard query presets — Sprint 3.95 architecture only.
 * Wire to an admin UI when authentication and roles ship.
 */
import type {
  FeedbackAdminView,
  FeedbackListFilters,
  FeedbackStatus,
  FeedbackType,
} from "@/types/feedback";

export type FeedbackAdminQuery = {
  status?: FeedbackStatus | FeedbackStatus[];
  type?: FeedbackType | FeedbackType[];
  orderBy: "created_at";
  ascending: boolean;
  groupByType?: boolean;
};

export function getAdminQueryForView(
  view: FeedbackAdminView
): FeedbackAdminQuery {
  switch (view) {
    case "newest":
      return { orderBy: "created_at", ascending: false };
    case "open":
      return { status: ["NEW", "OPEN"], orderBy: "created_at", ascending: false };
    case "resolved":
      return { status: "RESOLVED", orderBy: "created_at", ascending: false };
    case "archived":
      return { status: "ARCHIVED", orderBy: "created_at", ascending: false };
    case "feature_requests":
      return {
        type: "feature_request",
        orderBy: "created_at",
        ascending: false,
      };
    case "bug_reports":
      return { type: "bug_report", orderBy: "created_at", ascending: false };
    case "most_requested":
      return {
        type: "feature_request",
        orderBy: "created_at",
        ascending: false,
        groupByType: true,
      };
    default:
      return { orderBy: "created_at", ascending: false };
  }
}

export function describeAdminView(view: FeedbackAdminView): string {
  const labels: Record<FeedbackAdminView, string> = {
    newest: "Newest feedback",
    open: "Open items (NEW + OPEN)",
    resolved: "Resolved",
    archived: "Archived",
    feature_requests: "Feature requests",
    bug_reports: "Bug reports",
    most_requested: "Most requested features (grouped)",
  };
  return labels[view];
}

/** Placeholder for future list API — not implemented in MVP. */
export function buildListFilters(
  view: FeedbackAdminView,
  limit = 50,
  offset = 0
): FeedbackListFilters {
  return { view, limit, offset };
}
