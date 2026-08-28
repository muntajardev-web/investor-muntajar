import { cacheKeys } from "@/config/constants";
import type { DocumentAgentResult } from "@/services/employment/documents/document-agent.types";
import type { OcrResult } from "@/services/employment/documents/ocr.service";
import type {
  AnalysisProfileInput,
  WorkerAnalysisResult,
} from "@/services/employment/analysis.service";
import type { WorkerProfileSnapshot } from "@/services/employment/matching.service";
import type { CareerCoachContext } from "@/services/employment/advisor.service";
import type {
  ValidationDocumentInput,
  ValidationJobInput,
  ValidationProfileInput,
  ValidationResult,
} from "@/services/employment/validation.service";
import type {
  ApplicationPackage,
  PackageDocumentItem,
  ResumeProfileInput,
} from "@/services/employment/package.service";
import type {
  CoverLetterJobContext,
  CoverLetterLanguageId,
  CoverLetterProfile,
  CoverLetterTemplateId,
} from "@/services/employment/cover-letter.service";
import type { StatusTransitionInput } from "@/services/employment/tracking.service";
import {
  createEmploymentAiRegistry,
  employmentAiRegistry,
} from "./registry";
import {
  beginWorkflow,
  finishWorkflow,
  runOrchestratorStep,
} from "./logging";
import { invalidateEmploymentAiCache } from "./cached";
import type {
  EmploymentAiRegistry,
  OrchestratorWorkflowResult,
} from "./types";

export type EmploymentAiOrchestrator = ReturnType<
  typeof createEmploymentAiOrchestrator
>;

/**
 * Employment AI Orchestrator — single entry point for all employment AI workflows.
 * Services remain independent; the orchestrator coordinates via injected ports.
 */
