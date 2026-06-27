"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import { IntelligenceFieldMesh } from "@/components/intelligence-field/intelligence-field-mesh";
import { IntelligenceFieldPoints } from "@/components/intelligence-field/intelligence-field-points";
import type { IntelligenceFieldParams } from "@/lib/intelligence-field/params";

import type { IntelligenceFieldVariant } from "@/components/intelligence-field/types";

interface LivingIntelligenceCoreProps {
  params: IntelligenceFieldParams;
  variant?: IntelligenceFieldVariant;
  intensity?: number;
  paused?: boolean;
}

function Scene({ params, variant, intensity, paused }: LivingIntelligenceCoreProps) {
  return (
    <>
      <IntelligenceFieldMesh
        params={params}
        variant={variant}
        intensity={intensity}
        paused={paused}
      />
      <IntelligenceFieldPoints
        params={params}
        variant={variant}
        intensity={intensity}
        paused={paused}
      />
    </>
  );
}

export function LivingIntelligenceCore({
  params,
  variant = "ambient",
  intensity = 1,
  paused = false,
}: LivingIntelligenceCoreProps) {
  const cameraX = variant === "hero" ? -0.35 : 0;

  return (
    <Canvas
      camera={{ position: [cameraX, 0, 2.85], fov: 42, near: 0.1, far: 20 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene
          params={params}
          variant={variant}
          intensity={intensity}
          paused={paused}
        />
      </Suspense>
    </Canvas>
  );
}
