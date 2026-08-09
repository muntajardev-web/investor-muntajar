import type {
  EmploymentApplication,
  EmploymentApplicationStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import {
  STATUS_DESCRIPTIONS,
  formatEmploymentStatus,
} from "@/lib/employment/format";

export type StatusTransitionInput = {
  applicationId: string;
  status: EmploymentApplicationStatus;
  title?: string;
  description?: string;
  actorUserId?: string;
  notify?: boolean;
  /** Create timeline + notify + activity even if status is unchanged */
  forceEvent?: boolean;
  metadata?: Record<string, unknown>;
  applicationData?: {
    packageData?: Prisma.InputJsonValue;
    paidAt?: Date | null;
    submittedAt?: Date | null;
    jobListingId?: string | null;
    notes?: string | null;
  };
};

export type StatusTransitionResult = {
  application: EmploymentApplication;
  previousStatus: EmploymentApplicationStatus;
  changed: boolean;
  timelineEventId: string | null;
};

function defaultDescription(status: EmploymentApplicationStatus) {
  return STATUS_DESCRIPTIONS[status];
}

/**
 * Update application status, append timeline, notify the worker, and log activity.
 */
export async function transitionApplicationStatus(
  input: StatusTransitionInput,
): Promise<StatusTransitionResult> {
  const application = await prisma.employmentApplication.findFirst({
    where: { id: input.applicationId, deletedAt: null },
    include: { jobListing: true },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found", 404);
  }

  const previousStatus = application.status;
  const changed = previousStatus !== input.status;
  const emitEvent = changed || input.forceEvent === true;
  const title =
    input.title ?? `Status updated: ${formatEmploymentStatus(input.status)}`;
  const description = input.description ?? defaultDescription(input.status);

  let updated: EmploymentApplication = application;

  if (changed || input.applicationData) {
    updated = await prisma.employmentApplication.update({
      where: { id: application.id },
      data: {
        ...(changed ? { status: input.status } : {}),
        ...(input.status === "SUBMITTED" && !application.submittedAt
          ? { submittedAt: new Date() }
          : {}),
        ...(input.applicationData?.packageData !== undefined
          ? { packageData: input.applicationData.packageData }
          : {}),
        ...(input.applicationData?.paidAt !== undefined
          ? { paidAt: input.applicationData.paidAt }
          : {}),
        ...(input.applicationData?.submittedAt !== undefined
          ? { submittedAt: input.applicationData.submittedAt }
          : {}),
        ...(input.applicationData?.jobListingId !== undefined
          ? { jobListingId: input.applicationData.jobListingId }
          : {}),
        ...(input.applicationData?.notes !== undefined
          ? { notes: input.applicationData.notes }
          : {}),
      },
    });
  }

  let timelineEventId: string | null = null;

  if (emitEvent) {
    const event = await prisma.employmentTimelineEvent.create({
      data: {
        applicationId: application.id,
        title,
        description,
        status: input.status,
      },
    });
    timelineEventId = event.id;

    if (input.notify !== false) {
      const jobLabel = application.jobListing
        ? `${application.jobListing.title} at ${application.jobListing.company}`
        : "your overseas employment application";

      await prisma.notification.create({
        data: {
          userId: application.userId,
          type: "APPLICATION_UPDATE",
          title: `Application: ${formatEmploymentStatus(input.status)}`,
          body: `${description} (${jobLabel})`,
          data: {
            source: "employment",
            applicationId: application.id,
            previousStatus,
            status: input.status,
            timelineEventId: event.id,
          },
        },
      });
    }

    await logEmploymentActivity(
      application.userId,
      title,
      description,
      {
        source: "employment_tracking",
        applicationId: application.id,
        previousStatus,
        status: input.status,
        actorUserId: input.actorUserId ?? null,
        ...(input.metadata ?? {}),
      } as Prisma.InputJsonValue,
    );

    revalidateEmploymentShell(application.userId);
  }

  return {
    application: updated,
    previousStatus,
    changed,
    timelineEventId,
  };
}

/** Seed first timeline + notify + activity for a brand-new application. */
async function seedInitialTracking(
  userId: string,
  applicationId: string,
  status: EmploymentApplicationStatus,
) {
  const title = `Application created · ${formatEmploymentStatus(status)}`;
  const description = defaultDescription(status);

  await prisma.employmentTimelineEvent.create({
    data: {
      applicationId,
      title,
      description,
      status,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      type: "APPLICATION_UPDATE",
      title: `Application: ${formatEmploymentStatus(status)}`,
      body: description,
      data: {
        source: "employment",
        applicationId,
        status,
      },
    },
  });

  await logEmploymentActivity(userId, title, description, {
    source: "employment_tracking",
    applicationId,
    status,
  });
}

export async function ensureApplication(opts: {
  userId: string;
  jobListingId?: string | null;
  status?: EmploymentApplicationStatus;
  packageData?: Prisma.InputJsonValue;
  paidAt?: Date | null;
  notes?: string;
  seedTracking?: boolean;
}) {
  let application = opts.jobListingId
    ? await prisma.employmentApplication.findFirst({
        where: {
          userId: opts.userId,
          jobListingId: opts.jobListingId,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
      })
    : await prisma.employmentApplication.findFirst({
        where: { userId: opts.userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });

  if (!application) {
    application = await prisma.employmentApplication.create({
      data: {
        userId: opts.userId,
        jobListingId: opts.jobListingId ?? undefined,
        status: opts.status ?? "DRAFT",
        packageData: opts.packageData,
        paidAt: opts.paidAt ?? undefined,
        notes: opts.notes,
      },
    });

    if (opts.seedTracking !== false) {
      await seedInitialTracking(
        opts.userId,
        application.id,
        application.status,
      );
      revalidateEmploymentShell(opts.userId);
    }
  }

  return application;
}

export async function getApplicationTracking(
  userId: string,
  applicationId?: string,
) {
  const applications = await prisma.employmentApplication.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(applicationId ? { id: applicationId } : {}),
    },
    include: {
      jobListing: true,
      timeline: {
        where: { deletedAt: null },
        orderBy: { occurredAt: "desc" },
      },
      interviews: {
        where: { deletedAt: null },
        orderBy: { scheduledAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const appIds = new Set(applications.map((a) => a.id));

  const activities = await prisma.employmentActivity.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const history = activities.filter((a) => {
    const meta = (a.metadata ?? {}) as Record<string, unknown>;
    if (meta.source === "employment_tracking") {
      if (applicationId) return meta.applicationId === applicationId;
      return (
        typeof meta.applicationId === "string" &&
        appIds.has(meta.applicationId)
      );
    }
    if (applicationId) return meta.applicationId === applicationId;
    if (typeof meta.applicationId === "string" && appIds.has(meta.applicationId)) {
      return true;
    }
    // Include payment / interview / submit style activities without app id
    return /application|payment|interview|status|offer|visa|medical/i.test(
      a.title,
    );
  });

  return {
    applications,
    activities: history.length > 0 ? history : activities.slice(0, 40),
  };
}

export const employmentTrackingService = {
  transitionApplicationStatus,
  ensureApplication,
  getApplicationTracking,
};
