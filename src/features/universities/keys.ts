export const universityKeys = {
  all: ["universities"] as const,
  list: (filter: Record<string, unknown>) =>
    [...universityKeys.all, "list", filter] as const,
  detail: (slug: string) => [...universityKeys.all, slug] as const,
};
