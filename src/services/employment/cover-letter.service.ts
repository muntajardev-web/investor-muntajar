import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const COVER_LETTER_TEMPLATES = [
  {
    id: "professional",
    label: "Professional",
    description: "Balanced 3-paragraph letter for most overseas roles",
  },
  {
    id: "formal",
    label: "Formal",
    description: "Conservative tone for Gulf / corporate employers",
  },
  {
    id: "concise",
    label: "Concise",
    description: "Short and direct — one screen",
  },
  {
    id: "skills_focused",
    label: "Skills-focused",
    description: "Highlights verified skills and certifications",
  },
] as const;

export type CoverLetterTemplateId =
  (typeof COVER_LETTER_TEMPLATES)[number]["id"];

export const COVER_LETTER_LANGUAGES = [
  { id: "en", label: "English" },
  { id: "de", label: "German (formal opening)" },
  { id: "ja", label: "Japanese (formal opening)" },
  { id: "ar", label: "Arabic (bilingual opening)" },
] as const;

export type CoverLetterLanguageId =
  (typeof COVER_LETTER_LANGUAGES)[number]["id"];

export type CoverLetterProfile = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  nationality?: string | null;
  currentCountry?: string | null;
  preferredCountries?: string[];
  preferredIndustries?: string[];
  skills?: string[];
  customSkills?: string[];
  education?: unknown;
  experience?: unknown;
  languages?: unknown;
  certifications?: unknown;
};

export type CoverLetterJobContext = {
  jobTitle?: string | null;
  company?: string | null;
  country?: string | null;
  jobListingId?: string | null;
};

