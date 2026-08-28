import { randomUUID } from "crypto";
import type { JobListing, PreferredJobType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { openaiConfig } from "@/config";
import { logger } from "@/lib";
import { embedDocumentText } from "@/services/employment/documents/embedding.service";
import { isGeminiConfigured } from "@/services/ai/gemini.client";
import {
  auditedChatCompletion,
  auditedGeminiGenerateJson,
  recordAiAudit,
  summarizeAiText,
} from "@/services/ai/ai-audit.service";
import {
  MATCH_ENGINE_FINAL_TOP_N,
  MATCH_ENGINE_VECTOR_TOP_N,
  geminiRankingResponseSchema,
  type MatchKeyFactors,
  type JobRecommendationEnrichment,
} from "@/lib/employment/matching.types";
import { EMPLOYMENT_COUNTRIES } from "@/lib/employment/constants";

export type WorkerProfileSnapshot = {
  fullName?: string | null;
  nationality?: string | null;
  currentCountry?: string | null;
  preferredCountries?: string[];
  preferredSalary?: number | null;
  preferredJobType?: PreferredJobType | null;
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

const EDUCATION_RANK: Record<string, number> = {
  ssc: 1,
  hsc: 2,
  "vocational training": 3,
  vocational: 3,
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

const CATALOG: Array<{
  company: string;
  title: string;
  country: string;
  city: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  visaSponsorship: boolean;
  requirements: string[];
  skills: string[];
  jobType: PreferredJobType;
  description: string;
  experienceYears: number;
  educationLevel: string;
  languages: string[];
}> = [
  {
    company: "Gulf Build Co.",
    title: "Construction Supervisor",
    country: "United Arab Emirates",
    city: "Dubai",
    salaryMin: 1800,
    salaryMax: 2800,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["3+ years site experience", "Safety certification"],
    skills: ["Construction", "Mason"],
    jobType: "FULL_TIME",
    description: "Supervise residential construction crews across Dubai projects.",
    experienceYears: 3,
    educationLevel: "Diploma",
    languages: ["English", "Arabic"],
  },
  {
    company: "Al Noor Hospitals",
    title: "Registered Nurse",
    country: "Saudi Arabia",
    city: "Riyadh",
    salaryMin: 2200,
    salaryMax: 3200,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Nursing license", "2+ years hospital experience"],
    skills: ["Nurse", "Caregiver"],
    jobType: "FULL_TIME",
    description: "Provide inpatient care in a tertiary hospital setting.",
    experienceYears: 2,
    educationLevel: "Bachelor",
    languages: ["English"],
  },
  {
    company: "Sakura Care Group",
    title: "Caregiver",
    country: "Japan",
    city: "Osaka",
    salaryMin: 1600,
    salaryMax: 2300,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Caregiving certificate", "Basic Japanese preferred"],
    skills: ["Caregiver"],
    jobType: "FULL_TIME",
    description: "Support elderly residents in assisted living facilities.",
    experienceYears: 1,
    educationLevel: "Vocational Training",
    languages: ["Japanese", "English"],
  },
  {
    company: "TechBridge Asia",
    title: "Software Engineer",
    country: "Singapore",
    city: "Singapore",
    salaryMin: 4500,
    salaryMax: 7000,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["2+ years backend or fullstack", "Degree in CS or related"],
    skills: ["Software Engineer", "IT Support"],
    jobType: "FULL_TIME",
    description: "Build cloud services for regional fintech clients.",
    experienceYears: 2,
    educationLevel: "Bachelor",
    languages: ["English"],
  },
  {
    company: "Horizon Hotels",
    title: "Hotel Front Desk",
    country: "Qatar",
    city: "Doha",
    salaryMin: 1200,
    salaryMax: 1800,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Hospitality experience", "Customer service skills"],
    skills: ["Hotel Staff", "Customer Support"],
    jobType: "FULL_TIME",
    description: "Welcome guests and manage front-office operations.",
    experienceYears: 1,
    educationLevel: "HSC",
    languages: ["English"],
  },
  {
    company: "Nordic Auto Works",
    title: "Automotive Mechanic",
    country: "Germany",
    city: "Berlin",
    salaryMin: 2500,
    salaryMax: 3800,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Trade certificate", "Diagnostic tools experience"],
    skills: ["Automotive Mechanic"],
    jobType: "FULL_TIME",
    description: "Service passenger vehicles in a certified workshop.",
    experienceYears: 3,
    educationLevel: "Trade Certificates",
    languages: ["German", "English"],
  },
  {
    company: "Maple Care Homes",
    title: "Personal Support Worker",
    country: "Canada",
    city: "Toronto",
    salaryMin: 2200,
    salaryMax: 3000,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["PSW certificate or equivalent", "Clear background check"],
    skills: ["Caregiver", "Nurse"],
    jobType: "FULL_TIME",
    description: "Assist residents with daily living and mobility.",
    experienceYears: 1,
    educationLevel: "Diploma",
    languages: ["English"],
  },
  {
    company: "Desert Logistics",
    title: "Warehouse Supervisor",
    country: "Kuwait",
    city: "Kuwait City",
    salaryMin: 1400,
    salaryMax: 2100,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["2+ years warehouse ops", "Forklift preferred"],
    skills: ["Warehouse", "Logistics"],
    jobType: "FULL_TIME",
    description: "Oversee inventory and outbound shipping teams.",
    experienceYears: 2,
    educationLevel: "HSC",
    languages: ["English", "Arabic"],
  },
  {
    company: "Pacific Welders",
    title: "Structural Welder",
    country: "Malaysia",
    city: "Johor",
    salaryMin: 1100,
    salaryMax: 1700,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Welding certificate", "Site safety training"],
    skills: ["Welder", "Construction"],
    jobType: "FULL_TIME",
    description: "Perform structural welding on industrial projects.",
    experienceYears: 2,
    educationLevel: "Vocational Training",
    languages: ["English"],
  },
  {
    company: "Bright Sparks Electrical",
    title: "Electrician",
    country: "Oman",
    city: "Muscat",
    salaryMin: 1300,
    salaryMax: 2000,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Electrical license or equivalent", "3+ years experience"],
    skills: ["Electrician"],
    jobType: "FULL_TIME",
    description: "Install and maintain commercial electrical systems.",
    experienceYears: 3,
    educationLevel: "Diploma",
    languages: ["English"],
  },
  {
    company: "Harbor Chef Group",
    title: "Commis Chef",
    country: "Bahrain",
    city: "Manama",
    salaryMin: 900,
    salaryMax: 1400,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Kitchen experience", "Food safety awareness"],
    skills: ["Chef", "Hotel Staff"],
    jobType: "FULL_TIME",
    description: "Prep and cook under the sous chef in a busy kitchen.",
    experienceYears: 1,
    educationLevel: "HSC",
    languages: ["English"],
  },
  {
    company: "Sydney Civil Projects",
    title: "Civil Site Engineer",
    country: "Australia",
    city: "Sydney",
    salaryMin: 4000,
    salaryMax: 6200,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Civil engineering degree", "2+ years site experience"],
    skills: ["Civil Engineer", "Construction"],
    jobType: "FULL_TIME",
    description: "Coordinate site works and quality control on civil projects.",
    experienceYears: 2,
    educationLevel: "Bachelor",
    languages: ["English"],
  },
  {
    company: "Seoul Tech Services",
    title: "IT Support Specialist",
    country: "South Korea",
    city: "Seoul",
    salaryMin: 2200,
    salaryMax: 3400,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["IT diploma", "Helpdesk experience"],
    skills: ["IT Support", "Network Engineer"],
    jobType: "FULL_TIME",
    description: "Support enterprise users and escalate network issues.",
    experienceYears: 2,
    educationLevel: "Diploma",
    languages: ["Korean", "English"],
  },
  {
    company: "London Care Agency",
    title: "Healthcare Assistant",
    country: "United Kingdom",
    city: "London",
    salaryMin: 2000,
    salaryMax: 2800,
    salaryCurrency: "USD",
    visaSponsorship: true,
    requirements: ["Care certificate", "Right-to-work pathway eligible"],
    skills: ["Caregiver", "Nurse"],
    jobType: "FULL_TIME",
    description: "Support nurses with patient care in community settings.",
    experienceYears: 1,
    educationLevel: "HSC",
    languages: ["English"],
  },
  {
    company: "Texas Fabrication",
    title: "CNC Operator",
    country: "United States",
    city: "Houston",
    salaryMin: 2800,
    salaryMax: 4000,
    salaryCurrency: "USD",
    visaSponsorship: false,
    requirements: ["CNC experience", "Safety training"],
    skills: ["Factory Worker", "Welder"],
    jobType: "FULL_TIME",
    description: "Operate CNC machines for industrial fabrication.",
    experienceYears: 2,
    educationLevel: "Vocational Training",
    languages: ["English"],
  },
];

async function ensureJobCatalog() {
  const count = await prisma.jobListing.count({
    where: { deletedAt: null, status: "ACTIVE" },
  });
  if (count > 0) return;

  await prisma.jobListing.createMany({
    data: CATALOG.map((job) => ({
      ...job,
      status: "ACTIVE" as const,
    })),
  });
}

function yearsOfExperience(experience: unknown): number {
  if (!Array.isArray(experience)) return 0;
  return experience.reduce((sum, item) => {
    const years = Number((item as { years?: number }).years ?? 0);
    return sum + (Number.isFinite(years) ? years : 0);
  }, 0);
}

function educationRank(level?: string | null) {
  if (!level) return 0;
  return EDUCATION_RANK[level.toLowerCase().trim()] ?? 0;
}

function maxProfileEducation(education: unknown): number {
  if (!Array.isArray(education) || education.length === 0) return 99; // don't over-filter empty profiles
  return Math.max(
    0,
    ...education.map((e) =>
      educationRank(String((e as { level?: string }).level ?? "")),
    ),
  );
}

function profileLanguages(languages: unknown): string[] {
  if (!Array.isArray(languages)) return [];
  return languages
    .map((l) => String((l as { language?: string }).language ?? "").toLowerCase())
    .filter(Boolean);
}

function resolveCountryNames(codesOrNames: string[]) {
  return codesOrNames.map((value) => {
    const hit = EMPLOYMENT_COUNTRIES.find(
      (c) =>
        c.code === value ||
        c.name.toLowerCase() === value.toLowerCase(),
    );
    return (hit?.name ?? value).toLowerCase();
  });
}

function jobText(job: JobListing) {
  return [
    job.title,
    job.company,
    job.country,
    job.city,
    job.description,
    job.educationLevel,
    `experience ${job.experienceYears ?? 0} years`,
    `skills: ${job.skills.join(", ")}`,
    `requirements: ${job.requirements.join(", ")}`,
    `languages: ${job.languages.join(", ")}`,
    job.visaSponsorship ? "visa sponsorship available" : "no visa sponsorship",
  ]
    .filter(Boolean)
    .join("\n");
}

function profileText(profile: WorkerProfileSnapshot) {
  const skills = [...(profile.skills ?? []), ...(profile.customSkills ?? [])];
  return [
    profile.fullName,
    `nationality ${profile.nationality}`,
    `preferred countries ${profile.preferredCountries?.join(", ")}`,
    `preferred industries ${profile.preferredIndustries?.join(", ")}`,
    `skills ${skills.join(", ")}`,
    `education ${JSON.stringify(profile.education ?? [])}`,
    `experience ${JSON.stringify(profile.experience ?? [])}`,
    `languages ${JSON.stringify(profile.languages ?? [])}`,
    `certifications ${JSON.stringify(profile.certifications ?? [])}`,
    `preferred salary ${profile.preferredSalary ?? ""}`,
    `job type ${profile.preferredJobType ?? ""}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function cosineSimilarity(a: number[], b: number[]) {
  const len = Math.min(a.length, b.length);
  if (len === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}

function asNumberArray(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  const nums = value.map(Number).filter((n) => Number.isFinite(n));
  return nums.length ? nums : null;
}

async function ensureJobEmbeddings(jobs: JobListing[]) {
  const updated: JobListing[] = [];
  for (const job of jobs) {
    const existing = asNumberArray(job.embedding);
    if (existing && existing.length >= 32) {
      updated.push(job);
      continue;
    }
    const { embedding, model } = await embedDocumentText(jobText(job));
    const row = await prisma.jobListing.update({
      where: { id: job.id },
      data: {
        embedding: embedding as Prisma.InputJsonValue,
        embeddingModel: model,
        embeddedAt: new Date(),
      },
    });
    updated.push(row);
  }
  return updated;
}

/**
 * Attempt native pgvector cosine search. Falls back to in-memory cosine on JSON embeddings.
 */
async function vectorTopN(
  profileEmbedding: number[],
  candidateIds: string[],
  topN: number,
): Promise<Array<{ id: string; vectorScore: number }>> {
  if (candidateIds.length === 0) return [];

  // Ensure pgvector extension + column (best-effort on Neon)
  try {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector`);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE job_listings
      ADD COLUMN IF NOT EXISTS embedding_vector vector(1536)
    `);
  } catch (error) {
    logger.warn("pgvector setup skipped", { error });
  }

  // Sync JSON embeddings into vector column when dimensions match (OpenAI 1536)
  if (profileEmbedding.length === 1536) {
    try {
      for (const id of candidateIds) {
        const job = await prisma.jobListing.findUnique({
          where: { id },
          select: { embedding: true },
        });
        const emb = asNumberArray(job?.embedding);
        if (!emb || emb.length !== 1536) continue;
        await prisma.$executeRawUnsafe(
          `UPDATE job_listings SET embedding_vector = $1::vector WHERE id = $2::uuid`,
          `[${emb.join(",")}]`,
          id,
        );
      }

      const profileLiteral = `[${profileEmbedding.join(",")}]`;
      const idList = candidateIds.map((id) => `'${id}'::uuid`).join(",");
      const rows = await prisma.$queryRawUnsafe<
        Array<{ id: string; distance: number }>
      >(
        `SELECT id::text AS id, (embedding_vector <=> $1::vector) AS distance
         FROM job_listings
         WHERE id IN (${idList})
           AND embedding_vector IS NOT NULL
           AND deleted_at IS NULL
         ORDER BY embedding_vector <=> $1::vector
         LIMIT ${topN}`,
        profileLiteral,
      );

      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          vectorScore: Math.max(0, Math.min(1, 1 - Number(r.distance))),
        }));
      }
    } catch (error) {
      logger.warn("pgvector query failed, using JSON cosine", { error });
    }
  }

  // JSON cosine fallback (works for local-hash dims too)
  const jobs = await prisma.jobListing.findMany({
    where: { id: { in: candidateIds }, deletedAt: null },
    select: { id: true, embedding: true },
  });

  return jobs
    .map((job) => {
      const emb = asNumberArray(job.embedding) ?? [];
      return {
        id: job.id,
        vectorScore: cosineSimilarity(profileEmbedding, emb),
      };
    })
    .sort((a, b) => b.vectorScore - a.vectorScore)
    .slice(0, topN);
}

function heuristicEnrich(
  profile: WorkerProfileSnapshot,
  job: JobListing,
  vectorScore: number,
): JobRecommendationEnrichment {
  const skills = [...(profile.skills ?? []), ...(profile.customSkills ?? [])];
  const years = yearsOfExperience(profile.experience);
  const langs = profileLanguages(profile.languages);
  const skillHits = job.skills.filter((s) =>
    skills.some((p) => p.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(p.toLowerCase())),
  );
  const langHits = job.languages.filter((l) =>
    langs.some((p) => p.includes(l.toLowerCase()) || l.toLowerCase().includes(p)),
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (skillHits.length) strengths.push(`Skill overlap: ${skillHits.join(", ")}`);
  if (langHits.length) strengths.push(`Language fit: ${langHits.join(", ")}`);
  if (job.visaSponsorship) strengths.push("Employer offers visa sponsorship");
  if (years >= (job.experienceYears ?? 0))
    strengths.push("Meets experience requirement");
  else
    weaknesses.push(
      `Experience gap: role asks ${job.experienceYears ?? 0}+ years`,
    );
  if (!skillHits.length) weaknesses.push("Limited skill overlap with role");
  if (job.languages.length && !langHits.length)
    weaknesses.push(`Missing preferred languages: ${job.languages.join(", ")}`);

  const base =
    Math.round(vectorScore * 55) +
    Math.min(25, skillHits.length * 8) +
    (job.visaSponsorship ? 8 : 2) +
    (langHits.length ? 7 : 0);
  const matchScore = Math.min(95, Math.max(35, base));
  const probabilityOfSuccess = Math.min(
    92,
    Math.max(20, matchScore - (weaknesses.length * 6) + (strengths.length * 2)),
  );

  return {
    jobListingId: job.id,
    matchScore,
    strengths: strengths.length ? strengths : ["Profile partially aligns with role"],
    weaknesses: weaknesses.length ? weaknesses : ["No major gaps detected"],
    explanation: `${job.title} at ${job.company} scores ${matchScore}% based on skills, languages, experience, and semantic profile fit.`,
    probabilityOfSuccess,
  };
}

async function rankWithGemini(
  profile: WorkerProfileSnapshot,
  jobs: Array<{ job: JobListing; vectorScore: number }>,
  profileUserId?: string,
): Promise<{
  rankings: JobRecommendationEnrichment[];
  ranker: "gemini" | "openai" | "heuristic";
}> {
  const heuristic = jobs.map(({ job, vectorScore }) =>
    heuristicEnrich(profile, job, vectorScore),
  );

  const prompt = `You are the Muntajar Overseas Employment Matching Engine ranker (Gemini).

Rank the candidate against these jobs. Return ONLY valid JSON:
{
  "rankings": [
    {
      "jobListingId": string,
      "matchScore": 0-100,
      "strengths": string[],
      "weaknesses": string[],
      "explanation": string,
      "probabilityOfSuccess": 0-100
    }
  ]
}

Rules:
- Include EVERY jobListingId exactly once.
- Order rankings best-first (highest matchScore first).
- Never invent employers, salaries, or requirements not in the job data.
- Be realistic about gaps (education, experience, language, visa).

Candidate profile:
${JSON.stringify({
  fullName: profile.fullName,
  preferredCountries: profile.preferredCountries,
  preferredSalary: profile.preferredSalary,
  preferredJobType: profile.preferredJobType,
  skills: [...(profile.skills ?? []), ...(profile.customSkills ?? [])],
  education: profile.education,
  experience: profile.experience,
  languages: profile.languages,
  certifications: profile.certifications,
  experienceYears: yearsOfExperience(profile.experience),
})}

Jobs (vector pre-ranked):
${JSON.stringify(
  jobs.map(({ job, vectorScore }) => ({
    jobListingId: job.id,
    title: job.title,
    company: job.company,
    country: job.country,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    visaSponsorship: job.visaSponsorship,
    requirements: job.requirements,
    skills: job.skills,
    experienceYears: job.experienceYears,
    educationLevel: job.educationLevel,
    languages: job.languages,
    description: job.description,
    vectorScore: Number(vectorScore.toFixed(4)),
  })),
)}

Heuristic baseline (refine, do not ignore grounded gaps):
${JSON.stringify(heuristic)}`;

  if (isGeminiConfigured()) {
    try {
      const raw = await auditedGeminiGenerateJson(
        {
          action: "JOB_RANKING",
          userId: profileUserId,
          entityType: "JobMatch",
          entityId: profileUserId,
          inputSummary: summarizeAiText(
            `rank ${jobs.length} jobs for ${profile.fullName ?? "worker"}`,
          ),
        },
        prompt,
      );
      const parsed = geminiRankingResponseSchema.parse(JSON.parse(raw));
      const byId = new Map(parsed.rankings.map((r) => [r.jobListingId, r]));
      const rankings = jobs.map(({ job, vectorScore }) => {
        const ai = byId.get(job.id);
        return ai ?? heuristicEnrich(profile, job, vectorScore);
      });
      rankings.sort((a, b) => b.matchScore - a.matchScore);
      return { rankings, ranker: "gemini" as const };
    } catch (error) {
      logger.warn("Gemini ranking failed, trying OpenAI", { error });
    }
  }

  if (openaiConfig.apiKey && !openaiConfig.apiKey.startsWith("sk-dev")) {
    try {
      const completion = await auditedChatCompletion(
        {
          action: "JOB_RANKING",
          userId: profileUserId,
          entityType: "JobMatch",
          entityId: profileUserId,
          inputSummary: summarizeAiText(
            `rank ${jobs.length} jobs for ${profile.fullName ?? "worker"}`,
          ),
        },
        {
          model: openaiConfig.model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are an overseas employment matching ranker. Return ONLY valid JSON with key rankings as specified.",
            },
            { role: "user", content: prompt },
          ],
        },
      );
      const raw = completion.choices[0]?.message?.content ?? "{}";
      const parsed = geminiRankingResponseSchema.parse(JSON.parse(raw));
      const byId = new Map(parsed.rankings.map((r) => [r.jobListingId, r]));
      const rankings = jobs.map(({ job, vectorScore }) => {
        const ai = byId.get(job.id);
        return ai ?? heuristicEnrich(profile, job, vectorScore);
      });
      rankings.sort((a, b) => b.matchScore - a.matchScore);
      return { rankings, ranker: "openai" as const };
    } catch (error) {
      logger.warn("OpenAI ranking failed, using heuristic", { error });
    }
  }

  await recordAiAudit({
    action: "JOB_RANKING",
    provider: "local",
    model: "heuristic",
    status: "FALLBACK",
    inputSummary: summarizeAiText(
      `rank ${jobs.length} jobs for ${profile.fullName ?? "worker"}`,
    ),
    outputSummary: "heuristic ranking",
    userId: profileUserId,
    entityType: "JobMatch",
    entityId: profileUserId,
  });

  const rankings = heuristic.sort((a, b) => b.matchScore - a.matchScore);
  return { rankings, ranker: "heuristic" as const };
}

/**
 * Overseas Employment Matching Engine
 *
 * Candidate Profile → SQL Filters → Country → Visa → Education →
 * Experience → Language → pgvector Top 50 → Gemini Ranking → Top 10
 */
export const employmentMatchingService = {
  async ensureCatalog() {
    await ensureJobCatalog();
  },

  async matchJobs(userId: string, profile: WorkerProfileSnapshot) {
    await ensureJobCatalog();

    // 1) SQL base filter
    let candidates = await prisma.jobListing.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
    });
    const counts: NonNullable<MatchKeyFactors["pipeline"]> = {
      sqlFiltered: candidates.length,
      countryFiltered: 0,
      visaFiltered: 0,
      educationFiltered: 0,
      experienceFiltered: 0,
      languageFiltered: 0,
      vectorTopN: 0,
      rankedTopN: 0,
      ranker: "heuristic",
    };

    // 2) Country filter
    const preferredCountries = resolveCountryNames(
      profile.preferredCountries ?? [],
    );
    if (preferredCountries.length > 0) {
      const filtered = candidates.filter((job) =>
        preferredCountries.some(
          (c) =>
            job.country.toLowerCase().includes(c) ||
            c.includes(job.country.toLowerCase().slice(0, 4)),
        ),
      );
      if (filtered.length >= 3) candidates = filtered;
    }
    counts.countryFiltered = candidates.length;

    // 3) Visa filter — prefer sponsored roles when available
    const withVisa = candidates.filter((j) => j.visaSponsorship);
    if (withVisa.length >= 3) candidates = withVisa;
    counts.visaFiltered = candidates.length;

    // 4) Education filter
    const profileEdu = maxProfileEducation(profile.education);
    if (profileEdu < 99) {
      const eduFiltered = candidates.filter((job) => {
        const needed = educationRank(job.educationLevel);
        return needed === 0 || needed <= profileEdu + 1;
      });
      if (eduFiltered.length >= 3) candidates = eduFiltered;
    }
    counts.educationFiltered = candidates.length;

    // 5) Experience filter
    const years = yearsOfExperience(profile.experience);
    const expFiltered = candidates.filter((job) => {
      const required = job.experienceYears ?? 0;
      return years + 1 >= required || required === 0;
    });
    if (expFiltered.length >= 3) candidates = expFiltered;
    counts.experienceFiltered = candidates.length;

    // 6) Language filter
    const langs = profileLanguages(profile.languages);
    if (langs.length > 0) {
      const langFiltered = candidates.filter((job) => {
        if (!job.languages.length) return true;
        return job.languages.some((l) =>
          langs.some(
            (p) =>
              p.includes(l.toLowerCase()) || l.toLowerCase().includes(p),
          ),
        );
      });
      if (langFiltered.length >= 3) candidates = langFiltered;
    }
    counts.languageFiltered = candidates.length;

    // Ensure embeddings
    candidates = await ensureJobEmbeddings(candidates);
    const { embedding: profileEmbedding } = await embedDocumentText(
      profileText(profile),
      { userId, entityType: "WorkerProfile", entityId: userId },
    );

    // 7) pgvector / cosine → Top 50
    const vectorHits = await vectorTopN(
      profileEmbedding,
      candidates.map((c) => c.id),
      MATCH_ENGINE_VECTOR_TOP_N,
    );
    counts.vectorTopN = vectorHits.length;

    const byId = new Map(candidates.map((c) => [c.id, c]));
    const vectorJobs = vectorHits
      .map((hit) => {
        const job = byId.get(hit.id);
        if (!job) return null;
        return { job, vectorScore: hit.vectorScore };
      })
      .filter(Boolean) as Array<{ job: JobListing; vectorScore: number }>;

    // If vector returned nothing, fall back to all candidates
    const pool =
      vectorJobs.length > 0
        ? vectorJobs
        : candidates.map((job) => ({ job, vectorScore: 0.5 }));

    // 8) Gemini ranking → Top 10
    const { rankings, ranker } = await rankWithGemini(profile, pool, userId);
    counts.ranker = ranker;
    const top = rankings.slice(0, MATCH_ENGINE_FINAL_TOP_N);
    counts.rankedTopN = top.length;

    const batchId = randomUUID();

    await prisma.jobMatch.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    const created = await Promise.all(
      top.map(async (rec) => {
        const job = byId.get(rec.jobListingId) ?? pool.find((p) => p.job.id === rec.jobListingId)?.job;
        if (!job) return null;
        const vectorScore =
          pool.find((p) => p.job.id === job.id)?.vectorScore ?? 0;

        const keyFactors: MatchKeyFactors = {
          strengths: rec.strengths,
          weaknesses: rec.weaknesses,
          probabilityOfSuccess: rec.probabilityOfSuccess,
          salary: {
            min: job.salaryMin != null ? Number(job.salaryMin) : null,
            max: job.salaryMax != null ? Number(job.salaryMax) : null,
            currency: job.salaryCurrency,
          },
          visaSponsorship: job.visaSponsorship,
          requirements: job.requirements,
          vectorScore,
          pipeline: { ...counts },
        };

        return prisma.jobMatch.create({
          data: {
            userId,
            jobListingId: job.id,
            matchScore: rec.matchScore,
            explanation: rec.explanation,
            keyFactors: keyFactors as unknown as Prisma.InputJsonValue,
            batchId,
            status: "COMPLETED",
          },
          include: { jobListing: true },
        });
      }),
    );

    logger.info("Employment matching engine completed", {
      userId,
      ...counts,
    });

    return created.filter(Boolean);
  },
};
