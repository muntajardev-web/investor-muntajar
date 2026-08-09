import type {
  StudentProfileInput,
  UniversityWithProgram,
  EligibilityStatus,
} from "@/types/recommendation-engine";

export interface EligibilityCheckResult {
  isEligible: boolean;
  failedRequirements: string[];
  missingCount: number;
  status: EligibilityStatus;
  reasons: string[];
}

export const eligibilityEngine = {
  checkEligibility(
    profile: StudentProfileInput,
    university: UniversityWithProgram
  ): EligibilityCheckResult {
    const failedRequirements: string[] = [];
    const reasons: string[] = [];

    const program = university.program;
    const requirements = university.requirements || [];
    const minIelts = university.ieltsRequired || 0;
    const minGpa = requirements
      .filter(r => (r.type === "GPA" || r.type === "HSC_GPA" || r.type === "SSC_GPA") && r.isMandatory)
      .reduce((min, r) => Math.min(min, parseFloat(r.minValue || "5")), 5);
    const minToefl = requirements
      .filter(r => r.type === "TOEFL" && r.isMandatory)
      .reduce((min, r) => Math.min(min, parseInt(r.minValue || "0")), 0);
    const minSat = requirements
      .filter(r => r.type === "SAT" && r.isMandatory)
      .reduce((min, r) => Math.min(min, parseInt(r.minValue || "0")), 0);
    const annualTuition = program.tuitionFee || 0;
    const livingCost = university.livingCost || 0;
    const totalAnnualCost = annualTuition + livingCost;
    const budget = profile.budget || 0;

    let missingCount = 0;

    if (profile.gpa !== undefined && minGpa > 0) {
      const normalizedGpa = (profile.gpa / (profile.gpaScale || 4.0)) * 4.0;
      if (normalizedGpa < minGpa) {
        failedRequirements.push(`GPA: ${profile.gpa}/${profile.gpaScale} < required ${minGpa}`);
        reasons.push(`GPA ${profile.gpa}/${profile.gpaScale || 4.0} is below the minimum requirement of ${minGpa}`);
        missingCount++;
      } else {
        reasons.push(`GPA ${profile.gpa}/${profile.gpaScale || 4.0} meets requirement (min ${minGpa})`);
      }
    } else if (minGpa > 0 && profile.gpa === undefined) {
      failedRequirements.push("GPA not provided");
      reasons.push("GPA not provided but required by program");
      missingCount++;
    }

    if (profile.ieltsOverall !== undefined && minIelts > 0) {
      if (profile.ieltsOverall < minIelts) {
        failedRequirements.push(`IELTS: ${profile.ieltsOverall} < required ${minIelts}`);
        reasons.push(`IELTS ${profile.ieltsOverall} is below the minimum requirement of ${minIelts}`);
        missingCount++;
      } else {
        reasons.push(`IELTS ${profile.ieltsOverall} meets requirement (min ${minIelts})`);
      }
    } else if (minIelts > 0 && profile.ieltsOverall === undefined) {
      failedRequirements.push("IELTS not provided");
      reasons.push("IELTS not provided but required by program");
      missingCount++;
    }

    if (profile.toeflScore !== undefined && minToefl > 0) {
      if (profile.toeflScore < minToefl) {
        failedRequirements.push(`TOEFL: ${profile.toeflScore} < required ${minToefl}`);
        reasons.push(`TOEFL ${profile.toeflScore} is below the minimum requirement of ${minToefl}`);
        missingCount++;
      } else {
        reasons.push(`TOEFL ${profile.toeflScore} meets requirement (min ${minToefl})`);
      }
    } else if (minToefl > 0 && profile.toeflScore === undefined && profile.ieltsOverall === undefined) {
      failedRequirements.push("English proficiency not provided");
      reasons.push("No English proficiency score provided (IELTS/TOEFL required)");
      missingCount++;
    }

    if (profile.satScore !== undefined && minSat > 0) {
      if (profile.satScore < minSat) {
        failedRequirements.push(`SAT: ${profile.satScore} < required ${minSat}`);
        reasons.push(`SAT ${profile.satScore} is below the minimum requirement of ${minSat}`);
        missingCount++;
      } else {
        reasons.push(`SAT ${profile.satScore} meets requirement (min ${minSat})`);
      }
    } else if (minSat > 0 && profile.satScore === undefined) {
      reasons.push("SAT not provided (optional for this program)");
    }

    if (budget > 0 && totalAnnualCost > 0) {
      if (budget < totalAnnualCost) {
        failedRequirements.push(`Budget: $${budget} < total cost $${totalAnnualCost}`);
        reasons.push(`Budget $${budget} is below total annual cost of $${totalAnnualCost}`);
        missingCount++;
      } else {
        reasons.push(`Budget $${budget} covers total annual cost of $${totalAnnualCost}`);
      }
    }

    const degreeMatch = program.degreeLevel === profile.degreeLevel;
    if (!degreeMatch) {
      failedRequirements.push(`Degree level mismatch: ${program.degreeLevel} vs ${profile.degreeLevel}`);
      reasons.push(`Program degree level (${program.degreeLevel}) does not match preferred (${profile.degreeLevel})`);
      missingCount++;
    } else {
      reasons.push(`Degree level matches (${profile.degreeLevel})`);
    }

    const programMatch = this.matchesProgram(profile.preferredCourses || [], program.name, program.field || "");
    if (!programMatch) {
      failedRequirements.push(`Program mismatch: ${program.name} not in preferred courses`);
      reasons.push(`Program ${program.name} does not match preferred courses`);
      missingCount++;
    } else {
      reasons.push(`Program ${program.name} matches preferred courses`);
    }

    const countryMatch = profile.targetCountries?.includes(university.countryCode) ?? true;
    if (!countryMatch) {
      failedRequirements.push(`Country mismatch: ${university.countryCode} not in target countries`);
      reasons.push(`University country (${university.countryCode}) not in target countries`);
      missingCount++;
    }

    let status: EligibilityStatus = "ELIGIBLE";
    if (missingCount === 0) {
      status = "ELIGIBLE";
    } else if (missingCount === 1) {
      status = "BORDERLINE";
    } else {
      status = "NOT_ELIGIBLE";
    }

    const isEligible = missingCount === 0;

    return {
      isEligible,
      failedRequirements,
      missingCount,
      status,
      reasons,
    };
  },

  filterEligible(
    profile: StudentProfileInput,
    universities: UniversityWithProgram[]
  ): { eligible: UniversityWithProgram[]; ineligible: UniversityWithProgram[]; borderline: UniversityWithProgram[] } {
    const eligible: UniversityWithProgram[] = [];
    const ineligible: UniversityWithProgram[] = [];
    const borderline: UniversityWithProgram[] = [];

    for (const uni of universities) {
      const result = this.checkEligibility(profile, uni);
      if (result.status === "ELIGIBLE") {
        eligible.push(uni);
      } else if (result.status === "BORDERLINE") {
        borderline.push(uni);
      } else {
        ineligible.push(uni);
      }
    }

    return { eligible, ineligible, borderline };
  },

  matchesProgram(preferredCourses: string[], programName: string, programField: string): boolean {
    if (preferredCourses.length === 0) return true;
    
    const normalized = preferredCourses.map(c => c.toLowerCase().trim());
    const nameLower = programName.toLowerCase();
    const fieldLower = programField.toLowerCase();
    
    return normalized.some(c => 
      nameLower.includes(c) || 
      fieldLower.includes(c) ||
      c.includes("science") && (nameLower.includes("cs") || nameLower.includes("computer")) ||
      c.includes("engineering") && nameLower.includes("eng")
    );
  },
};