export const applicationKeys = {
  all: ["applications"] as const,
  byUser: (userId: string) => [...applicationKeys.all, userId] as const,
  detail: (id: string) => [...applicationKeys.all, id] as const,
};
