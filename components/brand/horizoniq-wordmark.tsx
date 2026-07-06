import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-[1.05rem]",
  inherit: "",
} as const;

export type HorizonIQWordmarkProps = {
  className?: string;
  size?: keyof typeof SIZE_CLASSES;
  /**
   * When true, Horizon uses foreground on light theme and white on dark.
   * When false, Horizon is always white (for dark hero surfaces).
   */
  adaptive?: boolean;
  /** Both parts use current text color (e.g. primary button label). */
  monochrome?: boolean;
};

/** Consistent HorizonIQ lockup: Horizon + IQ (#00c5ff). */
export function HorizonIQWordmark({
  className,
  size = "lg",
  adaptive = true,
  monochrome = false,
}: HorizonIQWordmarkProps) {
  return (
    <span
      className={cn(
        "font-heading font-semibold tracking-[-0.02em]",
        SIZE_CLASSES[size],
        className
      )}
      aria-label="HorizonIQ"
    >
      <span
        className={cn(
          monochrome
            ? "text-current"
            : adaptive
              ? "text-foreground dark:text-brand-horizon"
              : "text-brand-horizon"
        )}
      >
        Horizon
      </span>
      <span className={cn(monochrome ? "text-current" : "text-brand-iq")}>IQ</span>
    </span>
  );
}

/** Inline brand name for prose and buttons — inherits parent text size. */
export function BrandName({
  className,
  adaptive = true,
  monochrome = false,
}: {
  className?: string;
  adaptive?: boolean;
  monochrome?: boolean;
}) {
  return (
    <HorizonIQWordmark
      size="inherit"
      adaptive={adaptive}
      monochrome={monochrome}
      className={cn("inline", className)}
    />
  );
}
