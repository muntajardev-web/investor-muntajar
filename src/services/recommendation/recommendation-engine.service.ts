import { recommendationEngineConfig } from "@/config";
import { generateId, logger } from "@/lib";
import { recommendationEngineRepository } from "@/repositories/recommendation-engine.repository";
import type {
  RecommendationEngineResponse,
  RecommendationInput,
} from "@/types/recommendation-engine";
import { aiAnalysisService } from "./ai-analysis.service";
import { eligibilityScoringService } from "./eligibility-scoring.service";
import { filterPipeline } from "./filter.pipeline";

export const recommendationEngineService = {
  async generate(
    input: RecommendationInput,
  ): Promise<RecommendationEngineResponse> {
    const batchId = generateId();

    logger.info("Recommendation pipeline started", {
      batchId,
      targetCountry: input.targetCountry,
      subject: input.preferredSubject,
    });

    // Step 1: Filter universities by country (SQL)
    const universities =
      await recommendationEngineRepository.filterUniversitiesByCountry(
        input.targetCountry.toUpperCase(),
        input.preferredCity,
      );

    const universityIds = universities.map((u) => u.university_id);

    // Step 2: Filter programs by subject (+ optional intake)
    let programs =
      await recommendationEngineRepository.filterProgramsBySubject(
        universityIds,
        input.preferredSubject,
        input.preferredIntake,
      );

    // If intake/subject were too strict, broaden so students still get matches.
    if (programs.length === 0 && input.preferredIntake) {
      programs = await recommendationEngineRepository.filterProgramsBySubject(
        universityIds,
        input.preferredSubject,
        undefined,
      );
    }
    if (programs.length === 0 && input.preferredSubject) {
      const broadSubject = input.preferredSubject.split(/[\s,/]+/)[0] ?? "";
      if (broadSubject && broadSubject !== input.preferredSubject) {
        programs = await recommendationEngineRepository.filterProgramsBySubject(
          universityIds,
          broadSubject,
          undefined,
        );
      }
    }
    if (programs.length === 0) {
      programs = await recommendationEngineRepository.filterProgramsBySubject(
        universityIds,
        "",
        undefined,
      );
    }

    const programIds = programs.map((p) => p.program_id);
    const uniqueUniIds = [...new Set(programs.map((p) => p.university_id))];

    const [requirements, intakes, rankings, scholarships] = await Promise.all([
      recommendationEngineRepository.fetchRequirements(programIds),
      recommendationEngineRepository.fetchIntakes(programIds),
      recommendationEngineRepository.fetchRankings(uniqueUniIds),
      recommendationEngineRepository.fetchScholarships(uniqueUniIds, programIds),
    ]);

    let candidates = recommendationEngineRepository.assembleCandidates(
      universities,
      programs,
      requirements,
      intakes,
      rankings,
      scholarships,
    );

    const step2Count = candidates.length;

    // Step 3: Budget filter (keep unfiltered set if budget wipes everyone)
    const budgetFiltered = filterPipeline.filterByBudget(candidates, input);
    candidates = budgetFiltered.length > 0 ? budgetFiltered : candidates;
    const step3Count = candidates.length;

    // Step 4: GPA / test requirements filter
    const academicFiltered = filterPipeline.applyBaselineAcademicFilter(
      filterPipeline.filterByGpaAndTests(candidates, input),
      input,
    );
    candidates =
      academicFiltered.length > 0 ? academicFiltered : candidates;
    const step4Count = candidates.length;

    // Step 5: Eligibility scoring
    const scored = eligibilityScoringService.rankAndTake(
      candidates,
      input,
      recommendationEngineConfig.preFilterLimit,
    );
    const step5Count = scored.length;

    // Step 6: Top 15 to GPT
    const topForGpt = scored.slice(0, recommendationEngineConfig.gptTopN);
    const gptAnalysis = await aiAnalysisService.analyze(input, topForGpt);

    const analysisMap = new Map(
      gptAnalysis.map((a) => [`${a.universityId}:${a.programId}`, a]),
    );

    const recommendations = topForGpt.map((candidate) => {
      const analysis = analysisMap.get(
        `${candidate.universityId}:${candidate.programId}`,
      )!;

      return { ...candidate, ...analysis };
    });

    logger.info("Recommendation pipeline completed", {
      batchId,
      step1: universities.length,
      step2: step2Count,
      step3: step3Count,
      step4: step4Count,
      step5: step5Count,
      step6: topForGpt.length,
    });

    if (input.userId && recommendations.length > 0) {
      const { recommendationRepository } = await import(
        "@/repositories/recommendation.repository"
      );
      await recommendationRepository.deleteByUserId(input.userId);
      await recommendationRepository.saveEngineResults(
        input.userId,
        batchId,
        recommendations.map((r) => ({
          universityId: r.universityId,
          programId: r.programId,
          matchScore: r.overallScore,
          analysis: {
            whyThisUniversity: r.whyThisUniversity,
            pros: r.pros,
            cons: r.cons,
            admissionChance: r.admissionChance,
            scholarshipChance: r.scholarshipChance,
            visaChance: r.visaChance,
            employmentOpportunity: r.employmentOpportunity,
            overallScore: r.overallScore,
            eligibilityScore: r.eligibilityScore,
            scoreBreakdown: r.scoreBreakdown,
          },
        })),
      );
    }

    return {
      success: true,
      batchId,
      pipeline: {
        step1_universitiesFiltered: universities.length,
        step2_programsFiltered: step2Count,
        step3_budgetFiltered: step3Count,
        step4_gpaFiltered: step4Count,
        step5_scored: step5Count,
        step6_sentToGpt: topForGpt.length,
      },
      recommendations,
      generatedAt: new Date().toISOString(),
    };
  },
};
