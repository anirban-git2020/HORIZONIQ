/**
 * Canvas engine for the Living Intelligence Field.
 * Phase 1 — atmospheric layer only. Future phases can extend via config hooks.
 */

export type FocusGlow = {
  x: number;
  y: number;
  /** Screen-space radius for soft illumination behind a focused signal. */
  radius: number;
};

export type IntelligenceFieldEngineConfig = {
  /** When true, nodes are drawn but never move (prefers-reduced-motion). */
  frozen?: boolean;
  /** Soft illumination anchor when a signal is in Focus Mode. */
  focusGlow?: FocusGlow | null;
  /** Future: per-node intensity multiplier for signal pulses (1 = default). */
  getNodeIntensity?: (nodeIndex: number) => number;
  /** Future: regional drift bias for geography clusters. */
  getRegionBias?: (x: number, y: number) => { bx: number; by: number };
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
};

const IQ_BLUE = { r: 0, g: 197, b: 255 };
const MAX_SPEED = 0.1;
const CONNECTION_DISTANCE = 130;
const MAX_NEIGHBORS = 3;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function nodeCountForWidth(width: number): number {
  if (width < 640) return clamp(Math.round(25 + width * 0.02), 25, 40);
  if (width < 1024) return clamp(Math.round(38 + width * 0.03), 40, 60);
  return clamp(Math.round(52 + width * 0.04), 60, 90);
}

function hashPair(a: number, b: number): number {
  return ((a * 73856093) ^ (b * 19349663)) * 0.000001;
}

function createNodes(count: number, width: number, height: number): Node[] {
  const nodes: Node[] = [];
  const minDist = Math.min(width, height) * 0.06;
  let attempts = 0;
  const maxAttempts = count * 60;

  while (nodes.length < count && attempts < maxAttempts) {
    attempts += 1;
    const x = Math.random() * width;
    const y = Math.random() * height;
    const tooClose = nodes.some((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return dx * dx + dy * dy < minDist * minDist;
    });
    if (tooClose) continue;

    const speed = 0.015 + Math.random() * 0.055;
    const angle = Math.random() * Math.PI * 2;
    nodes.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() > 0.45 ? 2 : 1,
      opacity: 0.08 + Math.random() * 0.1,
    });
  }

  while (nodes.length < count) {
    const speed = 0.02 + Math.random() * 0.04;
    const angle = Math.random() * Math.PI * 2;
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1,
      opacity: 0.1,
    });
  }

  return nodes;
}

export class IntelligenceFieldEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: IntelligenceFieldEngineConfig;
  private nodes: Node[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rafId = 0;
  private running = false;
  private time = 0;
  private onVisibilityChange: () => void;
  private onResize: () => void;

  constructor(canvas: HTMLCanvasElement, config: IntelligenceFieldEngineConfig = {}) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.canvas = canvas;
    this.ctx = ctx;
    this.config = config;

    this.onResize = () => this.resize();
    this.onVisibilityChange = () => {
      if (document.hidden) this.stop();
      else this.start();
    };

    this.resize();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  /** Future phases: hot-swap config without rebuilding the engine. */
  setConfig(config: Partial<IntelligenceFieldEngineConfig>) {
    this.config = { ...this.config, ...config };
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.tick();
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.nodes = createNodes(nodeCountForWidth(this.width), this.width, this.height);
    this.draw();
  }

  private tick = () => {
    if (!this.running) return;
    if (!this.config.frozen) {
      this.time += 1;
      this.updateNodes();
    }
    this.draw();
    this.rafId = requestAnimationFrame(this.tick);
  };

  private updateNodes() {
    const { width, height } = this;
    const bias = this.config.getRegionBias;

    for (const node of this.nodes) {
      if (bias) {
        const { bx, by } = bias(node.x, node.y);
        node.vx += bx * 0.0002;
        node.vy += by * 0.0002;
      }

      node.x += node.vx;
      node.y += node.vy;

      const speed = Math.hypot(node.vx, node.vy);
      if (speed > MAX_SPEED) {
        node.vx = (node.vx / speed) * MAX_SPEED;
        node.vy = (node.vy / speed) * MAX_SPEED;
      }

      if (node.x < 0 || node.x > width) {
        node.vx *= -1;
        node.x = clamp(node.x, 0, width);
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -1;
        node.y = clamp(node.y, 0, height);
      }

      node.vx += (Math.random() - 0.5) * 0.002;
      node.vy += (Math.random() - 0.5) * 0.002;
    }
  }

  private draw() {
    const { ctx, width, height, nodes, time } = this;
    ctx.clearRect(0, 0, width, height);

    const focusGlow = this.config.focusGlow;
    if (focusGlow) {
      const gradient = ctx.createRadialGradient(
        focusGlow.x,
        focusGlow.y,
        0,
        focusGlow.x,
        focusGlow.y,
        focusGlow.radius
      );
      gradient.addColorStop(0, `rgba(${IQ_BLUE.r}, ${IQ_BLUE.g}, ${IQ_BLUE.b}, 0.07)`);
      gradient.addColorStop(0.45, `rgba(${IQ_BLUE.r}, ${IQ_BLUE.g}, ${IQ_BLUE.b}, 0.025)`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    const getIntensity = this.config.getNodeIntensity;

    for (let i = 0; i < nodes.length; i += 1) {
      const neighbors: { index: number; dist: number }[] = [];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECTION_DISTANCE) {
          neighbors.push({ index: j, dist });
        }
      }
      neighbors.sort((a, b) => a.dist - b.dist);
      const linked = neighbors.slice(0, MAX_NEIGHBORS);

      for (const { index: j, dist } of linked) {
        const fade =
          0.5 + 0.5 * Math.sin(time * 0.012 + hashPair(i, j) * Math.PI * 2);
        const proximity = 1 - dist / CONNECTION_DISTANCE;
        let alpha = clamp(proximity * fade * 0.08, 0.03, 0.08);
        if (focusGlow) {
          const midX = (nodes[i].x + nodes[j].x) * 0.5;
          const midY = (nodes[i].y + nodes[j].y) * 0.5;
          const glowDist = Math.hypot(midX - focusGlow.x, midY - focusGlow.y);
          const glowBoost = Math.max(0, 1 - glowDist / focusGlow.radius);
          alpha = clamp(alpha + glowBoost * 0.06, 0.03, 0.14);
        }
        ctx.strokeStyle = `rgba(${200 + IQ_BLUE.r * 0.12}, ${215 + IQ_BLUE.g * 0.1}, ${245 + IQ_BLUE.b * 0.04}, ${alpha})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      let intensity = getIntensity ? getIntensity(i) : 1;
      if (focusGlow) {
        const glowDist = Math.hypot(node.x - focusGlow.x, node.y - focusGlow.y);
        const glowBoost = Math.max(0, 1 - glowDist / focusGlow.radius);
        intensity += glowBoost * 1.4;
      }
      const alpha = clamp(node.opacity * intensity, 0.08, 0.28);
      const mix = 0.14;
      const r = Math.round(248 * (1 - mix) + IQ_BLUE.r * mix);
      const g = Math.round(250 * (1 - mix) + IQ_BLUE.g * mix);
      const b = Math.round(255 * (1 - mix) + IQ_BLUE.b * mix);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
