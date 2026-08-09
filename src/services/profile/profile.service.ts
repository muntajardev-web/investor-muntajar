import { profileRepository } from "@/repositories";
import { NotFoundError } from "@/lib";
import { cacheKeys } from "@/config";
import type {
  CreateUserProfileInput,
  UpdateUserProfileInput,
  UserProfileDTO,
} from "@/types";
import { cacheService } from "../cache/cache.service";

function toDTO(
  profile: NonNullable<Awaited<ReturnType<typeof profileRepository.findByUserId>>>,
): UserProfileDTO {
  return {
    id: profile.id,
    userId: profile.userId,
    gpa: profile.gpa,
    gpaScale: profile.gpaScale,
    board: profile.board,
    targetCountries: profile.targetCountries,
    budget: profile.budget ? Number(profile.budget) : null,
    budgetCurrency: profile.budgetCurrency,
    degreeLevel: profile.degreeLevel,
    preferredCourses: profile.preferredCourses,
    ieltsOverall: profile.ieltsOverall,
    ieltsReading: profile.ieltsReading,
    ieltsWriting: profile.ieltsWriting,
    ieltsListening: profile.ieltsListening,
    ieltsSpeaking: profile.ieltsSpeaking,
    otherPreferences: profile.otherPreferences as Record<string, unknown> | null,
    isComplete: profile.isComplete,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export const profileService = {
  async getByUserId(userId: string): Promise<UserProfileDTO> {
    const cached = await cacheService.get<UserProfileDTO>(
      cacheKeys.userProfile(userId),
    );
    if (cached) return cached;

    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("UserProfile", userId);
    }

    const dto = toDTO(profile);
    await cacheService.set(cacheKeys.userProfile(userId), dto, 300);
    return dto;
  },

  async create(input: CreateUserProfileInput): Promise<UserProfileDTO> {
    const profile = await profileRepository.create(input);
    const dto = toDTO(profile);
    await cacheService.del(cacheKeys.userProfile(input.userId));
    return dto;
  },

  async update(
    userId: string,
    input: UpdateUserProfileInput,
  ): Promise<UserProfileDTO> {
    const profile = await profileRepository.update(userId, input);
    await cacheService.del(cacheKeys.userProfile(userId));
    await cacheService.del(cacheKeys.recommendation(userId));
    return toDTO(profile);
  },

  async markComplete(userId: string): Promise<UserProfileDTO> {
    const profile = await profileRepository.markComplete(userId);
    await cacheService.del(cacheKeys.userProfile(userId));
    return toDTO(profile);
  },
};
