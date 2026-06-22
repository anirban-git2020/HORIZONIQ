"use client";

import { ROLES, ROLE_EXPERIENCE } from "@/lib/options";
import type { RoleId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RoleLens({ role }: { role: RoleId }) {
  const experience = ROLE_EXPERIENCE[role];
  const roleMeta = ROLES.find((r) => r.id === role);
  const Icon = roleMeta?.icon;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 md:p-6",
        "border-l-4",
        experience.accentClass
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div>
            <p className="label-caps text-primary">{experience.lensTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {experience.lensSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {experience.focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
