import type { ScoredUniversity, KeyFactor, MatchingCriteria } from "@/types";

interface UniversityContext {
  name: string;
  country: string;
  ranking?: number | null;
  acceptanceRate?: number | null;
  programs: Array<{ name: string; tuitionFee?: number | null }>;
  scholarships: Array<{ name: string; amount?: number | null }>;
}

export function buildJustificationPrompt(
  profile: MatchingCriteria,
  universities: ScoredUniversity[],
  universityDetails: UniversityContext[],
): string {
  const profileSection = `
User Profile:
- GPA: ${profile.gpa ?? "N/A"} (scale: ${profile.gpaScale ?? 4})
- Board: ${profile.board ?? "N/A"}
- Target Countries: ${profile.targetCountries.join(", ")}
- Budget: ${profile.budget ?? "N/A"} ${profile.budgetCurrency}
- Degree Level: ${profile.degreeLevel}
- Preferred Courses: ${profile.preferredCourses.join(", ")}
- IELTS Overall: ${profile.ieltsOverall ?? "N/A"}
`.trim();

  const universitiesSection = universities
    .map((uni, i) => {
      const details = universityDetails[i];
      return `
${i + 1}. ${uni.name} (${uni.country})
   Match Score: ${(uni.matchScore * 100).toFixed(1)}%
   Ranking: ${details?.ranking ?? "N/A"}
   Tuition: ${uni.tuitionFee ?? "N/A"} ${uni.currency ?? "USD"}
   Score Breakdown: ${JSON.stringify(uni.scoreBreakdown)}
`.trim();
    })
    .join("\n\n");

  return `
You are an expert study-abroad counselor for Muntajar, a global mobility platform.

Given the user profile and matched universities, write a personalized justification for EACH university explaining why it is a good fit. Be specific, encouraging, and factual.

${profileSection}

Matched Universities:
${universitiesSection}

Respond in JSON array format:
[
  {
    "universityId": "...",
    "justification": "2-3 sentence personalized explanation",
    "keyFactors": [
      { "category": "academics|tuition|ranking|scholarship|admission|location|post_study_work|safety", "score": 0.0-1.0, "label": "short label", "detail": "optional detail" }
    ]
  }
]
`.trim();
}
