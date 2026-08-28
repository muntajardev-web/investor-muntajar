import { z } from "zod";

export const eligibleCountrySchema = z.object({
  name: z.string(),
  code: z.string().optional().nullable(),
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()).default([]),
});

export const eligibleIndustrySchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()).default([]),
});

export const salaryEstimateSchema = z.object({
  currency: z.string().default("USD"),
  monthlyMin: z.number(),
  monthlyMax: z.number(),
  annualMin: z.number().optional().nullable(),
  annualMax: z.number().optional().nullable(),
  note: z.string().default(""),
});

/**
 * AI Worker Analysis Engine output — stored on WorkerProfile.aiAnalysis.
 */
export const workerAnalysisResultSchema = z.object({
  /** Career narrative */
  careerSummary: z.string(),
  /** @deprecated alias of careerSummary — kept for dashboard/API compat */
  summary: z.string(),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  eligibleCountries: z.array(eligibleCountrySchema).default([]),
  eligibleIndustries: z.array(eligibleIndustrySchema).default([]),
  salaryEstimate: salaryEstimateSchema,
  missingDocuments: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  /** 0–100 overall profile readiness */
  profileReadinessScore: z.number().min(0).max(100),
  /** @deprecated alias of profileReadinessScore */
  eligibilityEstimate: z.number().min(0).max(100),
  suggestions: z.array(z.string()).default([]),
  analyzedInputs: z
    .object({
      educationCount: z.number().default(0),
      experienceCount: z.number().default(0),
      skillsCount: z.number().default(0),
      languagesCount: z.number().default(0),
      certificationsCount: z.number().default(0),
      experienceYears: z.number().default(0),
    })
    .default({
      educationCount: 0,
      experienceCount: 0,
      skillsCount: 0,
      languagesCount: 0,
      certificationsCount: 0,
      experienceYears: 0,
    }),
  analyzedAt: z.string(),
  workerProfile: z.record(z.unknown()).default({}),
});

export type EligibleCountry = z.infer<typeof eligibleCountrySchema>;
export type EligibleIndustry = z.infer<typeof eligibleIndustrySchema>;
export type SalaryEstimate = z.infer<typeof salaryEstimateSchema>;
export type WorkerAnalysisResult = z.infer<typeof workerAnalysisResultSchema>;

/** @deprecated use WorkerAnalysisResult */
export type ProfileAnalysisResult = WorkerAnalysisResult;
