/** GLSL for intelligence field nodes — sparse surface particles on wireframe mesh. */

export const FIELD_VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform float uBreath;
uniform float uRegionPhase;
uniform float uRadius;

attribute float aRandom;
attribute vec3 aDirection;

varying float vGlow;
varying float vDepth;

void main() {
  float t = uTime * (0.08 + uEnergy * 0.18);
  float phase = aRandom * 6.2831853 + uRegionPhase * 6.2831853;

  float pulse = 1.0 + sin(t * 0.55 + phase) * 0.04 * uBreath;
  float radius = uRadius * pulse;

  vec3 dir = normalize(aDirection);
  vec3 pos = dir * radius;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float sizeBase = 1.2 + aRandom * 1.4;
  gl_PointSize = sizeBase * (72.0 / max(-mvPosition.z, 0.1));

  vGlow = 0.45 + aRandom * 0.55;
  vDepth = clamp(dot(dir, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5, 0.0, 1.0);
}
`;

export const FIELD_FRAGMENT_SHADER = /* glsl */ `
uniform float uConfidence;
uniform float uEnergy;
uniform vec3 uRoleTint;
uniform float uOpacity;

varying float vGlow;
varying float vDepth;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;

  float core = 1.0 - smoothstep(0.0, 0.48, d);
  core = pow(core, 2.8);

  vec3 color = mix(vec3(0.14, 0.38, 0.48), uRoleTint, 0.55);
  float brightness = 0.55 + uConfidence * 0.25 + uEnergy * 0.15 + vDepth * 0.1;

  float alpha = core * uOpacity * vGlow;
  gl_FragColor = vec4(color * brightness, alpha);
}
`;
