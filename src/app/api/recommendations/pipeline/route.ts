import { NextResponse } from "next/server";
import { DocumentValidationService } from "@/services/ai/document-validation.service";
import { StudentProfileAiService } from "@/services/ai/student-profile-ai.service";
import { VectorSearchService } from "@/services/ai/vector-search.service";
import { RankingEngineService } from "@/services/ai/ranking-engine.service";
import { RecommendationExplainerService } from "@/services/ai/recommendation-explainer.service";
import { logger } from "@/lib";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { documents = [], userInputs = {} } = body;

    logger.info(`[RecommendationPipelineAPI] Starting AI university recommendation pipeline`);

    // Step 1 & 2: Document OCR Validation & Data Extraction
    const extractedData = await DocumentValidationService.validateAndExtract(documents, userInputs);

    // Step 3: AI Student Profile Inferencing Engine
    const studentProfile = await StudentProfileAiService.buildProfile(extractedData);

    // Step 4 & 5: Semantic Vector Search & Hybrid Database Query
    const candidates = await VectorSearchService.executeHybridSearch(studentProfile);

    // Step 6: 9-Factor AI Ranking Engine
    const rankedRecommendations = RankingEngineService.rankCandidates(studentProfile, candidates);

    // Step 7: AI Reasoning & Explanation Generator
    const explainedRecommendations = await RecommendationExplainerService.generateExplanations(
      studentProfile,
      rankedRecommendations,
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      studentProfile,
      recommendations: explainedRecommendations,
    });
  } catch (error: any) {
    logger.error(`[RecommendationPipelineAPI] Error executing pipeline: ${error.message}`);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute university recommendation pipeline",
      },
      { status: 500 },
    );
  }
}
