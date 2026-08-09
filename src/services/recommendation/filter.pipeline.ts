import { recommendationEngineConfig } from "@/config";
import type {
  FinancialCapability,
  RecommendationInput,
  RequirementRow,
  UniversityProgramCandidate,
} from "@/types/recommendation-engine";

function parseMinValue(minValue: string | null): number | null {
  if (!minValue) return null;
  const parsed = parseFloat(minValue);
  return Number.isNaN(parsed) ? null : parsed;
}

function meetsRequirement(
  type: string,
  minValue: string | null,
  input: RecommendationInput,
): boolean {
  const min = parseMinValue(minValue);
  if (min === null) return true;

  switch (type) {
    case "SSC_GPA":
      return input.sscGpa !== undefined && input.sscGpa >= min;
    case "HSC_GPA":
    case "GPA":
      return input.hscGpa !== undefined && input.hscGpa >= min;
    case "IELTS":
      return input.ielts !== undefined && input.ielts >= min;
    case "DUOLINGO":
      return input.duolingo !== undefined && input.duolingo >= min;
    case "SAT":
      return input.sat !== undefined && input.sat >= min;
    default:
      return true;
  }
}

function meetsAllMandatoryRequirements(
  requirements: RequirementRow[],
  input: RecommendationInput,
): boolean {
  const mandatory = requirements.filter((r) => r.isMandatory);
  if (mandatory.length === 0) return true;
  return mandatory.every((r) => meetsRequirement(r.type, r.minValue, input));
}

export const filterPipeline = {
  /**
   * Step 3: Remove candidates outside budget based on financial capability.
   */
  filterByBudget(
    candidates: UniversityProgramCandidate[],
    input: RecommendationInput,
  ): UniversityProgramCandidate[] {
    const threshold =
      recommendationEngineConfig.financialThresholds[input.financialCapability];

    return candidates.filter((c) => {
      const totalAnnualCost = c.tuitionFee + c.livingCost;
      if (totalAnnualCost === 0) return true;

      const coverage = input.budget / totalAnnualCost;
      return coverage >= threshold;
    });
  },

  /**
   * Step 4: Remove candidates that do not meet mandatory GPA/test requirements.
   */
  filterByGpaAndTests(
    candidates: UniversityProgramCandidate[],
    input: RecommendationInput,
  ): UniversityProgramCandidate[] {
    return candidates.filter((c) =>
      meetsAllMandatoryRequirements(c.requirements, input),
    );
  },

  /**
   * Fallback: when no requirements in DB, apply baseline thresholds from user input.
   */
  applyBaselineAcademicFilter(
    candidates: UniversityProgramCandidate[],
    input: RecommendationInput,
  ): UniversityProgramCandidate[] {
    return candidates.filter((c) => {
      if (c.requirements.length > 0) return true;

      if (input.ielts !== undefined && c.ieltsRequired !== null) {
        if (input.ielts < c.ieltsRequired) return false;
      }

      if (input.hscGpa !== undefined && input.hscGpa < 2.5) return false;
      return true;
    });
  },

  getBudgetCoverage(
    candidate: UniversityProgramCandidate,
    budget: number,
  ): number {
    const total = candidate.tuitionFee + candidate.livingCost;
    if (total === 0) return 1;
    return Math.min(1, budget / total);
  },

  getFinancialThreshold(capability: FinancialCapability): number {
    return recommendationEngineConfig.financialThresholds[capability];
  },
};
