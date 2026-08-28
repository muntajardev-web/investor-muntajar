import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchAllUniversitiesWithPrograms() {
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

  const result = [];

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

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function normalizeGpa(gpa: number, scale: number) {
  if (!gpa || !scale) return 0;
  return (gpa / scale) * 4.0;
}

function calculateGpaFit(student: { gpa?: number; gpaScale?: number }, university: { program: { name: string }; requirements?: string }; requirements?: Array<{ type: string; minValue?: string; isMandatory: boolean }> }) {
  const program = university.program;
  const requirements = university.requirements || [];
  
  let minGpaRequired = 0;
  let hasGpaRequirement = false;

  for (const req of requirements) {
    if ((req.type === "GPA" || req.type === "HSC_GPA" || req.type === "SSC_GPA") && req.isMandatory) {
      const val = parseFloat(req.minValue || "0");
      if (val > minGpaRequired) minGpaRequired = val;
      hasGpaRequirement = true;
    }
  }

  if (!hasGpaRequirement) return 50;

  const studentGpa = normalizeGpa(student.gpa, student.gpaScale);
  if (studentGpa === 0) return 0;

  if (studentGpa >= minGpaRequired) {
    const excess = studentGpa - minGpaRequired;
    return clamp(70 + excess * 15, 70, 100);
  } else {
    const ratio = studentGpa / minGpaRequired;
    return clamp(ratio * 50, 0, 50);
  }
}

function calculateBudgetFit(student, university) {
  const budget = student.budget || 0;
  const tuition = university.program.tuitionFee || 0;
  const living = university.livingCost || 0;
  const totalCost = tuition + living;

  if (budget === 0 || totalCost === 0) return 50;

  const coverage = budget / totalCost;
  if (coverage >= 1.5) return 100;
  if (coverage >= 1.0) return clamp(80 + (coverage - 1) * 40, 80, 100);
  if (coverage >= 0.8) return clamp(50 + (coverage - 0.8) * 150, 50, 80);
  if (coverage >= 0.5) return clamp(20 + (coverage - 0.5) * 100, 20, 50);
  return clamp(coverage * 40, 0, 20);
}

function calculateUniversityRanking(university) {
  const ranking = university.ranking;
  if (!ranking) return 50;

  if (ranking <= 10) return 100;
  if (ranking <= 25) return 90;
  if (ranking <= 50) return 80;
  if (ranking <= 100) return 70;
  if (ranking <= 200) return 60;
  if (ranking <= 500) return 50;
  if (ranking <= 1000) return 40;
  return 30;
}

function calculateScholarshipAvailability(student, university) {
  const scholarships = university.scholarships || [];
  const preference = student.scholarshipPreference || "PREFERRED";

  if (scholarships.length === 0) {
    if (preference === "REQUIRED") return 10;
    if (preference === "PREFERRED") return 30;
    return 60;
  }

  const totalScholarshipAmount = scholarships.reduce((sum, s) => sum + (s.amount || 0), 0);
  const tuition = university.program.tuitionFee || 1;
  const coverageRatio = totalScholarshipAmount / tuition;

  if (preference === "REQUIRED") {
    return clamp(40 + coverageRatio * 100 + scholarships.length * 10, 40, 100);
  }
  if (preference === "PREFERRED") {
    return clamp(50 + coverageRatio * 80 + scholarships.length * 8, 50, 100);
  }
  return clamp(60 + coverageRatio * 60 + scholarships.length * 5, 60, 100);
}

function calculateEnglishTestMatch(student, university) {
  const ieltsReq = university.requirements.find(r => r.type === "IELTS" && r.isMandatory);
  const minIelts = ieltsReq ? parseFloat(ieltsReq.minValue || "6.5") : (university.ieltsRequired || 6.5);

  const studentIelts = student.ieltsOverall || 0;
  const studentToefl = student.toeflScore || 0;
  const studentDuolingo = student.duolingoScore || 0;

  if (studentIelts > 0) {
    const ratio = studentIelts / minIelts;
    return clamp(ratio * 100, 0, 100);
  }
  if (studentToefl > 0) {
    const ieltsEquivalent = Math.max(0, (studentToefl - 30) / 10);
    const ratio = ieltsEquivalent / minIelts;
    return clamp(ratio * 100, 0, 100);
  }
  if (studentDuolingo > 0) {
    const ieltsEquivalent = studentDuolingo / 15;
    const ratio = ieltsEquivalent / minIelts;
    return clamp(ratio * 100, 0, 100);
  }

  return 30;
}

