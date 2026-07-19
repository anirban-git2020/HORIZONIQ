"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Sparkle, X } from "lucide-react";

import type { DigestMover, VisitChanges } from "@/hooks/use-visit-changes";
import { cn } from "@/lib/utils";

const MAX_MOVERS = 6;

/** Deterministic, client-only relative time — the panel never server-renders. */
function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 60) return "earlier today";
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs <= 1 ? "an hour ago" : `${hrs} hours ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return weeks <= 1 ? "last week" : `${weeks} weeks ago`;
}

function MoverRow({ mover }: { mover: DigestMover }) {
  const tone =
    mover.bucket === "rising"
      ? "text-success"
      : mover.bucket === "falling"
        ? "text-warning"
        : "text-primary";
  const Icon =
    mover.bucket === "rising"
      ? ArrowUpRight
      : mover.bucket === "falling"
        ? ArrowDownRight
        : Sparkle;
  const value =
    mover.bucket === "new"
      ? "New"
      : mover.delta > 0
        ? `+${mover.delta}`
        : `${mover.delta}`;

  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <span className="flex items-center gap-2.5 text-sm text-foreground/90">
        <Icon className={cn("h-4 w-4 shrink-0", tone)} aria-hidden="true" />
        {mover.title}
      </span>
      <span className={cn("text-sm font-semibold tabular-nums", tone)}>
        {value}
      </span>
    </li>
  );
}

/**
 * "Since your last visit" — the in-app digest. Renders only on a genuine return
 * visit; leads with what moved, then a moved/steady tally. Restrained, editorial,
 * session-dismissible. Data comes from the unified visit-change engine.
 */
export function DigestPanel({
  changes,
  className,
}: {
  changes: VisitChanges;
  className?: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  const { movers, steadyCount, lastVisitAt, isReturn } = changes;
  const hasMovement = movers.length > 0;

  // Nothing to say on a first visit, or when there's no prior baseline.
  if (dismissed || !isReturn || (!hasMovement && steadyCount === 0)) return null;

  const when = relativeTime(lastVisitAt);
  const shown = movers.slice(0, MAX_MOVERS);
  const extra = movers.length - shown.length;

  return (
    <section
      aria-label="What changed since your last visit"
      className={cn(
        "relative rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-md md:p-7",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="label-caps text-primary">Since your last visit</p>

      {hasMovement ? (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            {movers.length} {movers.length === 1 ? "field" : "fields"} moved
            {steadyCount > 0 ? ` · ${steadyCount} held steady` : ""}
            {when ? ` · ${when}` : ""}
          </p>
          <ul className="mt-4 divide-y divide-border/40">
            {shown.map((mover) => (
              <MoverRow key={mover.id} mover={mover} />
            ))}
          </ul>
          {extra > 0 && (
            <p className="mt-3 text-xs text-muted-foreground/80">
              +{extra} more {extra === 1 ? "field" : "fields"} moved
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Nothing has moved in your fields{when ? ` since ${when}` : ""}. All{" "}
          {steadyCount} held steady.
        </p>
      )}
    </section>
  );
}
