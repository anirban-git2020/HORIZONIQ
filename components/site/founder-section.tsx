import { ExternalLink, Mail } from "lucide-react";

import { FooterLink } from "@/components/layout/footer-link";
import { FOUNDER } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Founder + Vision callout — the centerpiece of the About page. Leads with the
 * founder's vision in their own voice, then the bio and contact links.
 */
export function FounderSection({ className }: { className?: string }) {
  return (
    <section
      id="founder"
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-2xl border border-primary/20 bg-secondary/20 p-7 md:p-10",
        className
      )}
      aria-labelledby="founder-heading"
    >
      <p className="label-caps text-primary">From the Founder</p>

      {FOUNDER.vision && (
        <p
          id="founder-heading"
          className="mt-4 max-w-3xl font-heading text-xl font-medium leading-[1.4] tracking-[-0.01em] text-foreground md:text-2xl md:leading-[1.45]"
        >
          {FOUNDER.vision}
        </p>
      )}

      <div className="mt-8 border-t border-border/40 pt-6">
        <p className="text-base font-semibold text-foreground">{FOUNDER.name}</p>
        <p className="text-sm text-muted-foreground">{FOUNDER.role}</p>

        {FOUNDER.bio && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {FOUNDER.bio}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          <FooterLink
            href={FOUNDER.linkedIn}
            external
            surface="about-founder"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </FooterLink>
          <FooterLink
            href={`mailto:${FOUNDER.email}`}
            external
            surface="about-founder"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {FOUNDER.email}
          </FooterLink>
        </div>
      </div>
    </section>
  );
}
