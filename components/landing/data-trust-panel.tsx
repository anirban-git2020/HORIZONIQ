import { FadeIn } from "@/components/motion/fade-in";
import { ProvenanceBadge } from "@/components/trust/provenance-badge";
import {
  getTrustDisclaimer,
  LIVE_PIPELINE_SOURCE_NAMES,
  type DataProvenance,
} from "@/lib/trust";

interface DataTrustPanelProps {
  provenance: DataProvenance;
  briefingLabel: string;
  refreshSchedule: string;
}

export function DataTrustPanel({
  provenance,
  briefingLabel,
  refreshSchedule,
}: DataTrustPanelProps) {
  return (
    <FadeIn>
      <section
        aria-labelledby="data-trust-heading"
        className="rounded-xl border border-border/70 bg-card/80 px-6 py-6 md:px-8"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id="data-trust-heading"
            className="text-sm font-semibold tracking-tight"
          >
            About this briefing
          </h2>
          <ProvenanceBadge provenance={provenance} />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {getTrustDisclaimer(provenance, refreshSchedule)}
        </p>

        {provenance !== "curated-mock" && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {LIVE_PIPELINE_SOURCE_NAMES.map((source) => (
              <li key={source}>
                <span className="inline-flex rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">
                  {source}
                </span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Current briefing: {briefingLabel}
        </p>
      </section>
    </FadeIn>
  );
}
