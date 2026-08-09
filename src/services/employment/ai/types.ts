import type {
  AiAuditAction,
  AiAuditStatus,
  AiUserApproval,
  AuditAction,
  NotificationType,
  Prisma,
} from "@prisma/client";
import type { DocumentAgentResult } from "@/services/employment/documents/document-agent.types";
import type { OcrResult } from "@/services/employment/documents/ocr.service";
import type {
  AnalysisProfileInput,
  WorkerAnalysisResult,
} from "@/services/employment/analysis.service";
import type { WorkerProfileSnapshot } from "@/services/employment/matching.service";
import type { CareerCoachContext } from "@/services/employment/advisor.service";
import type {
  ValidationProfileInput,
  ValidationDocumentInput,
  ValidationJobInput,
  ValidationResult,
} from "@/services/employment/validation.service";
import type {
  ApplicationPackage,
  PackageDocumentItem,
  ResumeProfileInput,
} from "@/services/employment/package.service";
import type {
  CoverLetterProfile,
  CoverLetterJobContext,
  CoverLetterTemplateId,
  CoverLetterLanguageId,
} from "@/services/employment/cover-letter.service";
import type {
  StatusTransitionInput,
  StatusTransitionResult,
} from "@/services/employment/tracking.service";

export type {
  AnalysisProfileInput,
  WorkerAnalysisResult,
  WorkerProfileSnapshot,
  CareerCoachContext,
  ValidationResult,
  ApplicationPackage,
};

/** Shared orchestrator context for logging / audit / cache keys */
export type OrchestratorContext = {
  userId: string;
  requestId?: string;
  workflow?: EmploymentAiWorkflow;
  metadata?: Record<string, unknown>;
};

export type EmploymentAiWorkflow =
  | "document_pipeline"
  | "worker_analysis"
  | "job_matching"
  | "resume_build"
  | "cover_letter"
  | "application_package"
  | "validation"
  | "career_coach"
  | "notification"
  | "full_application";

// ─── Independent service ports (interfaces) ───────────────────────────────────

export interface DocumentAiPort {
  runOcr(input: {
    buffer: Buffer;
    mimeType: string;
    fileName: string;
    userId?: string;
    documentId?: string;
  }): Promise<OcrResult>;

  runDocumentAgent(input: {
    kind: string;
    fileName: string;
    ocrText: string;
    userId?: string;
    documentId?: string;
  }): Promise<DocumentAgentResult>;

  needsHumanReview(result: DocumentAgentResult): boolean;

  embedDocumentText(
    text: string,
    audit?: { userId?: string; entityType?: string; entityId?: string },
  ): Promise<{ embedding: number[]; model: string }>;

  applyExtractionToWorkerProfile(input: {
    userId: string;
    kind: string;
    documentId: string;
    extracted: DocumentAgentResult;
  }): Promise<{ profileCompletion?: number } & Record<string, unknown>>;
}

export interface WorkerProfileAiPort {
  analyze(
    profile: AnalysisProfileInput,
    uploadedKinds: string[],
    opts?: { userId?: string },
  ): Promise<WorkerAnalysisResult>;
  parseStored(value: unknown): WorkerAnalysisResult | null;
  toJson(result: WorkerAnalysisResult): Prisma.InputJsonValue;
}

export interface MatchingAiPort {
  matchJobs(userId: string, profile: WorkerProfileSnapshot): Promise<unknown[]>;
  ensureCatalog(): Promise<void>;
}

export interface ResumeAiPort {
  build(
    profile: ResumeProfileInput,
    targetJob?: {
      title?: string;
      company?: string;
      country?: string;
    } | null,
    uploadedDocLabels?: string[],
    extras?: {
      coverLetter?: string | null;
      coverLetterVersionId?: string | null;
      documents?: PackageDocumentItem[];
    },
  ): ApplicationPackage;
  toPdf(title: string, body: string, fileLabel: string): Promise<Uint8Array>;
  parseStored(value: unknown): ApplicationPackage | null;
  toJson(value: ApplicationPackage): Prisma.InputJsonValue;
}

export interface CoverLetterAiPort {
  generate(input: {
    profile: CoverLetterProfile;
    job?: CoverLetterJobContext;
    template?: CoverLetterTemplateId;
    language?: CoverLetterLanguageId;
  }): {
    content: string;
    template: CoverLetterTemplateId;
    language: CoverLetterLanguageId;
  };
  toPdf(title: string, body: string): Promise<Uint8Array>;
}

export interface ApplicationAiPort {
  transitionApplicationStatus(
    input: StatusTransitionInput,
  ): Promise<StatusTransitionResult>;
  ensureApplication(opts: {
    userId: string;
    jobListingId?: string | null;
    status?: import("@prisma/client").EmploymentApplicationStatus;
    packageData?: Prisma.InputJsonValue;
    paidAt?: Date | null;
    notes?: string;
    seedTracking?: boolean;
  }): Promise<unknown>;
  getApplicationTracking(userId: string, applicationId?: string): Promise<unknown>;
}

export interface ValidationAiPort {
  validate(
    profile: ValidationProfileInput,
    documents: ValidationDocumentInput[],
    options?: {
      packagePresent?: { hasResume?: boolean; hasCoverLetter?: boolean };
      job?: ValidationJobInput | null;
      unsupportedClaims?: string[];
    },
  ): ValidationResult;
  parseStored(value: unknown): ValidationResult | null;
  toJson(result: ValidationResult): Prisma.InputJsonValue;
}

export interface CareerCoachAiPort {
  answer(question: string, ctx: CareerCoachContext): Promise<string>;
}

export interface AuditAiPort {
  writeDocumentAudit(input: {
    userId: string;
    action: AuditAction;
    documentId: string;
    metadata?: Record<string, unknown>;
  }): Promise<unknown>;

  recordAiAudit(input: {
    action: AiAuditAction;
    provider: string;
    model: string;
    status: AiAuditStatus;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    costUsd?: number;
    durationMs?: number;
    inputSummary?: string | null;
    outputSummary?: string | null;
    userApproval?: AiUserApproval;
    userId?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    errorMessage?: string | null;
    metadata?: Record<string, unknown>;
  }): Promise<unknown>;
}

export interface NotificationAiPort {
  notify(input: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<unknown>;
}

/** Dependency injection container for all employment AI ports */
export interface EmploymentAiRegistry {
  document: DocumentAiPort;
  workerProfile: WorkerProfileAiPort;
  matching: MatchingAiPort;
  resume: ResumeAiPort;
  coverLetter: CoverLetterAiPort;
  application: ApplicationAiPort;
  validation: ValidationAiPort;
  careerCoach: CareerCoachAiPort;
  audit: AuditAiPort;
  notification: NotificationAiPort;
}

export type OrchestratorStepResult<T = unknown> = {
  ok: boolean;
  service: keyof EmploymentAiRegistry | "orchestrator";
  action: string;
  durationMs: number;
  cached?: boolean;
  retries?: number;
  data?: T;
  error?: string;
};

export type OrchestratorWorkflowResult<T = unknown> = {
  workflow: EmploymentAiWorkflow;
  requestId: string;
  userId: string;
  ok: boolean;
  durationMs: number;
  steps: OrchestratorStepResult[];
  data?: T;
  error?: string;
};
