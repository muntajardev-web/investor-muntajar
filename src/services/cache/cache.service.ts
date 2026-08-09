import { redis } from "@/lib/redis";
import { env } from "@/config";

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get<T>(key);
    return value ?? null;
  },

  async set<T>(
    key: string,
    value: T,
    ttlSeconds = env.RECOMMENDATION_CACHE_TTL_SECONDS,
  ): Promise<void> {
    await redis.set(key, value, { ex: ttlSeconds });
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  async increment(
    key: string,
    ttlSeconds = 60,
  ): Promise<number> {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, ttlSeconds);
    }
    return count;
  },
};
