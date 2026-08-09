import { prisma } from "@/lib/prisma";
import type {
  StudentProfileInput,
  UniversityWithProgram,
  ScoredUniversityResult,
} from "@/types/recommendation-engine";
import { scoreUniversity } from "./scoreCalculator";

export interface RecommendationRequest {
  studentProfile: StudentProfileInput;
  limit?: number;
  userId?: string;
}

export interface RecommendationResponse {
  success: boolean;
  recommendations: ScoredUniversityResult[];
  totalEvaluated: number;
  filteredOut: number;
  generatedAt: string;
}

async function fetchAllUniversitiesWithPrograms(): Promise<UniversityWithProgram[]> {
  const universities = await prisma.university.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    include: {
      country: true,
      programs: {
        where: { status: "ACTIVE", deletedAt: null },
        include: {
          intakes: {
            where: { status: "ACTIVE", deletedAt: null },
          },
          requirements: {
            where: { status: "ACTIVE", deletedAt: null },
          },
        },
      },
      scholarships: {
        where: { status: "ACTIVE", deletedAt: null },
      },
      rankings: {
        where: { status: "ACTIVE", deletedAt: null },
        orderBy: { rank: "asc" },
        take: 1,
      },
    },
  });

  const result: UniversityWithProgram[] = [];

  for (const uni of universities) {
    for (const program of uni.programs) {
      const scholarships = uni.scholarships
        .filter(s => s.programId === null || s.programId === program.id)
        .map(s => ({
          id: s.id,
          name: s.name,
          type: s.type,
          amount: s.amount ? Number(s.amount) : undefined,
          currency: s.currency,
        }));

      const requirements = program.requirements?.map(r => ({
        type: r.type,
        minValue: r.minValue || undefined,
        isMandatory: r.isMandatory,
      })) || [];

      result.push({
        id: uni.id,
        name: uni.name,
        slug: uni.slug,
        country: uni.country.name,
        countryCode: uni.country.code,
        city: uni.city || undefined,
        type: uni.type,
        ranking: uni.rankings[0]?.rank || undefined,
        acceptanceRate: uni.acceptanceRate || undefined,
        website: uni.website || undefined,
        logoUrl: uni.logoUrl || undefined,
        description: uni.description || undefined,
        program: {
          id: program.id,
          name: program.name,
          degreeLevel: program.degreeLevel,
          field: program.field || undefined,
          tuitionFee: program.tuitionFee ? Number(program.tuitionFee) : undefined,
          currency: program.currency,
          intakes: program.intakes?.map(i => i.name) || [],
        },
        scholarships,
        requirements,
        livingCost: uni.country.livingCost ? Number(uni.country.livingCost) : undefined,
        ieltsRequired: uni.country.ieltsRequired || undefined,
      });
    }
  }

  return result;
}

function filterUniversities(
  universities: UniversityWithProgram[],
  student: StudentProfileInput
): UniversityWithProgram[] {
  return universities.filter(uni => {
    if (student.targetCountries?.length && !student.targetCountries.includes(uni.countryCode)) {
      return false;
    }

    if (uni.program.degreeLevel !== student.degreeLevel) {
      return false;
    }

    if (student.preferredCourses?.length) {
      const progName = uni.program.name.toLowerCase();
      const progField = uni.program.field?.toLowerCase() || "";
      const hasMatch = student.preferredCourses.some(c => 
        progName.includes(c.toLowerCase()) || progField.includes(c.toLowerCase())
      );
      if (!hasMatch) return false;
    }

    if (student.budget) {
      const tuition = uni.program.tuitionFee || 0;
      const living = uni.livingCost || 0;
      if (student.budget < tuition + living) return false;
    }

    if (student.ieltsOverall && uni.ieltsRequired) {
      if (student.ieltsOverall < uni.ieltsRequired - 1.0) return false;
    }

    if (student.gpa) {
      const normalizedGpa = (student.gpa / (student.gpaScale || 4.0)) * 4.0;
      const minGpaReq = uni.requirements
        .filter(r => (r.type === "GPA" || r.type === "HSC_GPA" || r.type === "SSC_GPA") && r.isMandatory)
        .reduce((min, r) => Math.min(min, parseFloat(r.minValue || "5")), 5);
      if (normalizedGpa < minGpaReq - 0.5) return false;
    }

    return true;
  });
}

