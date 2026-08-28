/**
 * Matching & scoring weights (must sum to 1.0).
 * @see ARCHITECTURE.md — Recommendation Engine
 */
export const scoringWeights = {
  academic: 0.25,
  budget: 0.2,
  subject: 0.15,
  intake: 0.1,
  scholarship: 0.1,
  employment: 0.1,
  ranking: 0.1,
} as const;

export const recommendationEngineConfig = {
  gptTopN: 15,
  preFilterLimit: 100,
  financialThresholds: {
    FULL: 1.0,
    PARTIAL: 0.7,
    LOAN_REQUIRED: 0.5,
    SCHOLARSHIP_DEPENDENT: 0.3,
  } as const,
} as const;

export const cacheKeys = {
  recommendation: (userId: string) => `rec:${userId}`,
  recommendationBatch: (batchId: string) => `rec:batch:${batchId}`,
  university: (slug: string) => `uni:${slug}`,
  countryInfo: (code: string) => `country:${code}`,
  userProfile: (userId: string) => `profile:${userId}`,
  rateLimit: (identifier: string) => `rl:${identifier}`,
  employmentAnalysis: (userId: string) => `emp:analysis:${userId}`,
  employmentMatches: (userId: string) => `emp:match:${userId}`,
  employmentValidation: (userId: string) => `emp:validation:${userId}`,
  employmentPackage: (userId: string) => `emp:package:${userId}`,
  employmentOrchestrator: (workflow: string, userId: string) =>
    `emp:orch:${workflow}:${userId}`,
} as const;

export const queueNames = {
  generateRecommendations: "generate-recommendations",
  syncUniversityData: "sync-university-data",
  sendEmail: "send-email",
  processDocument: "process-document",
} as const;
