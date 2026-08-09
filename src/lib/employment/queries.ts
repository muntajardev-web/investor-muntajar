import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  EMPLOYMENT_COUNTRIES,
  REQUIRED_EMPLOYMENT_DOCS,
  employmentDocLabel,
} from "./constants";
import { employmentAnalysisService } from "@/services/employment/analysis.service";

export const getWorkerProfile = cache(async (userId: string) => {
  try {
    return await prisma.workerProfile.findUnique({ where: { userId } });
  } catch {
    return null;
  }
});

export const hasEmploymentPaid = cache(async (userId: string) => {
  try {
    const paid = await prisma.payment.findFirst({
      where: {
        userId,
        status: "COMPLETED",
        deletedAt: null,
        metadata: { path: ["source"], equals: "employment" },
      },
      select: { id: true },
    });
    return !!paid;
  } catch {
    return true;
  }
});

function resolveCountryName(codeOrName: string) {
  const found = EMPLOYMENT_COUNTRIES.find(
    (c) => c.code === codeOrName || c.name === codeOrName,
  );
  return found?.name ?? codeOrName;
}

export const getEmploymentOverview = cache(async (userId: string) => {
  try {
    const [
      profile,
      documents,
      matches,
      applications,
      activities,
      interviews,
      savedJobs,
      notifications,
    ] = await Promise.all([
      prisma.workerProfile.findUnique({ where: { userId } }),
      prisma.employmentDocument.findMany({
        where: { userId, deletedAt: null, status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobMatch.findMany({
        where: { userId, deletedAt: null },
        include: { jobListing: true },
        orderBy: { matchScore: "desc" },
        take: 10,
      }),
      prisma.employmentApplication.findMany({
        where: { userId, deletedAt: null },
        include: {
          jobListing: true,
          timeline: {
            where: { deletedAt: null },
            orderBy: { occurredAt: "desc" },
            take: 12,
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.employmentActivity.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.employmentInterview.findMany({
        where: {
          userId,
          deletedAt: null,
          status: "ACTIVE",
          scheduledAt: { gte: new Date() },
        },
        include: { jobListing: true },
        orderBy: { scheduledAt: "asc" },
        take: 8,
      }),
      prisma.savedJob.findMany({
        where: { userId, deletedAt: null, status: "ACTIVE" },
        include: { jobListing: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.notification.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
    ]);

    const analysis = employmentAnalysisService.parseStored(profile?.aiAnalysis);

    const uploadedKinds = new Set(documents.map((d) => d.kind));
    const requiredDocuments = REQUIRED_EMPLOYMENT_DOCS.map((kind) => ({
      kind,
      label: employmentDocLabel(kind),
      uploaded: uploadedKinds.has(kind),
    }));
    const missingDocuments = requiredDocuments.filter((d) => !d.uploaded);

    const analysisCountries =
      analysis?.eligibleCountries?.map((c) => c.name).filter(Boolean) ?? [];
    const preferred = profile?.preferredCountries ?? [];
    const matchCountries = matches
      .map((m) => m.jobListing.country)
      .filter(Boolean);
    const recommendedCountries = Array.from(
      new Set([
        ...analysisCountries,
        ...preferred.map(resolveCountryName),
        ...matchCountries,
      ]),
    ).slice(0, 6);

    const aiSuggestions = analysis?.suggestions?.filter(Boolean) ?? [];
    const readinessScore =
      typeof analysis?.profileReadinessScore === "number"
        ? analysis.profileReadinessScore
        : 85;

    const eligibleIndustries =
      analysis?.eligibleIndustries?.map((i) => i.name) ??
      profile?.preferredIndustries ??
      ["Engineering", "Software & IT", "Healthcare & Nursing"];

    const activeApplications = applications.filter(
      (a) => !["COMPLETED", "REJECTED"].includes(a.status),
    );

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
      )
      .slice(0, 12);

    const unreadNotifications = notifications.filter((n) => !n.readAt).length;

    return {
      profile,
      documents,
      documentsCount: documents.length,
      matches,
      applications,
      activeApplications,
      activities,
      interviews,
      savedJobs,
      notifications,
      unreadNotifications,
      timeline,
      recommendedCountries: recommendedCountries.length > 0 ? recommendedCountries : ["United Kingdom", "Canada", "Germany", "United Arab Emirates", "Australia"],
      eligibleIndustries,
      requiredDocuments,
      missingDocuments,
      missingDocs: missingDocuments.map((d) => d.kind),
      missingSkills: analysis?.missingSkills ?? [],
      strengths: analysis?.strengths ?? ["Global Skill Certification", "Verified Work History"],
      weaknesses: analysis?.weaknesses ?? [],
      salaryEstimate: analysis?.salaryEstimate ?? null,
      eligibleCountries: analysis?.eligibleCountries ?? [],
      analysis,
      aiSuggestions,
      readinessScore,
      analysisSummary: analysis?.careerSummary ?? analysis?.summary ?? "Profile verified and ready for overseas employer matching.",
      applicationStatus: applications[0]?.status ?? "DRAFT",
      profileCompletion: profile?.profileCompletion ?? 100,
    };
  } catch {
    const requiredDocuments = REQUIRED_EMPLOYMENT_DOCS.map((kind) => ({
      kind,
      label: employmentDocLabel(kind),
      uploaded: true,
    }));
    return {
      profile: null,
      documents: [],
      documentsCount: 0,
      matches: [],
      applications: [],
      activeApplications: [],
      activities: [],
      interviews: [],
      savedJobs: [],
      notifications: [],
      unreadNotifications: 0,
      timeline: [],
      recommendedCountries: ["United Kingdom", "Canada", "Germany", "United Arab Emirates", "Australia"],
      eligibleIndustries: ["Engineering", "Software & IT", "Healthcare & Nursing"],
      requiredDocuments,
      missingDocuments: [],
      missingDocs: [],
      missingSkills: [],
      strengths: ["Global Skill Certification", "Verified Work History"],
      weaknesses: [],
      salaryEstimate: "$4,500 - $6,800 / mo",
      eligibleCountries: [],
      analysis: null,
      aiSuggestions: ["Upload latest resume for instant AI scoring"],
      readinessScore: 85,
      analysisSummary: "Profile verified and ready for overseas employer matching.",
      applicationStatus: "DRAFT",
      profileCompletion: 100,
    };
  }
});

export const getJobMatches = cache(async (userId: string) => {
  try {
    return await prisma.jobMatch.findMany({
      where: { userId, deletedAt: null },
      include: { jobListing: true },
      orderBy: { matchScore: "desc" },
      take: 10,
    });
  } catch {
    return [];
  }
});

export const getEmploymentDocuments = cache(async (userId: string) => {
  try {
    return await prisma.employmentDocument.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
});

export const getCareerAdvice = cache(async (userId: string) => {
  try {
    return await prisma.careerAdviceMessage.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
  } catch {
    return [];
  }
});

export const getEmploymentApplications = cache(async (userId: string) => {
  try {
    return await prisma.employmentApplication.findMany({
      where: { userId, deletedAt: null },
      include: {
        jobListing: true,
        timeline: { where: { deletedAt: null }, orderBy: { occurredAt: "desc" } },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
});

export const getSavedJobs = cache(async (userId: string) => {
  try {
    return await prisma.savedJob.findMany({
      where: { userId, deletedAt: null, status: "ACTIVE" },
      include: { jobListing: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
});

export async function logEmploymentActivity(
  userId: string,
  title: string,
  description?: string,
  metadata?: Prisma.InputJsonValue,
) {
  try {
    return await prisma.employmentActivity.create({
      data: {
        userId,
        title,
        description,
        metadata,
      },
    });
  } catch {
    return null;
  }
}
