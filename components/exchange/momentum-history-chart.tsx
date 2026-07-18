"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type MomentumPoint = {
  date: string; // ISO calendar date, e.g. "2026-07-14"
  value: number; // momentum 0..100
};

type MomentumHistoryChartProps = {
  points: readonly MomentumPoint[];
  className?: string;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Deterministic "Jul 14" — parsed from the ISO string, timezone-independent. */
function formatDate(iso: string): string {
  const [, month, day] = iso.split("-").map(Number);
  if (!month || !day) return iso;
  return `${MONTHS[month - 1]} ${day}`;
}

const VIEW_W = 620;
const VIEW_H = 120;
const PAD_X = 6;
const PAD_Y = 14;

/**
 * Momentum-over-time chart for the Intelligence Brief. Shows a signal's real,
 * dated momentum history — the shape of the move plus when it happened and the
 * net change. Rising reads green, falling amber, flat neutral (same language as
 * the tile sparkline, scaled up). Static SVG: reduced-motion safe. Renders
 * nothing with fewer than two real points, so a thin history never fabricates a
 * trend.
 */
export function MomentumHistoryChart({
  points,
  className,
}: MomentumHistoryChartProps) {
  const gradientId = useId();
  if (points.length < 2) return null;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const flat = max === min;
  const range = max - min || 1;

  const first = points[0];
  const last = points[points.length - 1];
  const netChange = last.value - first.value;

  const tone =
    netChange > 0
      ? "text-success"
      : netChange < 0
        ? "text-warning"
        : "text-muted-foreground";

  const xFor = (i: number) =>
    PAD_X + (i / (points.length - 1)) * (VIEW_W - PAD_X * 2);
  const yFor = (v: number) =>
    flat
      ? VIEW_H / 2
      : VIEW_H - PAD_Y - ((v - min) / range) * (VIEW_H - PAD_Y * 2);

  const coords = points.map((p, i) => ({ x: xFor(i), y: yFor(p.value) }));
  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const end = coords[coords.length - 1];
  const areaPath = `${linePath} L ${end.x.toFixed(1)} ${VIEW_H} L ${coords[0].x.toFixed(1)} ${VIEW_H} Z`;

  const changeLabel =
    netChange > 0 ? `+${netChange}` : netChange < 0 ? `${netChange}` : "no change";
  const direction =
    netChange > 0 ? "rose" : netChange < 0 ? "fell" : "held steady";
  const summary = `Momentum ${direction} from ${first.value} on ${formatDate(
    first.date
  )} to ${last.value} on ${formatDate(last.date)}.`;

  return (
    <figure
      role="group"
      aria-label={summary}
      className={cn("space-y-2", className)}
    >
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Now{" "}
          <span className="font-medium tabular-nums text-foreground">
            {last.value}
          </span>
        </span>
        <span className={cn("text-xs font-medium tabular-nums", tone)}>
          {changeLabel} since {formatDate(first.date)}
        </span>
      </figcaption>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        height={VIEW_H}
        preserveAspectRatio="none"
        className={cn("overflow-visible", tone)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Reference lines at the window high and low — muted, for scale. */}
        {!flat && (
          <g className="text-border" stroke="currentColor" strokeWidth="1" opacity="0.5">
            <line x1={PAD_X} y1={yFor(max)} x2={VIEW_W - PAD_X} y2={yFor(max)} strokeDasharray="3 4" />
            <line x1={PAD_X} y1={yFor(min)} x2={VIEW_W - PAD_X} y2={yFor(min)} strokeDasharray="3 4" />
          </g>
        )}

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={end.x} cy={end.y} r="3.2" fill="currentColor" />
      </svg>

      <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
        <span>{formatDate(first.date)}</span>
        {!flat && (
          <span className="text-muted-foreground/70">
            range {min}–{max}
          </span>
        )}
        <span>{formatDate(last.date)}</span>
      </div>
    </figure>
  );
}
