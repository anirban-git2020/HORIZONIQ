import { ArrowRight } from "lucide-react";

import type { IntelligencePulseBrief } from "@/lib/exchange/pulse-brief-data";
import { cn } from "@/lib/utils";

type IntelligencePulseBriefProps = {
  brief: IntelligencePulseBrief;
  className?: string;
  compact?: boolean;
};

/**
 * Expanded Intelligence Brief — editorial sections, no dashboard chrome.
 */
export function IntelligencePulseBriefPanel({
  brief,
  className,
  compact = false,
}: IntelligencePulseBriefProps) {
  return (
    <div className={cn(compact ? "space-y-6 border-t border-border/25 pt-6" : "space-y-10 pt-10", className)}>
      <section aria-labelledby="brief-why-heading">
        <h4 id="brief-why-heading" className="label-caps text-primary">
          Why This Matters
        </h4>
        <p className={cn("max-w-2xl text-foreground/90", compact ? "mt-2 text-sm leading-relaxed" : "mt-4 text-base leading-[1.75] md:text-lg")}>
          {brief.whyItMatters}
        </p>
      </section>

      <section aria-labelledby="brief-evidence-heading">
        <h4 id="brief-evidence-heading" className="label-caps text-primary">
          Evidence
        </h4>
        <dl className={cn("grid gap-5 sm:grid-cols-2 lg:max-w-2xl", compact ? "mt-3 gap-3" : "mt-5")}>
          {brief.evidence.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className={cn("mt-1 font-heading font-semibold tabular-nums tracking-tight text-foreground", compact ? "text-xl" : "text-2xl")}>
                {stat.change}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="brief-drivers-heading">
        <h4 id="brief-drivers-heading" className="label-caps text-primary">
          Who Is Driving This
        </h4>
        <ul className={cn("flex flex-wrap gap-2", compact ? "mt-2" : "mt-4")}>
          {brief.drivers.map((name) => (
            <li key={name}>
              <span className="inline-flex rounded-full bg-secondary/40 px-3.5 py-1.5 text-sm text-foreground/85">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="brief-related-heading">
        <h4 id="brief-related-heading" className="label-caps text-primary">
          Related Signals
        </h4>
        <ul className={cn("flex flex-wrap gap-2", compact ? "mt-2" : "mt-4")}>
          {brief.relatedSignals.map((signal) => (
            <li key={signal}>
              <span
                className="inline-flex rounded-full border border-border/40 bg-transparent px-3 py-1 text-xs text-muted-foreground"
                aria-disabled="true"
              >
                {signal}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="brief-forecast-heading">
        <h4 id="brief-forecast-heading" className="label-caps text-primary">
          Forecast
        </h4>
        <p className={cn("max-w-2xl italic text-muted-foreground", compact ? "mt-2 text-sm leading-relaxed" : "mt-4 text-base leading-[1.8]")}>
          {brief.forecast}
        </p>
      </section>

      <div className={cn("border-t border-border/25", compact ? "pt-5" : "pt-8")}>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-transform duration-300 ease-in-out hover:translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm"
        >
          Read Full Brief
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
