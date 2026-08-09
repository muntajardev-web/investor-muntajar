import { z } from "zod";

export const MATCH_ENGINE_VECTOR_TOP_N = 50;
export const MATCH_ENGINE_FINAL_TOP_N = 10;

export const jobRecommendationSchema = z.object({
  jobListingId: z.string(),
  matchScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  explanation: z.string(),
  probabilityOfSuccess: z.number().min(0).max(100),
});

export const geminiRankingResponseSchema = z.object({
  rankings: z.array(jobRecommendationSchema),
});

export type JobRecommendationEnrichment = z.infer<typeof jobRecommendationSchema>;

export type MatchKeyFactors = {
  strengths: string[];
  weaknesses: string[];
  probabilityOfSuccess: number;
  salary?: {
    min: number | null;
    max: number | null;
    currency: string;
  };
  visaSponsorship: boolean;
  requirements: string[];
  vectorScore?: number;
  pipeline?: {
    sqlFiltered: number;
    countryFiltered: number;
    visaFiltered: number;
    educationFiltered: number;
    experienceFiltered: number;
    languageFiltered: number;
    vectorTopN: number;
    rankedTopN: number;
    ranker: "gemini" | "openai" | "heuristic";
  };
};
