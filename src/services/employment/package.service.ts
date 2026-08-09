import type { Prisma } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ResumeCountryVariant =
  | "gulf"
  | "europe"
  | "japan"
  | "asia"
  | "generic";

export type PackageDocumentItem = {
  id: string;
  kind: string;
  label: string;
  fileName: string;
  uploadedAt?: string | null;
};

export type PackageCollectionStatus = {
  resume: boolean;
  coverLetter: boolean;
  passport: boolean;
  passportDocument: boolean;
  certificates: boolean;
  experience: boolean;
  education: boolean;
  readyCount: number;
  totalCount: number;
};

export type ApplicationPackage = {
  professionalCv: string;
  atsResume: string;
  countryResume: string;
  countryVariant: ResumeCountryVariant;
  countryLabel: string;
  coverLetter: string;
  coverLetterVersionId?: string | null;
  applicationSummary: string;
  requiredDocuments: string[];
  /** Uploaded documents included in the package inventory */
  documents: PackageDocumentItem[];
  /** Verified profile snapshot organized for preview/submit */
  profileSnapshot: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    nationality: string | null;
    passportNumber: string | null;
    passportExpiry: string | null;
    education: unknown;
    experience: unknown;
    certifications: unknown;
    languages: unknown;
    skills: string[];
  };
  collection: PackageCollectionStatus;
  targetJob?: {
    title: string | null;
    company: string | null;
    country: string | null;
  } | null;
  generatedAt: string;
  /** True when content was edited by the user after generation */
  userEdited?: boolean;
  editedAt?: string;
};

export type ResumeProfileInput = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  currentAddress?: string | null;
  currentCity?: string | null;
  currentCountry?: string | null;
  nationality?: string | null;
  dateOfBirth?: Date | string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  preferredCountries?: string[];
  preferredIndustries?: string[];
  preferredSalary?: number | null;
  preferredSalaryCurrency?: string | null;
  preferredJobType?: string | null;
  skills?: string[];
  customSkills?: string[];
  education?: unknown;
  experience?: unknown;
  languages?: unknown;
  certifications?: unknown;
  passportNumber?: string | null;
  passportExpiry?: Date | string | null;
  hasDrivingLicense?: boolean | null;
};

type TargetJob = {
  title?: string;
  company?: string;
  country?: string;
} | null;

function present(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function line(...parts: Array<string | null | undefined>) {
  return parts.filter((p) => present(p)).join(" | ");
}

function fmtDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toISOString().slice(0, 10);
}

