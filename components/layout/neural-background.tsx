"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  NEURAL_EDGES,
  NEURAL_NODES,
  nodeById,
} from "@/lib/neural-network";
import { cn } from "@/lib/utils";

interface NeuralBackgroundProps {
  variant?: "default" | "subtle" | "hero";
  className?: string;
}

export function NeuralBackground({
  variant = "default",
  className,
}: NeuralBackgroundProps) {
  const intensity =
    variant === "hero" ? 1 : variant === "subtle" ? 0.55 : 0.75;

  const activeEdges = useMemo(
    () => NEURAL_EDGES.filter((e) => e.active),
    []
  );

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Soft wash so network sits behind content */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"
        style={{ opacity: 1 - intensity * 0.15 }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: intensity * 0.9 }}
      >
        <defs>
          <radialGradient id="neural-glow" cx="50%" cy="45%" r="45%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.08)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill="url(#neural-glow)" />

        {/* Synaptic connections */}
        {NEURAL_EDGES.map((edge) => {
          const a = nodeById(edge.from);
          const b = nodeById(edge.to);
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="hsl(var(--primary))"
              strokeWidth="0.12"
              strokeOpacity={edge.active ? 0.22 : 0.1}
            />
          );
        })}

        {/* Intelligence pulses traveling along active edges */}
        {activeEdges.map((edge, i) => {
          const a = nodeById(edge.from);
          const b = nodeById(edge.to);
          const duration = 2.8 + (i % 4) * 0.6;
          const delay = (i % 7) * 0.35;

          return (
            <motion.circle
              key={`pulse-${edge.from}-${edge.to}`}
              r="0.35"
              fill="hsl(var(--primary))"
              fillOpacity={0.7}
              initial={{ cx: a.x, cy: a.y, opacity: 0 }}
              animate={{
                cx: [a.x, b.x, a.x],
                cy: [a.y, b.y, a.y],
                opacity: [0, 0.85, 0],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.5, 1],
              }}
            />
          );
        })}

        {/* Neuron nodes */}
        {NEURAL_NODES.map((node, i) => (
          <g key={node.id}>
            {node.hub && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="1.2"
                fill="hsl(var(--primary))"
                fillOpacity={0.06}
                animate={{ r: [1.2, 1.8, 1.2], opacity: [0.04, 0.12, 0.04] }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.hub ? 0.55 : 0.38}
              fill="hsl(var(--card))"
              stroke="hsl(var(--primary))"
              strokeWidth="0.14"
              strokeOpacity={node.hub ? 0.55 : 0.35}
              animate={
                node.hub
                  ? { strokeOpacity: [0.35, 0.65, 0.35] }
                  : undefined
              }
              transition={
                node.hub
                  ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            />
          </g>
        ))}
      </svg>

      {/* Ambient drift — intelligence gathering */}
      <motion.div
        className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[100px]"
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
