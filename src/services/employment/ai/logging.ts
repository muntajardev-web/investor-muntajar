import { randomUUID } from "crypto";
import { logger } from "@/lib";
import type {
  EmploymentAiRegistry,
  EmploymentAiWorkflow,
  OrchestratorContext,
  OrchestratorStepResult,
  OrchestratorWorkflowResult,
} from "./types";
import { withRetry } from "./retry";
import { withCache } from "./cached";

type StepOptions = {
  service: OrchestratorStepResult["service"];
  action: string;
  retries?: number;
  cacheKey?: string;
  cacheTtlSeconds?: number;
  bypassCache?: boolean;
};

/**
 * Runs a single orchestrated step with logging, optional retries, and cache.
 */
export async function runOrchestratorStep<T>(
  ctx: OrchestratorContext,
  options: StepOptions,
  fn: () => Promise<T>,
): Promise<OrchestratorStepResult<T>> {
  const started = Date.now();
  const requestId = ctx.requestId ?? "unknown";

  logger.info("Orchestrator step start", {
    requestId,
    workflow: ctx.workflow,
    userId: ctx.userId,
    service: options.service,
    action: options.action,
  });

  try {
    const execute = async () => {
      if (options.cacheKey) {
        const cached = await withCache(
          {
            key: options.cacheKey,
            ttlSeconds: options.cacheTtlSeconds,
            bypass: options.bypassCache,
          },
          fn,
        );
        return { value: cached.result, cached: cached.cached, attempts: 1 };
      }

      if ((options.retries ?? 1) > 1) {
        const retried = await withRetry(fn, {
          attempts: options.retries,
          label: `${options.service}.${options.action}`,
        });
        return {
          value: retried.result,
          cached: false,
          attempts: retried.attempts,
        };
      }

      const value = await fn();
      return { value, cached: false, attempts: 1 };
    };

    // Cache + retry together when both configured
    let value: T;
    let cached = false;
    let attempts = 1;

    if (options.cacheKey && (options.retries ?? 1) > 1) {
      const wrapped = await withCache(
        {
          key: options.cacheKey,
          ttlSeconds: options.cacheTtlSeconds,
          bypass: options.bypassCache,
        },
        async () => {
          const retried = await withRetry(fn, {
            attempts: options.retries,
            label: `${options.service}.${options.action}`,
          });
          attempts = retried.attempts;
          return retried.result;
        },
      );
      value = wrapped.result;
      cached = wrapped.cached;
      if (cached) attempts = 1;
    } else {
      const out = await execute();
      value = out.value;
      cached = out.cached;
      attempts = out.attempts;
    }

    const durationMs = Date.now() - started;
    logger.info("Orchestrator step ok", {
      requestId,
      workflow: ctx.workflow,
      userId: ctx.userId,
      service: options.service,
      action: options.action,
      durationMs,
      cached,
      retries: attempts,
    });

    return {
      ok: true,
      service: options.service,
      action: options.action,
      durationMs,
      cached,
      retries: attempts,
      data: value,
    };
  } catch (error) {
    const durationMs = Date.now() - started;
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Orchestrator step failed", {
      requestId,
      workflow: ctx.workflow,
      userId: ctx.userId,
      service: options.service,
      action: options.action,
      durationMs,
      error: message,
    });
    return {
      ok: false,
      service: options.service,
      action: options.action,
      durationMs,
      error: message,
    };
  }
}

export function createRequestId() {
  return randomUUID();
}

export function beginWorkflow(
  workflow: EmploymentAiWorkflow,
  userId: string,
  requestId?: string,
): OrchestratorContext & { requestId: string; workflow: EmploymentAiWorkflow; startedAt: number } {
  const id = requestId ?? createRequestId();
  logger.info("Orchestrator workflow start", {
    requestId: id,
    workflow,
    userId,
  });
  return {
    userId,
    requestId: id,
    workflow,
    startedAt: Date.now(),
  };
}

export function finishWorkflow<T>(
  ctx: { requestId: string; workflow: EmploymentAiWorkflow; userId: string; startedAt: number },
  steps: OrchestratorStepResult[],
  data?: T,
  error?: string,
): OrchestratorWorkflowResult<T | undefined> {
  const ok = !error && steps.every((s) => s.ok);
  const durationMs = Date.now() - ctx.startedAt;
  const result: OrchestratorWorkflowResult<T | undefined> = {
    workflow: ctx.workflow,
    requestId: ctx.requestId,
    userId: ctx.userId,
    ok,
    durationMs,
    steps,
    data,
    error,
  };

  if (ok) {
    logger.info("Orchestrator workflow ok", {
      requestId: ctx.requestId,
      workflow: ctx.workflow,
      userId: ctx.userId,
      durationMs,
      stepCount: steps.length,
    });
  } else {
    logger.error("Orchestrator workflow failed", {
      requestId: ctx.requestId,
      workflow: ctx.workflow,
      userId: ctx.userId,
      durationMs,
      error: error ?? steps.find((s) => !s.ok)?.error,
      stepCount: steps.length,
    });
  }

  return result;
}

export type { EmploymentAiRegistry };
