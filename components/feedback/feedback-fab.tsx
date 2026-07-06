"use client";

import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedbackFabProps = {
  onClick: () => void;
  className?: string;
};

export function FeedbackFab({ onClick, className }: FeedbackFabProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "fixed z-[90] h-12 gap-2 rounded-full px-4 shadow-premium",
        "bottom-[max(1rem,env(safe-area-inset-bottom))] right-4",
        "sm:bottom-6 sm:right-6 sm:px-5",
        className
      )}
      aria-haspopup="dialog"
    >
      <MessageSquareText className="h-4 w-4" />
      <span className="text-sm font-medium">Feedback</span>
    </Button>
  );
}
