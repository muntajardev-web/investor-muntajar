import { cacheService } from "@/services/cache/cache.service";
import { logger } from "@/lib";

export type CacheOptions = {
  key: string;
  /** TTL seconds (default 900 = 15m) */
  ttlSeconds?: number;
  /** Skip cache read/write */
  bypass?: boolean;
};

/**
 * Cache-aside wrapper for expensive orchestrator steps.
 * Failures reading/writing cache never fail the primary call.
 */
export async function withCache<T>(
  options: CacheOptions,
  fn: () => Promise<T>,
): Promise<{ result: T; cached: boolean }> {
  if (!options.bypass) {
    try {
      const hit = await cacheService.get<T>(options.key);
      if (hit != null) {
        logger.debug("Orchestrator cache hit", { key: options.key });
        return { result: hit, cached: true };
      }
    } catch (error) {
      logger.warn("Orchestrator cache read failed", {
        key: options.key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const result = await fn();

  if (!options.bypass) {
    try {
      await cacheService.set(options.key, result, options.ttlSeconds ?? 900);
    } catch (error) {
      logger.warn("Orchestrator cache write failed", {
        key: options.key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { result, cached: false };
}

export async function invalidateEmploymentAiCache(userId: string) {
  try {
    await cacheService.invalidatePattern(`emp:*:${userId}`);
  } catch (error) {
    logger.warn("Failed to invalidate employment AI cache", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
