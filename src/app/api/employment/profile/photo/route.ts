import { NextRequest } from "next/server";
import { z } from "zod";
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
import { AppError } from "@/lib";

const photoSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z
    .string()
    .refine(
      (v) => v.startsWith("image/"),
      "Only image uploads are allowed",
    ),
  sizeBytes: z.number().int().positive().max(5_000_000),
  /** Optional client preview data URL stored for display */
  dataUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = photoSchema.parse(await request.json());

    const photoUrl =
      body.dataUrl ??
      `employment/${session.user.id}/photo/${Date.now()}_${body.fileName}`;

    const existing = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });

    const base = {
      ...(existing ?? {}),
      photoUrl,
      photoFileName: body.fileName,
      photoMimeType: body.mimeType,
      preferredCountries: existing?.preferredCountries ?? [],
      preferredIndustries: existing?.preferredIndustries ?? [],
      skills: existing?.skills ?? [],
      customSkills: existing?.customSkills ?? [],
      education: existing?.education,
      experience: existing?.experience,
      languages: existing?.languages,
      certifications: existing?.certifications,
      emergencyContact: existing?.emergencyContact,
      preferredSalary:
        existing?.preferredSalary != null
          ? Number(existing.preferredSalary)
          : null,
    };

    const profileCompletion = computeProfileCompletion(base);
    const isComplete = isWorkerProfileComplete(base);

    const profile = existing
      ? await prisma.workerProfile.update({
          where: { userId: session.user.id },
          data: {
            photoUrl,
            photoFileName: body.fileName,
            photoMimeType: body.mimeType,
            profileCompletion,
            isComplete,
          },
        })
      : await prisma.workerProfile.create({
          data: {
            userId: session.user.id,
            email: session.user.email,
            fullName: session.user.name,
            photoUrl,
            photoFileName: body.fileName,
            photoMimeType: body.mimeType,
            profileCompletion,
            isComplete,
          },
        });

    await logEmploymentActivity(
      session.user.id,
      "Profile photo updated",
      body.fileName,
    );

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({
      profile,
      completion: profileCompletion,
      sections: getProfileSectionCompletion(base),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const session = await requireAuth();
    const existing = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!existing) {
      throw new AppError("NOT_FOUND", "Worker profile not found", 404);
    }

    const base = {
      ...existing,
      photoUrl: null,
      preferredSalary:
        existing.preferredSalary != null
          ? Number(existing.preferredSalary)
          : null,
    };
    const profileCompletion = computeProfileCompletion(base);
    const isComplete = isWorkerProfileComplete(base);

    const profile = await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: {
        photoUrl: null,
        photoFileName: null,
        photoMimeType: null,
        profileCompletion,
        isComplete,
      },
    });

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({
      profile,
      completion: profileCompletion,
      sections: getProfileSectionCompletion(base),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