function allSkills(profile: ResumeProfileInput) {
  return Array.from(
    new Set(
      [...(profile.skills ?? []), ...(profile.customSkills ?? [])].filter(
        (s) => present(s),
      ),
    ),
  );
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function listExperience(experience: unknown): string[] {
  return asRecords(experience)
    .map((e) => {
      const position = String(e.position ?? "").trim();
      const employer = String(e.employer ?? "").trim();
      const years = e.years != null && String(e.years).trim() ? String(e.years) : "";
      const responsibilities = String(e.responsibilities ?? "").trim();
      if (!position && !employer) return null;
      const head = [position || null, employer ? `at ${employer}` : null, years ? `(${years} yrs)` : null]
        .filter(Boolean)
        .join(" ");
      return responsibilities ? `- ${head}\n  ${responsibilities}` : `- ${head}`;
    })
    .filter(Boolean) as string[];
}

function listEducation(education: unknown): string[] {
  return asRecords(education)
    .map((e) => {
      const level = String(e.level ?? "").trim();
      const institution = String(e.institution ?? "").trim();
      const year = e.graduationYear != null ? String(e.graduationYear) : "";
      const gpa = e.gpa != null && String(e.gpa).trim() ? String(e.gpa) : "";
      if (!level && !institution) return null;
      const parts = [
        level || null,
        institution || null,
        year || null,
        gpa ? `GPA ${gpa}` : null,
      ].filter(Boolean);
      return `- ${parts.join(" — ")}`;
    })
    .filter(Boolean) as string[];
}

function listLanguages(languages: unknown): string[] {
  return asRecords(languages)
    .map((l) => {
      const language = String(l.language ?? "").trim();
      if (!language) return null;
      const level = String(l.level ?? "").trim();
      const score = String(l.score ?? "").trim();
      const extras = [level, score].filter(Boolean).join(", ");
      return extras ? `- ${language} (${extras})` : `- ${language}`;
    })
    .filter(Boolean) as string[];
}

function listCertifications(certifications: unknown): string[] {
  return asRecords(certifications)
    .map((c) => {
      const name = String(c.name ?? "").trim();
      if (!name) return null;
      const issuer = String(c.issuer ?? "").trim();
      const year = c.year != null ? String(c.year) : "";
      const expiry = String(c.expiry ?? "").trim();
      const parts = [name, issuer, year, expiry ? `exp ${expiry}` : null].filter(
        Boolean,
      );
      return `- ${parts.join(" — ")}`;
    })
    .filter(Boolean) as string[];
}

function section(title: string, lines: string[]): string {
  if (lines.length === 0) return "";
  return `${title}\n${lines.join("\n")}`;
}

function contactBlock(profile: ResumeProfileInput) {
  const lines = [
    profile.fullName?.trim() || null,
    line(profile.email, profile.phone),
    line(
      profile.currentAddress,
      profile.currentCity,
      profile.currentCountry,
    ),
    line(
      profile.nationality ? `Nationality: ${profile.nationality}` : null,
      profile.gender ? `Gender: ${profile.gender}` : null,
      profile.maritalStatus ? `Marital status: ${profile.maritalStatus}` : null,
    ),
    line(
      profile.dateOfBirth
        ? `Date of birth: ${fmtDate(profile.dateOfBirth)}`
        : null,
      profile.hasDrivingLicense ? "Driving license: Yes" : null,
    ),
    line(
      profile.passportNumber
        ? `Passport: ${profile.passportNumber}`
        : null,
      profile.passportExpiry
        ? `Expiry: ${fmtDate(profile.passportExpiry)}`
        : null,
    ),
  ].filter(Boolean) as string[];
  return lines.join("\n");
}

function resolveCountryVariant(
  countryHint?: string | null,
  preferred: string[] = [],
): { variant: ResumeCountryVariant; label: string } {
  const hay = [countryHint, ...preferred]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /united arab emirates|saudi|qatar|kuwait|oman|bahrain|\bae\b|\bsa\b|\bqa\b|\bkw\b|\bom\b|\bbh\b|gulf|middle east/.test(
      hay,
    )
  ) {
    return { variant: "gulf", label: "Gulf / Middle East" };
  }
  if (/germany|deutschland|\bde\b|europe|netherlands|france|\bgb\b|united kingdom/.test(hay)) {
    return { variant: "europe", label: "Europe (Germany-focused)" };
  }
  if (/japan|\bjp\b|tokyo|osaka/.test(hay)) {
    return { variant: "japan", label: "Japan" };
  }
  if (/singapore|\bsg\b|malaysia|\bmy\b|korea|\bkr\b|asia/.test(hay)) {
    return { variant: "asia", label: "Asia (SG / MY / KR)" };
  }
  return { variant: "generic", label: "International" };
}

function buildProfessional(profile: ResumeProfileInput, target: TargetJob) {
  const skills = allSkills(profile);
  const blocks = [
    contactBlock(profile),
    section(
      "OBJECTIVE",
      target?.title
        ? [
            `Seeking ${target.title}${target.company ? ` at ${target.company}` : ""}${target.country ? ` (${target.country})` : ""}`.trim(),
          ]
        : profile.preferredCountries?.length
          ? [
              `Seeking overseas employment in ${(profile.preferredCountries ?? []).join(", ")}`,
            ]
          : [],
    ),
    section("EXPERIENCE", listExperience(profile.experience)),
    section("EDUCATION", listEducation(profile.education)),
    section(
      "SKILLS",
      skills.length ? [skills.join(", ")] : [],
    ),
    section("LANGUAGES", listLanguages(profile.languages)),
    section("CERTIFICATIONS", listCertifications(profile.certifications)),
    section(
      "PREFERENCES",
      [
        profile.preferredIndustries?.length
          ? `Industries: ${profile.preferredIndustries.join(", ")}`
          : null,
        profile.preferredJobType
          ? `Job type: ${profile.preferredJobType}`
          : null,
        profile.preferredSalary != null
          ? `Preferred salary: ${profile.preferredSalaryCurrency ?? "USD"} ${profile.preferredSalary}`
          : null,
      ].filter(Boolean) as string[],
    ),
  ].filter(Boolean);

  return blocks.join("\n\n").trim();
}

