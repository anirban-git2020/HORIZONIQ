/**
 * Minimal provider-agnostic LLM client for editorial synthesis. Supports Groq
 * (OpenAI-compatible) and Google Gemini, chosen by config. Any failure throws,
 * so the orchestrator can treat it as a rejection (fail-closed) and keep the
 * curated editorial. No dependency beyond global fetch.
 */

import { getGeminiApiKey, getGroqApiKey } from "@/lib/pipeline/config/env";
import type { LlmProvider } from "@/lib/pipeline/config/synthesis";

export type ChatRequest = {
  system: string;
  user: string;
  model: string;
  temperature: number;
  /** Ask the model to return strict JSON. */
  json?: boolean;
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function postJson(url: string, body: unknown, headers: Record<string, string>): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`LLM HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function chatGroq(req: ChatRequest): Promise<string> {
  const key = getGroqApiKey();
  if (!key) throw new Error("GROQ_API_KEY missing");
  const data = (await postJson(
    GROQ_URL,
    {
      model: req.model,
      temperature: req.temperature,
      max_tokens: 800,
      messages: [
        { role: "system", content: req.system },
        { role: "user", content: req.user },
      ],
      // Groq's strict json_object validator rejects otherwise-good llama output;
      // we ask for JSON in the prompt and parse robustly instead.
    },
    { Authorization: `Bearer ${key}` }
  )) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned no content");
  return text;
}

async function chatGemini(req: ChatRequest): Promise<string> {
  const key = getGeminiApiKey();
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const url = `${GEMINI_BASE}/${req.model}:generateContent?key=${encodeURIComponent(key)}`;
  const data = (await postJson(
    url,
    {
      contents: [{ parts: [{ text: `${req.system}\n\n${req.user}` }] }],
      generationConfig: {
        temperature: req.temperature,
        maxOutputTokens: 800,
        ...(req.json ? { responseMimeType: "application/json" } : {}),
      },
    },
    {}
  )) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");
  return text;
}

export async function chat(req: ChatRequest, provider: LlmProvider): Promise<string> {
  const call = () => (provider === "groq" ? chatGroq(req) : chatGemini(req));
  try {
    return await call();
  } catch {
    await new Promise((r) => setTimeout(r, 1500)); // one retry for transient errors
    return await call();
  }
}
