import type { Application, ApplicationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateApplicationInput, UpdateApplicationInput } from "@/types";
import { resolvePagination } from "./base.repository";
import type { PaginationParams } from "@/types";

export const applicationRepository = {
  async findById(id: string): Promise<Application | null> {
    return prisma.application.findUnique({ where: { id } });
  },

  async findByUserId(userId: string, params: PaginationParams = {}) {
    const { page, limit, skip } = resolvePagination(params);
    const where = { userId, deletedAt: null };

    const [data, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { university: true, program: true },
      }),
      prisma.application.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async create(data: CreateApplicationInput): Promise<Application> {
    return prisma.application.create({
      data: {
        userId: data.userId,
        universityId: data.universityId,
        programId: data.programId,
        intakeId: data.intakeId,
        notes: data.notes,
      },
    });
  },

  async update(
    id: string,
    data: UpdateApplicationInput,
  ): Promise<Application> {
    const updateData = {
      ...(data.status && { status: data.status }),
      ...(data.programId && { programId: data.programId }),
      ...(data.intakeId && { intakeId: data.intakeId }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.status === "SUBMITTED" && { submittedAt: new Date() }),
    };
    return prisma.application.update({ where: { id }, data: updateData });
  },

  async countByStatus(status?: ApplicationStatus): Promise<number> {
    return prisma.application.count({
      where: status ? { status, deletedAt: null } : { deletedAt: null },
    });
  },
};
