import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { prisma } from "@/lib/prisma";

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

    const timeline = applications
      .flatMap((app) =>
        app.timeline.map((event) => ({
          ...event,
          applicationId: app.id,
          jobTitle: app.jobListing?.title ?? "Employment application",
          company: app.jobListing?.company ?? null,
          applicationStatus: app.status,
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      );

    return apiSuccess({ timeline, applications });
  } catch (error) {
    return handleApiError(error);
  }
}
