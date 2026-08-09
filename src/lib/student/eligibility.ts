import type { StudentProfile } from "@prisma/client";

export interface EligibilityFactor {
  id: string;
  label: string;
  score: number;
  max: number;
  detail: string;
  complete: boolean;
  actionHref?: string;
  actionLabel?: string;
}

export interface EligibilityResult {
  total: number | null;
  factors: EligibilityFactor[];
  isComplete: boolean;
  level: "strong" | "good" | "fair" | "weak" | "incomplete";
}

function clampScore(raw: number, max: number) {
  return Math.min(max, Math.max(0, Math.round(raw)));
}

function readinessLevel(total: number | null): EligibilityResult["level"] {
  if (total === null) return "incomplete";
  if (total >= 80) return "strong";
  if (total >= 60) return "good";
  if (total >= 40) return "fair";
  return "weak";
}

const LEVEL_LABEL: Record<EligibilityResult["level"], string> = {
  strong: "Strong readiness",
  good: "Good readiness",
  fair: "Fair readiness",
  weak: "Needs work",
  incomplete: "Incomplete profile",
};

export function readinessLabel(level: EligibilityResult["level"]) {
  return LEVEL_LABEL[level];
}

export function computeEligibility(
  profile: StudentProfile | null,
  verifiedDocCount = 0,
): EligibilityResult {
  if (!profile) {
    return {
      total: null,
      isComplete: false,
      level: "incomplete",
      factors: [
        {
          id: "profile",
          label: "Profile",
          score: 0,
          max: 100,
          detail: "Complete your profile to begin",
          complete: false,
          actionHref: "/dashboard/profile",
          actionLabel: "Complete profile",
        },
      ],
    };
  }

  const scale = profile.gpaScale && profile.gpaScale > 0 ? profile.gpaScale : 5;
  const ieltsScore = profile.ieltsOverall
    ? clampScore((profile.ieltsOverall / 9) * 40, 40)
    : profile.toeflScore
      ? clampScore((profile.toeflScore / 120) * 40, 40)
      : 0;
  const gpaScore = profile.gpa
    ? clampScore((profile.gpa / scale) * 30, 30)
    : 0;
  const countryScore = profile.targetCountries.length > 0 ? 15 : 0;
  const budgetScore = profile.budget ? 15 : 0;
  const docScore = verifiedDocCount > 0 ? 10 : 0;

  const countryLabels = profile.targetCountries
    .map((c) => {
      const map: Record<string, string> = {
        US: "USA",
        CA: "Canada",
        GB: "UK",
        AU: "Australia",
      };
      return map[c.toUpperCase()] ?? c;
    })
    .join(", ");

  const factors: EligibilityFactor[] = [
    {
      id: "ielts",
      label: "English proficiency",
      score: ieltsScore,
      max: 40,
      detail: profile.ieltsOverall
        ? `IELTS ${profile.ieltsOverall}`
        : profile.toeflScore
          ? `TOEFL ${profile.toeflScore}`
          : "Add IELTS or TOEFL score",
      complete: !!profile.ieltsOverall || !!profile.toeflScore,
      actionHref: "/dashboard/profile",
      actionLabel: "Add scores",
    },
    {
      id: "gpa",
      label: "Academic record",
      score: gpaScore,
      max: 30,
      detail: profile.gpa
        ? `GPA ${profile.gpa} / ${scale}`
        : "Add your GPA",
      complete: !!profile.gpa,
      actionHref: "/dashboard/profile",
      actionLabel: "Update academics",
    },
    {
      id: "countries",
      label: "Target destinations",
      score: countryScore,
      max: 15,
      detail:
        profile.targetCountries.length > 0
          ? countryLabels
          : "Select at least one country",
      complete: profile.targetCountries.length > 0,
      actionHref: "/dashboard/profile",
      actionLabel: "Choose countries",
    },
    {
      id: "budget",
      label: "Financial planning",
      score: budgetScore,
      max: 15,
      detail: profile.budget
        ? `${profile.budgetCurrency} ${Number(profile.budget).toLocaleString()}`
        : "Set your study budget",
      complete: !!profile.budget,
      actionHref: "/dashboard/profile",
      actionLabel: "Set budget",
    },
    {
      id: "documents",
      label: "Verified documents",
      score: docScore,
      max: 10,
      detail:
        verifiedDocCount > 0
          ? `${verifiedDocCount} verified`
          : "Upload and verify documents",
      complete: verifiedDocCount > 0,
      actionHref: "/dashboard/documents",
      actionLabel: "Upload documents",
    },
  ];

  const total = Math.min(
    100,
    ieltsScore + gpaScore + countryScore + budgetScore + docScore,
  );

  return {
    total: profile.isComplete || total > 0 ? total : null,
    factors,
    isComplete: profile.isComplete,
    level: readinessLevel(profile.isComplete || total > 0 ? total : null),
  };
}
