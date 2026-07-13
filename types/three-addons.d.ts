/**
 * Ambient declarations for the Three.js post-processing addons used by the
 * Signal Galaxy. Three maps `three/addons/*` → `examples/jsm/*` at runtime, but
 * does not ship type declarations alongside them; these keep the strict build
 * resolving without pulling extra dependencies.
 */
declare module "three/addons/postprocessing/EffectComposer.js" {
  import type { WebGLRenderer, WebGLRenderTarget } from "three";
  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    addPass(pass: unknown): void;
    setSize(width: number, height: number): void;
    render(deltaTime?: number): void;
    dispose(): void;
  }
}
declare module "three/addons/postprocessing/RenderPass.js" {
  import type { Scene, Camera } from "three";
  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}
declare module "three/addons/postprocessing/UnrealBloomPass.js" {
  import type { Vector2 } from "three";
  export class UnrealBloomPass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
  }
}
declare module "three/addons/postprocessing/OutputPass.js" {
  export class OutputPass {
    constructor();
  }
}
