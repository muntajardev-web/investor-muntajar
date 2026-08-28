import { NonRetriableError } from "inngest";
import type { DocumentProcessingStatus, Prisma } from "@prisma/client";
import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { r2Storage } from "@/services/storage/s3.service";
import { scanDocumentBuffer } from "@/services/employment/documents/virus-scan.service";
import { DOCUMENT_AGENT_CONFIDENCE_THRESHOLD } from "@/services/employment/documents/document-agent.service";
import { employmentAiOrchestrator } from "@/services/employment/ai";
import { writeDocumentAudit } from "@/services/employment/documents/audit.service";
import { logger } from "@/lib";
import type { DocumentAgentResult } from "@/services/employment/documents/document-agent.types";

async function setStatus(
  documentId: string,
  processingStatus: DocumentProcessingStatus,
  extra: Prisma.EmploymentDocumentUpdateInput = {},
) {
  return prisma.employmentDocument.update({
    where: { id: documentId },
    data: { processingStatus, ...extra },
  });
}

async function runEmbeddingAndProfile(input: {
  documentId: string;
  userId: string;
  kind: string;
  fileName: string;
  ocrText: string;
  extracted: DocumentAgentResult;
}) {
  const { documentId, userId, kind, fileName, ocrText, extracted } = input;

  await setStatus(documentId, "EMBEDDING_QUEUED");
  await setStatus(documentId, "EMBEDDING");

  const workflow =
    await employmentAiOrchestrator.runDocumentEmbeddingAndProfile({
      documentId,
      userId,
      kind,
      fileName,
      ocrText,
      extracted,
    });

  if (!workflow.ok || !workflow.data) {
    throw new Error(workflow.error ?? "Embedding / profile update failed");
  }

  const { embedding, profile } = workflow.data as {
    embedding: { embedding: number[]; model: string };
    profile: { profileCompletion?: number };
  };

  await setStatus(documentId, "EMBEDDING_COMPLETE", {
    embedding: embedding.embedding as Prisma.InputJsonValue,
    embeddingModel: embedding.model,
    embeddedAt: new Date(),
  });

  await setStatus(documentId, "PROFILE_UPDATING");
  await setStatus(documentId, "COMPLETED", {
    processedAt: new Date(),
    processingError: null,
    needsReview: false,
    reviewStatus: "APPROVED",
    reviewedAt: new Date(),
  });

  return profile;
}

/**
 * Upload pipeline: R2 → Virus Scan → OCR → AI Document Agent →
 * (confidence ≥ 90% ? auto profile update : await review) → Embedding → Profile
 *
 * All AI steps run through the Employment AI Orchestrator.
 */
