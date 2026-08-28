import type { DegreeLevel } from "@prisma/client";

export type KeyFactorCategory =
  | "academics"
  | "tuition"
  | "ranking"
  | "scholarship"
  | "admission"
  | "location"
  | "post_study_work"
  | "safety";

export interface KeyFactor {
  category: KeyFactorCategory;
  score: number;
  label: string;
  detail?: string;
}

export interface ScoredUniversity {
  universityId: string;
  name: string;
  country: string;
  countryCode: string;
  matchScore: number;
  scoreBreakdown: Record<KeyFactorCategory, number>;
  tuitionFee?: number;
  currency?: string;
  ranking?: number;
  scholarships?: Array<{
    id: string;
    name: string;
    amount?: number;
    type: string;
  }>;
}

export interface RecommendationRequest {
  userId: string;
  profileId: string;
  topN?: number;
  forceRefresh?: boolean;
}

export interface RecommendationResponse {
  success: boolean;
  batchId: string;
  recommendations: Array<
    ScoredUniversity & {
      justification?: string;
      keyFactors?: KeyFactor[];
    }
  >;
  generatedAt: string;
}

export interface MatchingCriteria {
  gpa?: number;
  gpaScale?: number;
  board?: string;
  targetCountries: string[];
  budget?: number;
  budgetCurrency: string;
  degreeLevel: DegreeLevel;
  preferredCourses: string[];
  ieltsOverall?: number;
}
