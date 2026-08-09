import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { employmentAnalysisService } from "@/services/employment/analysis.service";
import { employmentAiOrchestrator } from "@/services/employment/ai";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { AppError } from "@/lib";

async function loadAnalysisContext(userId: string) {
  const [profile, documents] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId } }),
    prisma.employmentDocument.findMany({
      where: { userId, deletedAt: null },
      select: { kind: true },
    }),
  ]);
  return { profile, documents };
}

export async function GET() {
  try {
    const session = await requireAuth();
    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
      select: { aiAnalysis: true, profileCompletion: true, workflowStep: true },
    });

    const analysis = employmentAnalysisService.parseStored(profile?.aiAnalysis);

    return apiSuccess({
      analysis,
      profileCompletion: profile?.profileCompletion ?? 0,
      workflowStep: profile?.workflowStep ?? 1,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  try {
    const session = await requireAuth();
    const { profile, documents } = await loadAnalysisContext(session.user.id);

    if (!profile) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Complete personal information first.",
        400,
      );
    }

    const workflow = await employmentAiOrchestrator.runWorkerAnalysis({
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
        preferredSalaryCurrency: profile.preferredSalaryCurrency,
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
      uploadedKinds: documents.map((d) => d.kind),
    });

    if (!workflow.ok || !workflow.data) {
      throw new AppError(
        "INTERNAL_ERROR",
        workflow.error ?? "Worker analysis failed",
        500,
      );
    }

    const analysis = workflow.data;

    const updated = await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: {
        aiAnalysis: employmentAnalysisService.toJson(analysis),
        workflowStep: Math.max(profile.workflowStep, 7),
      },
    });

    await logEmploymentActivity(
      session.user.id,
      "AI worker analysis completed",
      `Readiness ${analysis.profileReadinessScore}% · ${analysis.eligibleCountries
        .slice(0, 3)
        .map((c) => c.name)
        .join(", ")}`,
      {
        profileReadinessScore: analysis.profileReadinessScore,
        eligibleCountries: analysis.eligibleCountries.map((c) => c.name),
        eligibleIndustries: analysis.eligibleIndustries.map((i) => i.name),
        orchestratorRequestId: workflow.requestId,
      },
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ analysis, profile: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
