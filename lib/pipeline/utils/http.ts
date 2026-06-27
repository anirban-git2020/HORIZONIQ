const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 2;

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchText(
  url: string,
  options: { retries?: number; timeoutMs?: number; init?: RequestInit } = {}
): Promise<string> {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options.init,
        signal: controller.signal,
        headers: {
          "User-Agent": "HorizonIQ-Pipeline/1.0 (https://horizoniq.app)",
          Accept: "application/json, application/xml, text/xml, */*",
          ...options.init?.headers,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(500 * (attempt + 1));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to fetch ${url}`);
}

export async function fetchJson<T>(
  url: string,
  options?: { retries?: number; timeoutMs?: number; init?: RequestInit }
): Promise<T> {
  const text = await fetchText(url, options);
  return JSON.parse(text) as T;
}

/** Serial queue for rate-limited APIs (arXiv: max 1 req / 3s). */
export class RateLimiter {
  private chain: Promise<void> = Promise.resolve();
  private readonly minIntervalMs: number;

  constructor(minIntervalMs: number) {
    this.minIntervalMs = minIntervalMs;
  }

  schedule<T>(task: () => Promise<T>): Promise<T> {
    const run = this.chain.then(async () => {
      await sleep(this.minIntervalMs);
      return task();
    });
    this.chain = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }
}
