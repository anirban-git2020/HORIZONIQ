import { BETA_PREVIEW_LABEL } from "@/lib/copy";
import { cn } from "@/lib/utils";

export function BetaBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "label-caps inline-flex items-center rounded-md border border-border/80",
        "bg-muted/40 px-2.5 py-1 text-[9px] tracking-[0.16em] text-muted-foreground",
        className
      )}
    >
      {BETA_PREVIEW_LABEL}
    </span>
  );
}
