import { BetaBadge } from "@/components/brand/beta-badge";
import { TaglineLockup } from "@/components/brand/tagline-lockup";
import { FooterLink, FooterTextLink } from "@/components/layout/footer-link";
import {
  COPYRIGHT_EXTENDED,
  COPYRIGHT_NOTICE,
  FOOTER_QUICK_LINKS,
  FOUNDER,
  SITE_NAME,
  SITE_VERSION,
  TECH_STACK,
  TRUST_BADGES,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  className?: string;
  /** Optional briefing-specific line above the global footer (dashboard/landing). */
  supplementary?: React.ReactNode;
};

export function SiteFooter({ className, supplementary }: SiteFooterProps) {
  return (
    <footer className={cn("relative z-10 border-t border-border/60 bg-background", className)}>
      {supplementary && (
        <div className="border-b border-border/40">
          <div className="container py-4 text-center text-xs text-muted-foreground sm:text-sm">
            {supplementary}
          </div>
        </div>
      )}

      <div className="container py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <div className="space-y-3">
              <p className="font-heading text-lg font-semibold tracking-[-0.02em]">
                {SITE_NAME}
              </p>
              <TaglineLockup size="sm" />
              <BetaBadge />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="whitespace-pre-line leading-relaxed">{COPYRIGHT_NOTICE}</p>
              <p>
                Designed and Created by{" "}
                <FooterLink
                  href="/about#founder"
                  className="text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {FOUNDER.name}
                </FooterLink>
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h2 className="label-caps text-muted-foreground">Contact</h2>
            <ul className="space-y-2">
              <li>
                <span className="text-xs text-muted-foreground/80">Email</span>
                <p>
                  <FooterLink
                    href={`mailto:${FOUNDER.email}`}
                    external
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {FOUNDER.email}
                  </FooterLink>
                </p>
              </li>
              <li>
                <span className="text-xs text-muted-foreground/80">LinkedIn</span>
                <p>
                  <FooterLink
                    href={FOUNDER.linkedIn}
                    external
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {FOUNDER.name}
                  </FooterLink>
                </p>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h2 className="label-caps text-muted-foreground">Quick Links</h2>
            <ul className="space-y-2">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  {item.placeholder || !item.href ? (
                    <span
                      className="text-sm text-muted-foreground/50"
                      aria-disabled="true"
                      title="Coming soon"
                    >
                      {item.label}
                      <span className="sr-only"> (coming soon)</span>
                    </span>
                  ) : (
                    <FooterTextLink href={item.href} label={item.label} />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Technology + Version */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <h2 className="label-caps text-muted-foreground">Technology</h2>
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                {TECH_STACK.map((tech) => (
                  <li
                    key={tech}
                    className="text-sm text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h2 className="label-caps text-muted-foreground">Version</h2>
              <p className="text-sm text-muted-foreground">{SITE_VERSION}</p>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border/40 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="label-caps text-muted-foreground">Built with</p>
            <p className="text-sm text-muted-foreground">
              {TECH_STACK.join(" · ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="label-caps rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-[9px] text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright extended */}
        <p className="mt-8 max-w-4xl text-xs leading-relaxed text-muted-foreground/80">
          {COPYRIGHT_EXTENDED}
        </p>
      </div>
    </footer>
  );
}
