import { cn } from "@/lib/utils";
import { MOTION_CLASS } from "@/lib/motion-language";

const METRICS = [
  { label: "Confidence", value: "94%" },
  { label: "Velocity", value: "▲▲▲" },
  { label: "Forecast", value: "Very Strong" },
  { label: "Evidence", value: "1,248 Signals" },
  { label: "Updated", value: "18 sec ago" },
] as const;

const SOURCES = [
  "GitHub",
  "arXiv",
  "Hacker News",
  "Wikipedia",
  "Product Hunt",
] as const;

/**
 * Featured opportunity glass card — placeholder data only, Phase 1.
 */
export function FeaturedOpportunityCard({ className }: { className?: string }) {
  return (
    <article
      aria-label="Featured opportunity: Agentic AI"
      className={cn(
        "flex w-full max-w-[420px] flex-col rounded-3xl border border-border/50",
        "bg-card/35 shadow-premium backdrop-blur-md",
        MOTION_CLASS.featuredEnter,
        className
      )}
      style={{ minHeight: "520px" }}
    >
      <div className="flex flex-1 flex-col p-7 md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Featured Opportunity
        </p>

        <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">
          Agentic AI
        </h2>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Momentum
          </p>
          <p
            className="mt-1 font-heading text-[5.5rem] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[6rem]"
            aria-label="Momentum score 97"
          >
            97
          </p>
        </div>

        <dl className="mt-8 space-y-3.5 border-t border-border/40 pt-6">
          {METRICS.map(({ label, value }) => (
            <div key={label} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd
                className={cn(
                  "text-right text-sm font-medium text-foreground",
                  label === "Velocity" && "tracking-widest text-success"
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-border/40 px-7 py-5 md:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Top Sources
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SOURCES.map((source) => (
            <li key={source}>
              <span className="inline-flex rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
                {source}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