function present(v: unknown) {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function skillsOf(profile: CoverLetterProfile) {
  return Array.from(
    new Set(
      [...(profile.skills ?? []), ...(profile.customSkills ?? [])].filter(
        (s) => present(s),
      ),
    ),
  );
}

function asRecords(value: unknown) {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function experienceYears(experience: unknown) {
  return asRecords(experience).reduce((sum, item) => {
    const y = Number(item.years ?? 0);
    return sum + (Number.isFinite(y) ? y : 0);
  }, 0);
}

function topRoles(experience: unknown, limit = 2) {
  return asRecords(experience)
    .map((e) => {
      const position = String(e.position ?? "").trim();
      const employer = String(e.employer ?? "").trim();
      if (!position && !employer) return null;
      return [position, employer].filter(Boolean).join(" at ");
    })
    .filter(Boolean)
    .slice(0, limit) as string[];
}

function educationBits(education: unknown, limit = 2) {
  return asRecords(education)
    .map((e) => {
      const level = String(e.level ?? "").trim();
      const institution = String(e.institution ?? "").trim();
      if (!level && !institution) return null;
      return [level, institution].filter(Boolean).join(" — ");
    })
    .filter(Boolean)
    .slice(0, limit) as string[];
}

function languageBits(languages: unknown) {
  return asRecords(languages)
    .map((l) => {
      const language = String(l.language ?? "").trim();
      if (!language) return null;
      const level = String(l.level ?? "").trim();
      const score = String(l.score ?? "").trim();
      const extra = [level, score].filter(Boolean).join(", ");
      return extra ? `${language} (${extra})` : language;
    })
    .filter(Boolean) as string[];
}

function certBits(certifications: unknown, limit = 3) {
  return asRecords(certifications)
    .map((c) => String(c.name ?? "").trim())
    .filter(Boolean)
    .slice(0, limit);
}

function greeting(
  language: CoverLetterLanguageId,
  company?: string | null,
): string {
  const to = company?.trim() ? `Hiring Manager, ${company}` : "Hiring Manager";
  switch (language) {
    case "de":
      return `Sehr geehrte Damen und Herren,\n\n(English body follows — facts from my verified profile only.)`;
    case "ja":
      return `拝啓\n\n${to} 様\n\n(English body follows — facts from my verified profile only.)`;
    case "ar":
      return `السلام عليكم\nDear ${to},`;
    default:
      return `Dear ${to},`;
  }
}

function closing(language: CoverLetterLanguageId, name: string) {
  switch (language) {
    case "de":
      return `Mit freundlichen Grüßen,\n${name}`;
    case "ja":
      return `敬具\n${name}`;
    case "ar":
      return `مع خالص التحية،\nSincerely,\n${name}`;
    default:
      return `Sincerely,\n${name}`;
  }
}

function targetSentence(job: CoverLetterJobContext) {
  if (job.jobTitle && job.company && job.country) {
    return `I am writing to apply for the ${job.jobTitle} position at ${job.company} in ${job.country}.`;
  }
  if (job.jobTitle && job.company) {
    return `I am writing to apply for the ${job.jobTitle} position at ${job.company}.`;
  }
  if (job.jobTitle && job.country) {
    return `I am writing to apply for the ${job.jobTitle} role in ${job.country}.`;
  }
  if (job.jobTitle) {
    return `I am writing to apply for the ${job.jobTitle} role.`;
  }
  if (job.country) {
    return `I am writing to express interest in overseas employment opportunities in ${job.country}.`;
  }
  return `I am writing to express interest in overseas employment opportunities.`;
}

function factSentences(profile: CoverLetterProfile): string[] {
  const sentences: string[] = [];
  const years = experienceYears(profile.experience);
  const roles = topRoles(profile.experience);
  const skills = skillsOf(profile).slice(0, 6);
  const edu = educationBits(profile.education);
  const langs = languageBits(profile.languages);
  const certs = certBits(profile.certifications);

  if (years > 0) {
    sentences.push(`My profile records ${years} year(s) of work experience.`);
  }
  if (roles.length) {
    sentences.push(`Recent roles on file include ${roles.join("; ")}.`);
  }
  if (skills.length) {
    sentences.push(`Verified skills: ${skills.join(", ")}.`);
  }
  if (edu.length) {
    sentences.push(`Education on file: ${edu.join("; ")}.`);
  }
  if (langs.length) {
    sentences.push(`Languages on file: ${langs.join("; ")}.`);
  }
  if (certs.length) {
    sentences.push(`Certifications on file: ${certs.join(", ")}.`);
  }
  if (profile.nationality) {
    sentences.push(`Nationality on file: ${profile.nationality}.`);
  }
  return sentences;
}

function buildBody(
  template: CoverLetterTemplateId,
  profile: CoverLetterProfile,
  job: CoverLetterJobContext,
): string {
  const facts = factSentences(profile);
  const target = targetSentence(job);
  const skills = skillsOf(profile).slice(0, 5);
  const certs = certBits(profile.certifications);

  if (template === "concise") {
    const lines = [target];
    if (facts[0]) lines.push(facts[0]);
    if (skills.length) lines.push(`Key skills on file: ${skills.join(", ")}.`);
    lines.push(
      "I am available for interviews and standard overseas hiring steps as required.",
    );
    lines.push(
      "This letter uses only verified profile and job details; no additional claims are made.",
    );
    return lines.join(" ");
  }

  if (template === "formal") {
    const p1 = target;
    const p2 =
      facts.length > 0
        ? facts.slice(0, 3).join(" ")
        : "Relevant experience and qualifications are recorded on my worker profile.";
    const p3 =
      "I would welcome the opportunity to discuss how my documented background aligns with your requirements. Thank you for your consideration.";
    const p4 =
      "All statements above are drawn from verified profile fields and the selected job context only.";
    return [p1, p2, p3, p4].join("\n\n");
  }

  if (template === "skills_focused") {
    const p1 = target;
    const p2 = skills.length
      ? `Skills on my verified profile that relate to this application: ${skills.join(", ")}.`
      : "My worker profile lists the skills and experience available for this application.";
    const p3 = certs.length
      ? `Certifications on file: ${certs.join(", ")}.`
      : null;
    const p4 =
      facts.filter((f) => f.includes("experience") || f.includes("Education"))
        .slice(0, 2)
        .join(" ") || null;
    const p5 =
      "I remain available for interviews and documentation checks. No unverified claims are included in this letter.";
    return [p1, p2, p3, p4, p5].filter(Boolean).join("\n\n");
  }

  // professional (default)
  const p1 = target;
  const p2 =
    facts.length > 0
      ? facts.slice(0, 4).join(" ")
      : "Details of my education, experience, and skills are available on my verified worker profile.";
  const p3 = job.country
    ? `I am prepared to complete hiring, medical, and visa steps required for employment in ${job.country}.`
    : "I am prepared to complete hiring, medical, and visa steps required for overseas employment.";
  const p4 =
    "Thank you for considering my application. This letter contains only information from my profile and the selected role.";
  return [p1, p2, p3, p4].join("\n\n");
}

/**
 * AI Cover Letter Generator — personalized from verified profile + job context.
 * Never invents employers, skills, or credentials.
 */
export const coverLetterService = {
  templates: COVER_LETTER_TEMPLATES,
  languages: COVER_LETTER_LANGUAGES,

  generate(input: {
    profile: CoverLetterProfile;
    job?: CoverLetterJobContext;
    template?: CoverLetterTemplateId;
    language?: CoverLetterLanguageId;
  }): {
    content: string;
    template: CoverLetterTemplateId;
    language: CoverLetterLanguageId;
  } {
    const name = input.profile.fullName?.trim();
    if (!name) {
      throw new Error("Full name is required on your profile.");
    }

    const template = input.template ?? "professional";
    const language = input.language ?? "en";
    const job = input.job ?? {};

    const header = [
      name,
      [input.profile.email, input.profile.phone].filter(Boolean).join(" | "),
      input.profile.currentCountry
        ? `Current location: ${input.profile.currentCountry}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const content = [
      header,
      "",
      greeting(language, job.company),
      "",
      buildBody(template, input.profile, job),
      "",
      closing(language, name),
    ].join("\n");

    return { content: content.trim(), template, language };
  },

  async toPdf(title: string, body: string): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const margin = 54;
    const fontSize = 11;
    const lineHeight = 16;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const maxWidth = pageWidth - margin * 2;

    let page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const ensureSpace = () => {
      if (y < margin + lineHeight) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    };

    const drawWrapped = (text: string, bold = false, size = fontSize) => {
      const active = bold ? fontBold : font;
      const words = text.split(/\s+/).filter(Boolean);
      let current = "";
      const flush = (line: string) => {
        ensureSpace();
        page.drawText(line, {
          x: margin,
          y,
          size,
          font: active,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
      };
      if (!words.length) {
        y -= lineHeight / 2;
        return;
      }
      for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (active.widthOfTextAtSize(next, size) > maxWidth && current) {
          flush(current);
          current = word;
        } else {
          current = next;
        }
      }
      if (current) flush(current);
    };

    drawWrapped(title, true, 14);
    y -= 8;

    for (const raw of body.split("\n")) {
      if (!raw.trim()) {
        y -= lineHeight / 2;
        continue;
      }
      drawWrapped(raw);
    }

    return doc.save();
  },
};
