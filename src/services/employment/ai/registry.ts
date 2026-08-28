import type { Prisma } from "@prisma/client";
import { runOcr } from "@/services/employment/documents/ocr.service";
import {
  runDocumentAgent,
  needsHumanReview,
} from "@/services/employment/documents/document-agent.service";
import { embedDocumentText } from "@/services/employment/documents/embedding.service";
import { applyExtractionToWorkerProfile } from "@/services/employment/documents/profile-update.service";
import { writeDocumentAudit } from "@/services/employment/documents/audit.service";
import { employmentAnalysisService } from "@/services/employment/analysis.service";
import { employmentMatchingService } from "@/services/employment/matching.service";
import { employmentPackageService } from "@/services/employment/package.service";
import { coverLetterService } from "@/services/employment/cover-letter.service";
import { employmentValidationService } from "@/services/employment/validation.service";
import { employmentAdvisorService } from "@/services/employment/advisor.service";
import { employmentTrackingService } from "@/services/employment/tracking.service";
import { recordAiAudit } from "@/services/ai/ai-audit.service";
import { prisma } from "@/lib/prisma";
import type {
  AuditAiPort,
  CoverLetterAiPort,
  DocumentAiPort,
  EmploymentAiRegistry,
  MatchingAiPort,
  NotificationAiPort,
  ApplicationAiPort,
  ResumeAiPort,
  ValidationAiPort,
  CareerCoachAiPort,
  WorkerProfileAiPort,
} from "./types";

const documentAi: DocumentAiPort = {
  runOcr,
  runDocumentAgent,
  needsHumanReview,
  embedDocumentText,
  applyExtractionToWorkerProfile,
};

const workerProfileAi: WorkerProfileAiPort = {
  analyze: (...args) => employmentAnalysisService.analyze(...args),
  parseStored: (value) => employmentAnalysisService.parseStored(value),
  toJson: (result) => employmentAnalysisService.toJson(result),
};

const matchingAi: MatchingAiPort = {
  matchJobs: (userId, profile) =>
    employmentMatchingService.matchJobs(userId, profile),
  ensureCatalog: () => employmentMatchingService.ensureCatalog(),
};

const resumeAi: ResumeAiPort = {
  build: (...args) => employmentPackageService.build(...args),
  toPdf: (...args) => employmentPackageService.toPdf(...args),
  parseStored: (value) => employmentPackageService.parseStored(value),
  toJson: (value) => employmentPackageService.toJson(value),
};

const coverLetterAi: CoverLetterAiPort = {
  generate: (input) => coverLetterService.generate(input),
  toPdf: (title, body) => coverLetterService.toPdf(title, body),
};

const applicationAi: ApplicationAiPort = {
  transitionApplicationStatus: (input) =>
    employmentTrackingService.transitionApplicationStatus(input),
  ensureApplication: (opts) => employmentTrackingService.ensureApplication(opts),
  getApplicationTracking: (userId, applicationId) =>
    employmentTrackingService.getApplicationTracking(userId, applicationId),
};

const validationAi: ValidationAiPort = {
  validate: (...args) => employmentValidationService.validate(...args),
  parseStored: (value) => employmentValidationService.parseStored(value),
  toJson: (result) => employmentValidationService.toJson(result),
};

const careerCoachAi: CareerCoachAiPort = {
  answer: (question, ctx) => employmentAdvisorService.answer(question, ctx),
};

const auditAi: AuditAiPort = {
  writeDocumentAudit: async (input) =>
    writeDocumentAudit({
      userId: input.userId,
      action: input.action,
      documentId: input.documentId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    }),
  recordAiAudit,
};

const notificationAi: NotificationAiPort = {
  async notify(input) {
    return prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        data: (input.data ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  },
};

/**
 * Default production DI registry — binds ports to concrete employment AI services.
 * Tests can call `createEmploymentAiRegistry({ matching: mockMatching })`.
 */
export function createEmploymentAiRegistry(
  overrides: Partial<EmploymentAiRegistry> = {},
): EmploymentAiRegistry {
  return {
    document: documentAi,
    workerProfile: workerProfileAi,
    matching: matchingAi,
    resume: resumeAi,
    coverLetter: coverLetterAi,
    application: applicationAi,
    validation: validationAi,
    careerCoach: careerCoachAi,
    audit: auditAi,
    notification: notificationAi,
    ...overrides,
  };
}

/** Singleton production registry */
export const employmentAiRegistry = createEmploymentAiRegistry();