function calculateProgramMatch(student, university) {
  const preferred = student.preferredCourses || [];
  if (preferred.length === 0) return 70;

  const programName = university.program.name.toLowerCase();
  const programField = university.program.field?.toLowerCase() || "";

  for (const pref of preferred) {
    const p = pref.toLowerCase();
    if (programName.includes(p) || programField.includes(p)) return 100;
  }

  for (const pref of preferred) {
    const p = pref.toLowerCase();
    const nameWords = programName.split(" ");
    const fieldWords = programField.split(" ");
    if (nameWords.some(w => p.includes(w)) || fieldWords.some(w => p.includes(w))) return 70;
  }

  return 40;
}

function getEligibilityReasons(student, university) {
  const reasons = [];
  const requirements = university.requirements || [];

  if (student.gpa) {
    const studentGpa = normalizeGpa(student.gpa, student.gpaScale);
    const minGpaReq = requirements
      .filter(r => (r.type === "GPA" || r.type === "HSC_GPA" || r.type === "SSC_GPA") && r.isMandatory)
      .reduce((min, r) => Math.min(min, parseFloat(r.minValue || "5")), 5);
    
    if (studentGpa >= minGpaReq) {
      reasons.push(`✅ GPA ${student.gpa}/${student.gpaScale || 4.0} meets requirement (min ${minGpaReq})`);
    } else {
      reasons.push(`❌ GPA ${student.gpa}/${student.gpaScale || 4.0} below requirement (min ${minGpaReq})`);
    }
  } else {
    const hasGpaReq = requirements.some(r => (r.type === "GPA" || r.type === "HSC_GPA" || r.type === "SSC_GPA") && r.isMandatory);
    if (hasGpaReq) reasons.push(`❌ GPA not provided`);
  }

  if (student.ieltsOverall) {
    const ieltsReq = requirements.find(r => r.type === "IELTS" && r.isMandatory);
    const minIelts = ieltsReq ? parseFloat(ieltsReq.minValue || "6.5") : 6.5;
    
    if (student.ieltsOverall >= minIelts) {
      reasons.push(`✅ IELTS ${student.ieltsOverall} meets requirement (min ${minIelts})`);
    } else {
      reasons.push(`❌ IELTS ${student.ieltsOverall} below requirement (min ${minIelts})`);
    }
  } else if (student.toeflScore) {
    reasons.push(`✅ TOEFL ${student.toeflScore} provided`);
  } else if (student.duolingoScore) {
    reasons.push(`✅ Duolingo ${student.duolingoScore} provided`);
  } else {
    const hasEnglishReq = requirements.some(r => (r.type === "IELTS" || r.type === "TOEFL" || r.type === "DUOLINGO") && r.isMandatory);
    if (hasEnglishReq) reasons.push(`❌ English proficiency not provided`);
  }

  if (student.satScore) {
    const satReq = requirements.find(r => r.type === "SAT" && r.isMandatory);
    if (satReq) {
      const minSat = parseInt(satReq.minValue || "0");
      if (minSat > 0) {
        if (student.satScore >= minSat) {
          reasons.push(`✅ SAT ${student.satScore} meets requirement (min ${minSat})`);
        } else {
          reasons.push(`❌ SAT ${student.satScore} below requirement (min ${minSat})`);
        }
      }
    }
  }

  if (student.budget) {
    const tuition = university.program.tuitionFee || 0;
    const living = university.livingCost || 0;
    const total = tuition + living;
    if (student.budget >= total) {
      reasons.push(`✅ Budget $${student.budget} covers total cost $${total}`);
    } else {
      reasons.push(`❌ Budget $${student.budget} below total cost $${total}`);
    }
  }

  const degreeMatch = university.program.degreeLevel === student.degreeLevel;
  if (degreeMatch) {
    reasons.push(`✅ Degree level matches (${student.degreeLevel})`);
  } else {
    reasons.push(`❌ Degree level mismatch: ${university.program.degreeLevel} vs ${student.degreeLevel}`);
  }

  const programMatch = calculateProgramMatch(student, university) >= 70;
  if (programMatch) {
    reasons.push(`✅ Program "${university.program.name}" matches preferences`);
  } else {
    reasons.push(`❌ Program "${university.program.name}" doesn't match preferred courses`);
  }

  const countryMatch = student.targetCountries?.includes(university.countryCode) ?? true;
  if (countryMatch) {
    reasons.push(`✅ Country ${university.countryCode} in target list`);
  } else {
    reasons.push(`❌ Country ${university.countryCode} not in target list`);
  }

  return reasons;
}