function buildAts(profile: ResumeProfileInput, target: TargetJob) {
  const skills = allSkills(profile);
  const years = asRecords(profile.experience).reduce((sum, item) => {
    const y = Number(item.years ?? 0);
    return sum + (Number.isFinite(y) ? y : 0);
  }, 0);

  const rows: Array<[string, string]> = [
    ["NAME", profile.fullName?.trim() ?? ""],
    ["EMAIL", profile.email?.trim() ?? ""],
    ["PHONE", profile.phone?.trim() ?? ""],
    ["CITY", profile.currentCity?.trim() ?? ""],
    ["COUNTRY", profile.currentCountry?.trim() ?? ""],
    ["NATIONALITY", profile.nationality?.trim() ?? ""],
    ["DATE_OF_BIRTH", fmtDate(profile.dateOfBirth) ?? ""],
    ["PASSPORT", profile.passportNumber?.trim() ?? ""],
    ["PASSPORT_EXPIRY", fmtDate(profile.passportExpiry) ?? ""],
    [
      "TARGET_ROLE",
      target?.title
        ? `${target.title}${target.company ? ` | ${target.company}` : ""}${target.country ? ` | ${target.country}` : ""}`
        : "",
    ],
    ["SKILLS", skills.join("; ")],
    ["EXPERIENCE_YEARS", years > 0 ? String(years) : ""],
    [
      "EXPERIENCE",
      listExperience(profile.experience)
        .map((l) => l.replace(/^- /, "").replace(/\n\s+/g, " "))
        .join(" || "),
    ],
    [
      "EDUCATION",
      listEducation(profile.education)
        .map((l) => l.replace(/^- /, ""))
        .join(" || "),
    ],
    [
      "LANGUAGES",
      listLanguages(profile.languages)
        .map((l) => l.replace(/^- /, ""))
        .join(" || "),
    ],
    [
      "CERTIFICATIONS",
      listCertifications(profile.certifications)
        .map((l) => l.replace(/^- /, ""))
        .join(" || "),
    ],
    [
      "PREFERRED_COUNTRIES",
      (profile.preferredCountries ?? []).join("; "),
    ],
    [
      "PREFERRED_INDUSTRIES",
      (profile.preferredIndustries ?? []).join("; "),
    ],
  ];

  return rows
    .filter(([, v]) => present(v))
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function buildCountryResume(
  profile: ResumeProfileInput,
  target: TargetJob,
  variant: ResumeCountryVariant,
) {
  const skills = allSkills(profile);
  const personal: string[] = [];
  if (present(profile.fullName)) personal.push(profile.fullName!.trim());
  if (present(profile.nationality))
    personal.push(`Nationality: ${profile.nationality}`);
  if (present(profile.dateOfBirth))
    personal.push(`DOB: ${fmtDate(profile.dateOfBirth)}`);
  if (present(profile.gender)) personal.push(`Gender: ${profile.gender}`);
  if (present(profile.maritalStatus))
    personal.push(`Marital status: ${profile.maritalStatus}`);
  if (present(profile.passportNumber))
    personal.push(`Passport: ${profile.passportNumber}`);
  if (present(profile.passportExpiry))
    personal.push(`Passport expiry: ${fmtDate(profile.passportExpiry)}`);
  if (profile.hasDrivingLicense) personal.push("Driving license: Yes");
  personal.push(
    ...[
      line(profile.email, profile.phone),
      line(profile.currentAddress, profile.currentCity, profile.currentCountry),
    ].filter(Boolean),
  );

  const order: string[] = [];

  if (variant === "gulf") {
    order.push(
      section("PERSONAL DETAILS", personal),
      section(
        "POSITION APPLIED",
        target?.title
          ? [
              `${target.title}${target.company ? ` — ${target.company}` : ""}${target.country ? ` (${target.country})` : ""}`,
            ]
          : [],
      ),
      section("WORK EXPERIENCE", listExperience(profile.experience)),
      section("EDUCATION", listEducation(profile.education)),
      section("SKILLS", skills.length ? [skills.join(", ")] : []),
      section("LANGUAGES", listLanguages(profile.languages)),
      section("CERTIFICATES", listCertifications(profile.certifications)),
    );
  } else if (variant === "europe") {
    order.push(
      section("PERSONAL INFORMATION", personal),
      section("WORK EXPERIENCE", listExperience(profile.experience)),
      section("EDUCATION AND TRAINING", listEducation(profile.education)),
      section("LANGUAGE COMPETENCES", listLanguages(profile.languages)),
      section(
        "DIGITAL / JOB SKILLS",
        skills.length ? [skills.join(", ")] : [],
      ),
      section(
        "ADDITIONAL CERTIFICATIONS",
        listCertifications(profile.certifications),
      ),
    );
  } else if (variant === "japan") {
    order.push(
      section("基本情報 / PERSONAL", personal),
      section("希望職種 / DESIRED ROLE", target?.title ? [target.title] : []),
      section("職歴 / WORK HISTORY", listExperience(profile.experience)),
      section("学歴 / EDUCATION", listEducation(profile.education)),
      section("語学 / LANGUAGES", listLanguages(profile.languages)),
      section("資格 / CERTIFICATIONS", listCertifications(profile.certifications)),
      section("スキル / SKILLS", skills.length ? [skills.join(", ")] : []),
    );
  } else if (variant === "asia") {
    order.push(
      section("PROFILE", personal),
      section("CAREER OBJECTIVE", target?.title ? [target.title] : []),
      section("EMPLOYMENT HISTORY", listExperience(profile.experience)),
      section("ACADEMIC QUALIFICATIONS", listEducation(profile.education)),
      section("SKILLS", skills.length ? [skills.join(", ")] : []),
      section("LANGUAGES", listLanguages(profile.languages)),
      section("CERTIFICATIONS", listCertifications(profile.certifications)),
    );
  } else {
    order.push(
      section("CONTACT", personal),
      section("EXPERIENCE", listExperience(profile.experience)),
      section("EDUCATION", listEducation(profile.education)),
      section("SKILLS", skills.length ? [skills.join(", ")] : []),
      section("LANGUAGES", listLanguages(profile.languages)),
      section("CERTIFICATIONS", listCertifications(profile.certifications)),
    );
  }

  const body = order.filter(Boolean).join("\n\n").trim();
  const note =
    "\n\n---\nGenerated from verified worker profile fields only. Empty sections omitted.";
  return `${body}${note}`;
}

function buildCoverLetter(profile: ResumeProfileInput, target: TargetJob) {
  const name = profile.fullName?.trim();
  if (!name) return "";

  const facts: string[] = [];
  const skills = allSkills(profile).slice(0, 6);
  const years = asRecords(profile.experience).reduce((sum, item) => {
    const y = Number(item.years ?? 0);
    return sum + (Number.isFinite(y) ? y : 0);
  }, 0);
  const langs = listLanguages(profile.languages)
    .map((l) => l.replace(/^- /, ""))
    .slice(0, 4);

  if (target?.title) {
    facts.push(
      `I am applying for ${target.title}${target.company ? ` at ${target.company}` : ""}${target.country ? ` in ${target.country}` : ""}.`,
    );
  } else if (profile.preferredCountries?.length) {
    facts.push(
      `I am seeking overseas employment opportunities in ${profile.preferredCountries.join(", ")}.`,
    );
  } else {
    facts.push("I am seeking overseas employment opportunities.");
  }

  if (years > 0) facts.push(`Recorded work experience totals ${years} year(s).`);
  if (skills.length) facts.push(`Verified skills on my profile: ${skills.join(", ")}.`);
  if (langs.length) facts.push(`Languages on file: ${langs.join("; ")}.`);

  const education = listEducation(profile.education);
  if (education.length) {
    facts.push(
      `Education on file: ${education
        .map((l) => l.replace(/^- /, ""))
        .slice(0, 2)
        .join("; ")}.`,
    );
  }

  facts.push(
    "This letter uses only information stored on my worker profile; no additional claims are made.",
  );

  return `Dear Hiring Manager,

${facts.join(" ")}

Sincerely,
${name}`.trim();
}

function buildSummary(
  profile: ResumeProfileInput,
  target: TargetJob,
  uploadedDocLabels: string[],
  countryLabel: string,
) {
  const skills = allSkills(profile);
  const lines = [
    profile.fullName ? `Applicant: ${profile.fullName}` : null,
    target?.title
      ? `Target: ${target.title}${target.company ? ` at ${target.company}` : ""}${target.country ? ` (${target.country})` : ""}`
      : null,
    profile.preferredCountries?.length
      ? `Preferred countries: ${profile.preferredCountries.join(", ")}`
      : null,
    `Resume layout: ${countryLabel}`,
    skills.length ? `Skills on file: ${skills.join(", ")}` : null,
    uploadedDocLabels.length
      ? `Documents on file: ${uploadedDocLabels.join(", ")}`
      : "Documents on file: none listed",
    "Source: verified WorkerProfile fields only",
  ].filter(Boolean) as string[];
  return lines.join("\n");
}

function computeCollection(input: {
  hasResume: boolean;
  hasCoverLetter: boolean;
  profile: ResumeProfileInput;
  documents: PackageDocumentItem[];
}): PackageCollectionStatus {
  const kinds = new Set(input.documents.map((d) => d.kind));
  const education = asRecords(input.profile.education);
  const experience = asRecords(input.profile.experience);
  const certifications = asRecords(input.profile.certifications);
  const hasCertDoc = [...kinds].some((k) =>
    [
      "TRAINING_CERTIFICATE",
      "DEGREE",
      "DIPLOMA",
      "LANGUAGE_CERTIFICATE",
      "TRADE_LICENSE",
    ].includes(k),
  );

  const status = {
    resume: input.hasResume,
    coverLetter: input.hasCoverLetter,
    passport: !!input.profile.passportNumber?.trim(),
    passportDocument: kinds.has("PASSPORT"),
    certificates: certifications.length > 0 || hasCertDoc,
    experience: experience.length > 0,
    education: education.length > 0,
  };

  const flags = Object.values(status);
  return {
    ...status,
    readyCount: flags.filter(Boolean).length,
    totalCount: flags.length,
  };
}

export const employmentPackageService = {
  computeCollection,

  build(
    profile: ResumeProfileInput,
    targetJob: TargetJob = null,
    uploadedDocLabels: string[] = [],
    extras?: {
      coverLetter?: string | null;
      coverLetterVersionId?: string | null;
      documents?: PackageDocumentItem[];
    },
  ): ApplicationPackage {
    const countryHint =
      targetJob?.country ?? profile.preferredCountries?.[0] ?? null;
    const { variant, label } = resolveCountryVariant(
      countryHint,
      profile.preferredCountries ?? [],
    );

    const professionalCv = buildProfessional(profile, targetJob);
    const atsResume = buildAts(profile, targetJob);
    const countryResume = buildCountryResume(profile, targetJob, variant);
    const coverLetter =
      extras?.coverLetter?.trim() || buildCoverLetter(profile, targetJob);
    const documents = extras?.documents ?? [];

    const collection = computeCollection({
      hasResume: !!(professionalCv || atsResume || countryResume),
      hasCoverLetter: !!coverLetter.trim(),
      profile,
      documents,
    });

    const summaryExtra = [
      buildSummary(profile, targetJob, uploadedDocLabels, label),
      "",
      "PACKAGE CONTENTS",
      `Resume: ${collection.resume ? "ready" : "missing"}`,
      `Cover letter: ${collection.coverLetter ? "ready" : "missing"}`,
      `Passport details: ${collection.passport ? "ready" : "missing"}`,
      `Passport document: ${collection.passportDocument ? "uploaded" : "missing"}`,
      `Certificates: ${collection.certificates ? "ready" : "missing"}`,
      `Experience: ${collection.experience ? "ready" : "missing"}`,
      `Education: ${collection.education ? "ready" : "missing"}`,
      `Collection: ${collection.readyCount}/${collection.totalCount}`,
    ].join("\n");

    return {
      professionalCv,
      atsResume,
      countryResume,
      countryVariant: variant,
      countryLabel: label,
      coverLetter,
      coverLetterVersionId: extras?.coverLetterVersionId ?? null,
      applicationSummary: summaryExtra,
      requiredDocuments: [
        "Passport",
        "CV / Resume",
        "Experience Letter",
        "Police Clearance",
        "Medical Certificate",
        "Language Certificates (if applicable)",
      ],
      documents,
      profileSnapshot: {
        fullName: profile.fullName?.trim() ?? null,
        email: profile.email?.trim() ?? null,
        phone: profile.phone?.trim() ?? null,
        nationality: profile.nationality?.trim() ?? null,
        passportNumber: profile.passportNumber?.trim() ?? null,
        passportExpiry: fmtDate(profile.passportExpiry),
        education: profile.education ?? [],
        experience: profile.experience ?? [],
        certifications: profile.certifications ?? [],
        languages: profile.languages ?? [],
        skills: allSkills(profile),
      },
      collection,
      targetJob: targetJob
        ? {
            title: targetJob.title ?? null,
            company: targetJob.company ?? null,
            country: targetJob.country ?? null,
          }
        : null,
      generatedAt: new Date().toISOString(),
      userEdited: false,
    };
  },

  parseStored(value: unknown): ApplicationPackage | null {
    if (!value || typeof value !== "object") return null;
    const v = value as Partial<ApplicationPackage>;
    if (!v.professionalCv && !v.atsResume && !v.coverLetter) return null;

    const profile = (v.profileSnapshot ?? {
      fullName: null,
      email: null,
      phone: null,
      nationality: null,
      passportNumber: null,
      passportExpiry: null,
      education: [],
      experience: [],
      certifications: [],
      languages: [],
      skills: [],
    }) as ApplicationPackage["profileSnapshot"];

    const documents = Array.isArray(v.documents) ? v.documents : [];
    const collection =
      v.collection ??
      computeCollection({
        hasResume: !!(v.professionalCv || v.atsResume || v.countryResume),
        hasCoverLetter: !!v.coverLetter?.trim(),
        profile: {
          fullName: profile.fullName,
          passportNumber: profile.passportNumber,
          education: profile.education,
          experience: profile.experience,
          certifications: profile.certifications,
        },
        documents,
      });

    return {
      professionalCv: v.professionalCv ?? "",
      atsResume: v.atsResume ?? "",
      countryResume: v.countryResume ?? "",
      countryVariant: v.countryVariant ?? "generic",
      countryLabel: v.countryLabel ?? "International",
      coverLetter: v.coverLetter ?? "",
      coverLetterVersionId: v.coverLetterVersionId ?? null,
      applicationSummary: v.applicationSummary ?? "",
      requiredDocuments: v.requiredDocuments ?? [],
      documents,
      profileSnapshot: profile,
      collection,
      targetJob: v.targetJob ?? null,
      generatedAt: v.generatedAt ?? new Date(0).toISOString(),
      userEdited: !!v.userEdited,
      editedAt: v.editedAt,
    };
  },

  toJson(pkg: ApplicationPackage): Prisma.InputJsonValue {
    return pkg as unknown as Prisma.InputJsonValue;
  },

  async toPdf(
    title: string,
    body: string,
    fileLabel: string,
  ): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const margin = 50;
    const fontSize = 10;
    const titleSize = 14;
    const lineHeight = 14;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const maxWidth = pageWidth - margin * 2;

    let page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const drawWrapped = (
      text: string,
      useBold = false,
      size = fontSize,
    ) => {
      const active = useBold ? fontBold : font;
      const words = text.split(/\s+/).filter(Boolean);
      let current = "";
      const flush = (line: string) => {
        if (y < margin + lineHeight) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, {
          x: margin,
          y,
          size,
          font: active,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
      };

      if (words.length === 0) {
        y -= lineHeight / 2;
        return;
      }

      for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        const width = active.widthOfTextAtSize(next, size);
        if (width > maxWidth && current) {
          flush(current);
          current = word;
        } else {
          current = next;
        }
      }
      if (current) flush(current);
    };

    drawWrapped(title || fileLabel, true, titleSize);
    y -= 6;
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 1,
      color: rgb(0.75, 0.75, 0.75),
    });
    y -= lineHeight;

    for (const raw of body.split("\n")) {
      const lineText = raw.replace(/\t/g, "  ");
      if (!lineText.trim()) {
        y -= lineHeight / 2;
        continue;
      }
      const isHeading =
        /^[A-Z][A-Z0-9 /_&()-]{2,}$/.test(lineText.trim()) ||
        lineText.trim().endsWith(":") ||
        /基本情報|職歴|学歴|語学|資格|スキル|希望職種/.test(lineText);
      if (lineText.length > 110 && !lineText.includes(" ")) {
        const chunks =
          lineText.match(new RegExp(`.{1,100}`, "g")) ?? [lineText];
        for (const chunk of chunks) drawWrapped(chunk, false, fontSize);
      } else {
        drawWrapped(lineText, isHeading && lineText.length < 60, fontSize);
      }
    }

    return doc.save();
  },
};
