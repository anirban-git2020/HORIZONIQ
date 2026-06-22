/** Neural network layout — normalized 0–100 coordinate space. */
export interface NeuralNode {
  id: number;
  x: number;
  y: number;
  /** Hub nodes pulse more prominently. */
  hub?: boolean;
}

export interface NeuralEdge {
  from: number;
  to: number;
  /** Edges that carry visible flow pulses. */
  active?: boolean;
}

/** Organic, brain-inspired node positions. */
export const NEURAL_NODES: NeuralNode[] = [
  { id: 0, x: 50, y: 48, hub: true },
  { id: 1, x: 38, y: 38, hub: true },
  { id: 2, x: 62, y: 38, hub: true },
  { id: 3, x: 28, y: 48 },
  { id: 4, x: 72, y: 48 },
  { id: 5, x: 35, y: 58 },
  { id: 6, x: 65, y: 58 },
  { id: 7, x: 50, y: 32, hub: true },
  { id: 8, x: 22, y: 36 },
  { id: 9, x: 78, y: 36 },
  { id: 10, x: 18, y: 52 },
  { id: 11, x: 82, y: 52 },
  { id: 12, x: 42, y: 68 },
  { id: 13, x: 58, y: 68 },
  { id: 14, x: 50, y: 62 },
  { id: 15, x: 32, y: 28 },
  { id: 16, x: 68, y: 28 },
  { id: 17, x: 50, y: 22 },
  { id: 18, x: 26, y: 62 },
  { id: 19, x: 74, y: 62 },
  { id: 20, x: 44, y: 44 },
  { id: 21, x: 56, y: 44 },
  { id: 22, x: 40, y: 52 },
  { id: 23, x: 60, y: 52 },
];

const MAX_DIST = 20;

function dist(a: NeuralNode, b: NeuralNode): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function buildEdges(): NeuralEdge[] {
  const edges: NeuralEdge[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < NEURAL_NODES.length; i++) {
    const neighbors = NEURAL_NODES.map((n, j) => ({ j, d: dist(NEURAL_NODES[i], n) }))
      .filter(({ j, d }) => j !== i && d < MAX_DIST)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);

    for (const { j } of neighbors) {
      const key = [Math.min(i, j), Math.max(i, j)].join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({
        from: i,
        to: j,
        active: (i + j) % 2 === 0,
      });
    }
  }
  return edges;
}

export const NEURAL_EDGES = buildEdges();

export function nodeById(id: number): NeuralNode {
  return NEURAL_NODES.find((n) => n.id === id)!;
}