function determineEligibilityStatus(student, university) {
  const reasons = getEligibilityReasons(student, university);
  const missingCount = reasons.filter(r => r.startsWith("❌")).length;

  if (missingCount === 0) return "ELIGIBLE";
  if (missingCount === 1) return "BORDERLINE";
  return "NOT_ELIGIBLE";
}

function determineAdmissionChance(matchScore, eligibilityStatus) {
  if (eligibilityStatus === "NOT_ELIGIBLE") return "LOW";
  if (eligibilityStatus === "BORDERLINE") return matchScore >= 60 ? "MEDIUM" : "LOW";
  if (matchScore >= 75) return "HIGH";
  if (matchScore >= 50) return "MEDIUM";
  return "LOW";
}

function scoreUniversity(student, university) {
  const scoreBreakdown = {
    gpaFit: calculateGpaFit(student, university),
    budgetFit: calculateBudgetFit(student, university),
    universityRanking: calculateUniversityRanking(university),
    scholarshipAvailability: calculateScholarshipAvailability(student, university),
    englishTestMatch: calculateEnglishTestMatch(student, university),
    programMatch: calculateProgramMatch(student, university),
  };

  const weights = {
    gpaFit: 0.35,
    budgetFit: 0.25,
    universityRanking: 0.15,
    scholarshipAvailability: 0.10,
    englishTestMatch: 0.10,
    programMatch: 0.05,
  };

  const matchScore = clamp(
    scoreBreakdown.gpaFit * weights.gpaFit +
    scoreBreakdown.budgetFit * weights.budgetFit +
    scoreBreakdown.universityRanking * weights.universityRanking +
    scoreBreakdown.scholarshipAvailability * weights.scholarshipAvailability +
    scoreBreakdown.englishTestMatch * weights.englishTestMatch +
    scoreBreakdown.programMatch * weights.programMatch,
    0,
    100
  );

  const eligibilityStatus = determineEligibilityStatus(student, university);
  const reasons = getEligibilityReasons(student, university);
  const admissionChance = determineAdmissionChance(matchScore, eligibilityStatus);

  return {
    universityId: university.id,
    name: university.name,
    country: university.country,
    countryCode: university.countryCode,
    matchScore: Math.round(matchScore),
    scoreBreakdown: {
      gpaFit: Math.round(scoreBreakdown.gpaFit),
      budgetFit: Math.round(scoreBreakdown.budgetFit),
      universityRanking: Math.round(scoreBreakdown.universityRanking),
      scholarshipAvailability: Math.round(scoreBreakdown.scholarshipAvailability),
      englishTestMatch: Math.round(scoreBreakdown.englishTestMatch),
      programMatch: Math.round(scoreBreakdown.programMatch),
    },
    eligibilityStatus,
    admissionChance,
    reasons,
    tuitionFee: university.program.tuitionFee,
    currency: university.program.currency,
    ranking: university.ranking,
    scholarships: university.scholarships,
    programName: university.program.name,
    admissionRequirements: university.requirements,
    website: university.website,
  };
}

