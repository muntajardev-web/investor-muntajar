import { requireAuth } from "@/server/auth/session";
import { getStudentProfile } from "@/lib/student/queries";
import { recommendationEngineService } from "@/services/recommendation/recommendation-engine.service";
import { logger } from "@/lib";

const COUNTRY_ALIASES: Record<string, string> = {
  USA: "US",
  "UNITED STATES": "US",
  "UNITED STATES OF AMERICA": "US",
  AMERICA: "US",
  UK: "GB",
  "UNITED KINGDOM": "GB",
  "GREAT BRITAIN": "GB",
  ENGLAND: "GB",
  AUS: "AU",
  AUSTRALIA: "AU",
  CAN: "CA",
  CANADA: "CA",
};

function normalizeCountryCode(raw: string): string {
  const value = raw.trim().toUpperCase();
  return COUNTRY_ALIASES[value] ?? value;
}

export async function POST() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const profile = await getStudentProfile(userId);

    if (!profile?.isComplete) {
      return Response.json(
        { error: "Profile incomplete. Please complete your profile first." },
        { status: 400 },
      );
    }

    const otherPrefs = (profile.otherPreferences as Record<string, unknown>) ?? {};

    const countries = (
      profile.targetCountries.length > 0
        ? profile.targetCountries
        : ["CA"]
    )
      .map(normalizeCountryCode)
      .filter(Boolean);

    // Deduplicate while preserving order
    const targetCountries = [...new Set(countries)];

    const preferredSubject =
      profile.preferredCourses[0]?.trim() || "Computer Science";

    const baseInput = {
      userId,
      preferredSubject,
      preferredIntake: "Fall",
      preferredCity: undefined,
      budget: profile.budget ? Number(profile.budget) : 50000,
      budgetCurrency: profile.budgetCurrency ?? "USD",
      hscGpa: profile.gpa ? Number(profile.gpa) : undefined,
      ielts: profile.ieltsOverall ?? undefined,
      duolingo: (otherPrefs.duolingoScore as number) ?? undefined,
      sat: (otherPrefs.satScore as number) ?? undefined,
      financialCapability: "PARTIAL" as const,
      scholarshipPreference: "PREFERRED" as const,
      workWhileStudying: false,
      rankingPriority: "MEDIUM" as const,
    };

    logger.info("Generating recommendations synchronously", {
      userId,
      targetCountries,
      preferredSubject,
    });

    let lastResult = null;

    for (const targetCountry of targetCountries) {
      const result = await recommendationEngineService.generate({
        ...baseInput,
        targetCountry,
      });
      lastResult = result;

      if (result.recommendations.length > 0) {
        logger.info("Recommendation generation completed", {
          userId,
          targetCountry,
          count: result.recommendations.length,
        });

        return Response.json({
          success: true,
          message: "Recommendations generated successfully",
          count: result.recommendations.length,
          country: targetCountry,
        });
      }
    }

    logger.warn("No recommendation matches after trying all target countries", {
      userId,
      targetCountries,
      pipeline: lastResult?.pipeline,
    });

    const { recommendationRepository } = await import(
      "@/repositories/recommendation.repository"
    );
    await recommendationRepository.deleteByUserId(userId);

    return Response.json({
      success: true,
      message:
        "No university matches found for your profile. Try adjusting preferred courses, budget, or target countries.",
      count: 0,
    });
  } catch (error) {
    logger.error("Recommendation generation failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate recommendations",
      },
      { status: 500 },
    );
  }
}
