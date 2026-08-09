import type { PaginationParams } from "@/types";

export function resolvePagination(params: PaginationParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
