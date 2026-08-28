import type { Prisma } from "@prisma/client";
import {
  REQUIRED_EMPLOYMENT_DOCS,
  employmentDocLabel,
} from "@/lib/employment/constants";

export type ValidationIssue = {
  code: string;
  category:
    | "documents"
    | "passport"
    | "certificates"
    | "experience"
    | "education"
    | "languages"
    | "medical"
    | "duplicates"
    | "claims"
    | "package"
    | "profile";
  severity: "error" | "warning";
  message: string;
  field?: string;
};

export type ValidationReport = {
  reportId: string;
  generatedAt: string;
  applicantName: string | null;
  targetJob: {
    title: string | null;
    company: string | null;
    country: string | null;
  } | null;
  summary: {
    totalIssues: number;
    errorCount: number;
    warningCount: number;
    passed: boolean;
    canSubmit: boolean;
  };
  categories: Array<{
    category: ValidationIssue["category"];
    label: string;
    errorCount: number;
    warningCount: number;
    issues: ValidationIssue[];
  }>;
  issues: ValidationIssue[];
};

export type ValidationResult = {
  ok: boolean;
  issues: ValidationIssue[];
  canProceedToPayment: boolean;
  /** Alias — submission blocked when false */
  canSubmit: boolean;
  report: ValidationReport;
};

export type ValidationDocumentInput = {
  id: string;
  kind: string;
  fileName: string;
};

export type ValidationJobInput = {
  title?: string | null;
  company?: string | null;
  country?: string | null;
  experienceYears?: number | null;
  educationLevel?: string | null;
  languages?: string[];
  requirements?: string[];
  skills?: string[];
} | null;

export type ValidationProfileInput = {
  fullName?: string | null;
  nationality?: string | null;
  currentCountry?: string | null;
  preferredCountries?: string[];
  preferredSalary?: number | null;
  preferredJobType?: string | null;
  skills?: string[];
  customSkills?: string[];
  education?: unknown;
  experience?: unknown;
  languages?: unknown;
  certifications?: unknown;
  passportNumber?: string | null;
  passportExpiry?: Date | string | null;
  dateOfBirth?: Date | string | null;
};

const CATEGORY_LABELS: Record<ValidationIssue["category"], string> = {
  documents: "Missing Documents",
  passport: "Passport",
  certificates: "Certificates",
  experience: "Experience",
  education: "Education",
  languages: "Language Scores",
  medical: "Medical",
  duplicates: "Duplicate Documents",
  claims: "Unsupported Claims",
  package: "Application Package",
  profile: "Profile",
};

const EDUCATION_RANK: Record<string, number> = {
  ssc: 1,
  hsc: 2,
  vocational: 3,
  "vocational training": 3,
  "trade certificates": 3,
  "technical education": 3,
  diploma: 4,
  bachelor: 5,
  bachelors: 5,
  "bachelor's": 5,
  masters: 6,
  "master's": 6,
  phd: 7,
};

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function educationRank(level?: string | null) {
  if (!level) return 0;
  return EDUCATION_RANK[level.toLowerCase().trim()] ?? 0;
}

function maxProfileEducation(education: unknown): number {
  const rows = asRecords(education);
  if (!rows.length) return 0;
  return Math.max(
    0,
    ...rows.map((e) => educationRank(String(e.level ?? ""))),
  );
}

function yearsOfExperience(experience: unknown): number {
  return asRecords(experience).reduce((sum, item) => {
    const years = Number(item.years ?? 0);
    return sum + (Number.isFinite(years) ? years : 0);
  }, 0);
}

function languageEntries(languages: unknown) {
  return asRecords(languages)
    .map((l) => ({
      language: String(l.language ?? "").trim(),
      level: String(l.level ?? "").trim(),
      score: String(l.score ?? "").trim(),
    }))
    .filter((l) => l.language);
}

