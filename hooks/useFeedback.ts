"use client";

import { useCallback, useMemo, useState } from "react";

import { collectFeedbackMetadata } from "@/lib/feedback/metadata";
import { usePreferences } from "@/lib/preferences";
import {
  submitFeedback,
  validateFeedbackInput,
  type SubmitFeedbackInput,
} from "@/services/feedbackService";
import type { FeedbackType } from "@/types/feedback";

export type FeedbackFormState = {
  type: FeedbackType;
  message: string;
  email: string;
  screenshot: File | null;
};

export type FeedbackUiStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM: FeedbackFormState = {
  type: "general_feedback",
  message: "",
  email: "",
  screenshot: null,
};

export function useFeedback() {
  const { preferences } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FeedbackFormState>(INITIAL_FORM);
  const [status, setStatus] = useState<FeedbackUiStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const metadata = useMemo(
    () => collectFeedbackMetadata(preferences),
    [preferences, isOpen]
  );

  const open = useCallback(() => {
    setIsOpen(true);
    setStatus("idle");
    setError(null);
    setSubmittedId(null);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setStatus("idle");
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setForm(INITIAL_FORM);
    setStatus("idle");
    setError(null);
    setSubmittedId(null);
  }, []);

  const updateField = useCallback(
    <K extends keyof FeedbackFormState>(key: K, value: FeedbackFormState[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      if (status === "error") {
        setError(null);
      }
    },
    [status]
  );

  const submit = useCallback(async () => {
    const payload: SubmitFeedbackInput = {
      type: form.type,
      message: form.message,
      email: form.email || null,
      screenshot: form.screenshot,
      metadata: collectFeedbackMetadata(preferences),
    };

    const validationError = validateFeedbackInput(payload);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError(null);

    const result = await submitFeedback(payload);

    if (!result.ok) {
      setError(result.error);
      setStatus("error");
      return;
    }

    setSubmittedId(result.id);
    setStatus("success");
    setForm(INITIAL_FORM);
  }, [form, preferences]);

  return {
    isOpen,
    open,
    close,
    reset,
    form,
    updateField,
    submit,
    status,
    error,
    submittedId,
    metadata,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
  };
}
