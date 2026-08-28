import type { DegreeLevel, UniversityType } from "@prisma/client";
import type { PaginationParams } from "./common";

export interface UniversityDTO {
  id: string;
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  ranking: number | null;
  type: UniversityType;
  acceptanceRate: number | null;
  isActive: boolean;
}

export interface UniversityProgramDTO {
  id: string;
  universityId: string;
  name: string;
  slug: string;
  degreeLevel: DegreeLevel;
  duration: number | null;
  durationUnit: string;
  tuitionFee: number | null;
  currency: string;
  intakes: string[];
  requirements: Record<string, unknown> | null;
}

export interface UniversityFilter extends PaginationParams {
  country?: string;
  countryCode?: string;
  degreeLevel?: DegreeLevel;
  maxTuition?: number;
  search?: string;
  isActive?: boolean;
}
