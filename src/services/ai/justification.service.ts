import { openaiConfig } from "@/config";
import { ExternalServiceError, logger } from "@/lib";
import type { ScoredUniversity, KeyFactor, MatchingCriteria } from "@/types";
import {
  auditedChatCompletion,
  summarizeAiText,
} from "@/services/ai/ai-audit.service";
import {
  buildJustificationPrompt,
} from "./prompts/justification.prompt";

interface JustificationResult {
  universityId: string;
  justification: string;
  keyFactors: KeyFactor[];
}

interface UniversityContext {
  name: string;
  country: string;
  ranking?: number | null;
  acceptanceRate?: number | null;
  programs: Array<{ name: string; tuitionFee?: number | null }>;
  scholarships: Array<{ name: string; amount?: number | null }>;
}

export const justificationService = {
  async generate(
    profile: MatchingCriteria,
    universities: ScoredUniversity[],
    universityDetails: UniversityContext[],
    opts?: { userId?: string },
  ): Promise<JustificationResult[]> {
    const prompt = buildJustificationPrompt(
      profile,
      universities,
      universityDetails,
    );

    try {
      const response = await auditedChatCompletion(
        {
          action: "JUSTIFICATION",
          userId: opts?.userId,
          entityType: "Recommendation",
          entityId: opts?.userId,
          inputSummary: summarizeAiText(
            `justifications for ${universities.length} universities`,
          ),
        },
        {
          model: openaiConfig.model,
          temperature: openaiConfig.temperature,
          max_tokens: openaiConfig.maxTokens,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a study-abroad recommendation engine. Always respond with valid JSON.",
            },
            { role: "user", content: prompt },
          ],
        },
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new ExternalServiceError("OpenAI", "Empty response from model");
      }

      const parsed = JSON.parse(content) as
        | JustificationResult[]
        | { recommendations: JustificationResult[] };

      const results = Array.isArray(parsed)
        ? parsed
        : parsed.recommendations ?? [];

      logger.info("AI justifications generated", {
        count: results.length,
        model: openaiConfig.model,
      });

      return results;
    } catch (error) {
      logger.error("AI justification failed", {
        error: error instanceof Error ? error.message : "Unknown",
      });

      if (openaiConfig.fallbackModel !== openaiConfig.model) {
        return this.generateWithFallback(
          profile,
          universities,
          universityDetails,
          opts,
        );
      }

      throw new ExternalServiceError(
        "OpenAI",
        error instanceof Error ? error.message : "Justification generation failed",
      );
    }
  },

  async generateWithFallback(
    profile: MatchingCriteria,
    universities: ScoredUniversity[],
    universityDetails: UniversityContext[],
    opts?: { userId?: string },
  ): Promise<JustificationResult[]> {
    const prompt = buildJustificationPrompt(
      profile,
      universities,
      universityDetails,
    );

    const response = await auditedChatCompletion(
      {
        action: "JUSTIFICATION",
        userId: opts?.userId,
        entityType: "Recommendation",
        entityId: opts?.userId,
        inputSummary: summarizeAiText(
          `fallback justifications for ${universities.length} universities`,
        ),
        metadata: { fallback: true },
      },
      {
        model: openaiConfig.fallbackModel,
        temperature: openaiConfig.temperature,
        max_tokens: openaiConfig.maxTokens,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a study-abroad recommendation engine. Always respond with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
      },
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ExternalServiceError("OpenAI", "Empty fallback response");
    }

    const parsed = JSON.parse(content) as JustificationResult[];
    return Array.isArray(parsed) ? parsed : [];
  },
};
