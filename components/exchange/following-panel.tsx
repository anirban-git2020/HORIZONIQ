"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";

import { useFollowedSignals } from "@/components/exchange/followed-signals-provider";
import { getSignalRepository } from "@/lib/domain/live-repository";
import { cn } from "@/lib/utils";

type FollowedRow = {
  signalId: string;
  title: string;
  delta: number;
  current: number;
  followedAt: string;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Deterministic "Jul 14" from an ISO timestamp. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/**
 * "You're following" — the follow-through loop. For each followed signal it shows
 * how its momentum has moved since the user followed it (real delta from the
 * captured baseline). Signed-in only; hidden when nothing is followed.
 */
export function FollowingPanel({ className }: { className?: string }) {
  const { followed, unfollow, signedIn } = useFollowedSignals();

  const rows = useMemo<FollowedRow[]>(() => {
    const repo = getSignalRepository();
    const out: FollowedRow[] = [];
    for (const record of followed.values()) {
      const signal = repo.getById(record.signalId);
      if (!signal) continue; // signal retired / not in current dataset
      const current = Math.round(signal.momentum.momentumScore);
      out.push({
        signalId: record.signalId,
        title: signal.identity.title,
        current,
        delta: current - record.momentumAtFollow,
        followedAt: record.followedAt,
      });
    }
    return out.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  }, [followed]);

  if (!signedIn || rows.length === 0) return null;

  return (
    <section
      aria-label="Signals you're following"
      className={cn(
        "mx-auto w-full max-w-[1500px] px-6 pb-4 md:pb-6",
        className
      )}
    >
      <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-md md:p-7">
        <p className="label-caps text-primary">You&apos;re following</p>
        <p className="mt-2 text-sm text-muted-foreground">
          How your followed signals have moved since you acted on them.
        </p>

        <ul className="mt-5 divide-y divide-border/40">
          {rows.map((row) => {
            const tone =
              row.delta > 0
                ? "text-success"
                : row.delta < 0
                  ? "text-warning"
                  : "text-muted-foreground";
            const Icon =
              row.delta > 0
                ? ArrowUpRight
                : row.delta < 0
                  ? ArrowDownRight
                  : null;
            const value =
              row.delta > 0 ? `+${row.delta}` : row.delta < 0 ? `${row.delta}` : "0";
            return (
              <li
                key={row.signalId}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Followed {formatDate(row.followedAt)} · now {row.current}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-semibold tabular-nums",
                      tone
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                    {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => unfollow(row.signalId)}
                    aria-label={`Unfollow ${row.title}`}
                    className="rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
