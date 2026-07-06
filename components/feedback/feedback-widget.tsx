"use client";

import { FeedbackFab } from "@/components/feedback/feedback-fab";
import { FeedbackModal } from "@/components/feedback/feedback-modal";
import { useFeedback } from "@/hooks/useFeedback";

export function FeedbackWidget() {
  const feedback = useFeedback();

  return (
    <>
      <FeedbackFab onClick={feedback.open} />
      <FeedbackModal feedback={feedback} />
    </>
  );
}
