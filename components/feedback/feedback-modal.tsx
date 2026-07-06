"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { FeedbackForm } from "@/components/feedback/feedback-form";
import { FeedbackSuccess } from "@/components/feedback/feedback-success";
import { Button } from "@/components/ui/button";
import type { useFeedback } from "@/hooks/useFeedback";
import { DURATION_NORMAL, EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FeedbackModalProps = {
  feedback: ReturnType<typeof useFeedback>;
};

export function FeedbackModal({ feedback }: FeedbackModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (feedback.isOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    }

    if (!feedback.isOpen && dialog.open) {
      dialog.close();
    }
  }, [feedback.isOpen]);

  const handleClose = () => {
    feedback.close();
    feedback.reset();
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "fixed inset-0 z-[100] m-0 h-dvh max-h-dvh w-full max-w-none",
        "border-0 bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        "open:flex open:items-end open:justify-center sm:open:items-center"
      )}
      aria-labelledby="feedback-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClose={handleClose}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close feedback dialog"
        onClick={handleClose}
      />

      <AnimatePresence>
        {feedback.isOpen && (
          <motion.div
            role="document"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: DURATION_NORMAL, ease: EASE_PREMIUM }}
            className={cn(
              "relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col",
              "overflow-hidden rounded-t-2xl border border-border/70 bg-background shadow-premium",
              "sm:rounded-2xl"
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6">
              <div>
                <p className="label-caps text-muted-foreground">Beta Preview</p>
                <h2 id="feedback-modal-title" className="section-title text-xl">
                  {feedback.isSuccess ? "Feedback received" : "Send feedback"}
                </h2>
                {!feedback.isSuccess && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No email required. Under 30 seconds.
                  </p>
                )}
              </div>
              <Button
                ref={closeButtonRef}
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="Close"
                onClick={handleClose}
              >
                <X />
              </Button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {feedback.isSuccess ? (
                <FeedbackSuccess onClose={handleClose} />
              ) : (
                <FeedbackForm
                  form={feedback.form}
                  onChange={feedback.updateField}
                  onSubmit={feedback.submit}
                  onCancel={handleClose}
                  isSubmitting={feedback.isSubmitting}
                  error={feedback.error}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
