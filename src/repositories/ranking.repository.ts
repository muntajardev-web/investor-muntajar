import type { UniversityRanking } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const rankingRepository = {
  async findByUniversityId(universityId: string): Promise<UniversityRanking[]> {
    return prisma.universityRanking.findMany({
      where: { universityId, deletedAt: null },
      orderBy: [{ year: "desc" }, { rank: "asc" }],
    });
  },

  async findLatestByUniversity(
    universityId: string,
    rankingBody = "QS",
  ): Promise<UniversityRanking | null> {
    return prisma.universityRanking.findFirst({
      where: { universityId, rankingBody, deletedAt: null },
      orderBy: { year: "desc" },
    });
  },
};
