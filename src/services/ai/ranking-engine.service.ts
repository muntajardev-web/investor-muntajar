import { logger } from "@/lib";
import { AIStudentProfile } from "./student-profile-ai.service";
import { VectorSearchResultCandidate } from "./vector-search.service";

export interface RankedUniversityRecommendation {
  candidate: VectorSearchResultCandidate;
  scores: {
    academicMatchScore: number; // 0-100
    budgetMatchScore: number; // 0-100
    englishMatchScore: number; // 0-100
    countryPreferenceScore: number; // 0-100
    scholarshipMatchScore: number; // 0-100
    careerGoalScore: number; // 0-100
    visaSuccessProbability: number; // 0-100
    admissionProbability: number; // 0-100
    overallMatchScore: number; // 0-100
  };
  admissionProbabilityTier: "HIGH_CHANCE" | "MODERATE_CHANCE" | "REACH_TARGET";
}

export class RankingEngineService {
  /**
   * Ranks candidates across 9 dimensions
   */
  public static rankCandidates(
    profile: AIStudentProfile,
    candidates: VectorSearchResultCandidate[],
  ): RankedUniversityRecommendation[] {
    logger.info(`[RankingEngine] Scoring ${candidates.length} candidates for ${profile.studentName}`);

    const ranked = candidates.map((c) => {
      // 1. Academic Match Score
      const gpaDiff = profile.rawDocumentData.gpa - c.requiredGpa;
      const academicMatchScore = Math.min(
        100,
        Math.max(40, 80 + gpaDiff * 25 + (c.field.toLowerCase().includes(profile.preferredField.toLowerCase()) ? 10 : 0)),
      );

      // 2. Budget Match Score
      const costRatio = profile.rawDocumentData.budgetUsd / (c.totalAnnualCostUsd || 1);
      const budgetMatchScore = Math.min(100, Math.max(35, Math.round(costRatio * 90)));

      // 3. English Match Score
      const englishDiff = profile.rawDocumentData.englishScore - c.requiredIelts;
      const englishMatchScore = Math.min(100, Math.max(50, 85 + englishDiff * 15));

      // 4. Country Preference Score
      const isTopCountry = c.countryName.toLowerCase() === profile.countryPreference.toLowerCase();
      const countryPreferenceScore = isTopCountry ? 100 : profile.eligibleCountries.includes(c.countryName) ? 85 : 65;

      // 5. Scholarship Match Score
      const scholarshipMatchScore = Math.min(
        100,
        Math.max(40, c.availableScholarshipsCount * 20 + (profile.scholarshipNeedScore > 70 ? 20 : 10)),
      );

      // 6. Career Goal Score
      const careerGoalScore = Math.min(100, Math.max(70, Math.round(c.vectorSimilarityScore * 100)));

      // 7. Visa Success Probability
      const visaSuccessProbability = Math.min(
        99,
        Math.max(60, Math.round(profile.visaReadinessScore * 0.7 + (c.countryName === "Germany" || c.countryName === "Canada" ? 25 : 15))),
      );

      // 8. Admission Probability
      const admissionProb = Math.min(
        98,
        Math.max(45, Math.round(academicMatchScore * 0.4 + englishMatchScore * 0.3 + (c.acceptanceRate || 50) * 0.3)),
      );

      // 9. Overall Weighted Score (Overall Match Score %)
      const overallMatchScore = Math.min(
        99,
        Math.round(
          academicMatchScore * 0.25 +
            budgetMatchScore * 0.2 +
            englishMatchScore * 0.15 +
            countryPreferenceScore * 0.1 +
            scholarshipMatchScore * 0.1 +
            careerGoalScore * 0.1 +
            admissionProb * 0.1,
        ),
      );

      const admissionProbabilityTier: "HIGH_CHANCE" | "MODERATE_CHANCE" | "REACH_TARGET" =
        admissionProb >= 85 ? "HIGH_CHANCE" : admissionProb >= 70 ? "MODERATE_CHANCE" : "REACH_TARGET";

      return {
        candidate: c,
        scores: {
          academicMatchScore: Math.round(academicMatchScore),
          budgetMatchScore: Math.round(budgetMatchScore),
          englishMatchScore: Math.round(englishMatchScore),
          countryPreferenceScore: Math.round(countryPreferenceScore),
          scholarshipMatchScore: Math.round(scholarshipMatchScore),
          careerGoalScore: Math.round(careerGoalScore),
          visaSuccessProbability: Math.round(visaSuccessProbability),
          admissionProbability: Math.round(admissionProb),
          overallMatchScore,
        },
        admissionProbabilityTier,
      };
    });

    // Sort descending by overall match score
    return ranked.sort((a, b) => b.scores.overallMatchScore - a.scores.overallMatchScore);
  }
}
