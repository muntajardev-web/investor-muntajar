import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { AppError } from "@/lib";

const saveSchema = z.object({
  jobListingId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
});

const removeSchema = z.object({
  jobListingId: z.string().uuid().optional(),
  id: z.string().uuid().optional(),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const saved = await prisma.savedJob.findMany({
      where: { userId: session.user.id, deletedAt: null, status: "ACTIVE" },
      include: { jobListing: true },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ savedJobs: saved });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = saveSchema.parse(await request.json());

    const job = await prisma.jobListing.findFirst({
      where: { id: body.jobListingId, deletedAt: null, status: "ACTIVE" },
    });
    if (!job) {
      throw new AppError("NOT_FOUND", "Job listing not found", 404);
    }

    const existing = await prisma.savedJob.findFirst({
      where: {
        userId: session.user.id,
        jobListingId: body.jobListingId,
      },
    });

    const saved = existing
      ? await prisma.savedJob.update({
          where: { id: existing.id },
          data: {
            deletedAt: null,
            status: "ACTIVE",
            notes: body.notes ?? existing.notes,
          },
          include: { jobListing: true },
        })
      : await prisma.savedJob.create({
          data: {
            userId: session.user.id,
            jobListingId: body.jobListingId,
            notes: body.notes,
          },
          include: { jobListing: true },
        });

    await logEmploymentActivity(
      session.user.id,
      "Job saved",
      `${job.title} at ${job.company}`,
      { jobListingId: job.id },
    );

    return apiSuccess({ savedJob: saved });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = removeSchema.parse(await request.json().catch(() => ({})));

    if (!body.id && !body.jobListingId) {
      throw new AppError("VALIDATION_ERROR", "Provide id or jobListingId", 400);
    }

    await prisma.savedJob.updateMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
        ...(body.id ? { id: body.id } : { jobListingId: body.jobListingId }),
      },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });

    return apiSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
