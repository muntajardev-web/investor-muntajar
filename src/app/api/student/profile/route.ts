import { NextRequest } from "next/server";
import { z } from "zod";
import type { BoardType, DegreeLevel } from "@prisma/client";
import { requireAuth } from "@/server/auth/session";
import { profileRepository } from "@/repositories";
import { apiSuccess, handleApiError } from "@/server/api";

const profileSchema = z.object({
  gpa: z.number().optional(),
  gpaScale: z.number().optional(),
  board: z
    .enum(["HSC", "A_LEVEL", "IB", "CBSE", "WAEC", "OTHER"])
    .optional(),
  nationality: z.string().optional(),
  degreeLevel: z
    .enum(["FOUNDATION", "BACHELOR", "MASTER", "PHD", "DIPLOMA", "CERTIFICATE"])
    .optional(),
  budget: z.number().optional(),
  budgetCurrency: z.string().optional(),
  targetCountries: z.array(z.string()).optional(),
  preferredCourses: z.array(z.string()).optional(),
  ieltsOverall: z.number().optional(),
  ieltsReading: z.number().optional(),
  ieltsWriting: z.number().optional(),
  ieltsListening: z.number().optional(),
  ieltsSpeaking: z.number().optional(),
  toeflScore: z.number().int().optional(),
});

function isProfileComplete(data: z.infer<typeof profileSchema>): boolean {
  return !!(
    data.gpa &&
    data.degreeLevel &&
    data.targetCountries &&
    data.targetCountries.length > 0 &&
    data.preferredCourses &&
    data.preferredCourses.length > 0 &&
    data.budget &&
    (data.ieltsOverall || data.toeflScore)
  );
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = profileSchema.parse(await request.json());

    const existing = await profileRepository.findByUserId(session.user.id);
    const merged = {
      gpa: body.gpa ?? existing?.gpa ?? undefined,
      degreeLevel: body.degreeLevel ?? existing?.degreeLevel ?? undefined,
      targetCountries:
        body.targetCountries ?? existing?.targetCountries ?? undefined,
      preferredCourses:
        body.preferredCourses ?? existing?.preferredCourses ?? undefined,
      budget:
        body.budget ??
        (existing?.budget != null ? Number(existing.budget) : undefined),
      ieltsOverall: body.ieltsOverall ?? existing?.ieltsOverall ?? undefined,
      toeflScore: body.toeflScore ?? existing?.toeflScore ?? undefined,
    };
    const isComplete = isProfileComplete(merged);

    if (existing) {
      await profileRepository.update(session.user.id, {
        ...body,
        isComplete,
      } as Parameters<typeof profileRepository.update>[1]);
    } else {
      await profileRepository.create({
        userId: session.user.id,
        degreeLevel: (body.degreeLevel ?? "BACHELOR") as DegreeLevel,
        board: body.board as BoardType | undefined,
        gpa: body.gpa,
        gpaScale: body.gpaScale ?? 5,
        targetCountries: body.targetCountries,
        budget: body.budget,
        budgetCurrency: body.budgetCurrency,
        preferredCourses: body.preferredCourses,
        ieltsOverall: body.ieltsOverall,
        ieltsReading: body.ieltsReading,
        ieltsWriting: body.ieltsWriting,
        ieltsListening: body.ieltsListening,
        ieltsSpeaking: body.ieltsSpeaking,
      });
      if (isComplete) {
        await profileRepository.markComplete(session.user.id);
      }
      if (body.nationality || body.toeflScore != null) {
        await profileRepository.update(session.user.id, {
          nationality: body.nationality,
          toeflScore: body.toeflScore,
          isComplete,
        } as Parameters<typeof profileRepository.update>[1]);
      }
    }

    const updated = await profileRepository.findByUserId(session.user.id);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
