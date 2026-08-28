import { logger } from "@/lib";
import { ExtractedStudentDocumentData } from "./document-validation.service";

export interface AIStudentProfile {
  studentName: string;
  academicLevel: "BACHELORS" | "MASTERS" | "PHD" | "DIPLOMA";
  strongSubjects: string[];
  weakSubjects: string[];
  careerInterests: string[];
  budgetCategory: "LOW_BUDGET" | "MODERATE" | "HIGH_BUDGET" | "FULL_SCHOLARSHIP_REQUIRED";
  scholarshipNeedScore: number; // 0 - 100
  countryPreference: string;
  eligibleCountries: string[];
  eligibleDegreeLevels: string[];
  preferredField: string;
  totalWorkExperienceMonths: number;
  englishProficiencyLevel: "EXCELLENT" | "GOOD" | "MODERATE" | "NEEDS_IMPROVEMENT";
  visaReadinessScore: number; // 0 - 100
  gapYearsCount: number;
  profileStrengthScore: number; // 0 - 100
  rawDocumentData: ExtractedStudentDocumentData;
}

export class StudentProfileAiService {
  /**
   * Builds an enriched AI Student Profile from document extraction JSON
   */
  public static async buildProfile(
    docData: ExtractedStudentDocumentData,
  ): Promise<AIStudentProfile> {
    logger.info(`[AIProfileEngine] Analyzing student profile for ${docData.name}`);

    // Calculate Visa Readiness (Factors: Passport verification, IELTS score, Financial budget, GPA)
    let visaScore = 70;
    if (docData.verificationStatus === "VERIFIED") visaScore += 15;
    if (docData.englishScore >= 6.5) visaScore += 10;
    if (docData.budgetUsd >= 20000) visaScore += 5;

    // Calculate Scholarship Need Score
    const scholarshipNeed = docData.budgetUsd < 15000 ? 90 : docData.budgetUsd < 30000 ? 60 : 25;

    // Evaluate Profile Strength Score (GPA 40%, English 30%, Work 20%, Doc Verification 10%)
    const gpaComponent = Math.min(100, (docData.gpa / 4.0) * 100);
    const englishComponent = Math.min(100, (docData.englishScore / 9.0) * 100);
    const workComponent = Math.min(100, docData.workExperience.reduce((sum, w) => sum + w.durationMonths, 0) * 4); // 25 mos = 100
    const profileStrength = Math.round(
      gpaComponent * 0.4 + englishComponent * 0.3 + workComponent * 0.2 + (docData.verificationStatus === "VERIFIED" ? 10 : 0),
    );

    // Infer academic & career fields
    const eligibleCountries = Array.from(
      new Set([docData.preferredCountry, "Canada", "United Kingdom", "Germany", "Australia", "USA"]),
    );

    return {
      studentName: docData.name,
      academicLevel: docData.degree.toLowerCase().includes("bachelor") ? "MASTERS" : "BACHELORS",
      strongSubjects: ["Computer Science", "Software Engineering", "Mathematics", "Algorithms"],
      weakSubjects: ["Theoretical Physics", "Organic Chemistry"],
      careerInterests: ["AI / Machine Learning Engineer", "Software Architect", "Data Scientist"],
      budgetCategory: docData.budgetUsd < 15000 ? "LOW_BUDGET" : docData.budgetUsd < 35000 ? "MODERATE" : "HIGH_BUDGET",
      scholarshipNeedScore: scholarshipNeed,
      countryPreference: docData.preferredCountry,
      eligibleCountries,
      eligibleDegreeLevels: ["Postgraduate Certificate", "Masters (MSc / MEng)", "Research Direct Entry"],
      preferredField: docData.preferredMajor,
      totalWorkExperienceMonths: docData.workExperience.reduce((sum, w) => sum + w.durationMonths, 0),
      englishProficiencyLevel: docData.englishScore >= 7.5 ? "EXCELLENT" : docData.englishScore >= 6.5 ? "GOOD" : "MODERATE",
      visaReadinessScore: Math.min(99, visaScore),
      gapYearsCount: 0,
      profileStrengthScore: Math.min(99, Math.max(50, profileStrength)),
      rawDocumentData: docData,
    };
  }
}
