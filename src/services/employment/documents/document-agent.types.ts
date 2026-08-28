import { z } from "zod";

/** Minimum confidence (0–100) required for automatic profile update without user review. */
export const DOCUMENT_AGENT_CONFIDENCE_THRESHOLD = 90;

export const educationEntrySchema = z.object({
  level: z.string().nullable(),
  institution: z.string().nullable(),
  graduationYear: z.union([z.string(), z.number()]).nullable(),
  gpa: z.union([z.string(), z.number()]).nullable(),
  fieldOfStudy: z.string().nullable().optional(),
});

export const experienceEntrySchema = z.object({
  employer: z.string().nullable(),
  position: z.string().nullable(),
  years: z.union([z.string(), z.number()]).nullable(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  responsibilities: z.string().nullable(),
  isCurrent: z.boolean().nullable().optional(),
});

export const certificateEntrySchema = z.object({
  name: z.string().nullable(),
  issuer: z.string().nullable(),
  year: z.union([z.string(), z.number()]).nullable(),
  expiry: z.string().nullable().optional(),
});

export const languageScoreSchema = z.object({
  language: z.string().nullable(),
  level: z.string().nullable(),
  score: z.string().nullable(),
  testType: z.string().nullable().optional(),
});

export const passportDetailsSchema = z.object({
  fullName: z.string().nullable(),
  nationality: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  passportNumber: z.string().nullable(),
  passportExpiry: z.string().nullable(),
  passportIssueDate: z.string().nullable().optional(),
  passportIssuingCountry: z.string().nullable().optional(),
});

/**
 * Structured JSON returned by the AI Document Agent.
 * Only fields grounded in OCR text should be non-null.
 */
export const documentAgentResultSchema = z.object({
  confidence: z.number().min(0).max(100),
  documentType: z.string(),
  education: z.array(educationEntrySchema).default([]),
  experience: z.array(experienceEntrySchema).default([]),
  employmentHistory: z.array(experienceEntrySchema).default([]),
  skills: z.array(z.string()).default([]),
  certificates: z.array(certificateEntrySchema).default([]),
  passportDetails: passportDetailsSchema.default({
    fullName: null,
    nationality: null,
    dateOfBirth: null,
    passportNumber: null,
    passportExpiry: null,
  }),
  languageScores: z.array(languageScoreSchema).default([]),
  unsupportedClaims: z.array(z.string()).default([]),
  sourceQuotes: z.record(z.string()).default({}),
  notes: z.string().nullable().optional(),
});

export type DocumentAgentResult = z.infer<typeof documentAgentResultSchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type CertificateEntry = z.infer<typeof certificateEntrySchema>;
export type LanguageScore = z.infer<typeof languageScoreSchema>;
export type PassportDetails = z.infer<typeof passportDetailsSchema>;

/** @deprecated use DocumentAgentResult — kept for pipeline compatibility */
export type ExtractedDocumentData = DocumentAgentResult & {
  fullName?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  passportNumber?: string | null;
  passportExpiry?: string | null;
  institution?: string | null;
  graduationYear?: string | number | null;
  gpa?: string | number | null;
  employer?: string | null;
  position?: string | null;
  yearsExperience?: number | null;
  languages?: LanguageScore[];
  certifications?: CertificateEntry[];
  rawSummary?: string | null;
};
