import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  computeProfileCompletion,
  isWorkerProfileComplete,
} from "@/lib/employment/profile/completion";
import type { DocumentAgentResult } from "./document-agent.types";
import { logEmploymentActivity } from "@/lib/employment/queries";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { writeDocumentAudit } from "./audit.service";

function mergeUnique(existing: string[], incoming: string[]) {
  return Array.from(new Set([...existing, ...incoming].filter(Boolean)));
}

function parseDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function applyExtractionToWorkerProfile(input: {
  userId: string;
  kind: string;
  documentId: string;
  extracted: DocumentAgentResult;
}) {
  const { userId, kind, documentId, extracted } = input;
  const existing = await prisma.workerProfile.findUnique({ where: { userId } });

  const education = Array.isArray(existing?.education)
    ? [...(existing.education as object[])]
    : [];
  const experience = Array.isArray(existing?.experience)
    ? [...(existing.experience as object[])]
    : [];
  const languages = Array.isArray(existing?.languages)
    ? [...(existing.languages as object[])]
    : [];
  const certifications = Array.isArray(existing?.certifications)
    ? [...(existing.certifications as object[])]
    : [];

  for (const e of extracted.education) {
    if (!e.level && !e.institution) continue;
    education.push({
      level: e.level ?? kind,
      institution: e.institution ?? "",
      graduationYear:
        e.graduationYear != null ? String(e.graduationYear) : "",
      gpa: e.gpa != null ? String(e.gpa) : "",
    });
  }

  const jobs =
    extracted.employmentHistory.length > 0
      ? extracted.employmentHistory
      : extracted.experience;

  for (const job of jobs) {
    if (!job.employer && !job.position) continue;
    experience.push({
      employer: job.employer ?? "",
      position: job.position ?? "",
      years: job.years != null ? String(job.years) : "",
      responsibilities: job.responsibilities ?? "",
      isCurrent: !!job.isCurrent,
      hasCertificate: kind === "EXPERIENCE_LETTER",
    });
  }

  for (const lang of extracted.languageScores) {
    if (!lang.language) continue;
    const exists = languages.some(
      (l) =>
        String((l as { language?: string }).language).toLowerCase() ===
        lang.language!.toLowerCase(),
    );
    if (!exists) {
      languages.push({
        language: lang.language,
        level: lang.level ?? "",
        score: lang.score ?? "",
      });
    }
  }

  for (const cert of extracted.certificates) {
    if (!cert.name) continue;
    certifications.push({
      name: cert.name,
      issuer: cert.issuer ?? "",
      year: cert.year != null ? String(cert.year) : "",
      expiry: cert.expiry ?? "",
    });
  }

  const skills = mergeUnique(existing?.skills ?? [], extracted.skills ?? []);
  const passport = extracted.passportDetails;

  const patch = {
    fullName: passport.fullName || existing?.fullName,
    nationality: passport.nationality || existing?.nationality,
    dateOfBirth: parseDate(passport.dateOfBirth) ?? existing?.dateOfBirth,
    passportNumber: passport.passportNumber || existing?.passportNumber,
    passportExpiry:
      parseDate(passport.passportExpiry) ?? existing?.passportExpiry,
    passportIssueDate:
      parseDate(passport.passportIssueDate ?? null) ??
      existing?.passportIssueDate,
    passportIssuingCountry:
      passport.passportIssuingCountry || existing?.passportIssuingCountry,
    education: education as Prisma.InputJsonValue,
    experience: experience as Prisma.InputJsonValue,
    languages: languages as Prisma.InputJsonValue,
    certifications: certifications as Prisma.InputJsonValue,
    skills,
  };

  const forCompletion = {
    ...existing,
    ...patch,
    preferredCountries: existing?.preferredCountries ?? [],
    preferredIndustries: existing?.preferredIndustries ?? [],
    customSkills: existing?.customSkills ?? [],
    preferredSalary:
      existing?.preferredSalary != null
        ? Number(existing.preferredSalary)
        : null,
    photoUrl: existing?.photoUrl,
    emergencyContact: existing?.emergencyContact,
  };

  const profileCompletion = computeProfileCompletion(forCompletion);
  const isComplete = isWorkerProfileComplete(forCompletion);

  if (existing) {
    await prisma.workerProfile.update({
      where: { userId },
      data: {
        ...patch,
        dateOfBirth: patch.dateOfBirth ?? undefined,
        passportExpiry: patch.passportExpiry ?? undefined,
        passportIssueDate: patch.passportIssueDate ?? undefined,
        profileCompletion,
        isComplete,
      },
    });
  } else {
    await prisma.workerProfile.create({
      data: {
        userId,
        fullName: patch.fullName,
        nationality: patch.nationality,
        dateOfBirth: patch.dateOfBirth ?? undefined,
        passportNumber: patch.passportNumber,
        passportExpiry: patch.passportExpiry ?? undefined,
        passportIssueDate: patch.passportIssueDate ?? undefined,
        passportIssuingCountry: patch.passportIssuingCountry,
        education: patch.education,
        experience: patch.experience,
        languages: patch.languages,
        certifications: patch.certifications,
        skills,
        profileCompletion,
        isComplete,
      },
    });
  }

  await logEmploymentActivity(
    userId,
    "Profile updated from document agent",
    `Extracted data from ${kind} applied (confidence ${extracted.confidence}%).`,
    { kind, documentId, confidence: extracted.confidence, profileCompletion },
  );

  await writeDocumentAudit({
    userId,
    action: "UPDATE",
    documentId,
    metadata: {
      event: "profile_updated_from_extraction",
      kind,
      confidence: extracted.confidence,
      profileCompletion,
    },
  });

  revalidateEmploymentShell(userId);
  return { profileCompletion };
}
