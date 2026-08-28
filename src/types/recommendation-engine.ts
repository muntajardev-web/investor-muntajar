import { z } from "zod";
import type { BoardType, DegreeLevel } from "@prisma/client";

export const recommendationInputSchema = z.object({
  sscGpa: z.number().min(0).max(5).optional(),
  hscGpa: z.number().min(0).max(5).optional(),
  ielts: z.number().min(0).max(9).optional(),
  duolingo: z.number().min(0).max(160).optional(),
  sat: z.number().min(400).max(1600).optional(),
  budget: z.number().positive(),
  budgetCurrency: z.string().length(3).default("USD"),
  targetCountry: z.string().min(2).max(2),
  preferredCity: z.string().optional(),
  preferredSubject: z.string().min(1),
  financialCapability: z.enum(["FULL", "PARTIAL", "LOAN_REQUIRED", "SCHOLARSHIP_DEPENDENT"]),
  preferredIntake: z.string().min(1),
  workWhileStudying: z.boolean().default(false),
  scholarshipPreference: z.enum(["REQUIRED", "PREFERRED", "NOT_NEEDED"]),
  userId: z.string().uuid().optional(),
  rankingPriority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
});

export type RecommendationInput = z.infer<typeof recommendationInputSchema>;

export const financialCapabilitySchema = z.enum([
  "FULL",
  "PARTIAL",
  "LOAN_REQUIRED",
  "SCHOLARSHIP_DEPENDENT",
]);
export type FinancialCapability = z.infer<typeof financialCapabilitySchema>;

export const scholarshipPreferenceSchema = z.enum([
  "REQUIRED",
  "PREFERRED",
  "NOT_NEEDED",
]);
export type ScholarshipPreference = z.infer<typeof scholarshipPreferenceSchema>;

export const chanceLevelSchema = z.enum([
  "high",
  "medium",
  "low",
  "insufficient_data",
]);
export type ChanceLevel = z.infer<typeof chanceLevelSchema>;

export interface RequirementRow {
  programId: string;
  type: string;
  minValue: string | null;
  isMandatory: boolean;
}

export interface IntakeRow {
  programId: string;
  name: string;
  startDate: Date;
  applicationDeadline: Date | null;
}

export interface RankingRow {
  universityId: string;
  rankingBody: string;
  rank: number;
  year: number;
  subject: string | null;
}

export interface ScholarshipRow {
  universityId: string;
  programId: string | null;
  name: string;
  type: string;
  amount: number | null;
  currency: string;
}

export interface UniversityProgramCandidate {
  universityId: string;
  universityName: string;
  universitySlug: string;
  city: string | null;
  acceptanceRate: number | null;
  countryCode: string;
  countryName: string;
  livingCost: number;
  ieltsRequired: number | null;
  postStudyWork: string | null;
  visaSuccessRate: number | null;
  programId: string;
  programName: string;
  programField: string | null;
  tuitionFee: number;
  currency: string;
  intakes: IntakeRow[];
  requirements: RequirementRow[];
  rankings: RankingRow[];
  scholarships: ScholarshipRow[];
}

export interface EligibilityScoreBreakdown {
  academic: number;
  budget: number;
  subject: number;
  intake: number;
  scholarship: number;
  employment: number;
  ranking: number;
}

export interface ScoredCandidate extends UniversityProgramCandidate {
  eligibilityScore: number;
  scoreBreakdown: EligibilityScoreBreakdown;
  totalAnnualCost: number;
}

export interface GptUniversityPayload {
  universityId: string;
  universityName: string;
  city: string | null;
  country: string;
  acceptanceRate: number | null;
  programId: string;
  programName: string;
  programField: string | null;
  tuitionFee: number;
  livingCost: number;
  totalAnnualCost: number;
  currency: string;
  eligibilityScore: number;
  scoreBreakdown: EligibilityScoreBreakdown;
  rankings: Array<{ body: string; rank: number; year: number }>;
  scholarships: Array<{ name: string; type: string; amount: number | null }>;
  requirements: Array<{ type: string; minValue: string | null }>;
  intakes: Array<{ name: string; startDate: string }>;
  visaSuccessRate: number | null;
  postStudyWork: string | null;
  ieltsRequired: number | null;
}

