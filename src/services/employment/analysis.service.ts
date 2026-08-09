import type { Prisma } from "@prisma/client";
import { openaiConfig } from "@/config";
import { logger } from "@/lib";
import {
  auditedChatCompletion,
  recordSkippedAiAction,
  summarizeAiText,
} from "@/services/ai/ai-audit.service";
import {
  EMPLOYMENT_COUNTRIES,
  EMPLOYMENT_DOCUMENT_KINDS,
  PREFERRED_INDUSTRIES,
  REQUIRED_EMPLOYMENT_DOCS,
  employmentDocLabel,
} from "@/lib/employment/constants";
import {
  workerAnalysisResultSchema,
  type WorkerAnalysisResult,
  type EligibleCountry,
  type EligibleIndustry,
  type ProfileAnalysisResult,
} from "@/lib/employment/analysis.types";

export type { WorkerAnalysisResult, ProfileAnalysisResult };

export type AnalysisProfileInput = {
  fullName?: string | null;
  nationality?: string | null;
  currentCountry?: string | null;
  preferredCountries?: string[];
  preferredSalary?: number | null;
  preferredSalaryCurrency?: string | null;
  preferredJobType?: string | null;
  preferredIndustries?: string[];
  skills?: string[];
  customSkills?: string[];
  education?: unknown;
  experience?: unknown;
  languages?: unknown;
  certifications?: unknown;
  passportNumber?: string | null;
  passportExpiry?: Date | string | null;
};

const SKILL_TO_INDUSTRY: Record<string, string[]> = {
  Construction: ["Construction"],
  Electrician: ["Construction", "Oil & Gas"],
  Plumber: ["Construction", "Hospitality"],
  Welder: ["Construction", "Manufacturing", "Oil & Gas"],
  Mason: ["Construction"],
  "Civil Engineer": ["Construction", "Engineering"],
  "Mechanical Engineer": ["Engineering", "Manufacturing", "Oil & Gas"],
  "Software Engineer": ["Information Technology"],
  Chef: ["Hospitality"],
  "Hotel Staff": ["Hospitality"],
  Housekeeping: ["Hospitality", "Domestic Work"],
  Driver: ["Logistics", "Hospitality"],
  Caregiver: ["Healthcare", "Domestic Work"],
  Nurse: ["Healthcare"],
  Doctor: ["Healthcare"],
  "Factory Worker": ["Manufacturing"],
  Warehouse: ["Logistics", "Manufacturing"],
  Sales: ["Retail"],
  Marketing: ["Retail", "Information Technology"],
  Accounting: ["Retail", "Information Technology"],
  "Customer Support": ["Information Technology", "Retail"],
  "Language Teacher": ["Education"],
  "HVAC Technician": ["Construction", "Hospitality"],
  "Automotive Mechanic": ["Automotive"],
  "IT Support": ["Information Technology"],
  "Network Engineer": ["Information Technology"],
  Pharmacist: ["Healthcare"],
  "Lab Technician": ["Healthcare"],
  "Security Guard": ["Security"],
  "Agriculture Worker": ["Agriculture"],
};

const COUNTRY_LANGUAGE_BOOST: Record<string, string[]> = {
  AE: ["english", "arabic"],
  SA: ["english", "arabic"],
  QA: ["english", "arabic"],
  KW: ["english", "arabic"],
  OM: ["english", "arabic"],
  BH: ["english", "arabic"],
  SG: ["english"],
  MY: ["english"],
  JP: ["japanese", "english"],
  KR: ["korean", "english"],
  DE: ["german", "english"],
  CA: ["english", "french"],
  AU: ["english"],
  GB: ["english"],
  US: ["english"],
};

