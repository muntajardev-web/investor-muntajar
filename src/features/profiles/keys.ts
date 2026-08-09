export const profileKeys = {
  all: ["profiles"] as const,
  byUser: (userId: string) => [...profileKeys.all, userId] as const,
};
