import type { University } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UniversityFilter } from "@/types";
import { resolvePagination } from "./base.repository";

const activeUniversity = { status: "ACTIVE" as const, deletedAt: null };

export const universityRepository = {
  async findById(id: string): Promise<University | null> {
    return prisma.university.findUnique({ where: { id } });
  },

  async findBySlug(slug: string): Promise<University | null> {
    return prisma.university.findUnique({ where: { slug } });
  },

  async findMany(filter: UniversityFilter = {}) {
    const { page, limit, skip } = resolvePagination(filter);

    const where = {
      ...activeUniversity,
      ...(filter.countryCode && {
        country: { code: filter.countryCode },
      }),
      ...(filter.search && {
        name: { contains: filter.search, mode: "insensitive" as const },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: { country: true },
      }),
      prisma.university.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async count(): Promise<number> {
    return prisma.university.count({ where: activeUniversity });
  },
};