export const processEmploymentDocument = inngest.createFunction(
  {
    id: "process-employment-document",
    name: "Process Employment Document",
    retries: 3,
    onFailure: async ({ event, error }) => {
      const documentId = (
        event.data as { event?: { data?: { documentId?: string } } }
      )?.event?.data?.documentId;
      if (!documentId) return;
      await prisma.employmentDocument.update({
        where: { id: documentId },
        data: {
          processingStatus: "FAILED",
          processingError: error.message.slice(0, 2000),
        },
      });
    },
  },
  { event: "employment/document.uploaded" },
  async ({ event, step }) => {
    const { documentId, userId, kind, s3Key, mimeType, fileName } = event.data;

    const object = await step.run("fetch-from-r2", async () => {
      await setStatus(documentId, "SCANNING");
      const result = await r2Storage.getObjectBuffer(s3Key);
      return {
        base64: result.buffer.toString("base64"),
        contentType: result.contentType ?? mimeType,
      };
    });

    const scan = await step.run("virus-scan", async () => {
      const buffer = Buffer.from(object.base64, "base64");
      const result = await scanDocumentBuffer({
        buffer,
        mimeType: object.contentType,
        fileName,
      });

      if (!result.clean) {
        await setStatus(documentId, "SCAN_FAILED", {
          scanResult: result,
          processingError: result.details,
          scannedAt: new Date(),
        });
        throw new NonRetriableError(`Virus scan failed: ${result.details}`);
      }

      await setStatus(documentId, "SCAN_CLEAN", {
        scanResult: result,
        scannedAt: new Date(),
      });
      return result;
    });

    const ocr = await step.run("ocr-queue", async () => {
      await setStatus(documentId, "OCR_QUEUED");
      await setStatus(documentId, "OCR_PROCESSING");

      const buffer = Buffer.from(object.base64, "base64");
      const workflow = await employmentAiOrchestrator.runDocumentOcr({
        buffer,
        mimeType: object.contentType,
        fileName,
        userId,
        documentId,
      });

      if (!workflow.ok || !workflow.data) {
        throw new Error(workflow.error ?? "OCR failed");
      }

      const result = workflow.data;

      await setStatus(documentId, "OCR_COMPLETE", {
        ocrText: result.text,
        ocrMeta: {
          method: result.method,
          confidence: result.confidence,
        },
        ocrCompletedAt: new Date(),
      });

      return result;
    });

    await step.run("persist-ocr-database", async () => {
      const doc = await prisma.employmentDocument.findUnique({
        where: { id: documentId },
        select: { id: true, ocrText: true },
      });
      if (!doc?.ocrText) throw new Error("OCR text missing in database");
      return { documentId: doc.id };
    });

    const agent = await step.run("ai-document-agent", async () => {
      await setStatus(documentId, "AI_QUEUED");
      await setStatus(documentId, "AI_EXTRACTING");

      const workflow = await employmentAiOrchestrator.runDocumentAgent({
        kind,
        fileName,
        ocrText: ocr.text,
        userId,
        documentId,
      });

      if (!workflow.ok || !workflow.data) {
        throw new Error(workflow.error ?? "Document agent failed");
      }

      const { result, reviewRequired } = workflow.data;

      await setStatus(documentId, "AI_COMPLETE", {
        extractedData: result as unknown as Prisma.InputJsonValue,
        extractionConfidence: result.confidence,
        needsReview: reviewRequired,
        reviewStatus: reviewRequired ? "PENDING" : null,
        extractedAt: new Date(),
      });

      return { result, reviewRequired };
    });

    if (agent.reviewRequired) {
      await step.run("await-user-review", async () => {
        await setStatus(documentId, "AWAITING_REVIEW", {
          needsReview: true,
          reviewStatus: "PENDING",
        });
        await writeDocumentAudit({
          userId,
          action: "VERIFY",
          documentId,
          metadata: {
            event: "awaiting_review",
            confidence: agent.result.confidence,
            reason: `confidence_below_${DOCUMENT_AGENT_CONFIDENCE_THRESHOLD}`,
          },
        });
      });

      return {
        documentId,
        status: "AWAITING_REVIEW",
        confidence: agent.result.confidence,
        message: "User review required before profile update",
      };
    }

    const profile = await step.run("embedding-and-profile-update", async () => {
      return runEmbeddingAndProfile({
        documentId,
        userId,
        kind,
        fileName,
        ocrText: ocr.text,
        extracted: agent.result,
      });
    });

    logger.info("Employment document pipeline completed", {
      documentId,
      userId,
      kind,
      scanClean: scan.clean,
      confidence: agent.result.confidence,
      profileCompletion: profile.profileCompletion,
    });

    return {
      documentId,
      status: "COMPLETED",
      confidence: agent.result.confidence,
      profileCompletion: profile.profileCompletion,
    };
  },
);

/**
 * Continues the pipeline after the user approves a low-confidence extraction.
 */
export const finalizeReviewedDocument = inngest.createFunction(
  {
    id: "finalize-reviewed-employment-document",
    name: "Finalize Reviewed Employment Document",
    retries: 3,
  },
  { event: "employment/document.extraction.approved" },
  async ({ event, step }) => {
    const { documentId, userId } = event.data;

    const doc = await step.run("load-document", async () => {
      const row = await prisma.employmentDocument.findFirst({
        where: { id: documentId, userId, deletedAt: null },
      });
      if (!row?.extractedData) {
        throw new NonRetriableError("No extracted data to finalize");
      }
      return {
        kind: row.kind,
        fileName: row.fileName,
        ocrText: row.ocrText ?? "",
        extracted: row.extractedData as unknown as DocumentAgentResult,
      };
    });

    const profile = await step.run("embedding-and-profile-update", async () => {
      return runEmbeddingAndProfile({
        documentId,
        userId,
        kind: doc.kind,
        fileName: doc.fileName,
        ocrText: doc.ocrText,
        extracted: doc.extracted,
      });
    });

    await step.run("audit-approved", async () => {
      await employmentAiOrchestrator.services.audit.writeDocumentAudit({
        userId,
        action: "APPROVE",
        documentId,
        metadata: {
          event: "extraction_approved_and_applied",
          confidence: doc.extracted.confidence,
          profileCompletion: profile.profileCompletion,
        },
      });
    });

    return {
      documentId,
      status: "COMPLETED",
      profileCompletion: profile.profileCompletion,
    };
  },
);

export const inngestFunctions = [
  processEmploymentDocument,
  finalizeReviewedDocument,
];
