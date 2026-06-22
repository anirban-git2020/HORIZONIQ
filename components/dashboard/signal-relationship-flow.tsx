"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SignalRelationshipFlowProps {
  causedBy: string[];
  impacts: string[];
  benefits: string[];
  actions: string[];
  compact?: boolean;
}

const COLUMNS = [
  { key: "causedBy", label: "Caused by", itemsKey: "causedBy" as const },
  { key: "impacts", label: "Impacts", itemsKey: "impacts" as const },
  { key: "benefits", label: "Benefits", itemsKey: "benefits" as const },
  { key: "actions", label: "Actions", itemsKey: "actions" as const },
];

export function SignalRelationshipFlow({
  causedBy,
  impacts,
  benefits,
  actions,
  compact = false,
}: SignalRelationshipFlowProps) {
  const data = { causedBy, impacts, benefits, actions };

  return (
    <div
      className={cn(
        "grid gap-3",
        compact
          ? "grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
      role="img"
      aria-label="Signal relationship flow from causes to actions"
    >
      {COLUMNS.map((col, colIndex) => (
        <motion.div
          key={col.key}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: colIndex * 0.06, duration: 0.35 }}
          className="relative"
        >
          {colIndex > 0 && (
            <ArrowRight
              className="absolute -left-2 top-8 hidden h-4 w-4 text-muted-foreground/40 lg:block"
              aria-hidden
            />
          )}
          {colIndex > 0 && colIndex % 2 === 0 && (
            <ArrowDown
              className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 text-muted-foreground/40 sm:hidden"
              aria-hidden
            />
          )}

          <div className="rounded-lg border border-border bg-card p-3">
            <p className="label-caps mb-2.5">{col.label}</p>
            <ul className="space-y-1.5">
              {data[col.itemsKey].map((item) => (
                <li
                  key={item}
                  className={cn(
                    "rounded-md border border-border/80 bg-secondary/50 px-2.5 py-1.5 text-xs font-medium text-foreground",
                    col.key === "actions" &&
                      "border-primary/25 bg-primary/10 text-primary"
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
