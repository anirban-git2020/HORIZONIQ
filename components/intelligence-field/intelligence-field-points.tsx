"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { IntelligenceFieldParams } from "@/lib/intelligence-field/params";
import {
  FIELD_FRAGMENT_SHADER,
  FIELD_VERTEX_SHADER,
} from "@/lib/intelligence-field/shaders";
import type { IntelligenceFieldVariant } from "@/components/intelligence-field/types";

function particleCountForVariant(variant: IntelligenceFieldVariant): number {
  if (typeof window === "undefined") return 400;
  const w = window.innerWidth;
  const mobile = w < 640;
  const tablet = w < 1024;

  if (variant === "welcome") {
    if (mobile) return 360;
    if (tablet) return 520;
    return 680;
  }
  if (variant === "hero") {
    if (mobile) return 320;
    if (tablet) return 480;
    return 640;
  }
  if (mobile) return 120;
  if (tablet) return 160;
  return 220;
}

function radiusForVariant(variant: IntelligenceFieldVariant): number {
  if (variant === "ambient") return 0.95;
  if (variant === "hero") return 1.15;
  return 1.08;
}

function offsetForVariant(variant: IntelligenceFieldVariant): number {
  return variant === "hero" ? 0.42 : 0;
}

function fibonacciSphere(count: number, radius: number): Float32Array {
  const directions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r * radius;
    const z = Math.sin(theta) * r * radius;
    directions[i * 3] = x;
    directions[i * 3 + 1] = y * radius;
    directions[i * 3 + 2] = z;
  }

  return directions;
}

interface IntelligenceFieldPointsProps {
  params: IntelligenceFieldParams;
  variant?: IntelligenceFieldVariant;
  intensity?: number;
  paused?: boolean;
}

export function IntelligenceFieldPoints({
  params,
  variant = "ambient",
  intensity = 1,
  paused = false,
}: IntelligenceFieldPointsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeOffset = useMemo(() => Math.random() * 1000, []);
  const targetTint = useMemo(
    () => new THREE.Vector3(...params.roleTint),
    [params.roleTint]
  );

  const radius = radiusForVariant(variant);
  const baseOpacity =
    variant === "ambient" ? 0.22 : variant === "hero" ? 0.42 : 0.38;

  const geometry = useMemo(() => {
    const count = particleCountForVariant(variant);
    const randoms = new Float32Array(count);
    const directions = fibonacciSphere(count, 1);

    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );
    geo.setAttribute(
      "aDirection",
      new THREE.BufferAttribute(directions, 3)
    );
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    return geo;
  }, [variant]);

  useFrame((state, delta) => {
    if (paused || !materialRef.current) return;
    const mat = materialRef.current;
    const t = state.clock.elapsedTime + timeOffset;

    mat.uniforms.uTime.value = t;
    mat.uniforms.uRadius.value = radius;
    mat.uniforms.uEnergy.value = THREE.MathUtils.lerp(
      mat.uniforms.uEnergy.value,
      params.energy * intensity,
      Math.min(1, delta * 2)
    );
    mat.uniforms.uBreath.value = THREE.MathUtils.lerp(
      mat.uniforms.uBreath.value,
      params.breath,
      Math.min(1, delta * 1.8)
    );
    mat.uniforms.uRegionPhase.value = THREE.MathUtils.lerp(
      mat.uniforms.uRegionPhase.value,
      params.regionPhase,
      Math.min(1, delta * 1.2)
    );
    mat.uniforms.uConfidence.value = THREE.MathUtils.lerp(
      mat.uniforms.uConfidence.value,
      params.confidence,
      Math.min(1, delta * 2)
    );
    mat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      mat.uniforms.uOpacity.value,
      baseOpacity * intensity,
      Math.min(1, delta * 2)
    );
    (mat.uniforms.uRoleTint.value as THREE.Vector3).lerp(
      targetTint,
      Math.min(1, delta * 1.5)
    );

    if (pointsRef.current) {
      pointsRef.current.position.x = offsetForVariant(variant);
      pointsRef.current.rotation.y = t * 0.014 + params.regionPhase * 0.35;
      pointsRef.current.rotation.x =
        Math.sin(t * 0.06 + params.regionPhase * 3.1) * 0.06;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={FIELD_VERTEX_SHADER}
        fragmentShader={FIELD_FRAGMENT_SHADER}
        uniforms={{
          uTime: { value: 0 },
          uRadius: { value: radius },
          uEnergy: { value: params.energy * intensity },
          uBreath: { value: params.breath },
          uRegionPhase: { value: params.regionPhase },
          uConfidence: { value: params.confidence },
          uRoleTint: { value: targetTint.clone() },
          uOpacity: { value: baseOpacity * intensity },
        }}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
