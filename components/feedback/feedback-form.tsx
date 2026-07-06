"use client";

import { useId, useRef } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { FeedbackTypeSelector } from "@/components/feedback/feedback-type-selector";
import { Button } from "@/components/ui/button";
import {
  FEEDBACK_MESSAGE_MAX_LENGTH,
  FEEDBACK_SCREENSHOT_MAX_BYTES,
} from "@/lib/feedback/constants";
import type { FeedbackFormState } from "@/hooks/useFeedback";

type FeedbackFormProps = {
  form: FeedbackFormState;
  onChange: <K extends keyof FeedbackFormState>(
    key: K,
    value: FeedbackFormState[K]
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
};

export function FeedbackForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: FeedbackFormProps) {
  const messageId = useId();
  const emailId = useId();
  const fileId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    onChange("screenshot", file);
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <FeedbackTypeSelector
        value={form.type}
        onChange={(type) => onChange("type", type)}
        disabled={isSubmitting}
      />

      <div className="space-y-2">
        <label htmlFor={messageId} className="label-caps text-muted-foreground">
          Message <span className="text-warning">*</span>
        </label>
        <textarea
          id={messageId}
          required
          rows={5}
          value={form.message}
          disabled={isSubmitting}
          maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
          placeholder="What happened? What would you like to see improved?"
          className="w-full resize-y rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(event) => onChange("message", event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {form.message.length}/{FEEDBACK_MESSAGE_MAX_LENGTH}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor={emailId} className="label-caps text-muted-foreground">
          Email <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          value={form.email}
          placeholder="you@example.com"
          className="h-11 w-full rounded-lg border border-border/80 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(event) => onChange("email", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={fileId} className="label-caps text-muted-foreground">
          Screenshot <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          ref={fileInputRef}
          id={fileId}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          disabled={isSubmitting}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            handleFileChange(file);
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus />
            Attach image
          </Button>
          {form.screenshot && (
            <div className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/30 px-2.5 py-1.5 text-xs text-muted-foreground">
              <span className="max-w-[12rem] truncate">{form.screenshot.name}</span>
              <button
                type="button"
                className="rounded p-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Remove screenshot"
                onClick={() => {
                  handleFileChange(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          PNG, JPEG, or WEBP · max {(FEEDBACK_SCREENSHOT_MAX_BYTES / (1024 * 1024)).toFixed(0)} MB
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Sending…
            </>
          ) : (
            "Send feedback"
          )}
        </Button>
      </div>
    </form>
  );
}
