import { NextRequest } from "next/server";
import { recommendationInputSchema } from "@/types/recommendation-engine";
import { generateRecommendations } from "@/services/recommendation/recommendationEngine";
import { apiSuccess, handleApiError } from "@/server/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = recommendationInputSchema.parse(body);

    const result = await generateRecommendations({
      studentProfile: {
        gpa: input.hscGpa,
        gpaScale: 5.0,
        board: "HSC",
        ieltsOverall: input.ielts,
        ieltsReading: undefined,
        ieltsWriting: undefined,
        ieltsListening: undefined,
        ieltsSpeaking: undefined,
        toeflScore: undefined,
        duolingoScore: input.duolingo,
        satScore: input.sat,
        budget: input.budget,
        budgetCurrency: input.budgetCurrency,
        degreeLevel: "BACHELOR",
        preferredCourses: [input.preferredSubject],
        targetCountries: [input.targetCountry.toUpperCase()],
        scholarshipPreference: input.scholarshipPreference,
        rankingPriority: "MEDIUM",
      },
      limit: 10,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}