import { openaiConfig } from "@/config";
import { logger } from "@/lib";
import {
  auditedChatCompletion,
  recordSkippedAiAction,
  summarizeAiText,
} from "@/services/ai/ai-audit.service";
import type { WorkerProfileSnapshot } from "./matching.service";
import type { WorkerAnalysisResult } from "@/lib/employment/analysis.types";
import { EMPLOYMENT_COUNTRIES } from "@/lib/employment/constants";

export type CareerCoachMatchSnippet = {
  title: string;
  company: string;
  country: string;
  matchScore: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  visaSponsorship?: boolean;
  probabilityOfSuccess?: number | null;
  explanation?: string | null;
};

export type CareerCoachMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type CareerCoachContext = {
  userId?: string;
  profile: WorkerProfileSnapshot & {
    preferredIndustries?: string[];
    certifications?: unknown;
    preferredSalaryCurrency?: string | null;
    profileCompletion?: number | null;
  };
  analysis?: WorkerAnalysisResult | null;
  matches?: CareerCoachMatchSnippet[];
  history?: CareerCoachMessage[];
};

function yearsOfExperience(experience: unknown): number {
  if (!Array.isArray(experience)) return 0;
  return experience.reduce((sum, item) => {
    const years = Number((item as { years?: number }).years ?? 0);
    return sum + (Number.isFinite(years) ? years : 0);
  }, 0);
}

function skillList(profile: CareerCoachContext["profile"]) {
  return [...(profile.skills ?? []), ...(profile.customSkills ?? [])];
}

function languageList(languages: unknown): string[] {
  if (!Array.isArray(languages)) return [];
  return languages
    .map((l) => String((l as { language?: string }).language ?? "").trim())
    .filter(Boolean);
}

function resolveCountry(nameOrCode: string) {
  const q = nameOrCode.toLowerCase();
  return EMPLOYMENT_COUNTRIES.find(
    (c) =>
      c.code.toLowerCase() === q ||
      c.name.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      q.includes(c.name.toLowerCase()),
  );
}

function detectTargetCountry(question: string) {
  const q = question.toLowerCase();
  for (const c of EMPLOYMENT_COUNTRIES) {
    if (q.includes(c.name.toLowerCase()) || q.includes(c.code.toLowerCase())) {
      return c;
    }
  }
  if (q.includes("germany") || q.includes("german")) {
    return EMPLOYMENT_COUNTRIES.find((c) => c.code === "DE")!;
  }
  if (q.includes("japan") || q.includes("japanese")) {
    return EMPLOYMENT_COUNTRIES.find((c) => c.code === "JP")!;
  }
  return null;
}

function formatSalaryRange(analysis: WorkerAnalysisResult | null | undefined) {
  if (!analysis?.salaryEstimate) return null;
  const { currency, monthlyMin, monthlyMax } = analysis.salaryEstimate;
  return `${currency} ${monthlyMin.toLocaleString()}–${monthlyMax.toLocaleString()} / month`;
}

function missingDataNote(ctx: CareerCoachContext) {
  const gaps: string[] = [];
  if (!skillList(ctx.profile).length) gaps.push("skills");
  if (!Array.isArray(ctx.profile.experience) || !ctx.profile.experience.length)
    gaps.push("work experience");
  if (!Array.isArray(ctx.profile.education) || !ctx.profile.education.length)
    gaps.push("education");
  if (!languageList(ctx.profile.languages).length) gaps.push("languages");
  if (!ctx.analysis) gaps.push("AI worker analysis");
  if (!ctx.matches?.length) gaps.push("job matches");
  return gaps;
}

/**
 * Grounded heuristic coach — answers only from provided context.
 */
