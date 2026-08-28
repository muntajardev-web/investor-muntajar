import type { Application } from "@prisma/client";
import { applicationRepository } from "@/repositories";
import { NotFoundError, ForbiddenError } from "@/lib";
import { buildPaginatedResult } from "@/types/common";
import type {
  ApplicationDTO,
  CreateApplicationInput,
  UpdateApplicationInput,
  PaginationParams,
} from "@/types";

function toDTO(app: Application): ApplicationDTO {
  return {
    id: app.id,
    userId: app.userId,
    universityId: app.universityId,
    programId: app.programId,
    intakeId: app.intakeId,
    status: app.status,
    notes: app.notes,
    submittedAt: app.submittedAt,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}

export const applicationService = {
  async getById(id: string, userId: string): Promise<ApplicationDTO> {
    const app = await applicationRepository.findById(id);
    if (!app) throw new NotFoundError("Application", id);
    if (app.userId !== userId) throw new ForbiddenError();
    return toDTO(app);
  },

  async listByUser(userId: string, params: PaginationParams = {}) {
    const { data, total, page, limit } =
      await applicationRepository.findByUserId(userId, params);
    return buildPaginatedResult(data.map(toDTO), total, page, limit);
  },

  async create(input: CreateApplicationInput): Promise<ApplicationDTO> {
    const app = await applicationRepository.create(input);
    return toDTO(app);
  },

  async update(
    id: string,
    userId: string,
    input: UpdateApplicationInput,
  ): Promise<ApplicationDTO> {
    const existing = await applicationRepository.findById(id);
    if (!existing) throw new NotFoundError("Application", id);
    if (existing.userId !== userId) throw new ForbiddenError();

    const app = await applicationRepository.update(id, input);
    return toDTO(app);
  },
};
