import { NextRequest } from "next/server";
import type { EmploymentApplicationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";
import { employmentTrackingService } from "@/services/employment/tracking.service";
import { AppError } from "@/lib";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await withAdminAuth("employment:applications:write");
    const { id } = await params;
    const body = await request.json();

    const app = await prisma.employmentApplication.findFirst({
      where: { id, deletedAt: null },
    });
    if (!app) throw new AppError("NOT_FOUND", "Application not found", 404);

    if (body.status) {
      const result =
        await employmentTrackingService.transitionApplicationStatus({
          applicationId: id,
          status: body.status as EmploymentApplicationStatus,
          title: body.title,
          description: body.description,
          actorUserId: session.user.id,
          applicationData: {
            notes: body.notes ?? undefined,
          },
        });
      return apiSuccess(result);
    }

    const updated = await prisma.employmentApplication.update({
      where: { id },
      data: { notes: body.notes ?? undefined },
    });
    return apiSuccess({ application: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:applications:write");
    const { id } = await params;
    await prisma.employmentApplication.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
