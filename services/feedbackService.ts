import {
  FEEDBACK_MESSAGE_MAX_LENGTH,
  FEEDBACK_MESSAGE_MIN_LENGTH,
  FEEDBACK_SCREENSHOT_MAX_BYTES,
  FEEDBACK_SCREENSHOT_MIME_TYPES,
} from "@/lib/feedback/constants";
import type { FeedbackSubmission, FeedbackSubmitResult } from "@/types/feedback";
import { FEEDBACK_TYPES } from "@/types/feedback";

export type SubmitFeedbackInput = FeedbackSubmission & {
  screenshot?: File | null;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateFeedbackInput(input: SubmitFeedbackInput): string | null {
  if (!FEEDBACK_TYPES.includes(input.type)) {
    return "Please select a feedback type.";
  }

  const message = input.message.trim();
  if (message.length < FEEDBACK_MESSAGE_MIN_LENGTH) {
    return `Message must be at least ${FEEDBACK_MESSAGE_MIN_LENGTH} characters.`;
  }
  if (message.length > FEEDBACK_MESSAGE_MAX_LENGTH) {
    return `Message must be under ${FEEDBACK_MESSAGE_MAX_LENGTH} characters.`;
  }

  if (input.email?.trim()) {
    if (!isValidEmail(input.email.trim())) {
      return "Please enter a valid email address.";
    }
  }

  const file = input.screenshot;
  if (file) {
    if (
      !FEEDBACK_SCREENSHOT_MIME_TYPES.includes(
        file.type as (typeof FEEDBACK_SCREENSHOT_MIME_TYPES)[number]
      )
    ) {
      return "Screenshot must be PNG, JPEG, or WEBP.";
    }
    if (file.size > FEEDBACK_SCREENSHOT_MAX_BYTES) {
      return "Screenshot must be 5 MB or smaller.";
    }
  }

  return null;
}

/** Client-side submit — posts to /api/feedback. */
export async function submitFeedback(
  input: SubmitFeedbackInput
): Promise<FeedbackSubmitResult> {
  const validationError = validateFeedbackInput(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const formData = new FormData();
  formData.set("type", input.type);
  formData.set("message", input.message.trim());
  if (input.email?.trim()) {
    formData.set("email", input.email.trim());
  }
  formData.set("metadata", JSON.stringify(input.metadata));
  if (input.screenshot) {
    formData.set("screenshot", input.screenshot);
  }

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as
      | { id: string }
      | { error: string };

    if (!response.ok) {
      return {
        ok: false,
        error: "error" in payload ? payload.error : "Unable to send feedback.",
      };
    }

    if (!("id" in payload)) {
      return { ok: false, error: "Unexpected response from server." };
    }

    return { ok: true, id: payload.id };
  } catch {
    return {
      ok: false,
      error: "Network error. Check your connection and try again.",
    };
  }
}
