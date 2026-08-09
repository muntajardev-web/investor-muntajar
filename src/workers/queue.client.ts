import { redis } from "@/lib/redis";
import { queueNames } from "@/config";
import { logger } from "@/lib";
import type { JobPayload } from "./types";

const QUEUE_PREFIX = "queue:";

export const queueClient = {
  async enqueue(job: JobPayload): Promise<string> {
    const jobId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const key = `${QUEUE_PREFIX}${job.name}`;

    await redis.lpush(
      key,
      JSON.stringify({ jobId, ...job, enqueuedAt: new Date().toISOString() }),
    );

    logger.info("Job enqueued", { jobId, name: job.name });
    return jobId;
  },

  async dequeue(name: keyof typeof queueNames): Promise<JobPayload | null> {
    const key = `${QUEUE_PREFIX}${queueNames[name]}`;
    const raw = await redis.rpop<string>(key);
    if (!raw) return null;

    return JSON.parse(raw) as JobPayload;
  },

  async queueLength(name: keyof typeof queueNames): Promise<number> {
    const key = `${QUEUE_PREFIX}${queueNames[name]}`;
    return redis.llen(key);
  },
};