function groundedReply(question: string, ctx: CareerCoachContext): string {
  const q = question.toLowerCase();
  const { profile, analysis, matches = [] } = ctx;
  const skills = skillList(profile);
  const langs = languageList(profile.languages);
  const years = yearsOfExperience(profile.experience);
  const preferred = profile.preferredCountries ?? [];
  const gaps = missingDataNote(ctx);
  const needMore =
    gaps.length > 0
      ? ` To answer more precisely, complete: ${gaps.slice(0, 4).join(", ")}.`
      : "";

  const target = detectTargetCountry(question);

  // Country recommendation
  if (
    (q.includes("which country") ||
      q.includes("where should") ||
      q.includes("suit") ||
      q.includes("work in")) &&
    !target
  ) {
    const fromAnalysis =
      analysis?.eligibleCountries?.slice(0, 3).map((c) => c.name) ?? [];
    const fromMatches = Array.from(
      new Set(matches.map((m) => m.country).filter(Boolean)),
    ).slice(0, 3);
    const list =
      fromAnalysis.length > 0
        ? fromAnalysis
        : fromMatches.length > 0
          ? fromMatches
          : preferred.length > 0
            ? preferred
            : [];

    if (list.length === 0) {
      return `I don't have enough profile data yet to recommend a country. Add preferred countries, skills, and run AI analysis first.${needMore}`;
    }

    const reasons =
      analysis?.eligibleCountries?.[0]?.reasons?.slice(0, 2).join("; ") ||
      (skills.length ? `skills include ${skills.slice(0, 3).join(", ")}` : null);

    return `Based on your profile${reasons ? ` (${reasons})` : ""}, prioritize: ${list.join(", ")}. I won't invent destinations beyond your analysis, matches, or stated preferences.${needMore}`;
  }

  // Specific country eligibility (Germany, Japan, etc.)
  if (target && (q.includes("eligible") || q.includes("eligib") || q.includes("can i"))) {
    const eligible = analysis?.eligibleCountries?.find(
      (c) =>
        c.name.toLowerCase() === target.name.toLowerCase() ||
        c.code?.toLowerCase() === target.code.toLowerCase(),
    );
    const matchHits = matches.filter(
      (m) =>
        m.country.toLowerCase().includes(target.name.toLowerCase()) ||
        target.name.toLowerCase().includes(m.country.toLowerCase()),
    );

    if (!eligible && matchHits.length === 0 && !preferred.some((p) => p.toLowerCase().includes(target.name.toLowerCase()) || p === target.code)) {
      return `I can't confirm eligibility for ${target.name} from your stored profile alone — it isn't in your analysis eligible countries or current matches. Run analysis/matching after adding languages and experience for ${target.name}, then ask again. I won't invent visa approval odds.${needMore}`;
    }

    const parts: string[] = [];
    if (eligible) {
      parts.push(
        `${target.name} appears in your analysis at ${eligible.score}% fit${eligible.reasons.length ? ` (${eligible.reasons.join("; ")})` : ""}.`,
      );
    }
    if (matchHits.length) {
      parts.push(
        `You have ${matchHits.length} matched role(s) there (e.g. ${matchHits[0]!.title} · ${Math.round(matchHits[0]!.matchScore)}% match).`,
      );
    }
    const readiness = analysis?.profileReadinessScore;
    if (typeof readiness === "number") {
      parts.push(`Overall profile readiness is ${readiness}%.`);
    }
    if (!langs.some((l) => /german|japanese|english/i.test(l)) && (target.code === "DE" || target.code === "JP")) {
      parts.push(
        target.code === "DE"
          ? "Your profile does not list German (or English) proficiency — that is a documented gap for many DE pathways."
          : "Your profile does not list Japanese (or English) proficiency — that is a documented gap for many JP pathways.",
      );
    }
    parts.push("This is not a visa guarantee.");
    return parts.join(" ") + needMore;
  }

  // Salary
  if (q.includes("salary") || q.includes("earn") || q.includes("pay") || q.includes("wage")) {
    const estimate = formatSalaryRange(analysis);
    const fromMatches = matches
      .filter((m) => m.salaryMin != null || m.salaryMax != null)
      .slice(0, 3)
      .map((m) => {
        const min = m.salaryMin != null ? Number(m.salaryMin) : null;
        const max = m.salaryMax != null ? Number(m.salaryMax) : null;
        const cur = m.salaryCurrency ?? "USD";
        if (min != null && max != null) return `${m.title}: ${cur} ${min}–${max}`;
        if (min != null) return `${m.title}: from ${cur} ${min}`;
        return `${m.title}: up to ${cur} ${max}`;
      });

    if (!estimate && fromMatches.length === 0 && profile.preferredSalary == null) {
      return `I don't have a salary estimate on file. Run AI Worker Analysis or job matching first so I can cite your stored figures — I won't invent pay rates.${needMore}`;
    }

    const bits: string[] = [];
    if (estimate) {
      bits.push(
        `Your stored analysis estimates about ${estimate}${analysis?.salaryEstimate.note ? ` (${analysis.salaryEstimate.note})` : ""}.`,
      );
    }
    if (profile.preferredSalary != null) {
      bits.push(
        `You set a preferred salary near ${profile.preferredSalaryCurrency ?? "USD"} ${Number(profile.preferredSalary).toLocaleString()}.`,
      );
    }
    if (fromMatches.length) {
      bits.push(`Matched roles show: ${fromMatches.join("; ")}.`);
    }
    bits.push("Actual offers vary by employer and visa package.");
    return bits.join(" ");
  }

  // Improve chances
  if (
    q.includes("improve") ||
    q.includes("chances") ||
    q.includes("chance") ||
    q.includes("how can i")
  ) {
    const suggestions = analysis?.suggestions?.slice(0, 4) ?? [];
    const missingSkills = analysis?.missingSkills?.slice(0, 4) ?? [];
    const missingDocs = analysis?.missingDocuments?.slice(0, 4) ?? [];
    const weaknesses = analysis?.weaknesses?.slice(0, 3) ?? [];

    if (!suggestions.length && !missingSkills.length && !missingDocs.length) {
      return `From your profile alone: quantify experience (${years} year(s) recorded), upload missing documents, add language scores, and re-run matching. I need analysis results for personalized chance improvements.${needMore}`;
    }

    const parts: string[] = ["To improve your chances based on stored data:"];
    if (suggestions.length) parts.push(suggestions.map((s) => `• ${s}`).join("\n"));
    if (missingSkills.length)
      parts.push(`Missing skills called out: ${missingSkills.join(", ")}.`);
    if (missingDocs.length)
      parts.push(`Missing documents: ${missingDocs.join(", ")}.`);
    if (weaknesses.length) parts.push(`Weaknesses noted: ${weaknesses.join("; ")}.`);
    if (typeof analysis?.profileReadinessScore === "number") {
      parts.push(`Current readiness: ${analysis.profileReadinessScore}%.`);
    }
    return parts.join("\n");
  }

  // Certificates
  if (q.includes("certif") || q.includes("licence") || q.includes("license")) {
    const missingSkills = analysis?.missingSkills ?? [];
    const certHints = missingSkills.filter((s) =>
      /cert|license|licence|cpr|safety|ielts|toefl/i.test(s),
    );
    const industries = analysis?.eligibleIndustries?.slice(0, 2).map((i) => i.name) ??
      profile.preferredIndustries?.slice(0, 2) ??
      [];

    if (!certHints.length && !industries.length && !skills.length) {
      return `I don't see enough trade/skill data to recommend a specific certificate. Add skills or certifications on your profile, then ask again — I won't invent credentials.${needMore}`;
    }

    const parts: string[] = [];
    if (certHints.length) {
      parts.push(
        `Your analysis flags these skill/cert gaps: ${certHints.join(", ")}.`,
      );
    } else if (industries.length) {
      parts.push(
        `For ${industries.join(" / ")} roles matching your profile, prioritize destination-accepted trade or safety certificates tied to your skills (${skills.slice(0, 3).join(", ") || "add skills"}).`,
      );
    }
    const existing = Array.isArray(profile.certifications)
      ? profile.certifications
          .map((c) => String((c as { name?: string }).name ?? "").trim())
          .filter(Boolean)
      : [];
    if (existing.length) {
      parts.push(`Already on your profile: ${existing.slice(0, 4).join(", ")}.`);
    }
    parts.push("Confirm acceptance with the destination employer or regulator.");
    return parts.join(" ");
  }

  // English
  if (q.includes("english") || q.includes("ielts") || q.includes("toefl")) {
    const hasEnglish = langs.some((l) => /english|ielts|toefl/i.test(l));
    const missing = analysis?.missingSkills?.some((s) =>
      /english|ielts|toefl/i.test(s),
    );
    if (!hasEnglish || missing) {
      return `Yes — based on your profile, English readiness looks like a gap${hasEnglish ? " that still needs stronger scores/proof" : " (no English/IELTS/TOEFL listed)"}. Destinations in your analysis (${(analysis?.eligibleCountries ?? []).slice(0, 3).map((c) => c.name).join(", ") || preferred.join(", ") || "preferred markets"}) typically expect communicative English. Add a score on your profile after you test.${needMore}`;
    }
    return `Your profile already lists English-related language data (${langs.filter((l) => /english|ielts|toefl/i.test(l)).join(", ")}). Keep scores current and upload a language certificate if required by matched employers.`;
  }

  // Generic eligibility
  if (q.includes("eligible") || q.includes("eligibility")) {
    const readiness = analysis?.profileReadinessScore;
    const countries =
      analysis?.eligibleCountries?.slice(0, 4).map((c) => `${c.name} (${c.score}%)`) ??
      [];
    if (readiness == null && countries.length === 0) {
      return `I can't assess eligibility without analysis or matches on file. Run AI Worker Analysis first.${needMore}`;
    }
    return `Stored readiness: ${readiness ?? "n/a"}%. Eligible markets from analysis: ${countries.join(", ") || "none listed yet"}. Missing docs: ${(analysis?.missingDocuments ?? []).join(", ") || "none flagged"}. This is not a legal visa determination.${needMore}`;
  }

  // Default grounded summary
  const summary =
    analysis?.careerSummary ||
    analysis?.summary ||
    `Profile for ${profile.fullName ?? "you"} with ${skills.length} skill(s), ${years} year(s) experience, languages: ${langs.join(", ") || "none listed"}.`;
  return `${summary} Ask about countries, salary, certificates, English, or eligibility for a specific destination (e.g. Germany or Japan).${needMore}`;
}

