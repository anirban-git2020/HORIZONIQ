import type { Metadata } from "next";

import { ContentPage } from "@/components/layout/content-page";
import { CHANGELOG_ENTRIES } from "@/lib/site-content/changelog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Official HorizonIQ release history — versions, improvements, fixes, and upcoming features.",
  path: "/changelog",
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <ContentPage
      title="Changelog"
      description="Official release history for HorizonIQ Beta Preview."
    >
      <div className="space-y-12">
        {CHANGELOG_ENTRIES.map((entry, index) => (
          <article
            key={entry.version}
            className="scroll-mt-24 space-y-5 border-b border-border/50 pb-12 last:border-0 last:pb-0"
            aria-labelledby={`release-${index}`}
          >
            <header className="space-y-1">
              <p className="label-caps text-muted-foreground">
                {formatDate(entry.date)}
              </p>
              <h2
                id={`release-${index}`}
                className="section-title text-xl font-semibold"
              >
                {entry.version}
              </h2>
            </header>

            {entry.improvements.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">
                  Major improvements
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {entry.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {entry.fixes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">
                  Bug fixes
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {entry.fixes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {entry.upcoming && entry.upcoming.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">
                  Upcoming
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {entry.upcoming.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </ContentPage>
  );
}
