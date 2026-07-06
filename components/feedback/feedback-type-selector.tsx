"use client";

import { cn } from "@/lib/utils";
import { FEEDBACK_TYPE_LABELS } from "@/lib/feedback/constants";
import type { FeedbackType } from "@/types/feedback";
import { FEEDBACK_TYPES } from "@/types/feedback";

type FeedbackTypeSelectorProps = {
  value: FeedbackType;
  onChange: (type: FeedbackType) => void;
  disabled?: boolean;
};

export function FeedbackTypeSelector({
  value,
  onChange,
  disabled = false,
}: FeedbackTypeSelectorProps) {
  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="label-caps text-muted-foreground">Feedback type</legend>
      <div
        className="grid gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Feedback type"
      >
        {FEEDBACK_TYPES.map((type) => {
          const selected = value === type;
          return (
            <label
              key={type}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                selected
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border/70 bg-secondary/20 text-muted-foreground hover:border-border hover:text-foreground",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <input
                type="radio"
                name="feedback-type"
                value={type}
                checked={selected}
                onChange={() => onChange(type)}
                className="sr-only"
              />
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-primary" : "border-border"
                )}
                aria-hidden="true"
              >
                {selected && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </span>
              {FEEDBACK_TYPE_LABELS[type]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
