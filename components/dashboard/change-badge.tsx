import { cn } from "@/lib/utils";
import type { ChangeType, DemandChange, GrowthChange } from "@/lib/types";

type BadgeChangeType = ChangeType | DemandChange | GrowthChange;

const CONFIG: Record<
  BadgeChangeType,
  { label: string; variant: "primary" | "success" | "warning" | "muted" }
> = {
  new: { label: "New", variant: "primary" },
  rising: { label: "Rising", variant: "success" },
  falling: { label: "Cooling", variant: "warning" },
  stable: { label: "Stable", variant: "muted" },
};

export function ChangeBadge({
  type,
  className,
}: {
  type: BadgeChangeType;
  className?: string;
}) {
  const config = CONFIG[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.variant === "primary" &&
          "border-primary/25 bg-primary/10 text-primary",
        config.variant === "success" &&
          "border-success/25 bg-success/10 text-success",
        config.variant === "warning" &&
          "border-warning/25 bg-warning/10 text-warning",
        config.variant === "muted" &&
          "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function DeltaIndicator({
  delta,
  label,
}: {
  delta: number;
  label: string;
}) {
  if (delta === 0) return null;
  const positive = delta > 0;
  return (
    <span
      className={cn(
        "text-xs font-medium tabular-nums",
        positive ? "text-success" : "text-warning"
      )}
    >
      {positive ? "↑" : "↓"}
      {Math.abs(delta)} {label}
    </span>
  );
}
