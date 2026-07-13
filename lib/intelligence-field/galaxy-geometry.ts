/**
 * Signal Galaxy geometry — CPU-side generation of the GPU star buffers.
 *
 * Builds a barred-spiral disc: radius is concentrated toward the centre (the
 * bulge), points ride a few arms with a spin twist, colour runs warm at the
 * core to blue in the outer arms. Pure data — no three/DOM — so it is cheap to
 * reason about and reuse. The WebGL core turns these buffers into a luminous,
 * additively-blended, bloomed Milky Way.
 */

export type GalaxyAttributes = {
  positions: Float32Array;
  colors: Float32Array;
  scales: Float32Array;
  seeds: Float32Array;
  count: number;
};

const R = 6.0;
const ARMS = 4;
const SPIN = 0.85;
const RND = 0.3;
const RPOW = 2.6;

// warm core → cool arm
const C_INNER = [1.0, 0.894, 0.69];
const C_MID = [0.812, 0.878, 1.0];
const C_OUTER = [0.373, 0.549, 1.0];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function buildGalaxy(count: number): GalaxyAttributes {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 2.3) * R;
    const branch = ((i % ARMS) / ARMS) * Math.PI * 2;
    const spinA = r * SPIN;
    const thin = 0.34 + 0.9 * (1 - r / R);

    const sign = () => (Math.random() < 0.5 ? 1 : -1);
    const rx = Math.pow(Math.random(), RPOW) * sign() * RND * r;
    const ry = Math.pow(Math.random(), RPOW) * sign() * RND * r * thin * 0.5;
    const rz = Math.pow(Math.random(), RPOW) * sign() * RND * r;

    positions[i3] = Math.cos(branch + spinA) * r + rx;
    positions[i3 + 1] = ry;
    positions[i3 + 2] = Math.sin(branch + spinA) * r + rz;

    const tRad = r / R;
    let cr: number;
    let cg: number;
    let cb: number;
    if (tRad < 0.5) {
      const k = tRad / 0.5;
      cr = lerp(C_INNER[0], C_MID[0], k);
      cg = lerp(C_INNER[1], C_MID[1], k);
      cb = lerp(C_INNER[2], C_MID[2], k);
    } else {
      const k = (tRad - 0.5) / 0.5;
      cr = lerp(C_MID[0], C_OUTER[0], k);
      cg = lerp(C_MID[1], C_OUTER[1], k);
      cb = lerp(C_MID[2], C_OUTER[2], k);
    }
    const j = (Math.random() - 0.5) * 0.06;
    colors[i3] = clamp01(cr + j);
    colors[i3 + 1] = clamp01(cg + j);
    colors[i3 + 2] = clamp01(cb + j);

    scales[i] = (Math.random() * 0.8 + 0.35) * (tRad < 0.12 ? 1.7 : 1.0);
    seeds[i] = Math.random();
  }

  return { positions, colors, scales, seeds, count };
}
