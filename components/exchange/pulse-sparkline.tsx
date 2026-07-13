"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type PulseSparklineProps = {
  points: readonly number[];
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Momentum sparkline — a minimal area chart of a signal's momentum history
 * (Apple Stocks inspired, no axes). Rising series read green, falling red, flat
 * neutral. A soft area fill anchors it as a chart rather than a stray line.
 */
export function PulseSparkline({
  points,
  className,
  width = 80,
  height = 28,
}: PulseSparklineProps) {
  const gradientId = useId();
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const flat = max === min;
  const range = max - min || 1;
  const pad = 3;

  const coords = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = flat
      ? height / 2
      : height - pad - ((value - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const linePath = coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  const first = coords[0];
  const last = coords[coords.length - 1];
  const areaPath = `${linePath} L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z`;

  // trend direction over the window
  const delta = points[points.length - 1] - points[0];
  const tone =
    delta > 0 ? "text-success" : delta < 0 ? "text-warning" : "text-muted-foreground";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0", tone, className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx={last.x} cy={last.y} r="2.1" fill="currentColor" />
    </svg>
  );
}
