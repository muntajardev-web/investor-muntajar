import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { AppError } from "@/lib";
import { employmentTrackingService } from "@/services/employment/tracking.service";

const createSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  scheduledAt: z.string().datetime(),
  meetingUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  applicationId: z.string().uuid().optional(),
  jobListingId: z.string().uuid().optional(),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const interviews = await prisma.employmentInterview.findMany({
      where: { userId: session.user.id, deletedAt: null },
      include: { jobListing: true, application: true },
      orderBy: { scheduledAt: "asc" },
    });
    return apiSuccess({ interviews });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = createSchema.parse(await request.json());

    if (body.applicationId) {
      const app = await prisma.employmentApplication.findFirst({
        where: {
          id: body.applicationId,
          userId: session.user.id,
          deletedAt: null,
        },
      });
      if (!app) {
        throw new AppError("NOT_FOUND", "Application not found", 404);
      }
    }

    const interview = await prisma.employmentInterview.create({
      data: {
        userId: session.user.id,
        company: body.company,
        position: body.position,
        scheduledAt: new Date(body.scheduledAt),
        meetingUrl: body.meetingUrl || null,
        notes: body.notes,
        applicationId: body.applicationId,
        jobListingId: body.jobListingId,
      },
      include: { jobListing: true },
    });

    if (body.applicationId) {
      await employmentTrackingService.transitionApplicationStatus({
        applicationId: body.applicationId,
        status: "INTERVIEW",
        title: "Interview scheduled",
        description: `${body.position} at ${body.company} on ${new Date(body.scheduledAt).toLocaleString()}`,
        actorUserId: session.user.id,
        metadata: { interviewId: interview.id },
      });
    }

    return apiSuccess({ interview });
  } catch (error) {
    return handleApiError(error);
  }
}
