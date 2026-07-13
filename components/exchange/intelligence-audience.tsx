"use client";

import { useLandingJourney } from "@/hooks/use-landing-journey";
import { INTEREST_LABEL, REGION_LABEL, ROLE_LABEL } from "@/lib/options";

/**
 * Reflects the professional's captured profile back to them on the briefing
 * page, so they remember who this intelligence was curated for. Reads the
 * journey (sessionStorage) only — no new state.
 */
export function IntelligenceAudience() {
  const { hydrated, journey } = useLandingJourney();
  if (!hydrated) return null;

  const { displayName, selectedRole, selectedRegion, selectedInterests } = journey;
  const hasProfile =
    Boolean(displayName || selectedRole || selectedRegion) ||
    selectedInterests.length > 0;
  if (!hasProfile) return null;

  const facets = [
    selectedRole ? ROLE_LABEL[selectedRole] : null,
    selectedRegion ? REGION_LABEL[selectedRegion] : null,
    selectedInterests.length > 0
      ? selectedInterests.map((i) => INTEREST_LABEL[i]).join(" · ")
      : null,
  ].filter((v): v is string => Boolean(v));

  return (
    <section className="hq-motion-hero-enter mx-auto w-full max-w-[1500px] px-6 pb-10">
      <p className="label-caps text-primary">Your Intelligence Brief</p>
      <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
        Curated for{" "}
        {displayName ? (
          <span className="font-medium text-foreground">{displayName}</span>
        ) : (
          "you"
        )}
        {facets.length > 0 ? " — " : ""}
        {facets.join(" · ")}
      </p>
    </section>
  );
}
