export const recommendationKeys = {
  all: ["recommendations"] as const,
  byUser: (userId: string) =>
    [...recommendationKeys.all, "user", userId] as const,
  byBatch: (batchId: string) =>
    [...recommendationKeys.all, "batch", batchId] as const,
};
