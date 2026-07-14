import { existsSync } from "node:fs";
import path from "node:path";

import { config } from "dotenv";

let loaded = false;

export function loadPipelineEnv(): void {
  if (loaded) return;
  const root = process.cwd();
  const candidates = [".env.local", ".env"];
  for (const file of candidates) {
    const fullPath = path.join(root, file);
    if (existsSync(fullPath)) {
      config({ path: fullPath });
      break;
    }
  }
  loaded = true;
}

export function getGitHubToken(): string | undefined {
  loadPipelineEnv();
  return process.env.GITHUB_TOKEN ?? process.env.GITHUB_PAT;
}

export function getProductHuntToken(): string | undefined {
  loadPipelineEnv();
  return (
    process.env.PRODUCT_HUNT_TOKEN ??
    process.env.PRODUCTHUNT_TOKEN ??
    process.env.PRODUCTHUNT_DEVELOPER_TOKEN
  );
}

export function requireGitHubToken(): string {
  const token = getGitHubToken();
  if (!token) {
    throw new Error(
      "Missing GITHUB_TOKEN (or GITHUB_PAT). Create a free read-only Personal Access Token at https://github.com/settings/tokens"
    );
  }
  return token;
}

export function requireProductHuntToken(): string {
  const token = getProductHuntToken();
  if (!token) {
    throw new Error(
      "Missing PRODUCT_HUNT_TOKEN. Register a free developer token at https://api.producthunt.com/v2/docs"
    );
  }
  return token;
}

/**
 * LLM key for editorial synthesis (Phase 1). Optional: when absent, synthesis
 * is skipped entirely and signals keep their curated editorial (fail-closed).
 * Provider is chosen by which key is present — Groq (default) or Gemini.
 */
export function getGroqApiKey(): string | undefined {
  loadPipelineEnv();
  return process.env.GROQ_API_KEY;
}

export function getGeminiApiKey(): string | undefined {
  loadPipelineEnv();
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
}
