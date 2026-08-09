import type { ApplicationStatus } from "@prisma/client";

export interface ApplicationDTO {
  id: string;
  userId: string;
  universityId: string;
  programId: string;
  intakeId: string | null;
  status: ApplicationStatus;
  notes: string | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationInput {
  userId: string;
  universityId: string;
  programId: string;
  intakeId?: string;
  notes?: string;
}

export interface UpdateApplicationInput {
  status?: ApplicationStatus;
  programId?: string;
  intakeId?: string;
  notes?: string;
}
