import type { Scholarship } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const active = { status: "ACTIVE" as const, deletedAt: null };

export const scholarshipRepository = {
  async findByUniversityId(universityId: string): Promise<Scholarship[]> {
    return prisma.scholarship.findMany({
      where: { universityId, ...active },
      orderBy: { deadline: "asc" },
    });
  },

  async findById(id: string): Promise<Scholarship | null> {
    return prisma.scholarship.findUnique({ where: { id } });
  },

  async findActive(): Promise<Scholarship[]> {
    return prisma.scholarship.findMany({
      where: active,
      orderBy: { deadline: "asc" },
    });
  },
};
