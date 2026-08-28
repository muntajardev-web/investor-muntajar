import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import {
  employmentPackageService,
  type PackageDocumentItem,
} from "@/services/employment/package.service";
import { employmentAiOrchestrator } from "@/services/employment/ai";
import {
  EMPLOYMENT_DOCUMENT_KINDS,
  employmentDocLabel,
} from "@/lib/employment/constants";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { AppError } from "@/lib";

const generateSchema = z.object({
  jobMatchId: z.string().uuid().optional(),
});

const saveSchema = z.object({
  professionalCv: z.string().max(50000).optional(),
  atsResume: z.string().max(50000).optional(),
  countryResume: z.string().max(50000).optional(),
  coverLetter: z.string().max(20000).optional(),
  applicationSummary: z.string().max(10000).optional(),
});

function profileInput(
  profile: NonNullable<
    Awaited<ReturnType<typeof prisma.workerProfile.findUnique>>
  >,
) {
  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    currentAddress: profile.currentAddress,
    currentCity: profile.currentCity,
    currentCountry: profile.currentCountry,
    nationality: profile.nationality,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    maritalStatus: profile.maritalStatus,
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
    hasDrivingLicense: profile.hasDrivingLicense,
  };
}

function toDocItems(
  documents: Array<{
    id: string;
    kind: string;
    fileName: string;
    uploadedAt: Date | null;
  }>,
): PackageDocumentItem[] {
  return documents.map((d) => ({
    id: d.id,
    kind: d.kind,
    label: employmentDocLabel(d.kind),
    fileName: d.fileName,
    uploadedAt: d.uploadedAt?.toISOString() ?? null,
  }));
}

/** GET package + live collection inventory */
export async function GET() {
  try {
    const session = await requireAuth();
    const [profile, documents, coverLetter] = await Promise.all([
      prisma.workerProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.employmentDocument.findMany({
        where: { userId: session.user.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      prisma.coverLetterVersion.findFirst({
        where: {
          userId: session.user.id,
          deletedAt: null,
          isActive: true,
        },
        orderBy: { version: "desc" },
      }),
    ]);

    const pkg = employmentPackageService.parseStored(
      profile?.applicationPackage,
    );
    const input = profile
      ? profileInput(profile)
      : ({} as ReturnType<typeof profileInput>);
    const docs = toDocItems(documents);
    const liveCollection = employmentPackageService.computeCollection({
      hasResume: !!(
        pkg?.professionalCv ||
        pkg?.atsResume ||
        pkg?.countryResume
      ),
      hasCoverLetter: !!(coverLetter?.content || pkg?.coverLetter),
      profile: input,
      documents: docs,
    });

    return apiSuccess({
      package: pkg,
      collection: liveCollection,
      documents: docs,
      coverLetterVersion: coverLetter
        ? {
            id: coverLetter.id,
            version: coverLetter.version,
            template: coverLetter.template,
            language: coverLetter.language,
          }
        : null,
      fullName: profile?.fullName ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Assemble final application package:
 * Resume + Cover Letter + Passport + Certificates + Experience + Education
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = generateSchema.parse(await request.json().catch(() => ({})));

    const [profile, documents, match, coverLetter] = await Promise.all([
      prisma.workerProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.employmentDocument.findMany({
        where: { userId: session.user.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      body.jobMatchId
        ? prisma.jobMatch.findFirst({
            where: {
              id: body.jobMatchId,
              userId: session.user.id,
              deletedAt: null,
            },
            include: { jobListing: true },
          })
        : prisma.jobMatch.findFirst({
            where: { userId: session.user.id, deletedAt: null },
            include: { jobListing: true },
            orderBy: { matchScore: "desc" },
          }),
      prisma.coverLetterVersion.findFirst({
        where: {
          userId: session.user.id,
          deletedAt: null,
          isActive: true,
        },
        orderBy: { version: "desc" },
      }),
    ]);

    if (!profile) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Worker profile required.",
        400,
      );
    }

    if (!profile.fullName?.trim()) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Add your full name on the profile before building the application package.",
        400,
      );
    }

    const labels = documents.map(
      (d) =>
        EMPLOYMENT_DOCUMENT_KINDS.find((k) => k.kind === d.kind)?.label ??
        d.kind,
    );
    const docs = toDocItems(documents);

    const workflow = await employmentAiOrchestrator.runResumeBuild({
      userId: session.user.id,
      profile: profileInput(profile),
      targetJob: match?.jobListing
        ? {
            title: match.jobListing.title,
            company: match.jobListing.company,
            country: match.jobListing.country,
          }
        : null,
      uploadedDocLabels: labels,
      extras: {
        coverLetter: coverLetter?.content ?? null,
        coverLetterVersionId: coverLetter?.id ?? null,
        documents: docs,
      },
    });

    if (!workflow.ok || !workflow.data) {
      throw new AppError(
        "INTERNAL_ERROR",
        workflow.error ?? "Application package build failed",
        500,
      );
    }

    const pkg = workflow.data;

    const updated = await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: {
        applicationPackage: employmentPackageService.toJson(pkg),
        workflowStep: Math.max(profile.workflowStep, 10),
      },
    });

    await logEmploymentActivity(
      session.user.id,
      "Application package generated",
      `Final package assembled (${pkg.collection.readyCount}/${pkg.collection.totalCount} sections ready).`,
      {
        collection: pkg.collection,
        orchestratorRequestId: workflow.requestId,
      },
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ package: pkg, profile: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Save user edits to stored package */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = saveSchema.parse(await request.json());
    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      throw new AppError("VALIDATION_ERROR", "Worker profile required.", 400);
    }

    const existing = employmentPackageService.parseStored(
      profile.applicationPackage,
    );
    if (!existing) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Generate the application package before editing.",
        400,
      );
    }

    const next = {
      ...existing,
      professionalCv: body.professionalCv ?? existing.professionalCv,
      atsResume: body.atsResume ?? existing.atsResume,
      countryResume: body.countryResume ?? existing.countryResume,
      coverLetter: body.coverLetter ?? existing.coverLetter,
      applicationSummary:
        body.applicationSummary ?? existing.applicationSummary,
      userEdited: true,
      editedAt: new Date().toISOString(),
      collection: employmentPackageService.computeCollection({
        hasResume: !!(
          (body.professionalCv ?? existing.professionalCv) ||
          (body.atsResume ?? existing.atsResume) ||
          (body.countryResume ?? existing.countryResume)
        ),
        hasCoverLetter: !!(body.coverLetter ?? existing.coverLetter)?.trim(),
        profile: {
          fullName: existing.profileSnapshot.fullName,
          passportNumber: existing.profileSnapshot.passportNumber,
          education: existing.profileSnapshot.education,
          experience: existing.profileSnapshot.experience,
          certifications: existing.profileSnapshot.certifications,
        },
        documents: existing.documents,
      }),
    };

    await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: {
        applicationPackage: employmentPackageService.toJson(next),
      },
    });

    await logEmploymentActivity(
      session.user.id,
      "Application package edited",
      "Package text edits saved before submission.",
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ package: next });
  } catch (error) {
    return handleApiError(error);
  }
}
