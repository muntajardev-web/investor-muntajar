import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import {
  COVER_LETTER_LANGUAGES,
  COVER_LETTER_TEMPLATES,
  type CoverLetterLanguageId,
  type CoverLetterTemplateId,
} from "@/services/employment/cover-letter.service";
import { employmentPackageService } from "@/services/employment/package.service";
import { employmentAiOrchestrator } from "@/services/employment/ai";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { AppError } from "@/lib";

const generateSchema = z.object({
  template: z
    .enum(["professional", "formal", "concise", "skills_focused"])
    .default("professional"),
  language: z.enum(["en", "de", "ja", "ar"]).default("en"),
  jobListingId: z.string().uuid().optional(),
  jobTitle: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  country: z.string().max(120).optional(),
});

const saveSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(20).max(20000),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const version = await prisma.coverLetterVersion.findFirst({
        where: { id, userId: session.user.id, deletedAt: null },
      });
      if (!version) {
        throw new AppError("NOT_FOUND", "Cover letter version not found", 404);
      }
      return apiSuccess({ version });
    }

    const versions = await prisma.coverLetterVersion.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { version: "desc" },
      take: 30,
    });

    return apiSuccess({
      versions,
      templates: COVER_LETTER_TEMPLATES,
      languages: COVER_LETTER_LANGUAGES,
      active: versions.find((v) => v.isActive) ?? versions[0] ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Generate a new cover letter version from profile + job context */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = generateSchema.parse(await request.json().catch(() => ({})));

    const [profile, match, latest] = await Promise.all([
      prisma.workerProfile.findUnique({ where: { userId: session.user.id } }),
      body.jobListingId
        ? prisma.jobListing.findFirst({
            where: { id: body.jobListingId, deletedAt: null },
          })
        : prisma.jobMatch
            .findFirst({
              where: { userId: session.user.id, deletedAt: null },
              include: { jobListing: true },
              orderBy: { matchScore: "desc" },
            })
            .then((m) => m?.jobListing ?? null),
      prisma.coverLetterVersion.findFirst({
        where: { userId: session.user.id, deletedAt: null },
        orderBy: { version: "desc" },
        select: { version: true },
      }),
    ]);

    if (!profile?.fullName?.trim()) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Add your full name on the profile before generating a cover letter.",
        400,
      );
    }

    const jobTitle = body.jobTitle ?? match?.title ?? null;
    const company = body.company ?? match?.company ?? null;
    const country = body.country ?? match?.country ?? null;

    const workflow = await employmentAiOrchestrator.runCoverLetter({
      userId: session.user.id,
      profile: {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        nationality: profile.nationality,
        currentCountry: profile.currentCountry,
        preferredCountries: profile.preferredCountries,
        preferredIndustries: profile.preferredIndustries,
        skills: profile.skills,
        customSkills: profile.customSkills,
        education: profile.education,
        experience: profile.experience,
        languages: profile.languages,
        certifications: profile.certifications,
      },
      job: {
        jobTitle,
        company,
        country,
        jobListingId: match?.id ?? body.jobListingId ?? null,
      },
      template: body.template as CoverLetterTemplateId,
      language: body.language as CoverLetterLanguageId,
    });

    if (!workflow.ok || !workflow.data) {
      throw new AppError(
        "INTERNAL_ERROR",
        workflow.error ?? "Cover letter generation failed",
        500,
      );
    }

    const generated = workflow.data;

    const nextVersion = (latest?.version ?? 0) + 1;

    await prisma.coverLetterVersion.updateMany({
      where: { userId: session.user.id, deletedAt: null, isActive: true },
      data: { isActive: false },
    });

    const version = await prisma.coverLetterVersion.create({
      data: {
        userId: session.user.id,
        version: nextVersion,
        template: generated.template,
        language: generated.language,
        jobTitle,
        company,
        country,
        jobListingId: match?.id ?? body.jobListingId ?? null,
        content: generated.content,
        userEdited: false,
        isActive: true,
      },
    });

    // Keep application package cover letter in sync with active version
    const pkg = employmentPackageService.parseStored(profile.applicationPackage);
    if (pkg) {
      await prisma.workerProfile.update({
        where: { userId: session.user.id },
        data: {
          applicationPackage: employmentPackageService.toJson({
            ...pkg,
            coverLetter: generated.content,
            userEdited: pkg.userEdited,
          }),
        },
      });
    }

    await logEmploymentActivity(
      session.user.id,
      "Cover letter generated",
      `v${nextVersion} · ${generated.template} · ${jobTitle ?? "general"}`,
      {
        versionId: version.id,
        template: generated.template,
        language: generated.language,
      },
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ version, templates: COVER_LETTER_TEMPLATES });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Save edits to an existing version (stores as updated content + marks userEdited) */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = saveSchema.parse(await request.json());

    const existing = await prisma.coverLetterVersion.findFirst({
      where: { id: body.id, userId: session.user.id, deletedAt: null },
    });
    if (!existing) {
      throw new AppError("NOT_FOUND", "Cover letter version not found", 404);
    }

    const version = await prisma.coverLetterVersion.update({
      where: { id: existing.id },
      data: {
        content: body.content,
        userEdited: true,
        isActive: true,
      },
    });

    // Deactivate others if this becomes active
    await prisma.coverLetterVersion.updateMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
        isActive: true,
        id: { not: version.id },
      },
      data: { isActive: false },
    });

    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
      select: { applicationPackage: true },
    });
    const pkg = employmentPackageService.parseStored(profile?.applicationPackage);
    if (pkg) {
      await prisma.workerProfile.update({
        where: { userId: session.user.id },
        data: {
          applicationPackage: employmentPackageService.toJson({
            ...pkg,
            coverLetter: body.content,
            userEdited: true,
            editedAt: new Date().toISOString(),
          }),
        },
      });
    }

    await logEmploymentActivity(
      session.user.id,
      "Cover letter edited",
      `Saved edits to version ${version.version}`,
      { versionId: version.id },
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ version });
  } catch (error) {
    return handleApiError(error);
  }
}