function buildReport(
  issues: ValidationIssue[],
  meta: {
    applicantName: string | null;
    targetJob: ValidationReport["targetJob"];
  },
): ValidationReport {
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const passed = errorCount === 0;

  const byCategory = new Map<ValidationIssue["category"], ValidationIssue[]>();
  for (const issue of issues) {
    const list = byCategory.get(issue.category) ?? [];
    list.push(issue);
    byCategory.set(issue.category, list);
  }

  const categories = Array.from(byCategory.entries()).map(
    ([category, catIssues]) => ({
      category,
      label: CATEGORY_LABELS[category],
      errorCount: catIssues.filter((i) => i.severity === "error").length,
      warningCount: catIssues.filter((i) => i.severity === "warning").length,
      issues: catIssues,
    }),
  );

  return {
    reportId: `val_${Date.now().toString(36)}`,
    generatedAt: new Date().toISOString(),
    applicantName: meta.applicantName,
    targetJob: meta.targetJob,
    summary: {
      totalIssues: issues.length,
      errorCount,
      warningCount,
      passed,
      canSubmit: passed,
    },
    categories,
    issues,
  };
}

/**
 * Application Validation Engine
 * Blocks payment/submission when any error-severity issue is present.
 */
export const employmentValidationService = {
  validate(
    profile: ValidationProfileInput,
    documents: ValidationDocumentInput[],
    options?: {
      packagePresent?: {
        hasResume?: boolean;
        hasCoverLetter?: boolean;
      };
      job?: ValidationJobInput;
      unsupportedClaims?: string[];
    },
  ): ValidationResult {
    const issues: ValidationIssue[] = [];
    const uploadedKinds = documents.map((d) => d.kind);
    const kindCounts = new Map<string, number>();
    for (const d of documents) {
      kindCounts.set(d.kind, (kindCounts.get(d.kind) ?? 0) + 1);
    }

    // ── Profile basics ──────────────────────────────────────────────
    if (!profile.fullName?.trim()) {
      issues.push({
        code: "MISSING_NAME",
        category: "profile",
        severity: "error",
        message: "Full name is required.",
        field: "fullName",
      });
    }

    if (profile.dateOfBirth) {
      const dob = parseDate(profile.dateOfBirth);
      if (!dob || dob.getTime() > Date.now()) {
        issues.push({
          code: "INVALID_DATES",
          category: "profile",
          severity: "error",
          message: "Date of birth is invalid.",
          field: "dateOfBirth",
        });
      }
    }

    // ── Missing Documents ───────────────────────────────────────────
    for (const kind of REQUIRED_EMPLOYMENT_DOCS) {
      if (kind === "MEDICAL_CERTIFICATE") continue; // handled under medical
      if (!uploadedKinds.includes(kind)) {
        issues.push({
          code: "MISSING_DOCUMENTS",
          category: "documents",
          severity: "error",
          message: `Missing document: ${employmentDocLabel(kind)}.`,
          field: kind,
        });
      }
    }

    // ── Missing Medical ─────────────────────────────────────────────
    const hasMedical =
      uploadedKinds.includes("MEDICAL_CERTIFICATE") ||
      uploadedKinds.includes("MEDICAL_REPORT");
    if (!hasMedical) {
      issues.push({
        code: "MISSING_MEDICAL",
        category: "medical",
        severity: "error",
        message:
          "Missing medical document. Upload a Medical Certificate or Medical Report.",
        field: "MEDICAL_CERTIFICATE",
      });
    }

    // ── Passport ────────────────────────────────────────────────────
    if (!profile.passportNumber?.trim()) {
      issues.push({
        code: "MISSING_PASSPORT",
        category: "passport",
        severity: "error",
        message: "Missing passport number on profile.",
        field: "passportNumber",
      });
    }

    if (!uploadedKinds.includes("PASSPORT")) {
      issues.push({
        code: "MISSING_PASSPORT_DOC",
        category: "passport",
        severity: "error",
        message: "Missing passport document upload.",
        field: "PASSPORT",
      });
    }

    if (profile.passportExpiry) {
      const expiry = parseDate(profile.passportExpiry);
      if (!expiry) {
        issues.push({
          code: "INVALID_DATES",
          category: "passport",
          severity: "error",
          message: "Passport expiry date is invalid.",
          field: "passportExpiry",
        });
      } else if (expiry.getTime() < Date.now()) {
        issues.push({
          code: "EXPIRED_PASSPORT",
          category: "passport",
          severity: "error",
          message: `Passport expired on ${expiry.toISOString().slice(0, 10)}.`,
          field: "passportExpiry",
        });
      } else if (expiry.getTime() < Date.now() + 1000 * 60 * 60 * 24 * 180) {
        issues.push({
          code: "PASSPORT_EXPIRING",
          category: "passport",
          severity: "warning",
          message: "Passport expires within 6 months.",
          field: "passportExpiry",
        });
      }
    } else {
      issues.push({
        code: "MISSING_PASSPORT_EXPIRY",
        category: "passport",
        severity: "error",
        message: "Passport expiry date is required.",
        field: "passportExpiry",
      });
    }

    // ── Expired Certificates ────────────────────────────────────────
    const certifications = asRecords(profile.certifications);
    for (const cert of certifications) {
      const name = String(cert.name ?? "Certificate").trim() || "Certificate";
      const expiry = parseDate(cert.expiry);
      if (cert.expiry && !expiry) {
        issues.push({
          code: "INVALID_CERTIFICATE_DATE",
          category: "certificates",
          severity: "warning",
          message: `Certificate "${name}" has an invalid expiry date.`,
          field: "certifications",
        });
      } else if (expiry && expiry.getTime() < Date.now()) {
        issues.push({
          code: "EXPIRED_CERTIFICATES",
          category: "certificates",
          severity: "error",
          message: `Certificate "${name}" expired on ${expiry.toISOString().slice(0, 10)}.`,
          field: "certifications",
        });
      }
    }

    // ── Experience ──────────────────────────────────────────────────
    const experience = asRecords(profile.experience);
    const years = yearsOfExperience(profile.experience);
    if (experience.length === 0) {
      issues.push({
        code: "MISSING_EXPERIENCE",
        category: "experience",
        severity: "error",
        message: "Missing work experience.",
        field: "experience",
      });
    }

    const job = options?.job ?? null;
    if (job?.experienceYears != null && job.experienceYears > 0) {
      if (years + 0.5 < job.experienceYears) {
        issues.push({
          code: "EXPERIENCE_MISMATCH",
          category: "experience",
          severity: "error",
          message: `Experience mismatch: role asks for ${job.experienceYears}+ years, profile has ${years} year(s).`,
          field: "experience",
        });
      }
    }

    // ── Education ───────────────────────────────────────────────────
    const education = asRecords(profile.education);
    if (education.length === 0) {
      issues.push({
        code: "MISSING_EDUCATION",
        category: "education",
        severity: "error",
        message: "Missing education history.",
        field: "education",
      });
    }

    if (job?.educationLevel) {
      const needed = educationRank(job.educationLevel);
      const have = maxProfileEducation(profile.education);
      if (needed > 0 && have > 0 && have + 1 < needed) {
        issues.push({
          code: "EDUCATION_MISMATCH",
          category: "education",
          severity: "error",
          message: `Education mismatch: role expects ${job.educationLevel}, highest on profile ranks lower.`,
          field: "education",
        });
      } else if (needed > 0 && have === 0 && education.length === 0) {
        issues.push({
          code: "EDUCATION_MISMATCH",
          category: "education",
          severity: "error",
          message: `Education mismatch: role expects ${job.educationLevel}, but no education is on file.`,
          field: "education",
        });
      }
    }

    // ── Missing Language Score ──────────────────────────────────────
    const langs = languageEntries(profile.languages);
    if (langs.length === 0) {
      issues.push({
        code: "MISSING_LANGUAGE_SCORE",
        category: "languages",
        severity: "error",
        message: "Missing language proficiency or scores on profile.",
        field: "languages",
      });
    } else {
      const withScore = langs.filter((l) => l.score || l.level);
      if (withScore.length === 0) {
        issues.push({
          code: "MISSING_LANGUAGE_SCORE",
          category: "languages",
          severity: "error",
          message:
            "Languages listed but no level or score recorded (e.g. IELTS/TOEFL).",
          field: "languages",
        });
      }

      if (job?.languages?.length) {
        const profileLangs = langs.map((l) => l.language.toLowerCase());
        const missingJobLangs = job.languages.filter(
          (jl) =>
            !profileLangs.some(
              (pl) =>
                pl.includes(jl.toLowerCase()) ||
                jl.toLowerCase().includes(pl),
            ),
        );
        if (missingJobLangs.length) {
          issues.push({
            code: "LANGUAGE_MISMATCH",
            category: "languages",
            severity: "warning",
            message: `Job prefers languages not on profile: ${missingJobLangs.join(", ")}.`,
            field: "languages",
          });
        }
      }
    }

    if (
      !uploadedKinds.includes("LANGUAGE_CERTIFICATE") &&
      langs.some((l) => /ielts|toefl|english|german|japanese|korean/i.test(l.language))
    ) {
      issues.push({
        code: "MISSING_LANGUAGE_DOC",
        category: "languages",
        severity: "warning",
        message: "Language scores on profile but no language certificate uploaded.",
        field: "LANGUAGE_CERTIFICATE",
      });
    }

    // ── Duplicate Documents ─────────────────────────────────────────
    for (const [kind, count] of kindCounts) {
      if (count > 1) {
        issues.push({
          code: "DUPLICATE_DOCUMENTS",
          category: "duplicates",
          severity: "error",
          message: `Duplicate documents: ${count} uploads of ${employmentDocLabel(kind)}. Keep one active file.`,
          field: kind,
        });
      }
    }

    const fileNameCounts = new Map<string, number>();
    for (const d of documents) {
      const key = d.fileName.trim().toLowerCase();
      if (!key) continue;
      fileNameCounts.set(key, (fileNameCounts.get(key) ?? 0) + 1);
    }
    for (const [name, count] of fileNameCounts) {
      if (count > 1) {
        issues.push({
          code: "DUPLICATE_DOCUMENTS",
          category: "duplicates",
          severity: "warning",
          message: `Duplicate file name uploaded ${count} times: ${name}.`,
          field: "fileName",
        });
      }
    }

    // ── Unsupported Claims ──────────────────────────────────────────
    const skills = [...(profile.skills ?? []), ...(profile.customSkills ?? [])];
    if (skills.length === 0) {
      issues.push({
        code: "UNSUPPORTED_CLAIMS",
        category: "claims",
        severity: "warning",
        message: "No skills listed — role claims may be unsupported.",
        field: "skills",
      });
    }

    const unsupported = (options?.unsupportedClaims ?? []).filter(Boolean);
    for (const claim of unsupported.slice(0, 8)) {
      issues.push({
        code: "UNSUPPORTED_CLAIMS",
        category: "claims",
        severity: "error",
        message: `Unsupported claim from document extraction: ${claim}`,
        field: "extractedData",
      });
    }

    // Thin experience rows without employer/position
    for (const row of experience) {
      const employer = String(row.employer ?? "").trim();
      const position = String(row.position ?? "").trim();
      if (!employer && !position) {
        issues.push({
          code: "UNSUPPORTED_CLAIMS",
          category: "claims",
          severity: "warning",
          message:
            "An experience entry is missing employer and position — remove or complete it.",
          field: "experience",
        });
        break;
      }
    }

    // ── Package ─────────────────────────────────────────────────────
    if (options?.packagePresent && !options.packagePresent.hasResume) {
      issues.push({
        code: "MISSING_PACKAGE_RESUME",
        category: "package",
        severity: "error",
        message:
          "Application package is missing a resume. Generate it in Application Builder.",
        field: "applicationPackage",
      });
    }

    if (options?.packagePresent && !options.packagePresent.hasCoverLetter) {
      issues.push({
        code: "MISSING_PACKAGE_COVER_LETTER",
        category: "package",
        severity: "warning",
        message: "Application package has no cover letter yet.",
        field: "coverLetter",
      });
    }

    const errors = issues.filter((i) => i.severity === "error");
    const canSubmit = errors.length === 0;
    const report = buildReport(issues, {
      applicantName: profile.fullName?.trim() ?? null,
      targetJob: job
        ? {
            title: job.title ?? null,
            company: job.company ?? null,
            country: job.country ?? null,
          }
        : null,
    });

    return {
      ok: canSubmit,
      issues,
      canProceedToPayment: canSubmit,
      canSubmit,
      report,
    };
  },

  parseStored(value: unknown): ValidationResult | null {
    if (!value || typeof value !== "object") return null;
    const v = value as Partial<ValidationResult>;
    if (!Array.isArray(v.issues)) return null;
    const canSubmit =
      typeof v.canSubmit === "boolean"
        ? v.canSubmit
        : typeof v.canProceedToPayment === "boolean"
          ? v.canProceedToPayment
          : !!v.ok;
    return {
      ok: !!v.ok,
      issues: v.issues as ValidationIssue[],
      canProceedToPayment: canSubmit,
      canSubmit,
      report:
        (v.report as ValidationReport) ??
        buildReport((v.issues as ValidationIssue[]) ?? [], {
          applicantName: null,
          targetJob: null,
        }),
    };
  },

  toJson(result: ValidationResult): Prisma.InputJsonValue {
    return result as unknown as Prisma.InputJsonValue;
  },
};
