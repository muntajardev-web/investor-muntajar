import type { ScholarshipType } from "@prisma/client";

export interface ScholarshipDTO {
  id: string;
  universityId: string | null;
  name: string;
  type: ScholarshipType;
  amount: number | null;
  currency: string;
  eligibility: Record<string, unknown> | null;
  deadline: Date | null;
  link: string | null;
}

export interface CountryInfoDTO {
  id: string;
  country: string;
  countryCode: string;
  visaSuccessRate: number | null;
  livingCost: number | null;
  currency: string;
  postStudyWork: string | null;
  ieltsRequired: number | null;
  safetyIndex: number | null;
}

export interface RankingDTO {
  id: string;
  universityId: string;
  rankingBody: string;
  rank: number;
  year: number;
  score: number | null;
  subject: string | null;
}
