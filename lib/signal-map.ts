import type { SignalView, SignalMapGraph, MapNode, MapLink } from "@/lib/types";
import { getSignalIntelligence, extractSeedId } from "@/lib/data/signal-intelligence";

/** Build a unified relationship graph from the user's active signals. */
export function buildSignalMap(signals: SignalView[]): SignalMapGraph {
  const nodeMap = new Map<string, MapNode>();
  const linkSet = new Set<string>();
  const links: MapLink[] = [];

  const addNode = (node: MapNode) => {
    if (!nodeMap.has(node.id)) nodeMap.set(node.id, node);
  };

  const addLink = (source: string, target: string, strength: number) => {
    const key = `${source}->${target}`;
    if (linkSet.has(key)) return;
    linkSet.add(key);
    links.push({ source, target, strength });
  };

  for (const signal of signals) {
    const intel = getSignalIntelligence(signal.seedId, signal.name, "professional");
    const chain = intel.chain;

    addNode({
      id: signal.seedId,
      label: signal.name,
      type: "signal",
      signalSeedId: signal.seedId,
      momentum: signal.momentum,
    });

    for (let i = 0; i < chain.length; i++) {
      const node = chain[i];
      addNode({
        id: node.id,
        label: node.label,
        type: node.type,
        signalSeedId: node.type === "signal" ? node.id : undefined,
        momentum: node.id === signal.seedId ? signal.momentum : undefined,
      });
      if (i > 0) {
        addLink(chain[i - 1].id, node.id, 0.85 - (i - 1) * 0.05);
      }
    }

    // Cross-link signals that share drivers/outcomes
    for (const other of signals) {
      if (other.seedId === signal.seedId) continue;
      const otherIntel = getSignalIntelligence(other.seedId, other.name, "professional");
      const shared = intel.chain.filter((c) =>
        otherIntel.chain.some((o) => o.label === c.label && c.id !== o.id)
      );
      for (const s of shared) {
        const match = otherIntel.chain.find((o) => o.label === s.label);
        if (match) addLink(s.id, match.id, 0.35);
      }
    }
  }

  return { nodes: Array.from(nodeMap.values()), links };
}

export function getMapNodeLabel(id: string, nodes: MapNode[]): string {
  return nodes.find((n) => n.id === id)?.label ?? id;
}
