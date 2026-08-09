import { Redis } from "@upstash/redis";
import { redisConfig } from "@/config";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  return new Redis({
    url: redisConfig.url,
    token: redisConfig.token,
  });
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
