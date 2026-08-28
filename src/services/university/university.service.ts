import { universityRepository } from "@/repositories";
import { NotFoundError } from "@/lib";
import { buildPaginatedResult } from "@/types/common";
import type { UniversityDTO, UniversityFilter } from "@/types";

type UniversityWithCountry = NonNullable<
  Awaited<ReturnType<typeof universityRepository.findById>>
> & {
  country?: { name: string; code: string };
};

function toDTO(uni: UniversityWithCountry): UniversityDTO {
  return {
    id: uni.id,
    slug: uni.slug,
    name: uni.name,
    country: uni.country?.name ?? "",
    countryCode: uni.country?.code ?? "",
    logoUrl: uni.logoUrl,
    website: uni.website,
    description: uni.description,
    ranking: null,
    type: uni.type,
    acceptanceRate: uni.acceptanceRate,
    isActive: uni.status === "ACTIVE",
  };
}

export const universityService = {
  async getBySlug(slug: string): Promise<UniversityDTO> {
    const uni = await universityRepository.findBySlug(slug);
    if (!uni) throw new NotFoundError("University", slug);
    return toDTO(uni);
  },

  async list(filter: UniversityFilter = {}) {
    const { data, total, page, limit } =
      await universityRepository.findMany(filter);
    return buildPaginatedResult(data.map(toDTO), total, page, limit);
  },

  async count(): Promise<number> {
    return universityRepository.count();
  },
};
