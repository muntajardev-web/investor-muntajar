import type {
  RecommendationHistory,
  RecommendationStatus,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resolvePagination } from "./base.repository";
import type { PaginationParams } from "@/types";

export interface CreateRecommendationData {
  userId: string;
  universityId: string;
  programId?: string;
  matchScore: number;
  justification?: string;
  keyFactors?: Prisma.InputJsonValue;
  batchId?: string;
  status?: RecommendationStatus;
}

export const recommendationRepository = {
  async findByUserId(userId: string, params: PaginationParams = {}) {
    const { page, limit, skip } = resolvePagination(params);
    const where = { userId, deletedAt: null };

    const [data, total] = await Promise.all([
      prisma.recommendationHistory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { matchScore: "desc" },
        include: { university: true, program: true },
      }),
      prisma.recommendationHistory.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async findByBatchId(batchId: string): Promise<RecommendationHistory[]> {
    return prisma.recommendationHistory.findMany({
      where: { batchId, deletedAt: null },
      orderBy: { matchScore: "desc" },
      include: { university: true, program: true },
    });
  },

  async createMany(data: CreateRecommendationData[]): Promise<number> {
    const result = await prisma.recommendationHistory.createMany({ data });
    return result.count;
  },

  async saveEngineResults(
    userId: string,
    batchId: string,
    results: Array<{
      universityId: string;
      programId: string;
      matchScore: number;
      analysis: Record<string, unknown>;
    }>,
  ): Promise<number> {
    const result = await prisma.recommendationHistory.createMany({
      data: results.map((r) => ({
        userId,
        universityId: r.universityId,
        programId: r.programId,
        matchScore: r.matchScore,
        justification: JSON.stringify(r.analysis),
        keyFactors: r.analysis as Prisma.InputJsonValue,
        batchId,
        status: "COMPLETED" as RecommendationStatus,
      })),
    });
    return result.count;
  },

  async updateJustification(
    id: string,
    justification: string,
    keyFactors: Prisma.InputJsonValue,
  ): Promise<RecommendationHistory> {
    return prisma.recommendationHistory.update({
      where: { id },
      data: {
        justification,
        keyFactors,
        status: "COMPLETED",
      },
    });
  },

  async updateStatus(
    batchId: string,
    status: RecommendationStatus,
  ): Promise<number> {
    const result = await prisma.recommendationHistory.updateMany({
      where: { batchId },
      data: { status },
    });
    return result.count;
  },

  async deleteByUserId(userId: string): Promise<number> {
    const result = await prisma.recommendationHistory.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return result.count;
  },

  async count(): Promise<number> {
    return prisma.recommendationHistory.count({
      where: { deletedAt: null },
    });
  },
};
