"use client";

import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getSourceBadgeVariant, getSourceTypeLabel } from "@/lib/trust";
import type { IntelligenceEvidence } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IntelligenceCardEvidenceProps {
  evidence: IntelligenceEvidence;
  className?: string;
}

export function IntelligenceCardEvidence({
  evidence,
  className,
}: IntelligenceCardEvidenceProps) {
  return (
    <div className={cn("border-t border-border/60 pt-4", className)}>
      <p className="label-caps mb-3 text-primary">Evidence</p>

      <dl className="mb-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium text-muted-foreground">
            Last updated
          </dt>
          <dd className="mt-0.5 text-foreground">{evidence.lastUpdatedLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Region</dt>
          <dd className="mt-0.5 text-foreground">{evidence.regionLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">
            Categories
          </dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {evidence.categories.map((cat, index) => (
              <Badge key={`${cat}-${index}`} variant="muted" className="text-xs">
                {cat}
              </Badge>
            ))}
          </dd>
        </div>
      </dl>

      <p className="label-caps mb-2 text-[10px] text-muted-foreground">
        Sources used
      </p>
      <ul className="space-y-2">
        {evidence.sources.map((source) => {
          const url = source.url;
          const title = source.label.replace(/^[^:]+:\s*/, "");

          return (
            <li key={source.label}>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-secondary/30"
                >
                  <Badge
                    variant={getSourceBadgeVariant(source.type)}
                    className="shrink-0"
                  >
                    {getSourceTypeLabel(source.type)}
                  </Badge>
                  <span className="min-w-0 flex-1 leading-snug text-foreground/90">
                    {title}
                  </span>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                </a>
              ) : (
                <div className="flex items-start gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <Badge variant={getSourceBadgeVariant(source.type)}>
                    {getSourceTypeLabel(source.type)}
                  </Badge>
                  <span className="text-foreground/90">{source.label}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
