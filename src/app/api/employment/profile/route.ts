import { NextRequest } from "next/server";
import { z } from "zod";
import type { PreferredJobType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import {
  computeProfileCompletion,
  isWorkerProfileComplete,
  getProfileSectionCompletion,
} from "@/lib/employment/profile/completion";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { logEmploymentActivity } from "@/lib/employment/queries";

const educationSchema = z.object({
  level: z.string().optional(),
  institution: z.string().optional(),
  graduationYear: z.union([z.number(), z.string()]).optional(),
  gpa: z.union([z.number(), z.string()]).optional(),
});

const experienceSchema = z.object({
  employer: z.string().optional(),
  position: z.string().optional(),
  years: z.union([z.number(), z.string()]).optional(),
  responsibilities: z.string().optional(),
  isCurrent: z.boolean().optional(),
  hasCertificate: z.boolean().optional(),
  hasReference: z.boolean().optional(),
});

const languageSchema = z.object({
  language: z.string().optional(),
  level: z.string().optional(),
  score: z.string().optional(),
});

const certificationSchema = z.object({
  name: z.string().optional(),
  issuer: z.string().optional(),
  year: z.union([z.number(), z.string()]).optional(),
  expiry: z.string().optional(),
});

const emergencySchema = z.object({
  name: z.string().optional(),
  relation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

const profileSchema = z.object({
  fullName: z.string().optional(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().nullable().optional(),
  passportIssueDate: z.string().nullable().optional(),
  passportIssuingCountry: z.string().optional(),
  currentCountry: z.string().optional(),
  currentAddress: z.string().optional(),
  currentCity: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  maritalStatus: z.string().optional(),
  hasDrivingLicense: z.boolean().optional(),
  preferredCountries: z.array(z.string()).optional(),
  preferredSalary: z.number().nullable().optional(),
  preferredSalaryCurrency: z.string().optional(),
  preferredJobType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "SEASONAL"])
    .nullable()
    .optional(),
  preferredIndustries: z.array(z.string()).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  skills: z.array(z.string()).optional(),
  customSkills: z.array(z.string()).optional(),
  languages: z.array(languageSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  emergencyContact: emergencySchema.optional(),
  photoUrl: z.string().nullable().optional(),
  photoFileName: z.string().nullable().optional(),
  photoMimeType: z.string().nullable().optional(),
  workflowStep: z.number().int().min(1).max(13).optional(),
  autosave: z.boolean().optional(),
});

function parseDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET() {
  try {
    const session = await requireAuth();
    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });
    return apiSuccess({
      profile,
      completion: profile?.profileCompletion ?? 0,
      sections: getProfileSectionCompletion(profile),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = profileSchema.parse(await request.json());
    const isAutosave = !!body.autosave;

    const existing = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });

    const merged = {
      fullName: body.fullName ?? existing?.fullName,
      dateOfBirth:
        body.dateOfBirth !== undefined
          ? parseDate(body.dateOfBirth)
          : existing?.dateOfBirth,
      gender: body.gender ?? existing?.gender,
      nationality: body.nationality ?? existing?.nationality,
      passportNumber: body.passportNumber ?? existing?.passportNumber,
      passportExpiry:
        body.passportExpiry !== undefined
          ? parseDate(body.passportExpiry)
          : existing?.passportExpiry,
      passportIssueDate:
        body.passportIssueDate !== undefined
          ? parseDate(body.passportIssueDate)
          : existing?.passportIssueDate,
      passportIssuingCountry:
        body.passportIssuingCountry ?? existing?.passportIssuingCountry,
      currentCountry: body.currentCountry ?? existing?.currentCountry,
      currentAddress: body.currentAddress ?? existing?.currentAddress,
      currentCity: body.currentCity ?? existing?.currentCity,
      phone: body.phone ?? existing?.phone,
      email: body.email || existing?.email || session.user.email,
      maritalStatus: body.maritalStatus ?? existing?.maritalStatus,
      hasDrivingLicense:
        body.hasDrivingLicense ?? existing?.hasDrivingLicense ?? false,
      preferredCountries:
        body.preferredCountries ?? existing?.preferredCountries ?? [],
      preferredSalary:
        body.preferredSalary !== undefined
          ? body.preferredSalary
          : existing?.preferredSalary != null
            ? Number(existing.preferredSalary)
            : null,
      preferredSalaryCurrency:
        body.preferredSalaryCurrency ??
        existing?.preferredSalaryCurrency ??
        "USD",
      preferredJobType:
        (body.preferredJobType as PreferredJobType | null | undefined) ??
        existing?.preferredJobType ??
        null,
      preferredIndustries:
        body.preferredIndustries ?? existing?.preferredIndustries ?? [],
      education: (body.education ??
        existing?.education ??
        []) as Prisma.InputJsonValue,
      experience: (body.experience ??
        existing?.experience ??
        []) as Prisma.InputJsonValue,
      skills: body.skills ?? existing?.skills ?? [],
      customSkills: body.customSkills ?? existing?.customSkills ?? [],
      languages: (body.languages ??
        existing?.languages ??
        []) as Prisma.InputJsonValue,
      certifications: (body.certifications ??
        existing?.certifications ??
        []) as Prisma.InputJsonValue,
      emergencyContact: (body.emergencyContact ??
        existing?.emergencyContact ??
        {}) as Prisma.InputJsonValue,
      photoUrl:
        body.photoUrl !== undefined ? body.photoUrl : existing?.photoUrl,
      photoFileName:
        body.photoFileName !== undefined
          ? body.photoFileName
          : existing?.photoFileName,
      photoMimeType:
        body.photoMimeType !== undefined
          ? body.photoMimeType
          : existing?.photoMimeType,
      workflowStep: body.workflowStep ?? existing?.workflowStep ?? 1,
    };

    const forCompletion = {
      ...merged,
      education: body.education ?? existing?.education,
      experience: body.experience ?? existing?.experience,
      languages: body.languages ?? existing?.languages,
      certifications: body.certifications ?? existing?.certifications,
      emergencyContact: body.emergencyContact ?? existing?.emergencyContact,
      preferredIndustries: merged.preferredIndustries,
      customSkills: merged.customSkills,
      photoUrl: merged.photoUrl,
    };

    const profileCompletion = computeProfileCompletion(forCompletion);
    const isComplete = isWorkerProfileComplete(forCompletion);
    const previousCompletion = existing?.profileCompletion ?? 0;

    const data = {
      ...merged,
      preferredSalary: merged.preferredSalary ?? undefined,
      preferredJobType: merged.preferredJobType ?? undefined,
      photoUrl: merged.photoUrl ?? undefined,
      photoFileName: merged.photoFileName ?? undefined,
      photoMimeType: merged.photoMimeType ?? undefined,
      profileCompletion,
      isComplete,
    };

    const profile = existing
      ? await prisma.workerProfile.update({
          where: { userId: session.user.id },
          data,
        })
      : await prisma.workerProfile.create({
          data: {
            userId: session.user.id,
            ...data,
          },
        });

    if (!isAutosave || profileCompletion !== previousCompletion) {
      await logEmploymentActivity(
        session.user.id,
        isAutosave ? "Profile autosaved" : "Profile updated",
        `Worker profile ${profileCompletion}% complete.`,
        { profileCompletion, autosave: isAutosave },
      );
    }

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({
      profile,
      completion: profileCompletion,
      sections: getProfileSectionCompletion(forCompletion),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
