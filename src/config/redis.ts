import { env } from "./env";

export const redisConfig = {
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
} as const;
