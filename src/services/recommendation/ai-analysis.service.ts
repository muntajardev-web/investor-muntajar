import { openaiConfig } from "@/config";
import { ExternalServiceError, logger } from "@/lib";
import type {
  GptAnalysisResult,
  GptUniversityPayload,
  RecommendationInput,
  ScoredCandidate,
} from "@/types/recommendation-engine";
import {
  auditedChatCompletion,
  recordSkippedAiAction,
  summarizeAiText,
} from "@/services/ai/ai-audit.service";

function toGptPayload(
  candidate: ScoredCandidate,
): GptUniversityPayload {
  return {
    universityId: candidate.universityId,
    universityName: candidate.universityName,
    city: candidate.city,
    country: candidate.countryName,
    acceptanceRate: candidate.acceptanceRate,
    programId: candidate.programId,
    programName: candidate.programName,
    programField: candidate.programField,
    tuitionFee: candidate.tuitionFee,
    livingCost: candidate.livingCost,
    totalAnnualCost: candidate.totalAnnualCost,
    currency: candidate.currency,
    eligibilityScore: candidate.eligibilityScore,
    scoreBreakdown: candidate.scoreBreakdown,
    rankings: candidate.rankings.map((r) => ({
      body: r.rankingBody,
      rank: r.rank,
      year: r.year,
    })),
    scholarships: candidate.scholarships.map((s) => ({
      name: s.name,
      type: s.type,
      amount: s.amount,
    })),
    requirements: candidate.requirements.map((r) => ({
      type: r.type,
      minValue: r.minValue,
    })),
    intakes: candidate.intakes.map((i) => ({
      name: i.name,
      startDate: i.startDate.toISOString().split("T")[0],
    })),
    visaSuccessRate: candidate.visaSuccessRate,
    postStudyWork: candidate.postStudyWork,
    ieltsRequired: candidate.ieltsRequired,
  };
}

function buildSystemPrompt(): string {
  return `You are a university recommendation analyst for Muntajar, a global mobility platform.

STRICT RULES:
1. You MUST only use data provided in the input JSON. Never search the internet. Never invent statistics, rankings, or facts not present in the input.
2. If data is missing for a field, use "insufficient_data" for chance levels and state the limitation in whyThisUniversity.
3. Return ONLY valid JSON. No markdown. No code fences. No explanatory text outside JSON.
4. admissionChance, scholarshipChance, visaChance, employmentOpportunity must be one of: "high", "medium", "low", "insufficient_data".
5. overallScore must be an integer 0-100 derived from the provided eligibilityScore and available data only.
6. pros and cons must reference only facts from the input data.
7. Do not hallucinate university features, employment rates, or visa approval rates not in the input.`;
}

function buildUserPrompt(
  input: RecommendationInput,
  universities: GptUniversityPayload[],
): string {
  const studentProfile = {
    sscGpa: input.sscGpa ?? null,
    hscGpa: input.hscGpa ?? null,
    ielts: input.ielts ?? null,
    duolingo: input.duolingo ?? null,
    sat: input.sat ?? null,
    budget: input.budget,
    budgetCurrency: input.budgetCurrency,
    targetCountry: input.targetCountry,
    preferredCity: input.preferredCity ?? null,
    preferredSubject: input.preferredSubject,
    financialCapability: input.financialCapability,
    preferredIntake: input.preferredIntake,
    workWhileStudying: input.workWhileStudying,
    scholarshipPreference: input.scholarshipPreference,
  };

  return JSON.stringify({
    instruction:
      "Analyze each university-program pair. Return a JSON object with key 'recommendations' containing an array. Each item must include: universityId, programId, whyThisUniversity, pros (string array), cons (string array), admissionChance, scholarshipChance, visaChance, employmentOpportunity, overallScore.",
    studentProfile,
    universities,
  });
}

interface GptResponseShape {
  recommendations: GptAnalysisResult[];
}

