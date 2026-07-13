/**
 * Signal Galaxy GLSL. Additive point sprites: a soft radial core with a glow
 * falloff (fake per-star bloom) plus a gentle twinkle, driven on the GPU. Kept
 * separate from the locked Living Intelligence Field shaders.
 */

export const GALAXY_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute vec3 aColor;
  attribute float aScale;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.55 + 0.45 * sin(uTime * (0.5 + aSeed * 1.6) + aSeed * 6.2831);
    gl_PointSize = uSize * aScale * (0.6 + 0.4 * tw) * (1.0 / -mv.z);
    vColor = aColor;
    vTw = tw;
  }
`;

export const GALAXY_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vTw;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float core = 1.0 - smoothstep(0.0, 0.5, d);
    float glow = pow(core, 3.0);
    float a = glow * (0.55 + 0.45 * vTw);
    gl_FragColor = vec4(vColor * (0.6 + 0.8 * glow), a);
  }
`;
