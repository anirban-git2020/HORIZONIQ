"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { IntelligenceFieldParams } from "@/lib/intelligence-field/params";
import type { IntelligenceFieldVariant } from "@/components/intelligence-field/types";

interface IntelligenceFieldMeshProps {
  params: IntelligenceFieldParams;
  variant?: IntelligenceFieldVariant;
  intensity?: number;
  paused?: boolean;
}

function meshConfig(variant: IntelligenceFieldVariant) {
  if (variant === "hero") {
    return { detail: 5, radius: 1.15, lineOpacity: 0.22, offsetX: 0.42 };
  }
  if (variant === "welcome") {
    return { detail: 5, radius: 1.08, lineOpacity: 0.2, offsetX: 0 };
  }
  return { detail: 3, radius: 0.95, lineOpacity: 0.11, offsetX: 0 };
}

export function IntelligenceFieldMesh({
  params,
  variant = "ambient",
  intensity = 1,
  paused = false,
}: IntelligenceFieldMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const { detail, radius, lineOpacity, offsetX } = meshConfig(variant);

  const geometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(radius, detail);
    return new THREE.EdgesGeometry(ico);
  }, [detail, radius]);

  useFrame((state, delta) => {
    if (paused || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    const speed = 0.01 + params.energy * 0.016 * intensity;

    groupRef.current.rotation.y = t * speed + params.regionPhase * Math.PI * 2;
    groupRef.current.rotation.x =
      Math.sin(t * 0.07 + params.regionPhase * 4) * 0.1;

    if (lineMatRef.current) {
      const pulse = 0.88 + Math.sin(t * 0.45) * 0.12 * params.breath;
      lineMatRef.current.opacity = THREE.MathUtils.lerp(
        lineMatRef.current.opacity,
        lineOpacity * intensity * pulse,
        Math.min(1, delta * 2)
      );
    }

    if (coreMatRef.current) {
      const corePulse = 0.55 + Math.sin(t * 0.8) * 0.2;
      coreMatRef.current.opacity = THREE.MathUtils.lerp(
        coreMatRef.current.opacity,
        (variant === "ambient" ? 0.25 : 0.55) * corePulse * intensity,
        Math.min(1, delta * 2)
      );
    }
  });

  const tint = useMemo(
    () => new THREE.Color(...params.roleTint),
    [params.roleTint]
  );
  const coreColor = useMemo(
    () => tint.clone().lerp(new THREE.Color(0.95, 0.72, 0.35), 0.35),
    [tint]
  );

  return (
    <group ref={groupRef} position={[offsetX, 0.02, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          ref={lineMatRef}
          color={tint}
          transparent
          opacity={lineOpacity * intensity}
          depthWrite={false}
        />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[radius * 0.07, 20, 20]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color={coreColor}
          transparent
          opacity={variant === "ambient" ? 0.25 : 0.55}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.18, 16, 16]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={0.06 * intensity}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