async function generateRecommendations(studentProfile) {
  const allUniversities = await fetchAllUniversitiesWithPrograms();
  const totalEvaluated = allUniversities.length;

  const filteredUniversities = allUniversities.filter(uni => {
    if (studentProfile.targetCountries?.length && !studentProfile.targetCountries.includes(uni.countryCode)) {
      return false;
    }

    if (uni.program.degreeLevel !== studentProfile.degreeLevel) {
      return false;
    }

    if (studentProfile.preferredCourses?.length) {
      const progName = uni.program.name.toLowerCase();
      const progField = uni.program.field?.toLowerCase() || "";
      const hasMatch = studentProfile.preferredCourses.some(c => 
        progName.includes(c.toLowerCase()) || progField.includes(c.toLowerCase())
      );
      if (!hasMatch) return false;
    }

    if (studentProfile.budget) {
      const tuition = uni.program.tuitionFee || 0;
      const living = uni.livingCost || 0;
      if (studentProfile.budget < tuition + living) return false;
    }

    if (studentProfile.ieltsOverall && uni.ieltsRequired) {
      if (studentProfile.ieltsOverall < uni.ieltsRequired - 1.0) return false;
    }

    if (studentProfile.gpa) {
      const normalizedGpa = normalizeGpa(studentProfile.gpa, studentProfile.gpaScale);
      const minGpaReq = uni.requirements
        .filter(r => (r.type === "GPA" || r.type === "HSC_GPA" || r.type === "SSC_GPA") && r.isMandatory)
        .reduce((min, r) => Math.min(min, parseFloat(r.minValue || "5")), 5);
      if (normalizedGpa < minGpaReq - 0.5) return false;
    }

    return true;
  });

  const filteredOut = totalEvaluated - filteredUniversities.length;

  const scoredUniversities = filteredUniversities.map(uni => scoreUniversity(studentProfile, uni));
  scoredUniversities.sort((a, b) => b.matchScore - a.matchScore);

  return {
    success: true,
    recommendations: scoredUniversities.slice(0, 10),
    totalEvaluated,
    filteredOut,
    generatedAt: new Date().toISOString(),
  };
}

async function test() {
  const studentProfile = {
    gpa: 4.0,
    gpaScale: 5.0,
    ieltsOverall: 7.0,
    budget: 50000,
    budgetCurrency: "USD",
    degreeLevel: "BACHELOR",
    preferredCourses: ["Computer Science"],
    targetCountries: ["CA"],
    scholarshipPreference: "PREFERRED",
  };

  console.log("Testing recommendation engine...");
  const result = await generateRecommendations(studentProfile);
  
  console.log(`Total evaluated: ${result.totalEvaluated}`);
  console.log(`Filtered out: ${result.filteredOut}`);
  console.log(`Recommendations: ${result.recommendations.length}`);
  
  for (const rec of result.recommendations) {
    console.log(`\n--- ${rec.name} (${rec.programName}) ---`);
    console.log(`Country: ${rec.country} (${rec.countryCode})`);
    console.log(`Match Score: ${rec.matchScore}/100`);
    console.log(`Eligibility: ${rec.eligibilityStatus}`);
    console.log(`Admission Chance: ${rec.admissionChance}`);
    console.log(`Tuition: $${rec.tuitionFee} ${rec.currency}`);
    console.log(`Ranking: ${rec.ranking || 'N/A'}`);
    console.log(`Breakdown:`);
    console.log(`  GPA Fit: ${rec.scoreBreakdown.gpaFit}`);
    console.log(`  Budget Fit: ${rec.scoreBreakdown.budgetFit}`);
    console.log(`  Ranking: ${rec.scoreBreakdown.universityRanking}`);
    console.log(`  Scholarship: ${rec.scoreBreakdown.scholarshipAvailability}`);
    console.log(`  English: ${rec.scoreBreakdown.englishTestMatch}`);
    console.log(`  Program: ${rec.scoreBreakdown.programMatch}`);
    console.log(`Reasons:`);
    for (const reason of rec.reasons) {
      console.log(`  ${reason}`);
    }
  }

  await prisma.$disconnect();
}

test().catch(e => {
  console.error(e);
  prisma.$disconnect();
});