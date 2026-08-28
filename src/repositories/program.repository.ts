import type { Program } from "@prisma/client";
import type { DegreeLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const programRepository = {
  async findByUniversityId(universityId: string): Promise<Program[]> {
    return prisma.program.findMany({
      where: { universityId, status: "ACTIVE", deletedAt: null },
    });
  },

  async findByDegreeLevel(
    universityId: string,
    degreeLevel: DegreeLevel,
  ): Promise<Program[]> {
    return prisma.program.findMany({
      where: { universityId, degreeLevel, status: "ACTIVE", deletedAt: null },
    });
  },

  async findById(id: string): Promise<Program | null> {
    return prisma.program.findUnique({ where: { id } });
  },
};
