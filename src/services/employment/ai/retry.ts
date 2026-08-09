import { logger } from "@/lib";

export type RetryOptions = {
  /** Max attempts including the first try (default 3) */
  attempts?: number;
  /** Base delay in ms before first retry (default 200) */
  baseDelayMs?: number;
  /** Cap on exponential backoff delay (default 5000) */
  maxDelayMs?: number;
  /** Label for logs */
  label?: string;
  /** Return true to skip retry for this error */
  isRetryable?: (error: unknown) => boolean;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultIsRetryable(error: unknown): boolean {
  if (!error || typeof error !== "object") return true;
  const err = error as { status?: number; code?: string; message?: string };
  if (typeof err.status === "number") {
    if (err.status === 400 || err.status === 401 || err.status === 403 || err.status === 404) {
      return false;
    }
  }
  const msg = (err.message ?? "").toLowerCase();
  if (msg.includes("validation") || msg.includes("non-retriable")) return false;
  return true;
}

/**
 * Exponential backoff with jitter for production AI / network calls.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<{ result: T; attempts: number }> {
  const attempts = Math.max(1, options.attempts ?? 3);
  const baseDelayMs = options.baseDelayMs ?? 200;
  const maxDelayMs = options.maxDelayMs ?? 5000;
  const label = options.label ?? "operation";
  const isRetryable = options.isRetryable ?? defaultIsRetryable;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const result = await fn();
      if (attempt > 1) {
        logger.info("Retry succeeded", { label, attempt, attempts });
      }
      return { result, attempts: attempt };
    } catch (error) {
      lastError = error;
      const retryable = isRetryable(error);
      logger.warn("Operation failed", {
        label,
        attempt,
        attempts,
        retryable,
        error: error instanceof Error ? error.message : String(error),
      });

      if (!retryable || attempt >= attempts) break;

      const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
      const jitter = Math.floor(Math.random() * Math.min(100, exp * 0.2));
      await sleep(exp + jitter);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError ?? "Retry exhausted"));
}
