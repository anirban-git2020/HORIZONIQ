"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";

import { buildSignalMap, getMapNodeLabel } from "@/lib/signal-map";
import { PremiumCard } from "@/components/ui/premium-card";
import type { SignalView, MapNode } from "@/lib/types";

interface SignalMapProps {
  signals: SignalView[];
}

export function SignalMap({ signals }: SignalMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 360 });

  const graph = useMemo(() => buildSignalMap(signals), [signals]);

  const connected = useMemo(() => {
    if (!hovered) return new Set<string>();
    const set = new Set<string>([hovered]);
    for (const link of graph.links) {
      if (link.source === hovered) set.add(link.target);
      if (link.target === hovered) set.add(link.source);
    }
    return set;
  }, [hovered, graph.links]);

  const hoveredNode = graph.nodes.find((n) => n.id === hovered);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setDimensions({ width: w, height: Math.min(420, Math.max(300, w * 0.42)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || graph.nodes.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.attr("viewBox", `0 0 ${width} ${height}`).append("g");

    const nodes = graph.nodes.map((n) => ({ ...n }));
    const links = graph.links.map((l) => ({ ...l }));
    const typeX: Record<MapNode["type"], number> = {
      driver: width * 0.15,
      signal: width * 0.5,
      outcome: width * 0.85,
    };

    type SimNode = MapNode & d3.SimulationNodeDatum;
    type SimLink = d3.SimulationLinkDatum<SimNode> & { strength: number };
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = links.map((l) => ({ ...l }));

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((l) => 80 + (1 - l.strength) * 40)
          .strength((l) => l.strength * 0.6)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("x", d3.forceX<SimNode>((d) => typeX[d.type]).strength(0.8))
      .force("y", d3.forceY<SimNode>(height / 2).strength(0.05))
      .force("collide", d3.forceCollide(28))
      .alphaDecay(0.02)
      .velocityDecay(0.35);

    const link = g
      .append("g")
      .attr("aria-hidden", "true")
      .selectAll("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => 1 + d.strength * 2.5);

    const node = g
      .append("g")
      .selectAll("g")
      .data(simNodes)
      .join("g")
      .attr("cursor", "pointer")
      .attr("role", "button")
      .attr("tabindex", 0)
      .attr("aria-label", (d) => d.label)
      .on("mouseenter", (_, d) => setHovered(d.id))
      .on("mouseleave", () => setHovered(null))
      .on("focus", (_, d) => setHovered(d.id))
      .on("blur", () => setHovered(null));

    node
      .append("circle")
      .attr("r", (d) => (d.type === "signal" ? 10 : 7))
      .attr("fill", (d) =>
        d.type === "signal"
          ? "hsl(var(--primary))"
          : d.type === "driver"
            ? "hsl(var(--secondary))"
            : "hsl(var(--card))"
      )
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", (d) => (d.type === "signal" ? 2 : 1))
      .attr("stroke-opacity", 0.5);

    node
      .append("text")
      .text((d) => d.label)
      .attr("x", 0)
      .attr("y", 22)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-inter), sans-serif")
      .attr("opacity", 0.85);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);

      node.attr(
        "transform",
        (d) => `translate(${d.x ?? 0},${d.y ?? 0})`
      );
    });

    return () => {
      simulation.stop();
    };
  }, [graph, dimensions]);

  // Highlight pass — separate effect to avoid re-running simulation
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll<SVGLineElement, unknown>("line").attr("stroke-opacity", function () {
      const el = d3.select(this);
      const x1 = el.attr("x1");
      // Can't easily get link id — use opacity by hover state on parent
      if (!hovered) return 0.5;
      return 0.25;
    });

    svg.selectAll<SVGGElement, MapNode>("g").select("circle").attr("opacity", function () {
      const parent = (this as SVGCircleElement).parentElement;
      if (!parent) return 1;
      const label = d3.select(parent).select("text").text();
      const node = graph.nodes.find((n) => n.label === label);
      if (!hovered) return 1;
      if (node && connected.has(node.id)) return 1;
      return 0.25;
    });
  }, [hovered, connected, graph.nodes]);

  if (signals.length === 0) return null;

  return (
    <PremiumCard className="overflow-hidden" hover={false}>
      <div className="border-b border-border px-5 py-4 md:px-6">
        <p className="label-caps mb-1">Living signal map</p>
        <h3 className="section-title text-lg">How your signals connect</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Hover a node to trace dependencies and relationship strength.
        </p>
      </div>

      <div ref={containerRef} className="relative w-full px-2 pb-2 pt-4">
        <svg
          ref={svgRef}
          className="w-full"
          style={{ height: dimensions.height }}
          role="img"
          aria-label="Interactive signal relationship map"
        />
      </div>

      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="border-t border-border bg-secondary/40 px-5 py-3 md:px-6"
          >
            <p className="text-sm font-medium text-foreground">
              {hoveredNode.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hoveredNode.type === "signal" && hoveredNode.momentum
                ? `Momentum ${hoveredNode.momentum} · `
                : ""}
              Connected to{" "}
              {Array.from(connected)
                .filter((id) => id !== hovered)
                .map((id) => getMapNodeLabel(id, graph.nodes))
                .join(", ") || "—"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumCard>
  );
}
