"use client";

import { motion } from "framer-motion";

import { TaglineLockup } from "@/components/brand/tagline-lockup";
import { Button } from "@/components/ui/button";
import { EASE_PREMIUM } from "@/lib/motion";

type FeedbackSuccessProps = {
  onClose: () => void;
};

export function FeedbackSuccess({ onClose }: FeedbackSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      className="flex flex-col items-center px-2 py-6 text-center"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
        <span className="text-lg text-primary" aria-hidden="true">
          ✓
        </span>
      </div>
      <h3 className="section-title text-2xl">Thank you.</h3>
      <p className="prose-lead mt-3 max-w-sm text-muted-foreground">
        Your feedback helps shape the future of HorizonIQ.
      </p>
      <div className="mt-8">
        <TaglineLockup size="sm" />
      </div>
      <Button className="mt-8 min-w-[140px]" onClick={onClose}>
        Done
      </Button>
    </motion.div>
  );
}
