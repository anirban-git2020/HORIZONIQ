import type { FeedbackType } from "@/types/feedback";

export const FEEDBACK_SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024;

export const FEEDBACK_SCREENSHOT_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const FEEDBACK_STORAGE_BUCKET =
  process.env.SUPABASE_FEEDBACK_BUCKET ?? "feedback-screenshots";

export const FEEDBACK_TYPE_LABELS: Record<FeedbackType, string> = {
  bug_report: "Bug Report",
  feature_request: "Feature Request",
  improvement: "Improvement",
  question: "Question",
  general_feedback: "General Feedback",
};

export const FEEDBACK_MESSAGE_MIN_LENGTH = 8;
export const FEEDBACK_MESSAGE_MAX_LENGTH = 4000;
