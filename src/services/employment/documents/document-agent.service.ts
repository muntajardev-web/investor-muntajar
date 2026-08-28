import { openaiConfig } from "@/config";
import { logger } from "@/lib";
import {
  auditedChatCompletion,
  recordAiAudit,
  recordSkippedAiAction,
  setAiAuditUserApproval,
  summarizeAiText,
} from "@/services/ai/ai-audit.service";
import {
  DOCUMENT_AGENT_CONFIDENCE_THRESHOLD,
  documentAgentResultSchema,
  type DocumentAgentResult,
} from "./document-agent.types";

const SYSTEM_PROMPT = `You are the Muntajar AI Document Agent for overseas employment.

STRICT RULES:
1. Return ONLY valid JSON. No markdown. No prose outside JSON.
2. NEVER hallucinate. Every non-null value MUST be explicitly supported by the OCR text.
3. If a field is not clearly present in the OCR text, set it to null or omit it from arrays.
4. confidence is an integer 0-100 reflecting how sure you are that extracted fields are correct and grounded.
5. If OCR text is thin, noisy, or filename-only, confidence MUST be below 90.
6. Put any inferred-but-unsupported ideas into unsupportedClaims — do NOT put them in structured fields.
7. sourceQuotes maps field paths to short verbatim OCR snippets that justify the value.
8. employmentHistory and experience should contain the same employment records when present.
9. Extract: education, experience/employmentHistory, skills, certificates, passportDetails, languageScores.

JSON SHAPE:
{
  "confidence": 0-100,
  "documentType": "PASSPORT|SSC|...",
  "education": [{ "level", "institution", "graduationYear", "gpa", "fieldOfStudy" }],
  "experience": [{ "employer", "position", "years", "startDate", "endDate", "responsibilities", "isCurrent" }],
  "employmentHistory": [same as experience],
  "skills": ["..."],
  "certificates": [{ "name", "issuer", "year", "expiry" }],
  "passportDetails": {
    "fullName", "nationality", "dateOfBirth",
    "passportNumber", "passportExpiry", "passportIssueDate", "passportIssuingCountry"
  },
  "languageScores": [{ "language", "level", "score", "testType" }],
  "unsupportedClaims": [],
  "sourceQuotes": { "passportDetails.passportNumber": "..." },
  "notes": null
}`;

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isGrounded(ocrText: string, value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "boolean") return true;
  if (typeof value === "number") {
    return ocrText.includes(String(value));
  }
  const str = String(value).trim();
  if (!str) return true;
  const ocrNorm = normalizeText(ocrText);
  const valNorm = normalizeText(str);
  if (valNorm.length < 3) return ocrText.toLowerCase().includes(str.toLowerCase());
  return ocrNorm.includes(valNorm) || ocrText.toLowerCase().includes(str.toLowerCase());
}

