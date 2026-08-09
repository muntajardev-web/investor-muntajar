import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { employmentAnalysisService } from "@/services/employment/analysis.service";
import { employmentAiOrchestrator } from "@/services/employment/ai";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { AppError } from "@/lib";
import type { MatchKeyFactors } from "@/lib/employment/matching.types";

const bodySchema = z.object({
  question: z.string().min(3).max(1000),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const messages = await prisma.careerAdviceMessage.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
    return apiSuccess({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = bodySchema.parse(await request.json());

    const [profile, matches, history] = await Promise.all([
      prisma.workerProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.jobMatch.findMany({
        where: { userId: session.user.id, deletedAt: null },
        include: { jobListing: true },
        orderBy: { matchScore: "desc" },
        take: 10,
      }),
      prisma.careerAdviceMessage.findMany({
        where: { userId: session.user.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
    ]);

    if (!profile) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Worker profile required before using the Career Coach.",
        400,
      );
    }

    await prisma.careerAdviceMessage.create({
      data: {
        userId: session.user.id,
        role: "user",
        content: body.question,
      },
    });

    const analysis = employmentAnalysisService.parseStored(profile.aiAnalysis);

    const workflow = await employmentAiOrchestrator.runCareerCoach({
      userId: session.user.id,
      question: body.question,
      context: {
        userId: session.user.id,
        profile: {
          fullName: profile.fullName,
          nationality: profile.nationality,
          currentCountry: profile.currentCountry,
          preferredCountries: profile.preferredCountries,
          preferredIndustries: profile.preferredIndustries,
          preferredSalary:
            profile.preferredSalary != null
              ? Number(profile.preferredSalary)
              : null,
          preferredSalaryCurrency: profile.preferredSalaryCurrency,
          preferredJobType: profile.preferredJobType,
          skills: profile.skills,
          customSkills: profile.customSkills,
          education: profile.education,
          experience: profile.experience,
          languages: profile.languages,
          certifications: profile.certifications,
          passportNumber: profile.passportNumber,
          passportExpiry: profile.passportExpiry,
          profileCompletion: profile.profileCompletion,
        },
        analysis,
        matches: matches.map((m) => {
          const factors = m.keyFactors as MatchKeyFactors | null;
          return {
            title: m.jobListing.title,
            company: m.jobListing.company,
            country: m.jobListing.country,
            matchScore: m.matchScore,
            salaryMin:
              m.jobListing.salaryMin != null
                ? Number(m.jobListing.salaryMin)
                : null,
            salaryMax:
              m.jobListing.salaryMax != null
                ? Number(m.jobListing.salaryMax)
                : null,
            salaryCurrency: m.jobListing.salaryCurrency,
            visaSponsorship: m.jobListing.visaSponsorship,
            probabilityOfSuccess: factors?.probabilityOfSuccess ?? null,
            explanation: m.explanation,
          };
        }),
        history: history
          .reverse()
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
      },
    });

    if (!workflow.ok || workflow.data == null) {
      throw new AppError(
        "INTERNAL_ERROR",
        workflow.error ?? "Career coach failed",
        500,
      );
    }

    const answer = workflow.data;

    const assistant = await prisma.careerAdviceMessage.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: answer,
      },
    });

    await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: { workflowStep: Math.max(profile.workflowStep, 9) },
    });

    await logEmploymentActivity(
      session.user.id,
      "Career coach question",
      body.question.slice(0, 120),
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ answer, message: assistant });
  } catch (error) {
    return handleApiError(error);
  }
}
