import type { StudentProfile } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateUserProfileInput,
  UpdateUserProfileInput,
} from "@/types";

function toJson(
  value: Record<string, unknown> | undefined,
): Prisma.InputJsonValue | undefined {
  return value as Prisma.InputJsonValue | undefined;
}

export const profileRepository = {
  async findByUserId(userId: string): Promise<StudentProfile | null> {
    return prisma.studentProfile.findUnique({ where: { userId } });
  },

  async findById(id: string): Promise<StudentProfile | null> {
    return prisma.studentProfile.findUnique({ where: { id } });
  },

  async create(data: CreateUserProfileInput): Promise<StudentProfile> {
    return prisma.studentProfile.create({
      data: {
        userId: data.userId,
        gpa: data.gpa,
        gpaScale: data.gpaScale,
        board: data.board,
        targetCountries: data.targetCountries ?? [],
        budget: data.budget,
        budgetCurrency: data.budgetCurrency ?? "USD",
        degreeLevel: data.degreeLevel,
        preferredCourses: data.preferredCourses ?? [],
        ieltsOverall: data.ieltsOverall,
        ieltsReading: data.ieltsReading,
        ieltsWriting: data.ieltsWriting,
        ieltsListening: data.ieltsListening,
        ieltsSpeaking: data.ieltsSpeaking,
        otherPreferences: toJson(data.otherPreferences),
        isComplete: false,
      },
    });
  },

  async update(
    userId: string,
    data: UpdateUserProfileInput,
  ): Promise<StudentProfile> {
    const { otherPreferences, ...rest } = data;
    return prisma.studentProfile.update({
      where: { userId },
      data: {
        ...rest,
        ...(otherPreferences !== undefined && {
          otherPreferences: toJson(otherPreferences),
        }),
      },
    });
  },

  async markComplete(userId: string): Promise<StudentProfile> {
    return prisma.studentProfile.update({
      where: { userId },
      data: { isComplete: true },
    });
  },
};