export const aiAnalysisService = {
  toGptPayload,

  async analyze(
    input: RecommendationInput,
    candidates: ScoredCandidate[],
  ): Promise<GptAnalysisResult[]> {
    if (candidates.length === 0) return [];

    const auditCtx = {
      action: "STUDY_ABROAD_ANALYSIS" as const,
      userId: input.userId,
      entityType: "Recommendation",
      entityId: input.userId,
      inputSummary: summarizeAiText(
        `study-abroad analysis · ${candidates.length} candidates`,
      ),
    };

    const apiKey = openaiConfig.apiKey;
    if (
      !apiKey ||
      apiKey === "sk-dev-placeholder" ||
      process.env.RECOMMENDATION_USE_GPT === "false"
    ) {
      await recordSkippedAiAction({
        ...auditCtx,
        model: openaiConfig.model,
        reason: "GPT skipped for recommendations",
        outputSummary: "fallback analysis",
      });
      return candidates.map(buildFallbackAnalysis);
    }

    const universities = candidates.map(toGptPayload);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    try {
      const response = await auditedChatCompletion(
        auditCtx,
        {
          model: openaiConfig.model,
          temperature: 0.1,
          max_tokens: openaiConfig.maxTokens,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: buildUserPrompt(input, universities) },
          ],
        },
        { signal: controller.signal },
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new ExternalServiceError("OpenAI", "Empty response from model");
      }

      const trimmed = content.trim();
      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        throw new ExternalServiceError(
          "OpenAI",
          `Non-JSON model response: ${trimmed.slice(0, 80)}`,
        );
      }

      const parsed = JSON.parse(trimmed) as GptResponseShape;
      const results = parsed.recommendations ?? [];

      logger.info("GPT analysis completed", {
        inputCount: candidates.length,
        outputCount: results.length,
        model: openaiConfig.model,
      });

      return this.validateAndMerge(candidates, results);
    } catch (error) {
      logger.error("GPT analysis failed", {
        error: error instanceof Error ? error.message : "Unknown",
      });

      if (
        openaiConfig.fallbackModel !== openaiConfig.model &&
        !(error instanceof ExternalServiceError)
      ) {
        try {
          return await this.analyzeWithFallback(input, candidates);
        } catch (fallbackError) {
          logger.error("GPT fallback analysis failed", {
            error:
              fallbackError instanceof Error
                ? fallbackError.message
                : "Unknown",
          });
        }
      }

      logger.warn("Using local analysis fallback after GPT failure");
      return candidates.map(buildFallbackAnalysis);
    } finally {
      clearTimeout(timeout);
    }
  },

  async analyzeWithFallback(
    input: RecommendationInput,
    candidates: ScoredCandidate[],
  ): Promise<GptAnalysisResult[]> {
    const universities = candidates.map(toGptPayload);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await auditedChatCompletion(
        {
          action: "STUDY_ABROAD_ANALYSIS",
          userId: input.userId,
          entityType: "Recommendation",
          entityId: input.userId,
          inputSummary: summarizeAiText(
            `fallback study-abroad analysis · ${candidates.length} candidates`,
          ),
          metadata: { fallback: true },
        },
        {
          model: openaiConfig.fallbackModel,
          temperature: 0.1,
          max_tokens: openaiConfig.maxTokens,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: buildUserPrompt(input, universities) },
          ],
        },
        { signal: controller.signal },
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new ExternalServiceError("OpenAI", "Empty fallback response");
      }

      const parsed = JSON.parse(content) as GptResponseShape;
      return this.validateAndMerge(candidates, parsed.recommendations ?? []);
    } finally {
      clearTimeout(timeout);
    }
  },

  /**
   * Ensure GPT results map to known candidates; fill gaps with data-driven defaults.
   */
  validateAndMerge(
    candidates: ScoredCandidate[],
    gptResults: GptAnalysisResult[],
  ): GptAnalysisResult[] {
    return candidates.map((candidate) => {
      const gpt = gptResults.find(
        (r) =>
          r.universityId === candidate.universityId &&
          r.programId === candidate.programId,
      );

      if (gpt) {
        return {
          ...gpt,
          overallScore: clampScore(gpt.overallScore, candidate.eligibilityScore),
        };
      }

      return buildFallbackAnalysis(candidate);
    });
  },
};

function clampScore(gptScore: number, eligibilityScore: number): number {
  const score = Number.isFinite(gptScore) ? gptScore : eligibilityScore;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function buildFallbackAnalysis(
  candidate: ScoredCandidate,
): GptAnalysisResult {
  const admissionChance = deriveChance(
    candidate.acceptanceRate,
    candidate.eligibilityScore,
  );
  const scholarshipChance =
    candidate.scholarships.length > 0 ? "medium" : "low";
  const visaChance = deriveChance(candidate.visaSuccessRate, null);
  const employmentChance = candidate.postStudyWork ? "medium" : "insufficient_data";

  return {
    universityId: candidate.universityId,
    programId: candidate.programId,
    whyThisUniversity: `Strong fit for ${candidate.programName} — eligibility score ${Math.round(candidate.eligibilityScore)} based on your academics, budget, and preferences.`,
    pros: [
      `Program: ${candidate.programName}`,
      candidate.rankings[0]
        ? `Ranked #${candidate.rankings[0].rank} by ${candidate.rankings[0].rankingBody}`
        : "Ranking data not available",
    ],
    cons: [
      candidate.totalAnnualCost > 0
        ? `Annual cost: ${candidate.totalAnnualCost.toLocaleString()} ${candidate.currency}`
        : "Cost data incomplete",
    ],
    admissionChance,
    scholarshipChance: scholarshipChance as GptAnalysisResult["scholarshipChance"],
    visaChance,
    employmentOpportunity: employmentChance as GptAnalysisResult["employmentOpportunity"],
    overallScore: Math.round(candidate.eligibilityScore),
  };
}

function deriveChance(
  rate: number | null,
  score: number | null,
): GptAnalysisResult["admissionChance"] {
  if (rate !== null) {
    if (rate >= 60) return "high";
    if (rate >= 30) return "medium";
    return "low";
  }
  if (score !== null) {
    if (score >= 75) return "high";
    if (score >= 50) return "medium";
    return "low";
  }
  return "insufficient_data";
}
