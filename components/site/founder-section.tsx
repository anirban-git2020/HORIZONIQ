import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";

import { FooterLink } from "@/components/layout/footer-link";
import { FOUNDER } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FounderSection({ className }: { className?: string }) {
  return (
    <section
      id="founder"
      className={cn(
        "scroll-mt-24 rounded-xl border border-border/70 bg-secondary/20 p-6 md:p-8",
        className
      )}
      aria-labelledby="founder-heading"
    >
      <p className="label-caps text-muted-foreground">Founder</p>
      <h2 id="founder-heading" className="section-title mt-2 text-2xl">
        {FOUNDER.name}
      </h2>
      <p className="mt-1 text-sm text-foreground/90">{FOUNDER.role}</p>

      <ul className="mt-6 space-y-3">
        <li>
          <FooterLink
            href={FOUNDER.linkedIn}
            external
            surface="about-founder"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </FooterLink>
        </li>
        <li>
          <FooterLink
            href={`mailto:${FOUNDER.email}`}
            external
            surface="about-founder"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {FOUNDER.email}
          </FooterLink>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Contact page
          </Link>
        </li>
      </ul>
    </section>
  );
}
