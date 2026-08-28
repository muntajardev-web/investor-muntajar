import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth, requireRole } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { employmentTrackingService } from "@/services/employment/tracking.service";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib";
import type { EmploymentApplicationStatus } from "@prisma/client";

const STATUSES = [
  "DRAFT",
  "PREPARING",
  "WAITING_PAYMENT",
  "SUBMITTED",
  "EMPLOYER_REVIEWING",
  "INTERVIEW",
  "MEDICAL",
  "VISA_PROCESSING",
  "OFFER_LETTER",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
] as const;

const patchSchema = z.object({
  status: z.enum(STATUSES),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const app = await prisma.employmentApplication.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
      select: { id: true },
    });
    if (!app) {
      throw new AppError("NOT_FOUND", "Application not found", 404);
    }

    const tracking = await employmentTrackingService.getApplicationTracking(
      session.user.id,
      id,
    );

    return apiSuccess(tracking);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Status updates — admin/agent only.
 * Workers see changes via tracker, notifications, and activity history.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(["ADMIN", "AGENT"]);
    const { id } = await context.params;
    const body = patchSchema.parse(await request.json());

    const app = await prisma.employmentApplication.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!app) {
      throw new AppError("NOT_FOUND", "Application not found", 404);
    }

    const result = await employmentTrackingService.transitionApplicationStatus({
      applicationId: id,
      status: body.status as EmploymentApplicationStatus,
      title: body.title,
      description: body.description,
      actorUserId: session.user.id,
      applicationData: body.notes !== undefined ? { notes: body.notes } : undefined,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
