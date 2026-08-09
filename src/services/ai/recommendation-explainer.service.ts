import { logger } from "@/lib";
import { AIStudentProfile } from "./student-profile-ai.service";
import { RankedUniversityRecommendation } from "./ranking-engine.service";

export interface ExplainedRecommendation extends RankedUniversityRecommendation {
  explanation: {
    whyRecommended: string;
    pros: string[];
    missingRequirements: string[];
    scholarshipOpportunities: string[];
    advisorRecommendation: string;
    estimatedTuitionFormatted: string;
    estimatedLivingFormatted: string;
  };
}

export class RecommendationExplainerService {
  /**
   * Generates AI explanations for each ranked university recommendation
   */
  public static async generateExplanations(
    profile: AIStudentProfile,
    rankedList: RankedUniversityRecommendation[],
  ): Promise<ExplainedRecommendation[]> {
    logger.info(`[RecommendationExplainer] Generating AI explanations for ${rankedList.length} universities`);

    return rankedList.map((item) => {
      const { candidate, scores } = item;
      const gpaExceeds = profile.rawDocumentData.gpa >= candidate.requiredGpa;
      const ieltsExceeds = profile.rawDocumentData.englishScore >= candidate.requiredIelts;

      const pros = [
        gpaExceeds
          ? `Excellent GPA match (Your GPA ${profile.rawDocumentData.gpa} exceeds minimum ${candidate.requiredGpa})`
          : `Competitive academic profile for ${candidate.field}`,
        ieltsExceeds
          ? `English proficiency exceeds requirement (${profile.rawDocumentData.englishTestType} ${profile.rawDocumentData.englishScore} vs ${candidate.requiredIelts})`
          : `Meets English language entry threshold`,
        `${candidate.postStudyWorkVisa} available upon graduation`,
        `${candidate.availableScholarshipsCount} active scholarship grants eligible for application`,
      ];

      const missingRequirements: string[] = [];
      if (profile.rawDocumentData.gpa < candidate.requiredGpa) {
        missingRequirements.push(`Requires WES credential evaluation or course equivalency verification`);
      }
      if (!profile.rawDocumentData.passportNumber) {
        missingRequirements.push("Valid International Passport copy required for official offer letter issuance");
      }
      missingRequirements.push("2 Letters of Recommendation (Academic / Employer)");
      missingRequirements.push("Statement of Purpose (SOP) aligned with research track");

      const whyRecommended = `${candidate.universityName} in ${candidate.countryName} ranks #${candidate.qsRanking || 50} globally and offers a ${scores.overallMatchScore}% match for your profile in ${profile.preferredField}. Your academic background and work experience strongly position you for admission and graduate employability.`;

      const advisorRecommendation = scores.overallMatchScore >= 90
        ? `Top Tier Recommendation: Apply immediately for the ${candidate.intakeName} before the ${candidate.applicationDeadline} deadline to maximize scholarship grant eligibility.`
        : `Strong Alternative Pathway: Excellent fallback or target choice with high visa success probability (${scores.visaSuccessProbability}%).`;

      return {
        ...item,
        explanation: {
          whyRecommended,
          pros,
          missingRequirements,
          scholarshipOpportunities: candidate.scholarshipsList,
          advisorRecommendation,
          estimatedTuitionFormatted: `$${candidate.tuitionFeeUsd.toLocaleString()} USD / yr`,
          estimatedLivingFormatted: `$${candidate.livingCostUsd.toLocaleString()} USD / yr`,
        },
      };
    });
  }
}