const INDUSTRY_SALARY_USD: Record<string, { min: number; max: number }> = {
  Construction: { min: 800, max: 2200 },
  Healthcare: { min: 1200, max: 4500 },
  Hospitality: { min: 700, max: 2000 },
  "Information Technology": { min: 1500, max: 6000 },
  Engineering: { min: 1400, max: 5000 },
  Manufacturing: { min: 700, max: 1800 },
  Logistics: { min: 700, max: 1800 },
  Education: { min: 1000, max: 3500 },
  "Oil & Gas": { min: 1800, max: 5500 },
  Agriculture: { min: 500, max: 1200 },
  Retail: { min: 600, max: 1600 },
  Automotive: { min: 800, max: 2200 },
  Security: { min: 600, max: 1400 },
  "Domestic Work": { min: 500, max: 1200 },
  Other: { min: 700, max: 2000 },
};

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function yearsOfExperience(experience: unknown): number {
  return asArray(experience).reduce((sum, item) => {
    const years = Number(item.years ?? 0);
    return sum + (Number.isFinite(years) ? years : 0);
  }, 0);
}

function allSkills(profile: AnalysisProfileInput): string[] {
  return Array.from(
    new Set([...(profile.skills ?? []), ...(profile.customSkills ?? [])].filter(Boolean)),
  );
}

function languageLabels(languages: unknown): string[] {
  return asArray(languages)
    .map((l) => String(l.language ?? l.name ?? "").toLowerCase())
    .filter(Boolean);
}

function certNames(certifications: unknown): string[] {
  return asArray(certifications)
    .map((c) => String(c.name ?? "").trim())
    .filter(Boolean);
}

function educationLevels(education: unknown): string[] {
  return asArray(education)
    .map((e) => String(e.level ?? "").trim())
    .filter(Boolean);
}

function resolveCountryName(codeOrName: string) {
  const hit = EMPLOYMENT_COUNTRIES.find(
    (c) =>
      c.code === codeOrName ||
      c.name.toLowerCase() === codeOrName.toLowerCase(),
  );
  return hit?.name ?? codeOrName;
}

function resolveCountryCode(codeOrName: string) {
  const hit = EMPLOYMENT_COUNTRIES.find(
    (c) =>
      c.code === codeOrName ||
      c.name.toLowerCase() === codeOrName.toLowerCase(),
  );
  return hit?.code ?? null;
}

