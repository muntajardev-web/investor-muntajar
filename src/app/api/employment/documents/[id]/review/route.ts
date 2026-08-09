import { NextRequest } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { inngest } from "@/inngest";
import { AppError } from "@/lib";
import { writeDocumentAudit } from "@/services/employment/documents/audit.service";
import { setAiAuditUserApproval } from "@/services/ai/ai-audit.service";
import { documentAgentResultSchema } from "@/services/employment/documents/document-agent.types";
import { logEmploymentActivity } from "@/lib/employment/queries";

type Params = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  action: z.enum(["approve", "reject"]),
  /** Optional corrected extraction JSON on approve */
  extractedData: z.unknown().optional(),
  notes: z.string().max(2000).optional(),
});

/**
 * Approve or reject a low-confidence Document Agent extraction.
 * Approve → enqueue embedding + profile update via Inngest.
 * Reject → leave profile unchanged.
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = bodySchema.parse(await request.json());

    const document = await prisma.employmentDocument.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
    });

    if (!document) {
      throw new AppError("NOT_FOUND", "Document not found", 404);
    }

    if (
      document.processingStatus !== "AWAITING_REVIEW" &&
      !(document.needsReview && document.reviewStatus === "PENDING")
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Document is not awaiting review",
        400,
      );
    }

    if (!document.extractedData) {
      throw new AppError("VALIDATION_ERROR", "No extraction to review", 400);
    }

    if (body.action === "reject") {
      const updated = await prisma.employmentDocument.update({
        where: { id: document.id },
        data: {
          needsReview: false,
          reviewStatus: "REJECTED",
          reviewedAt: new Date(),
          reviewNotes: body.notes ?? "Rejected by user",
          processingStatus: "FAILED",
          processingError:
            "Extraction rejected by user — profile was not updated",
        },
      });

      await writeDocumentAudit({
        userId: session.user.id,
        action: "REJECT",
        documentId: document.id,
        metadata: {
          event: "extraction_rejected",
          notes: body.notes ?? null,
        },
      });

      await setAiAuditUserApproval({
        entityType: "EmploymentDocument",
        entityId: document.id,
        action: "DOCUMENT_AGENT",
        approval: "REJECTED",
      });

      await logEmploymentActivity(
        session.user.id,
        "Document extraction rejected",
        `${document.fileName} extraction was rejected. Profile not updated.`,
        { documentId: document.id },
      );

      return apiSuccess({ document: updated, action: "reject" });
    }

    const extractedJson: Prisma.InputJsonValue =
      body.extractedData != null
        ? (documentAgentResultSchema.parse(
            body.extractedData,
          ) as unknown as Prisma.InputJsonValue)
        : (document.extractedData as Prisma.InputJsonValue);

    const updated = await prisma.employmentDocument.update({
      where: { id: document.id },
      data: {
        extractedData: extractedJson,
        needsReview: false,
        reviewStatus: "APPROVED",
        reviewedAt: new Date(),
        reviewNotes: body.notes ?? "Approved by user",
        processingStatus: "EMBEDDING_QUEUED",
      },
    });

    await writeDocumentAudit({
      userId: session.user.id,
      action: "APPROVE",
      documentId: document.id,
      metadata: {
        event: "extraction_approved",
        notes: body.notes ?? null,
        patched: body.extractedData != null,
      },
    });

    await setAiAuditUserApproval({
      entityType: "EmploymentDocument",
      entityId: document.id,
      action: "DOCUMENT_AGENT",
      approval: "APPROVED",
    });

    await inngest.send({
      name: "employment/document.extraction.approved",
      data: {
        documentId: updated.id,
        userId: session.user.id,
      },
    });

    await logEmploymentActivity(
      session.user.id,
      "Document extraction approved",
      `${document.fileName} approved — applying to profile.`,
      { documentId: document.id },
    );

    return apiSuccess({ document: updated, action: "approve", queued: true });
  } catch (error) {
    return handleApiError(error);
  }
}
