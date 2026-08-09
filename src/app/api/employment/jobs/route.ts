import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { employmentMatchingService } from "@/services/employment/matching.service";

/** Ensure job catalog exists in Neon, then list active listings. */
export async function GET() {
  try {
    await requireAuth();
    await employmentMatchingService.ensureCatalog();

    const jobs = await prisma.jobListing.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return apiSuccess({ jobs, count: jobs.length });
  } catch (error) {
    return handleApiError(error);
  }
}