const SYSTEM_PROMPT = `You are Muntajar's AI Career Coach for overseas employment.

STRICT RULES:
1. Use ONLY the provided context: worker profile, AI analysis, job matches, and prior chat messages.
2. NEVER hallucinate. Do not invent employers, visas, salaries, certificates, language scores, or eligibility decisions not supported by context.
3. If data is missing, say what is missing and what the user should complete. Do not guess.
4. For country/salary/eligibility questions, prefer analysis.eligibleCountries, analysis.salaryEstimate, analysis.profileReadinessScore, and match scores.
5. Never promise visa approval. Frame outcomes as estimates from stored data.
6. Keep answers practical, under 200 words, in clear prose (short bullets OK).
7. Stay consistent with prior chat turns when they are provided.`;

/**
 * AI Career Coach — profile-aware, grounded, multi-turn.
 */
export const employmentAdvisorService = {
  async answer(question: string, ctx: CareerCoachContext): Promise<string> {
    const fallback = groundedReply(question, ctx);

    if (!openaiConfig.apiKey || openaiConfig.apiKey.startsWith("sk-dev")) {
      await recordSkippedAiAction({
        action: "CAREER_ADVISOR",
        model: openaiConfig.model,
        reason: "OpenAI not configured — grounded fallback",
        userId: ctx.userId,
        entityType: "WorkerProfile",
        entityId: ctx.userId,
        inputSummary: summarizeAiText(question),
        outputSummary: summarizeAiText(fallback),
      });
      return fallback;
    }

    try {
      const history = (ctx.history ?? [])
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const factPack = {
        question,
        profile: {
          fullName: ctx.profile.fullName,
          nationality: ctx.profile.nationality,
          currentCountry: ctx.profile.currentCountry,
          preferredCountries: ctx.profile.preferredCountries,
          preferredIndustries: ctx.profile.preferredIndustries,
          preferredSalary: ctx.profile.preferredSalary,
          preferredSalaryCurrency: ctx.profile.preferredSalaryCurrency,
          preferredJobType: ctx.profile.preferredJobType,
          skills: skillList(ctx.profile),
          education: ctx.profile.education,
          experience: ctx.profile.experience,
          experienceYears: yearsOfExperience(ctx.profile.experience),
          languages: ctx.profile.languages,
          certifications: ctx.profile.certifications,
          passportNumber: ctx.profile.passportNumber ? "[on file]" : null,
          passportExpiry: ctx.profile.passportExpiry
            ? String(ctx.profile.passportExpiry)
            : null,
          profileCompletion: ctx.profile.profileCompletion,
        },
        analysis: ctx.analysis
          ? {
              careerSummary: ctx.analysis.careerSummary ?? ctx.analysis.summary,
              strengths: ctx.analysis.strengths,
              weaknesses: ctx.analysis.weaknesses,
              eligibleCountries: ctx.analysis.eligibleCountries,
              eligibleIndustries: ctx.analysis.eligibleIndustries,
              salaryEstimate: ctx.analysis.salaryEstimate,
              missingDocuments: ctx.analysis.missingDocuments,
              missingSkills: ctx.analysis.missingSkills,
              profileReadinessScore: ctx.analysis.profileReadinessScore,
              suggestions: ctx.analysis.suggestions,
            }
          : null,
        matches: (ctx.matches ?? []).slice(0, 8),
        dataGaps: missingDataNote(ctx),
        groundedFallback: fallback,
      };

      const completion = await auditedChatCompletion(
        {
          action: "CAREER_ADVISOR",
          userId: ctx.userId,
          entityType: "WorkerProfile",
          entityId: ctx.userId,
          inputSummary: summarizeAiText(question),
        },
        {
          model: openaiConfig.model,
          temperature: 0.2,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            {
              role: "user",
              content: JSON.stringify(factPack),
            },
          ],
        },
      );

      const text = completion.choices[0]?.message?.content?.trim();
      return text || fallback;
    } catch (error) {
      logger.warn("Career coach AI failed", { error });
      return fallback;
    }
  },

  /** @deprecated use answer(question, ctx) */
  async answerLegacy(
    question: string,
    profile: WorkerProfileSnapshot,
    analysis?: WorkerAnalysisResult | null,
  ) {
    return this.answer(question, { profile, analysis });
  },
};