export function createEmploymentAiOrchestrator(
  registry: EmploymentAiRegistry = employmentAiRegistry,
) {
  const services = registry;

  return {
    /** Expose ports for advanced / Inngest step wiring */
    services,

    async runDocumentOcr(input: {
      userId: string;
      buffer: Buffer;
      mimeType: string;
      fileName: string;
      documentId?: string;
      requestId?: string;
    }): Promise<OrchestratorWorkflowResult<OcrResult | undefined>> {
      const ctx = beginWorkflow(
        "document_pipeline",
        input.userId,
        input.requestId,
      );
      const step = await runOrchestratorStep(
        ctx,
        {
          service: "document",
          action: "runOcr",
          retries: 3,
        },
        () =>
          services.document.runOcr({
            buffer: input.buffer,
            mimeType: input.mimeType,
            fileName: input.fileName,
            userId: input.userId,
            documentId: input.documentId,
          }),
      );
      return finishWorkflow(
        ctx,
        [step],
        step.ok ? step.data : undefined,
        step.error,
      );
    },

    async runDocumentAgent(input: {
      userId: string;
      kind: string;
      fileName: string;
      ocrText: string;
      documentId?: string;
      requestId?: string;
    }): Promise<
      OrchestratorWorkflowResult<{
        result: DocumentAgentResult;
        reviewRequired: boolean;
      } | undefined>
    > {
      const ctx = beginWorkflow(
        "document_pipeline",
        input.userId,
        input.requestId,
      );
      const extract = await runOrchestratorStep(
        ctx,
        {
          service: "document",
          action: "runDocumentAgent",
          retries: 3,
        },
        () =>
          services.document.runDocumentAgent({
            kind: input.kind,
            fileName: input.fileName,
            ocrText: input.ocrText,
            userId: input.userId,
            documentId: input.documentId,
          }),
      );

      if (!extract.ok || !extract.data) {
        return finishWorkflow(ctx, [extract], undefined, extract.error);
      }

      const reviewRequired = services.document.needsHumanReview(extract.data);

      const audit = await runOrchestratorStep(
        ctx,
        { service: "audit", action: "writeDocumentAudit", retries: 2 },
        () =>
          services.audit.writeDocumentAudit({
            userId: input.userId,
            action: "CREATE",
            documentId: input.documentId ?? "unknown",
            metadata: {
              event: "document_agent_extraction",
              confidence: extract.data!.confidence,
              needsReview: reviewRequired,
              documentType: extract.data!.documentType,
            },
          }),
      );

      const notify = await runOrchestratorStep(
        ctx,
        { service: "notification", action: "notify", retries: 2 },
        () =>
          services.notification.notify({
            userId: input.userId,
            type: "DOCUMENT_STATUS",
            title: reviewRequired
              ? "Review document extraction"
              : "Document extracted",
            body: reviewRequired
              ? `AI confidence is ${extract.data!.confidence}%. Please review extracted fields.`
              : `AI Document Agent extracted data from ${input.fileName} with ${extract.data!.confidence}% confidence.`,
            data: {
              source: "employment",
              documentId: input.documentId,
              needsReview: reviewRequired,
              confidence: extract.data!.confidence,
            },
          }),
      );

      return finishWorkflow(
        ctx,
        [extract, audit, notify],
        { result: extract.data, reviewRequired },
        [extract, audit, notify].find((s) => !s.ok)?.error,
      );
    },

    async runDocumentEmbeddingAndProfile(input: {
      userId: string;
      documentId: string;
      kind: string;
      fileName: string;
      ocrText: string;
      extracted: DocumentAgentResult;
      requestId?: string;
    }) {
      const ctx = beginWorkflow(
        "document_pipeline",
        input.userId,
        input.requestId,
      );

      const embedText = [
        input.kind,
        input.fileName,
        input.ocrText,
        JSON.stringify(input.extracted),
      ].join("\n");

      const embed = await runOrchestratorStep(
        ctx,
        { service: "document", action: "embedDocumentText", retries: 3 },
        () =>
          services.document.embedDocumentText(embedText, {
            userId: input.userId,
            entityType: "EmploymentDocument",
            entityId: input.documentId,
          }),
      );

      if (!embed.ok || !embed.data) {
        return finishWorkflow(ctx, [embed], undefined, embed.error);
      }

      const profile = await runOrchestratorStep(
        ctx,
        {
          service: "document",
          action: "applyExtractionToWorkerProfile",
          retries: 2,
        },
        () =>
          services.document.applyExtractionToWorkerProfile({
            userId: input.userId,
            kind: input.kind,
            documentId: input.documentId,
            extracted: input.extracted,
          }),
      );

      if (profile.ok) {
        await invalidateEmploymentAiCache(input.userId);
      }

      return finishWorkflow(
        ctx,
        [embed, profile],
        profile.ok
          ? { embedding: embed.data, profile: profile.data }
          : undefined,
        profile.error ?? embed.error,
      );
    },

    async runWorkerAnalysis(input: {
      userId: string;
      profile: AnalysisProfileInput;
      uploadedKinds: string[];
      bypassCache?: boolean;
      requestId?: string;
    }): Promise<OrchestratorWorkflowResult<WorkerAnalysisResult | undefined>> {
      const ctx = beginWorkflow("worker_analysis", input.userId, input.requestId);

      const analyze = await runOrchestratorStep(
        ctx,
        {
          service: "workerProfile",
          action: "analyze",
          retries: 3,
          cacheKey: cacheKeys.employmentAnalysis(input.userId),
          cacheTtlSeconds: 600,
          bypassCache: input.bypassCache,
        },
        () =>
          services.workerProfile.analyze(
            input.profile,
            input.uploadedKinds,
            { userId: input.userId },
          ),
      );

      if (!analyze.ok || !analyze.data) {
        return finishWorkflow(ctx, [analyze], undefined, analyze.error);
      }

      const notify = await runOrchestratorStep(
        ctx,
        { service: "notification", action: "notify", retries: 2 },
        () =>
          services.notification.notify({
            userId: input.userId,
            type: "SYSTEM",
            title: "Worker analysis ready",
            body: `Profile readiness ${analyze.data!.profileReadinessScore}%. Review eligible countries and gaps on your dashboard.`,
            data: {
              source: "employment",
              readiness: analyze.data!.profileReadinessScore,
            },
          }),
      );

      return finishWorkflow(
        ctx,
        [analyze, notify],
        analyze.data,
        notify.ok ? undefined : notify.error,
      );
    },

    async runJobMatching(input: {
      userId: string;
      profile: WorkerProfileSnapshot;
      bypassCache?: boolean;
      requestId?: string;
    }): Promise<OrchestratorWorkflowResult<unknown[] | undefined>> {
      const ctx = beginWorkflow("job_matching", input.userId, input.requestId);

      const catalog = await runOrchestratorStep(
        ctx,
        { service: "matching", action: "ensureCatalog", retries: 2 },
        () => services.matching.ensureCatalog(),
      );

      const match = await runOrchestratorStep(
        ctx,
        {
          service: "matching",
          action: "matchJobs",
          retries: 3,
          cacheKey: cacheKeys.employmentMatches(input.userId),
          cacheTtlSeconds: 300,
          bypassCache: input.bypassCache,
        },
        () => services.matching.matchJobs(input.userId, input.profile),
      );

      if (!match.ok || !match.data) {
        return finishWorkflow(
          ctx,
          [catalog, match],
          undefined,
          match.error,
        );
      }

      const notify = await runOrchestratorStep(
        ctx,
        { service: "notification", action: "notify", retries: 2 },
        () =>
          services.notification.notify({
            userId: input.userId,
            type: "SYSTEM",
            title: "Job matches ready",
            body: `Matching engine returned ${match.data!.length} top roles. Save favorites or apply later.`,
            data: {
              source: "employment",
              matchCount: match.data!.length,
            },
          }),
      );

      return finishWorkflow(
        ctx,
        [catalog, match, notify],
        match.data,
        [catalog, match, notify].find((s) => !s.ok)?.error,
      );
    },

    async runResumeBuild(input: {
      userId: string;
      profile: ResumeProfileInput;
      targetJob?: {
        title?: string;
        company?: string;
        country?: string;
      } | null;
      uploadedDocLabels?: string[];
      extras?: {
        coverLetter?: string | null;
        coverLetterVersionId?: string | null;
        documents?: PackageDocumentItem[];
      };
      requestId?: string;
    }): Promise<OrchestratorWorkflowResult<ApplicationPackage | undefined>> {
      const ctx = beginWorkflow("resume_build", input.userId, input.requestId);

      const build = await runOrchestratorStep(
        ctx,
        {
          service: "resume",
          action: "build",
          cacheKey: cacheKeys.employmentPackage(input.userId),
          cacheTtlSeconds: 300,
          bypassCache: true,
        },
        async () =>
          services.resume.build(
            input.profile,
            input.targetJob ?? null,
            input.uploadedDocLabels ?? [],
            input.extras,
          ),
      );

      return finishWorkflow(
        ctx,
        [build],
        build.ok ? build.data : undefined,
        build.error,
      );
    },

    async runCoverLetter(input: {
      userId: string;
      profile: CoverLetterProfile;
      job?: CoverLetterJobContext;
      template?: CoverLetterTemplateId;
      language?: CoverLetterLanguageId;
      requestId?: string;
    }) {
      const ctx = beginWorkflow("cover_letter", input.userId, input.requestId);

      const generate = await runOrchestratorStep(
        ctx,
        { service: "coverLetter", action: "generate", retries: 2 },
        async () =>
          services.coverLetter.generate({
            profile: input.profile,
            job: input.job,
            template: input.template,
            language: input.language,
          }),
      );

      return finishWorkflow(
        ctx,
        [generate],
        generate.ok ? generate.data : undefined,
        generate.error,
      );
    },

    async runValidation(input: {
      userId: string;
      profile: ValidationProfileInput;
      documents: ValidationDocumentInput[];
      options?: {
        packagePresent?: { hasResume?: boolean; hasCoverLetter?: boolean };
        job?: ValidationJobInput | null;
        unsupportedClaims?: string[];
      };
      bypassCache?: boolean;
      requestId?: string;
    }): Promise<OrchestratorWorkflowResult<ValidationResult | undefined>> {
      const ctx = beginWorkflow("validation", input.userId, input.requestId);

      const validate = await runOrchestratorStep(
        ctx,
        {
          service: "validation",
          action: "validate",
          cacheKey: cacheKeys.employmentValidation(input.userId),
          cacheTtlSeconds: 300,
          bypassCache: input.bypassCache ?? true,
        },
        async () =>
          services.validation.validate(
            input.profile,
            input.documents,
            input.options,
          ),
      );

      return finishWorkflow(
        ctx,
        [validate],
        validate.ok ? validate.data : undefined,
        validate.error,
      );
    },

    async runCareerCoach(input: {
      userId: string;
      question: string;
      context: CareerCoachContext;
      requestId?: string;
    }): Promise<OrchestratorWorkflowResult<string | undefined>> {
      const ctx = beginWorkflow("career_coach", input.userId, input.requestId);

      const answer = await runOrchestratorStep(
        ctx,
        { service: "careerCoach", action: "answer", retries: 3 },
        () => services.careerCoach.answer(input.question, input.context),
      );

      return finishWorkflow(
        ctx,
        [answer],
        answer.ok ? answer.data : undefined,
        answer.error,
      );
    },

    async runApplicationTransition(input: {
      userId: string;
      transition: StatusTransitionInput;
      requestId?: string;
    }) {
      const ctx = beginWorkflow(
        "full_application",
        input.userId,
        input.requestId,
      );

      const transition = await runOrchestratorStep(
        ctx,
        {
          service: "application",
          action: "transitionApplicationStatus",
          retries: 2,
        },
        () =>
          services.application.transitionApplicationStatus(input.transition),
      );

      return finishWorkflow(
        ctx,
        [transition],
        transition.ok ? transition.data : undefined,
        transition.error,
      );
    },

    async notify(input: {
      userId: string;
      type: Parameters<EmploymentAiRegistry["notification"]["notify"]>[0]["type"];
      title: string;
      body: string;
      data?: Record<string, unknown>;
      requestId?: string;
    }) {
      const ctx = beginWorkflow("notification", input.userId, input.requestId);
      const step = await runOrchestratorStep(
        ctx,
        { service: "notification", action: "notify", retries: 2 },
        () =>
          services.notification.notify({
            userId: input.userId,
            type: input.type,
            title: input.title,
            body: input.body,
            data: input.data,
          }),
      );
      return finishWorkflow(
        ctx,
        [step],
        step.ok ? step.data : undefined,
        step.error,
      );
    },

    /**
     * Coordinated package workflow: validation → resume build → readiness signal.
     * Used when preparing a full application package for submission.
     */
    async runFullApplicationPrep(input: {
      userId: string;
      profile: ResumeProfileInput & ValidationProfileInput;
      documents: ValidationDocumentInput[];
      uploadedDocLabels?: string[];
      targetJob?: {
        title?: string;
        company?: string;
        country?: string;
      } | null;
      validationOptions?: {
        packagePresent?: { hasResume?: boolean; hasCoverLetter?: boolean };
        job?: ValidationJobInput | null;
        unsupportedClaims?: string[];
      };
      extras?: {
        coverLetter?: string | null;
        coverLetterVersionId?: string | null;
        documents?: PackageDocumentItem[];
      };
      requestId?: string;
    }) {
      const ctx = beginWorkflow(
        "full_application",
        input.userId,
        input.requestId,
      );

      const validation = await runOrchestratorStep(
        ctx,
        {
          service: "validation",
          action: "validate",
          bypassCache: true,
        },
        async () =>
          services.validation.validate(
            input.profile,
            input.documents,
            input.validationOptions,
          ),
      );

      if (!validation.ok || !validation.data) {
        return finishWorkflow(ctx, [validation], undefined, validation.error);
      }

      const pkg = await runOrchestratorStep(
        ctx,
        { service: "resume", action: "build", bypassCache: true },
        async () =>
          services.resume.build(
            input.profile,
            input.targetJob ?? null,
            input.uploadedDocLabels ?? [],
            input.extras,
          ),
      );

      if (!pkg.ok || !pkg.data) {
        return finishWorkflow(
          ctx,
          [validation, pkg],
          undefined,
          pkg.error,
        );
      }

      const notify = await runOrchestratorStep(
        ctx,
        { service: "notification", action: "notify", retries: 2 },
        () =>
          services.notification.notify({
            userId: input.userId,
            type: "SYSTEM",
            title: "Application package ready",
            body: validation.data!.canSubmit
              ? "Your application package passed validation and is ready for review."
              : `Validation found ${validation.data!.issues.filter((i) => i.severity === "error").length} blocking issue(s). Fix them before submission.`,
            data: {
              source: "employment",
              canSubmit: validation.data!.canSubmit,
              issueCount: validation.data!.issues.length,
            },
          }),
      );

      return finishWorkflow(
        ctx,
        [validation, pkg, notify],
        {
          validation: validation.data,
          package: pkg.data,
        },
        [validation, pkg, notify].find((s) => !s.ok)?.error,
      );
    },

    invalidateCache: invalidateEmploymentAiCache,
  };
}

/** Production singleton — all employment AI workflows should go through this. */
export const employmentAiOrchestrator = createEmploymentAiOrchestrator();

export { createEmploymentAiRegistry, employmentAiRegistry };
