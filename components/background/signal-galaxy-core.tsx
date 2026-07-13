"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import { buildGalaxy } from "@/lib/intelligence-field/galaxy-geometry";
import {
  GALAXY_FRAGMENT_SHADER,
  GALAXY_VERTEX_SHADER,
} from "@/lib/intelligence-field/galaxy-shaders";

/** Oblique 3/4 view — disc seen from the side a bit (not top-down). */
const TILT: [number, number, number] = [-0.55, 0, 0.25];
/** Push the bright core off the hero reading column (toward centre-right, slightly low). */
const GALAXY_POS: [number, number, number] = [1.7, -0.25, 0];

function GalaxyPoints({ pixelRatio }: { pixelRatio: number }) {
  const spin = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const attrs = useMemo(() => {
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 80000 : 200000;
    return buildGalaxy(count);
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: 20 * pixelRatio } }),
    [pixelRatio]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (matRef.current) matRef.current.uniforms.uTime.value = t;
    if (spin.current) spin.current.rotation.y = t * 0.03;
  });

  return (
    <group rotation={TILT} position={GALAXY_POS}>
      <group ref={spin}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[attrs.positions, 3]} />
            <bufferAttribute attach="attributes-aColor" args={[attrs.colors, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[attrs.scales, 1]} />
            <bufferAttribute attach="attributes-aSeed" args={[attrs.seeds, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={matRef}
            uniforms={uniforms}
            vertexShader={GALAXY_VERTEX_SHADER}
            fragmentShader={GALAXY_FRAGMENT_SHADER}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
          />
        </points>
      </group>
    </group>
  );
}

function BackgroundStars() {
  const geo = useMemo(() => {
    const n = 2500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      const i3 = i * 3;
      const rr = 30 + Math.random() * 40;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i3] = rr * Math.sin(ph) * Math.cos(th);
      pos[i3 + 1] = rr * Math.sin(ph) * Math.sin(th);
      pos[i3 + 2] = rr * Math.cos(ph);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.06}
        color={0x8fa6d6}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Takes over the render loop with a bloom composer (Three built-in addons). */
function BloomComposer() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    // strength / radius / threshold — restrained so the core glows without washing out text
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.16, 0.45, 0.34));
    c.addPass(new OutputPass());
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size.width, size.height]);

  useFrame(() => composer.render(), 1);

  return null;
}

export function SignalGalaxyCore() {
  const pixelRatio = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.24;
      }}
    >
      <GalaxyPoints pixelRatio={pixelRatio} />
      <BackgroundStars />
      <BloomComposer />
    </Canvas>
  );
}

export default SignalGalaxyCore;
