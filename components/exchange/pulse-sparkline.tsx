import { cn } from "@/lib/utils";

type PulseSparklineProps = {
  points: readonly number[];
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Minimal trend sparkline — Apple Stocks inspired, no axes or gridlines.
 */
export function PulseSparkline({
  points,
  className,
  width = 80,
  height = 28,
}: PulseSparklineProps) {
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 2;

  const coords = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - pad - ((value - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const linePath = coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  const last = coords[coords.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0 text-foreground/35", className)}
      aria-hidden="true"
    >
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="2"
        className="fill-primary/60"
      />
    </svg>
  );
}
