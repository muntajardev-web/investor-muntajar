import { prisma } from "@/lib/prisma";
import { EMPLOYMENT_DOCUMENT_KINDS } from "@/lib/employment/constants";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { employmentPackageService } from "@/services/employment/package.service";
import { employmentTrackingService } from "@/services/employment/tracking.service";
import type { Invoice, Payment } from "@prisma/client";

/**
 * Side-effects after an employment fee payment completes:
 * build package, create/update application, notify, advance workflow.
 */
export async function fulfillEmploymentPayment(
  userId: string,
  payment: Payment,
  invoice: Invoice,
) {
  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  const [documents, topMatch, coverLetter] = await Promise.all([
    prisma.employmentDocument.findMany({
      where: { userId, deletedAt: null },
    }),
    prisma.jobMatch.findFirst({
      where: { userId, deletedAt: null },
      include: { jobListing: true },
      orderBy: { matchScore: "desc" },
    }),
    prisma.coverLetterVersion.findFirst({
      where: { userId, deletedAt: null, isActive: true },
      orderBy: { version: "desc" },
    }),
  ]);

  if (profile) {
    const labels = documents.map(
      (d) =>
        EMPLOYMENT_DOCUMENT_KINDS.find((k) => k.kind === d.kind)?.label ??
        d.kind,
    );
    const pkg = employmentPackageService.build(
      {
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
      },
      topMatch?.jobListing
        ? {
            title: topMatch.jobListing.title,
            company: topMatch.jobListing.company,
            country: topMatch.jobListing.country,
          }
        : null,
      labels,
      {
        coverLetter: coverLetter?.content ?? null,
        coverLetterVersionId: coverLetter?.id ?? null,
        documents: documents.map((d) => ({
          id: d.id,
          kind: d.kind,
          label:
            EMPLOYMENT_DOCUMENT_KINDS.find((k) => k.kind === d.kind)?.label ??
            d.kind,
          fileName: d.fileName,
          uploadedAt: d.uploadedAt?.toISOString() ?? null,
        })),
      },
    );

    await prisma.workerProfile.update({
      where: { userId },
      data: {
        applicationPackage: employmentPackageService.toJson(pkg),
        workflowStep: Math.max(profile.workflowStep, 14),
      },
    });

    let application = await prisma.employmentApplication.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!application) {
      application = await employmentTrackingService.ensureApplication({
        userId,
        jobListingId: topMatch?.jobListingId,
        status: "PREPARING",
        packageData: employmentPackageService.toJson(pkg),
        paidAt: payment.paidAt ?? new Date(),
        seedTracking: false,
      });
    }

    await employmentTrackingService.transitionApplicationStatus({
      applicationId: application.id,
      status: "PREPARING",
      title: "Payment received",
      description: `Application fee paid via ${payment.provider}. Invoice ${invoice.invoiceNumber}. Package is being prepared for submission.`,
      forceEvent: true,
      applicationData: {
        packageData: employmentPackageService.toJson(pkg),
        paidAt: payment.paidAt ?? new Date(),
      },
      metadata: {
        paymentId: payment.id,
        invoiceId: invoice.id,
      },
    });
  }

  await prisma.notification.create({
    data: {
      userId,
      type: "PAYMENT",
      title: "Employment fee received",
      body: `Payment confirmed. Invoice ${invoice.invoiceNumber} is ready.`,
      data: {
        source: "employment",
        paymentId: payment.id,
        invoiceId: invoice.id,
      },
    },
  });

  await logEmploymentActivity(
    userId,
    "Payment completed",
    `Fee paid via ${payment.provider}. Invoice ${invoice.invoiceNumber}.`,
    { paymentId: payment.id, invoiceId: invoice.id },
  );

  revalidateEmploymentShell(userId);
}