export async function generateRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const allUniversities = await fetchAllUniversitiesWithPrograms();
  const totalEvaluated = allUniversities.length;

  const filteredUniversities = filterUniversities(allUniversities, request.studentProfile);
  const filteredOut = totalEvaluated - filteredUniversities.length;

  const scoredUniversities = filteredUniversities.map(uni => 
    scoreUniversity(request.studentProfile, uni)
  );

  scoredUniversities.sort((a, b) => b.matchScore - a.matchScore);

  const limitedResults = request.limit 
    ? scoredUniversities.slice(0, request.limit)
    : scoredUniversities;

  return {
    success: true,
    recommendations: limitedResults,
    totalEvaluated,
    filteredOut,
    generatedAt: new Date().toISOString(),
  };
}

export async function storeStudentProfile(
  userId: string,
  profile: StudentProfileInput
): Promise<string> {
  const profileRecord = await prisma.studentProfile.upsert({
    where: { userId },
    update: {
      gpa: profile.gpa,
      gpaScale: profile.gpaScale,
      board: profile.board as any,
      targetCountries: profile.targetCountries || [],
      budget: profile.budget,
      budgetCurrency: profile.budgetCurrency || "USD",
      degreeLevel: profile.degreeLevel as any,
      preferredCourses: profile.preferredCourses || [],
      ieltsOverall: profile.ieltsOverall,
      ieltsReading: profile.ieltsReading,
      ieltsWriting: profile.ieltsWriting,
      ieltsListening: profile.ieltsListening,
      ieltsSpeaking: profile.ieltsSpeaking,
      toeflScore: profile.toeflScore,
      otherPreferences: {
        duolingoScore: profile.duolingoScore,
        satScore: profile.satScore,
        scholarshipPreference: profile.scholarshipPreference,
        rankingPriority: profile.rankingPriority,
      },
      isComplete: true,
    },
    create: {
      userId,
      gpa: profile.gpa,
      gpaScale: profile.gpaScale,
      board: profile.board as any,
      targetCountries: profile.targetCountries || [],
      budget: profile.budget,
      budgetCurrency: profile.budgetCurrency || "USD",
      degreeLevel: profile.degreeLevel as any,
      preferredCourses: profile.preferredCourses || [],
      ieltsOverall: profile.ieltsOverall,
      ieltsReading: profile.ieltsReading,
      ieltsWriting: profile.ieltsWriting,
      ieltsListening: profile.ieltsListening,
      ieltsSpeaking: profile.ieltsSpeaking,
      toeflScore: profile.toeflScore,
      otherPreferences: {
        duolingoScore: profile.duolingoScore,
        satScore: profile.satScore,
        scholarshipPreference: profile.scholarshipPreference,
        rankingPriority: profile.rankingPriority,
      },
      isComplete: true,
    },
  });

  return profileRecord.id;
}

export async function storeRecommendationResults(
  userId: string,
  batchId: string,
  recommendations: ScoredUniversityResult[]
): Promise<number> {
  const result = await prisma.recommendationHistory.createMany({
    data: recommendations.map(r => ({
      userId,
      universityId: r.universityId,
      programId: undefined,
      matchScore: r.matchScore,
      justification: JSON.stringify({
        reasons: r.reasons,
        scoreBreakdown: r.scoreBreakdown,
        eligibilityStatus: r.eligibilityStatus,
        admissionChance: r.admissionChance,
      }),
      keyFactors: {
        scoreBreakdown: r.scoreBreakdown,
        eligibilityStatus: r.eligibilityStatus,
        admissionChance: r.admissionChance,
        reasons: r.reasons,
      } as any,
      batchId,
      status: "COMPLETED" as any,
    })),
  });

  return result.count;
}