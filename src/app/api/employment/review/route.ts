import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { employmentValidationService } from "@/services/employment/validation.service";
import { employmentPackageService } from "@/services/employment/package.service";
import { employmentAiOrchestrator } from "@/services/employment/ai";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { AppError } from "@/lib";
import { employmentTrackingService } from "@/services/employment/tracking.service";

export async function GET() {
  try {
    const session = await requireAuth();
    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
      select: { validationResult: true },
    });
    const result = employmentValidationService.parseStored(
      profile?.validationResult,
    );
    return apiSuccess({ result });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  try {
    const session = await requireAuth();
    const [profile, documents, topMatch] = await Promise.all([
      prisma.workerProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.employmentDocument.findMany({
        where: { userId: session.user.id, deletedAt: null },
        select: { id: true, kind: true, fileName: true, extractedData: true },
      }),
      prisma.jobMatch.findFirst({
        where: { userId: session.user.id, deletedAt: null },
        include: { jobListing: true },
        orderBy: { matchScore: "desc" },
      }),
    ]);

    if (!profile) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Worker profile required.",
        400,
      );
    }

    const pkg = employmentPackageService.parseStored(profile.applicationPackage);

    const unsupportedClaims: string[] = [];
    for (const doc of documents) {
      const data = doc.extractedData as { unsupportedClaims?: string[] } | null;
      if (Array.isArray(data?.unsupportedClaims)) {
        unsupportedClaims.push(...data.unsupportedClaims.filter(Boolean));
      }
    }

    const workflow = await employmentAiOrchestrator.runValidation({
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
        skills: profile.skills,
        customSkills: profile.customSkills,
        education: profile.education,
        experience: profile.experience,
        languages: profile.languages,
        certifications: profile.certifications,
        passportNumber: profile.passportNumber,
        passportExpiry: profile.passportExpiry,
        dateOfBirth: profile.dateOfBirth,
      },
      documents: documents.map((d) => ({
        id: d.id,
        kind: d.kind,
        fileName: d.fileName,
      })),
      options: {
        packagePresent: {
          hasResume: !!(
            pkg?.professionalCv ||
            pkg?.atsResume ||
            pkg?.countryResume
          ),
          hasCoverLetter: !!pkg?.coverLetter?.trim(),
        },
        job: topMatch?.jobListing
          ? {
              title: topMatch.jobListing.title,
              company: topMatch.jobListing.company,
              country: topMatch.jobListing.country,
              experienceYears: topMatch.jobListing.experienceYears,
              educationLevel: topMatch.jobListing.educationLevel,
              languages: topMatch.jobListing.languages,
              requirements: topMatch.jobListing.requirements,
              skills: topMatch.jobListing.skills,
            }
          : null,
        unsupportedClaims,
      },
    });

    if (!workflow.ok || !workflow.data) {
      throw new AppError(
        "INTERNAL_ERROR",
        workflow.error ?? "Validation failed",
        500,
      );
    }

    const result = workflow.data;

    await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: {
        validationResult: employmentValidationService.toJson(result),
        workflowStep: Math.max(profile.workflowStep, 12),
      },
    });

    await logEmploymentActivity(
      session.user.id,
      result.ok ? "Validation passed" : "Validation failed",
      result.ok
        ? "Validation report clear — submission allowed."
        : `Report ${result.report.reportId}: ${result.report.summary.errorCount} error(s), ${result.report.summary.warningCount} warning(s). Submission blocked.`,
      {
        reportId: result.report.reportId,
        errorCount: result.report.summary.errorCount,
        warningCount: result.report.summary.warningCount,
        canSubmit: result.canSubmit,
        orchestratorRequestId: workflow.requestId,
      },
    );

    if (result.canSubmit) {
      const paid = await prisma.payment.findFirst({
        where: {
          userId: session.user.id,
          status: "COMPLETED",
          deletedAt: null,
          metadata: { path: ["source"], equals: "employment" },
        },
        select: { id: true },
      });

      if (!paid) {
        const application =
          await employmentTrackingService.ensureApplication({
            userId: session.user.id,
            jobListingId: topMatch?.jobListingId,
            status: "WAITING_PAYMENT",
            packageData: profile.applicationPackage ?? undefined,
          });

        if (
          application.status === "DRAFT" ||
          application.status === "PREPARING" ||
          application.status === "WAITING_PAYMENT"
        ) {
          await employmentTrackingService.transitionApplicationStatus({
            applicationId: application.id,
            status: "WAITING_PAYMENT",
            title: "Waiting for payment",
            description:
              "Validation passed. Pay the application fee to continue to submission.",
          });
        }
      }
    }

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ result, report: result.report });
  } catch (error) {
    return handleApiError(error);
  }
}