function scrubUngroundedFields(
  result: DocumentAgentResult,
  ocrText: string,
): DocumentAgentResult {
  const unsupported = [...(result.unsupportedClaims ?? [])];

  const scrubString = (path: string, value: string | null | undefined) => {
    if (value == null || value === "") return null;
    if (isGrounded(ocrText, value)) return value;
    unsupported.push(`${path} not found in OCR: ${value}`);
    return null;
  };

  const passport = { ...result.passportDetails };
  passport.fullName = scrubString("passportDetails.fullName", passport.fullName);
  passport.nationality = scrubString(
    "passportDetails.nationality",
    passport.nationality,
  );
  passport.dateOfBirth = scrubString(
    "passportDetails.dateOfBirth",
    passport.dateOfBirth,
  );
  passport.passportNumber = scrubString(
    "passportDetails.passportNumber",
    passport.passportNumber,
  );
  passport.passportExpiry = scrubString(
    "passportDetails.passportExpiry",
    passport.passportExpiry,
  );
  passport.passportIssueDate = scrubString(
    "passportDetails.passportIssueDate",
    passport.passportIssueDate ?? null,
  );
  passport.passportIssuingCountry = scrubString(
    "passportDetails.passportIssuingCountry",
    passport.passportIssuingCountry ?? null,
  );

  const education = result.education
    .map((e) => ({
      level: scrubString("education.level", e.level),
      institution: scrubString("education.institution", e.institution),
      graduationYear: isGrounded(ocrText, e.graduationYear)
        ? e.graduationYear
        : null,
      gpa: isGrounded(ocrText, e.gpa) ? e.gpa : null,
      fieldOfStudy: scrubString(
        "education.fieldOfStudy",
        e.fieldOfStudy ?? null,
      ),
    }))
    .filter((e) => e.level || e.institution);

  const scrubExperience = (list: DocumentAgentResult["experience"]) =>
    list
      .map((e) => ({
        employer: scrubString("experience.employer", e.employer),
        position: scrubString("experience.position", e.position),
        years: isGrounded(ocrText, e.years) ? e.years : null,
        startDate: scrubString("experience.startDate", e.startDate ?? null),
        endDate: scrubString("experience.endDate", e.endDate ?? null),
        responsibilities: scrubString(
          "experience.responsibilities",
          e.responsibilities,
        ),
        isCurrent: e.isCurrent ?? null,
      }))
      .filter((e) => e.employer || e.position);

  const experience = scrubExperience(result.experience);
  const employmentHistory = scrubExperience(
    result.employmentHistory.length ? result.employmentHistory : result.experience,
  );

  const skills = result.skills.filter((s) => {
    if (isGrounded(ocrText, s)) return true;
    unsupported.push(`skill not found in OCR: ${s}`);
    return false;
  });

  const certificates = result.certificates
    .map((c) => ({
      name: scrubString("certificates.name", c.name),
      issuer: scrubString("certificates.issuer", c.issuer),
      year: isGrounded(ocrText, c.year) ? c.year : null,
      expiry: scrubString("certificates.expiry", c.expiry ?? null),
    }))
    .filter((c) => c.name);

  const languageScores = result.languageScores
    .map((l) => ({
      language: scrubString("languageScores.language", l.language),
      level: scrubString("languageScores.level", l.level),
      score: scrubString("languageScores.score", l.score),
      testType: scrubString("languageScores.testType", l.testType ?? null),
    }))
    .filter((l) => l.language);

  let confidence = Math.round(result.confidence);
  if (ocrText.length < 40 || ocrText.startsWith("Document filename:")) {
    confidence = Math.min(confidence, 55);
  }
  if (unsupported.length > 0) {
    confidence = Math.min(confidence, 88);
  }
  if (
    !passport.passportNumber &&
    education.length === 0 &&
    experience.length === 0 &&
    skills.length === 0 &&
    certificates.length === 0 &&
    languageScores.length === 0
  ) {
    confidence = Math.min(confidence, 40);
  }

  return {
    ...result,
    confidence,
    education,
    experience,
    employmentHistory,
    skills,
    certificates,
    passportDetails: passport,
    languageScores,
    unsupportedClaims: unsupported,
  };
}