export interface GptAnalysisResult {
  universityId: string;
  programId: string;
  whyThisUniversity: string;
  pros: string[];
  cons: string[];
  admissionChance: ChanceLevel;
  scholarshipChance: ChanceLevel;
  visaChance: ChanceLevel;
  employmentOpportunity: ChanceLevel;
  overallScore: number;
}

export interface RecommendationEngineResponse {
  success: boolean;
  batchId: string;
  pipeline: {
    step1_universitiesFiltered: number;
    step2_programsFiltered: number;
    step3_budgetFiltered: number;
    step4_gpaFiltered: number;
    step5_scored: number;
    step6_sentToGpt: number;
  };
  recommendations: Array<ScoredCandidate & GptAnalysisResult>;
  generatedAt: string;
}

export interface StudentProfileInput {
  gpa?: number;
  gpaScale?: number;
  board?: BoardType;
  percentage?: number;
  ieltsOverall?: number;
  ieltsReading?: number;
  ieltsWriting?: number;
  ieltsListening?: number;
  ieltsSpeaking?: number;
  toeflScore?: number;
  duolingoScore?: number;
  satScore?: number;
  budget?: number;
  budgetCurrency?: string;
  degreeLevel: DegreeLevel;
  preferredCourses?: string[];
  targetCountries?: string[];
  scholarshipPreference?: "REQUIRED" | "PREFERRED" | "NOT_NEEDED";
  rankingPriority?: "HIGH" | "MEDIUM" | "LOW";
  userId?: string;
}

export interface UniversityWithProgram {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryCode: string;
  city?: string;
  type: string;
  ranking?: number;
  acceptanceRate?: number;
  website?: string;
  logoUrl?: string;
  description?: string;
  program: {
    id: string;
    name: string;
    degreeLevel: DegreeLevel;
    field?: string;
    tuitionFee?: number;
    currency: string;
    intakes: string[];
  };
  scholarships: Array<{
    id: string;
    name: string;
    type: string;
    amount?: number;
    currency: string;
  }>;
  requirements: Array<{
    type: string;
    minValue?: string;
    isMandatory: boolean;
  }>;
  livingCost?: number;
  ieltsRequired?: number;
}

export interface ScoreBreakdown {
  gpaFit: number;
  budgetFit: number;
  universityRanking: number;
  scholarshipAvailability: number;
  englishTestMatch: number;
  programMatch: number;
}

export interface ScoredUniversityResult {
  universityId: string;
  name: string;
  country: string;
  countryCode: string;
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
  eligibilityStatus: "ELIGIBLE" | "BORDERLINE" | "NOT_ELIGIBLE";
  admissionChance: "HIGH" | "MEDIUM" | "LOW";
  reasons: string[];
  tuitionFee?: number;
  currency?: string;
  ranking?: number;
  scholarships: Array<{
    id: string;
    name: string;
    type: string;
    amount?: number;
    currency: string;
  }>;
  programName: string;
  admissionRequirements: Array<{
    type: string;
    minValue?: string;
    isMandatory: boolean;
  }>;
  website?: string;
}

export interface RecommendationRequest {
  studentProfile: StudentProfileInput;
  limit?: number;
  userId?: string;
}

export interface RecommendationResponse {
  success: boolean;
  recommendations: ScoredUniversityResult[];
  totalEvaluated: number;
  filteredOut: number;
  generatedAt: string;
}

export interface Requirement {
  type: string;
  minValue?: string;
  isMandatory: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  type: string;
  amount?: number;
  currency: string;
}

export interface Ranking {
  rankingBody: string;
  rank: number;
  year: number;
  subject?: string;
}

export type EligibilityStatus = "ELIGIBLE" | "BORDERLINE" | "NOT_ELIGIBLE";

export interface EligibilityResult {
  isEligible: boolean;
  failedRequirements: string[];
  missingCount: number;
  status: EligibilityStatus;
  reasons: string[];
}