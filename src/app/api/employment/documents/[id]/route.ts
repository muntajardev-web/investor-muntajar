import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const document = await prisma.employmentDocument.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
    });

    if (!document) {
      throw new AppError("NOT_FOUND", "Document not found", 404);
    }

    return apiSuccess({
      document,
      pipeline: {
        uploaded: !!document.uploadedAt,
        scanned: !!document.scannedAt,
        ocr: !!document.ocrCompletedAt,
        aiExtraction: !!document.extractedAt,
        embedding: !!document.embeddedAt,
        completed: document.processingStatus === "COMPLETED",
        awaitingReview: document.processingStatus === "AWAITING_REVIEW",
        failed: ["FAILED", "SCAN_FAILED", "OCR_FAILED", "AI_FAILED"].includes(
          document.processingStatus,
        ),
        status: document.processingStatus,
        error: document.processingError,
        confidence: document.extractionConfidence,
        needsReview: document.needsReview,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
