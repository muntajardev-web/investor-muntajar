import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { AppError } from "@/lib";
import { employmentValidationService } from "@/services/employment/validation.service";
import { employmentTrackingService } from "@/services/employment/tracking.service";
import { logEmploymentActivity } from "@/lib/employment/queries";

const bodySchema = z.object({
  action: z.enum(["submit", "apply_later"]).default("submit"),
  jobListingId: z.string().uuid().optional(),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const applications = await prisma.employmentApplication.findMany({
      where: { userId: session.user.id, deletedAt: null },
      include: {
        jobListing: true,
        timeline: {
          where: { deletedAt: null },
          orderBy: { occurredAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return apiSuccess({ applications });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = bodySchema.parse(await request.json().catch(() => ({})));

    if (body.action === "apply_later") {
      if (!body.jobListingId) {
        throw new AppError(
          "VALIDATION_ERROR",
          "jobListingId is required to apply later",
          400,
        );
      }

      const job = await prisma.jobListing.findFirst({
        where: { id: body.jobListingId, deletedAt: null },
      });
      if (!job) {
        throw new AppError("NOT_FOUND", "Job not found", 404);
      }

      const existingSaved = await prisma.savedJob.findUnique({
        where: {
          userId_jobListingId: {
            userId: session.user.id,
            jobListingId: body.jobListingId,
          },
        },
      });
      if (!existingSaved) {
        await prisma.savedJob.create({
          data: {
            userId: session.user.id,
            jobListingId: body.jobListingId,
            status: "ACTIVE",
          },
        });
      } else if (existingSaved.deletedAt || existingSaved.status !== "ACTIVE") {
        await prisma.savedJob.update({
          where: { id: existingSaved.id },
          data: { deletedAt: null, status: "ACTIVE" },
        });
      }

      const application = await employmentTrackingService.ensureApplication({
        userId: session.user.id,
        jobListingId: body.jobListingId,
        status: "DRAFT",
        notes: "Queued via Apply later — complete payment to submit.",
      });

      if (application.status !== "DRAFT") {
        // Keep existing advanced applications; only log queue action
        await logEmploymentActivity(
          session.user.id,
          "Job queued to apply later",
          `${job.title} at ${job.company}`,
          {
            source: "employment_tracking",
            jobListingId: job.id,
            applicationId: application.id,
          },
        );
      }

      revalidateEmploymentShell(session.user.id);
      return apiSuccess({ application, action: "apply_later" });
    }

    const paid = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        deletedAt: null,
        metadata: { path: ["source"], equals: "employment" },
      },
    });

    if (!paid) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Payment required before submit.",
        400,
      );
    }

    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });

    const validation = employmentValidationService.parseStored(
      profile?.validationResult,
    );
    if (!validation?.canSubmit) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Application validation failed. Fix issues on the Review page before submitting.",
        400,
      );
    }

    const topMatch = await prisma.jobMatch.findFirst({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { matchScore: "desc" },
    });

    let application = body.jobListingId
      ? await prisma.employmentApplication.findFirst({
          where: {
            userId: session.user.id,
            jobListingId: body.jobListingId,
            deletedAt: null,
          },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.employmentApplication.findFirst({
          where: { userId: session.user.id, deletedAt: null },
          orderBy: { createdAt: "desc" },
        });

    const jobListingId =
      body.jobListingId ??
      application?.jobListingId ??
      topMatch?.jobListingId ??
      null;

    if (!application) {
      application = await employmentTrackingService.ensureApplication({
        userId: session.user.id,
        jobListingId,
        status: "PREPARING",
        packageData: profile?.applicationPackage ?? undefined,
        paidAt: paid.paidAt,
        seedTracking: true,
      });
    }

    const { application: submitted } =
      await employmentTrackingService.transitionApplicationStatus({
        applicationId: application.id,
        status: "SUBMITTED",
        title: "Application submitted",
        description:
          "Your overseas employment application was submitted and is with the employment team.",
        applicationData: {
          jobListingId,
          packageData: profile?.applicationPackage ?? undefined,
          paidAt: paid.paidAt ?? application.paidAt,
          submittedAt: new Date(),
        },
      });

    if (profile) {
      await prisma.workerProfile.update({
        where: { userId: session.user.id },
        data: { workflowStep: Math.max(profile.workflowStep, 17) },
      });
    }

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({
      application: submitted,
      action: "submit",
      paymentId: paid.id,
      redirectTo: `/work/employment/receipt?paymentId=${paid.id}&applicationId=${submitted.id}`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