function deriveIndustries(skills: string[], preferred: string[]): EligibleIndustry[] {
  const scores = new Map<string, { score: number; reasons: string[] }>();

  for (const ind of preferred) {
    const cur = scores.get(ind) ?? { score: 0, reasons: [] };
    cur.score += 35;
    cur.reasons.push("Listed in preferred industries");
    scores.set(ind, cur);
  }

  for (const skill of skills) {
    const mapped = SKILL_TO_INDUSTRY[skill] ?? ["Other"];
    for (const ind of mapped) {
      const cur = scores.get(ind) ?? { score: 0, reasons: [] };
      cur.score += 18;
      cur.reasons.push(`Skill match: ${skill}`);
      scores.set(ind, cur);
    }
  }

  if (scores.size === 0) {
    return [
      {
        name: "Other",
        score: 40,
        reasons: ["Add skills or preferred industries for better targeting"],
      },
    ];
  }

  return Array.from(scores.entries())
    .map(([name, v]) => ({
      name,
      score: Math.min(95, v.score),
      reasons: Array.from(new Set(v.reasons)).slice(0, 3),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function deriveCountries(
  profile: AnalysisProfileInput,
  languages: string[],
  industries: EligibleIndustry[],
): EligibleCountry[] {
  const preferred = profile.preferredCountries ?? [];
  const topIndustry = industries[0]?.name;
  const results: EligibleCountry[] = [];

  for (const country of EMPLOYMENT_COUNTRIES) {
    let score = 20;
    const reasons: string[] = [];

    if (
      preferred.some(
        (p) =>
          p === country.code ||
          p.toLowerCase() === country.name.toLowerCase(),
      )
    ) {
      score += 30;
      reasons.push("Preferred destination");
    }

    const langBoost = COUNTRY_LANGUAGE_BOOST[country.code] ?? [];
    const matchedLang = langBoost.find((l) =>
      languages.some((ul) => ul.includes(l) || l.includes(ul)),
    );
    if (matchedLang) {
      score += 20;
      reasons.push(`Language fit (${matchedLang})`);
    }

    if (
      topIndustry &&
      ["Construction", "Hospitality", "Oil & Gas", "Domestic Work"].includes(
        topIndustry,
      ) &&
      ["AE", "SA", "QA", "KW", "OM", "BH"].includes(country.code)
    ) {
      score += 15;
      reasons.push(`Strong demand for ${topIndustry}`);
    }

    if (
      topIndustry === "Healthcare" &&
      ["JP", "DE", "CA", "AU", "SG", "GB"].includes(country.code)
    ) {
      score += 15;
      reasons.push("Healthcare pathways available");
    }

    if (
      topIndustry === "Information Technology" &&
      ["SG", "DE", "CA", "AU", "GB", "US", "JP"].includes(country.code)
    ) {
      score += 15;
      reasons.push("IT hiring markets");
    }

    if (profile.passportNumber) {
      score += 5;
      reasons.push("Passport on file");
    }

    if (score >= 40 || preferred.length === 0) {
      results.push({
        name: country.name,
        code: country.code,
        score: Math.min(95, score),
        reasons: reasons.slice(0, 3),
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 6);
}

function deriveMissingSkills(
  skills: string[],
  industries: EligibleIndustry[],
): string[] {
  const missing: string[] = [];
  const top = industries[0]?.name;

  const recommendations: Record<string, string[]> = {
    Construction: ["Safety Certification", "Scaffolding", "Heavy Equipment"],
    Healthcare: ["Nursing License", "CPR", "Patient Care"],
    Hospitality: ["Food Safety", "Customer Service", "Housekeeping"],
    "Information Technology": ["Cloud Basics", "Networking", "English Communication"],
    Engineering: ["AutoCAD", "Project Management", "Site Supervision"],
    Manufacturing: ["Quality Control", "Machine Operation", "Lean Basics"],
    Logistics: ["Forklift License", "Inventory Management", "Driving License"],
    "Oil & Gas": ["H2S Awareness", "Confined Space", "Safety Certification"],
    Education: ["Teaching Certificate", "Classroom Management", "English"],
    Automotive: ["Diagnostics", "Electrical Systems", "Workshop Safety"],
    Security: ["Security License", "First Aid", "Crowd Control"],
    Agriculture: ["Equipment Operation", "Irrigation", "Harvesting"],
    Retail: ["POS Systems", "Merchandising", "Customer Support"],
    "Domestic Work": ["Childcare", "Elder Care", "Cooking"],
  };

  const wanted = recommendations[top ?? ""] ?? ["Workplace Safety", "English Communication"];
  for (const skill of wanted) {
    const has = skills.some(
      (s) =>
        s.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(s.toLowerCase()),
    );
    if (!has) missing.push(skill);
  }

  if (!skills.some((s) => /english|ielts|toefl/i.test(s))) {
    if (!missing.includes("English Communication")) {
      missing.push("English Communication");
    }
  }

  return missing.slice(0, 6);
}

function deriveSalary(
  industries: EligibleIndustry[],
  years: number,
  preferredSalary: number | null | undefined,
  currency: string,
): WorkerAnalysisResult["salaryEstimate"] {
  const top = industries[0]?.name ?? "Other";
  const base = INDUSTRY_SALARY_USD[top] ?? INDUSTRY_SALARY_USD.Other;
  const yearBoost = Math.min(0.45, years * 0.06);
  let monthlyMin = Math.round(base.min * (1 + yearBoost));
  let monthlyMax = Math.round(base.max * (1 + yearBoost));

  if (preferredSalary && preferredSalary > 0) {
    monthlyMin = Math.round(Math.min(monthlyMin, preferredSalary * 0.85));
    monthlyMax = Math.round(Math.max(monthlyMax, preferredSalary * 1.1));
  }

  return {
    currency: currency || "USD",
    monthlyMin,
    monthlyMax,
    annualMin: monthlyMin * 12,
    annualMax: monthlyMax * 12,
    note: `Estimate for ${top} roles with ~${years} year(s) experience. Actual offers vary by country and employer.`,
  };
}

function computeReadiness(input: {
  skills: string[];
  years: number;
  langs: number;
  educationCount: number;
  certCount: number;
  hasPassport: boolean;
  preferredCountries: number;
  missingDocs: number;
}): number {
  let score = 25;
  score += Math.min(18, input.skills.length * 3);
  score += Math.min(18, input.years * 3.5);
  score += Math.min(10, input.langs * 4);
  score += Math.min(10, input.educationCount * 4);
  score += Math.min(8, input.certCount * 4);
  if (input.hasPassport) score += 6;
  if (input.preferredCountries > 0) score += 5;
  score += Math.max(0, 10 - input.missingDocs * 2);
  return Math.min(95, Math.round(score));
}

function heuristicAnalysis(
  profile: AnalysisProfileInput,
  uploadedKinds: string[],
): WorkerAnalysisResult {
  const skills = allSkills(profile);
  const years = yearsOfExperience(profile.experience);
  const langs = languageLabels(profile.languages);
  const education = asArray(profile.education);
  const experience = asArray(profile.experience);
  const certifications = asArray(profile.certifications);
  const certs = certNames(profile.certifications);
  const eduLevels = educationLevels(profile.education);

  const missingDocuments = REQUIRED_EMPLOYMENT_DOCS.filter(
    (k) => !uploadedKinds.includes(k),
  ).map((k) => employmentDocLabel(k));

  const industries = deriveIndustries(
    skills,
    profile.preferredIndustries ?? [],
  );
  const countries = deriveCountries(profile, langs, industries);
  const missingSkills = deriveMissingSkills(skills, industries);
  const salaryEstimate = deriveSalary(
    industries,
    years,
    profile.preferredSalary,
    profile.preferredSalaryCurrency ?? "USD",
  );

  const profileReadinessScore = computeReadiness({
    skills,
    years,
    langs: langs.length,
    educationCount: education.length,
    certCount: certifications.length,
    hasPassport: !!profile.passportNumber,
    preferredCountries: profile.preferredCountries?.length ?? 0,
    missingDocs: missingDocuments.length,
  });

  const strengths: string[] = [];
  if (skills.length)
    strengths.push(`Relevant skills: ${skills.slice(0, 5).join(", ")}`);
  if (years >= 2)
    strengths.push(`${years} years of combined work experience`);
  if (eduLevels.length)
    strengths.push(`Education on file: ${eduLevels.slice(0, 3).join(", ")}`);
  if (certs.length)
    strengths.push(`Certifications: ${certs.slice(0, 3).join(", ")}`);
  if (langs.length)
    strengths.push(
      `Languages: ${langs.map((l) => l.replace(/\b\w/g, (c) => c.toUpperCase())).join(", ")}`,
    );
  if (profile.passportNumber) strengths.push("Passport details available");
  if ((profile.preferredCountries?.length ?? 0) > 0)
    strengths.push("Clear destination preferences");

  const weaknesses: string[] = [];
  if (!skills.length) weaknesses.push("No skills listed yet");
  if (years < 1) weaknesses.push("Limited documented work experience");
  if (!education.length) weaknesses.push("Education history incomplete");
  if (!langs.length) weaknesses.push("No language scores or proficiency listed");
  if (!certifications.length)
    weaknesses.push("No professional certifications recorded");
  if (missingDocuments.length)
    weaknesses.push(`Missing documents: ${missingDocuments.join(", ")}`);
  if (missingSkills.length)
    weaknesses.push(`Skill gaps for target roles: ${missingSkills.slice(0, 3).join(", ")}`);
  if (!profile.passportNumber) weaknesses.push("Passport not on profile");

  const suggestions: string[] = [];
  if (missingDocuments.length)
    suggestions.push(`Upload: ${missingDocuments.join(", ")}`);
  if (missingSkills.length)
    suggestions.push(`Build skills: ${missingSkills.slice(0, 3).join(", ")}`);
  if (years < 2)
    suggestions.push("Add detailed employment history with responsibilities");
  if (!langs.length)
    suggestions.push("Add English / IELTS or destination language scores");
  if (!certifications.length)
    suggestions.push("Add trade or professional certifications");
  suggestions.push("Re-run analysis after updating profile or documents");

  const name = profile.fullName ?? "Worker";
  const careerSummary = `${name} presents a ${profileReadinessScore}% readiness profile for overseas employment, with strongest alignment to ${industries[0]?.name ?? "general"} roles in markets such as ${countries
    .slice(0, 3)
    .map((c) => c.name)
    .join(", ") || "preferred destinations"}. Estimated monthly salary range: ${salaryEstimate.currency} ${salaryEstimate.monthlyMin.toLocaleString()}–${salaryEstimate.monthlyMax.toLocaleString()}.`;

  return workerAnalysisResultSchema.parse({
    careerSummary,
    summary: careerSummary,
    strengths: strengths.length
      ? strengths
      : ["Profile started — complete sections for a fuller analysis"],
    weaknesses: weaknesses.length
      ? weaknesses
      : ["No major gaps detected from current inputs"],
    eligibleCountries: countries,
    eligibleIndustries: industries,
    salaryEstimate,
    missingDocuments,
    missingSkills,
    profileReadinessScore,
    eligibilityEstimate: profileReadinessScore,
    suggestions,
    analyzedInputs: {
      educationCount: education.length,
      experienceCount: experience.length,
      skillsCount: skills.length,
      languagesCount: langs.length,
      certificationsCount: certifications.length,
      experienceYears: years,
    },
    analyzedAt: new Date().toISOString(),
    workerProfile: {
      skills,
      experienceYears: years,
      preferredCountries: (profile.preferredCountries ?? []).map(resolveCountryName),
      preferredIndustries: profile.preferredIndustries ?? [],
      nationality: profile.nationality,
      currentCountry: profile.currentCountry,
      educationLevels: eduLevels,
      certifications: certs,
      languages: langs,
    },
  });
}

function mergeAiResult(
  parsed: Partial<WorkerAnalysisResult>,
  fallback: WorkerAnalysisResult,
): WorkerAnalysisResult {
  const readiness =
    typeof parsed.profileReadinessScore === "number"
      ? parsed.profileReadinessScore
      : typeof parsed.eligibilityEstimate === "number"
        ? parsed.eligibilityEstimate
        : fallback.profileReadinessScore;

  const careerSummary =
    parsed.careerSummary ?? parsed.summary ?? fallback.careerSummary;

  const salary = parsed.salaryEstimate
    ? {
        ...fallback.salaryEstimate,
        ...parsed.salaryEstimate,
        currency:
          parsed.salaryEstimate.currency || fallback.salaryEstimate.currency,
      }
    : fallback.salaryEstimate;

  const eligibleCountries = (
    parsed.eligibleCountries?.length
      ? parsed.eligibleCountries
      : fallback.eligibleCountries
  ).map((c) => ({
    ...c,
    name: resolveCountryName(c.name),
    code: c.code ?? resolveCountryCode(c.name),
    reasons: c.reasons ?? [],
  }));

  const eligibleIndustries = (
    parsed.eligibleIndustries?.length
      ? parsed.eligibleIndustries
      : fallback.eligibleIndustries
  ).map((i) => ({
    ...i,
    reasons: i.reasons ?? [],
  }));

  return workerAnalysisResultSchema.parse({
    careerSummary,
    summary: careerSummary,
    strengths: parsed.strengths?.length ? parsed.strengths : fallback.strengths,
    weaknesses: parsed.weaknesses?.length
      ? parsed.weaknesses
      : fallback.weaknesses,
    eligibleCountries,
    eligibleIndustries,
    salaryEstimate: salary,
    missingDocuments: parsed.missingDocuments?.length
      ? parsed.missingDocuments
      : fallback.missingDocuments,
    missingSkills: parsed.missingSkills?.length
      ? parsed.missingSkills
      : fallback.missingSkills,
    profileReadinessScore: readiness,
    eligibilityEstimate: readiness,
    suggestions: parsed.suggestions?.length
      ? parsed.suggestions
      : fallback.suggestions,
    analyzedInputs: parsed.analyzedInputs ?? fallback.analyzedInputs,
    analyzedAt: new Date().toISOString(),
    workerProfile: parsed.workerProfile ?? fallback.workerProfile,
  });
}

/**
 * AI Worker Analysis Engine
 * Analyzes education, skills, experience, languages, certifications.
 * Generates readiness, eligibility, salary, gaps — never invents credentials.
 */
export const employmentAnalysisService = {
  async analyze(
    profile: AnalysisProfileInput,
    uploadedKinds: string[],
    opts?: { userId?: string },
  ): Promise<WorkerAnalysisResult> {
    const fallback = heuristicAnalysis(profile, uploadedKinds);
    const auditCtx = {
      action: "EMPLOYMENT_ANALYSIS" as const,
      userId: opts?.userId,
      entityType: "WorkerProfile",
      entityId: opts?.userId,
      inputSummary: summarizeAiText(
        `${profile.fullName ?? "worker"} · skills=${(profile.skills ?? []).length} · docs=${uploadedKinds.length}`,
      ),
    };

    if (!openaiConfig.apiKey || openaiConfig.apiKey.startsWith("sk-dev")) {
      await recordSkippedAiAction({
        ...auditCtx,
        model: openaiConfig.model,
        reason: "OpenAI not configured — heuristic analysis",
        outputSummary: summarizeAiText(fallback.careerSummary),
      });
      return fallback;
    }

    try {
      const completion = await auditedChatCompletion(auditCtx, {
        model: openaiConfig.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are the Muntajar AI Worker Analysis Engine for overseas employment.

Analyze ONLY the provided profile inputs: education, skills, experience, languages, certifications, documents.

Return ONLY valid JSON with this shape:
{
  "careerSummary": string,
  "strengths": string[],
  "weaknesses": string[],
  "eligibleCountries": [{ "name", "code", "score": 0-100, "reasons": string[] }],
  "eligibleIndustries": [{ "name", "score": 0-100, "reasons": string[] }],
  "salaryEstimate": { "currency", "monthlyMin", "monthlyMax", "annualMin", "annualMax", "note" },
  "missingDocuments": string[],
  "missingSkills": string[],
  "profileReadinessScore": 0-100,
  "suggestions": string[],
  "workerProfile": object
}

Rules:
- Never invent degrees, jobs, languages, or certificates not in the input.
- Prefer countries from: ${EMPLOYMENT_COUNTRIES.map((c) => c.name).join(", ")}.
- Prefer industries from: ${PREFERRED_INDUSTRIES.join(", ")}.
- Known document kinds: ${EMPLOYMENT_DOCUMENT_KINDS.map((d) => d.label).join(", ")}.
- Use the heuristic result as a baseline; refine wording and scores, do not ignore grounded gaps.`,
          },
          {
            role: "user",
            content: JSON.stringify({
              profile: {
                ...profile,
                passportExpiry: profile.passportExpiry
                  ? String(profile.passportExpiry)
                  : null,
              },
              uploadedDocumentKinds: uploadedKinds,
              requiredDocuments: [...REQUIRED_EMPLOYMENT_DOCS],
              heuristic: fallback,
            }),
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Partial<WorkerAnalysisResult>;
      return mergeAiResult(parsed, fallback);
    } catch (error) {
      logger.warn("Worker analysis engine AI failed", { error });
      return fallback;
    }
  },

  toJson(result: WorkerAnalysisResult): Prisma.InputJsonValue {
    return result as unknown as Prisma.InputJsonValue;
  },

  parseStored(value: unknown): WorkerAnalysisResult | null {
    if (!value || typeof value !== "object") return null;
    const result = workerAnalysisResultSchema.safeParse({
      ...(value as object),
      careerSummary:
        (value as { careerSummary?: string; summary?: string }).careerSummary ??
        (value as { summary?: string }).summary ??
        "",
      summary:
        (value as { summary?: string; careerSummary?: string }).summary ??
        (value as { careerSummary?: string }).careerSummary ??
        "",
      profileReadinessScore:
        (value as { profileReadinessScore?: number }).profileReadinessScore ??
        (value as { eligibilityEstimate?: number }).eligibilityEstimate ??
        0,
      eligibilityEstimate:
        (value as { eligibilityEstimate?: number }).eligibilityEstimate ??
        (value as { profileReadinessScore?: number }).profileReadinessScore ??
        0,
      salaryEstimate: (value as { salaryEstimate?: unknown }).salaryEstimate ?? {
        currency: "USD",
        monthlyMin: 0,
        monthlyMax: 0,
        note: "",
      },
      analyzedAt:
        (value as { analyzedAt?: string }).analyzedAt ??
        new Date(0).toISOString(),
    });
    return result.success ? result.data : null;
  },
};
