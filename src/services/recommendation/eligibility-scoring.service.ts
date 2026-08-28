import { scoringWeights } from "@/config";
import type {
  EligibilityScoreBreakdown,
  RecommendationInput,
  ScoredCandidate,
  UniversityProgramCandidate,
} from "@/types/recommendation-engine";
import { filterPipeline } from "./filter.pipeline";

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function scoreAcademic(
  candidate: UniversityProgramCandidate,
  input: RecommendationInput,
): number {
  let score = 50;
  let factors = 0;

  if (input.hscGpa !== undefined) {
    score += (input.hscGpa / 5) * 30;
    factors++;
  }
  if (input.sscGpa !== undefined) {
    score += (input.sscGpa / 5) * 15;
    factors++;
  }
  if (input.ielts !== undefined && candidate.ieltsRequired) {
    const ratio = input.ielts / candidate.ieltsRequired;
    score += clamp(ratio * 25, 0, 25);
    factors++;
  } else if (input.ielts !== undefined) {
    score += (input.ielts / 9) * 20;
    factors++;
  }
  if (input.duolingo !== undefined) {
    score += (input.duolingo / 160) * 15;
    factors++;
  }
  if (input.sat !== undefined) {
    score += ((input.sat - 400) / 1200) * 15;
    factors++;
  }

  if (candidate.acceptanceRate !== null) {
    score += candidate.acceptanceRate * 0.15;
  }

  return factors > 0 ? clamp(score / (1 + factors * 0.1)) : 50;
}

function scoreBudget(
  candidate: UniversityProgramCandidate,
  input: RecommendationInput,
): number {
  const coverage = filterPipeline.getBudgetCoverage(candidate, input.budget);
  const threshold = filterPipeline.getFinancialThreshold(
    input.financialCapability,
  );
  if (coverage >= 1) return 100;
  if (coverage >= threshold) return clamp(coverage * 100);
  return clamp(coverage * 80);
}

function scoreSubject(
  candidate: UniversityProgramCandidate,
  input: RecommendationInput,
): number {
  const subject = input.preferredSubject.toLowerCase();
  const field = candidate.programField?.toLowerCase() ?? "";
  const name = candidate.programName.toLowerCase();

  if (field.includes(subject) || name.includes(subject)) return 100;
  if (field.split(" ").some((w) => subject.includes(w))) return 70;
  return 40;
}

function scoreIntake(
  candidate: UniversityProgramCandidate,
  input: RecommendationInput,
): number {
  const intake = input.preferredIntake.toLowerCase();
  const match = candidate.intakes.some((i) =>
    i.name.toLowerCase().includes(intake),
  );
  return match ? 100 : 30;
}

function scoreScholarship(
  candidate: UniversityProgramCandidate,
  input: RecommendationInput,
): number {
  const count = candidate.scholarships.length;
  if (count === 0) {
    return input.scholarshipPreference === "REQUIRED" ? 10 : 40;
  }
  if (input.scholarshipPreference === "REQUIRED") return clamp(count * 30 + 40);
  if (input.scholarshipPreference === "PREFERRED") return clamp(count * 25 + 50);
  return clamp(count * 15 + 60);
}

function scoreEmployment(
  candidate: UniversityProgramCandidate,
  input: RecommendationInput,
): number {
  let score = 40;
  if (candidate.postStudyWork) score += 30;
  if (input.workWhileStudying && candidate.postStudyWork) score += 20;
  if (candidate.visaSuccessRate !== null) {
    score += candidate.visaSuccessRate * 0.1;
  }
  return clamp(score);
}

function scoreRanking(candidate: UniversityProgramCandidate): number {
  const best = candidate.rankings[0];
  if (!best) return 50;
  return clamp(100 - (best.rank / 1000) * 100);
}

export const eligibilityScoringService = {
  score(
    candidate: UniversityProgramCandidate,
    input: RecommendationInput,
  ): ScoredCandidate {
    const scoreBreakdown: EligibilityScoreBreakdown = {
      academic: scoreAcademic(candidate, input),
      budget: scoreBudget(candidate, input),
      subject: scoreSubject(candidate, input),
      intake: scoreIntake(candidate, input),
      scholarship: scoreScholarship(candidate, input),
      employment: scoreEmployment(candidate, input),
      ranking: scoreRanking(candidate),
    };

    const eligibilityScore = clamp(
      scoreBreakdown.academic * scoringWeights.academic +
        scoreBreakdown.budget * scoringWeights.budget +
        scoreBreakdown.subject * scoringWeights.subject +
        scoreBreakdown.intake * scoringWeights.intake +
        scoreBreakdown.scholarship * scoringWeights.scholarship +
        scoreBreakdown.employment * scoringWeights.employment +
        scoreBreakdown.ranking * scoringWeights.ranking,
    );

    return {
      ...candidate,
      eligibilityScore,
      scoreBreakdown,
      totalAnnualCost: candidate.tuitionFee + candidate.livingCost,
    };
  },

  rankAndTake(
    candidates: UniversityProgramCandidate[],
    input: RecommendationInput,
    topN: number,
  ): ScoredCandidate[] {
    return candidates
      .map((c) => this.score(c, input))
      .sort((a, b) => b.eligibilityScore - a.eligibilityScore)
      .slice(0, topN);
  },
};
