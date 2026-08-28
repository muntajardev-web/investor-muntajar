export const documentKeys = {
  all: ["documents"] as const,
  byUser: (userId: string) => [...documentKeys.all, userId] as const,
};
