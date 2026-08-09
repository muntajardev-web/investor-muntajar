import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { employmentAiOrchestrator } from "@/services/employment/ai";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { AppError } from "@/lib";

export async function POST() {
  try {
    const session = await requireAuth();
    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Worker profile required.",
        400,
      );
    }

    const workflow = await employmentAiOrchestrator.runJobMatching({
      userId: session.user.id,
      bypassCache: true,
      profile: {
        fullName: profile.fullName,
        nationality: profile.nationality,
        currentCountry: profile.currentCountry,
        preferredCountries: profile.preferredCountries,
        preferredSalary:
          profile.preferredSalary != null
            ? Number(profile.preferredSalary)
            : null,
        preferredJobType: profile.preferredJobType,
        preferredIndustries: profile.preferredIndustries,
        skills: profile.skills,
        customSkills: profile.customSkills,
        education: profile.education,
        experience: profile.experience,
        languages: profile.languages,
        certifications: profile.certifications,
        passportNumber: profile.passportNumber,
        passportExpiry: profile.passportExpiry,
      },
    });

    if (!workflow.ok || !workflow.data) {
      throw new AppError(
        "INTERNAL_ERROR",
        workflow.error ?? "Job matching failed",
        500,
      );
    }

    const matches = workflow.data;

    await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: { workflowStep: Math.max(profile.workflowStep, 8) },
    });

    await logEmploymentActivity(
      session.user.id,
      "Job matching completed",
      `Matching engine found ${matches.length} top jobs (filters → vector → ranking).`,
      {
        matchCount: matches.length,
        orchestratorRequestId: workflow.requestId,
      },
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ matches });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const session = await requireAuth();
    const matches = await prisma.jobMatch.findMany({
      where: { userId: session.user.id, deletedAt: null },
      include: { jobListing: true },
      orderBy: { matchScore: "desc" },
      take: 10,
    });
    return apiSuccess({ matches });
  } catch (error) {
    return handleApiError(error);
  }
}