function heuristicExtract(input: {
  kind: string;
  fileName: string;
  ocrText: string;
}): DocumentAgentResult {
  const text = input.ocrText;
  const passportMatch = text.match(
    /passport\s*(?:no|number|#)?[:\s]*([A-Z0-9]{6,12})/i,
  );
  const nameMatch = text.match(
    /(?:name|full name)[:\s]+([A-Za-z][A-Za-z .'-]{2,60})/i,
  );
  const ieltsMatch = text.match(/ielts[:\s]*([0-9](?:\.[0-9])?)/i);

  const base: DocumentAgentResult = {
    confidence: text.length > 80 ? 62 : 35,
    documentType: input.kind,
    education: [],
    experience: [],
    employmentHistory: [],
    skills: [],
    certificates: [],
    passportDetails: {
      fullName: nameMatch?.[1]?.trim() ?? null,
      nationality: null,
      dateOfBirth: null,
      passportNumber: passportMatch?.[1]?.toUpperCase() ?? null,
      passportExpiry: null,
    },
    languageScores: ieltsMatch
      ? [
          {
            language: "English",
            level: null,
            score: ieltsMatch[1],
            testType: "IELTS",
          },
        ]
      : [],
    unsupportedClaims: [],
    sourceQuotes: {},
    notes: "Heuristic extraction (AI unavailable or low OCR yield)",
  };

  return scrubUngroundedFields(base, text);
}

/**
 * AI Document Agent — reads OCR text and returns structured JSON only.
 * Never hallucinates: ungrounded values are scrubbed and confidence reduced.
 */
export async function runDocumentAgent(input: {
  kind: string;
  fileName: string;
  ocrText: string;
  userId?: string;
  documentId?: string;
}): Promise<DocumentAgentResult> {
  const ocrText = input.ocrText?.trim() || `Document filename: ${input.fileName}`;
  const auditCtx = {
    action: "DOCUMENT_AGENT" as const,
    userId: input.userId,
    entityType: "EmploymentDocument",
    entityId: input.documentId,
    inputSummary: summarizeAiText(
      `${input.kind} · ${input.fileName} · ${ocrText.slice(0, 200)}`,
    ),
  };

  if (!openaiConfig.apiKey || openaiConfig.apiKey.startsWith("sk-dev")) {
    const result = heuristicExtract({ ...input, ocrText });
    await recordSkippedAiAction({
      ...auditCtx,
      model: openaiConfig.model,
      provider: "openai",
      reason: "OpenAI not configured — heuristic extract",
      outputSummary: summarizeAiText(result),
      userApproval:
        result.confidence < DOCUMENT_AGENT_CONFIDENCE_THRESHOLD
          ? "PENDING"
          : "NOT_REQUIRED",
    });
    return result;
  }

  try {
    const completion = await auditedChatCompletion(
      {
        ...auditCtx,
        userApproval: "PENDING",
      },
      {
        model: openaiConfig.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              kind: input.kind,
              fileName: input.fileName,
              ocrText: ocrText.slice(0, 14000),
              instruction:
                "Extract only what is explicitly present. Return structured JSON.",
            }),
          },
        ],
      },
    );

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    const validated = documentAgentResultSchema.parse({
      ...parsed,
      documentType: parsed.documentType || input.kind,
      confidence: Number(parsed.confidence ?? 50),
    });

    const scrubbed = scrubUngroundedFields(validated, ocrText);

    await setAiAuditUserApproval({
      entityType: "EmploymentDocument",
      entityId: input.documentId ?? "",
      action: "DOCUMENT_AGENT",
      approval:
        scrubbed.confidence < DOCUMENT_AGENT_CONFIDENCE_THRESHOLD
          ? "PENDING"
          : "NOT_REQUIRED",
    }).catch(() => null);

    return scrubbed;
  } catch (error) {
    logger.warn("Document agent AI failed, using heuristic", { error });
    const result = heuristicExtract({ ...input, ocrText });
    await recordAiAudit({
      action: "DOCUMENT_AGENT",
      provider: "openai",
      model: openaiConfig.model,
      status: "FALLBACK",
      inputSummary: auditCtx.inputSummary,
      outputSummary: summarizeAiText(result),
      userApproval:
        result.confidence < DOCUMENT_AGENT_CONFIDENCE_THRESHOLD
          ? "PENDING"
          : "NOT_REQUIRED",
      userId: input.userId,
      entityType: "EmploymentDocument",
      entityId: input.documentId,
      errorMessage: error instanceof Error ? error.message : "Unknown",
    });
    return result;
  }
}

export function needsHumanReview(result: DocumentAgentResult) {
  return result.confidence < DOCUMENT_AGENT_CONFIDENCE_THRESHOLD;
}

export { DOCUMENT_AGENT_CONFIDENCE_THRESHOLD };
