import { documentRepository } from "@/repositories";
import { logger } from "@/lib";
import type { ProcessDocumentPayload } from "./types";

export async function processDocumentJob(
  payload: ProcessDocumentPayload,
): Promise<void> {
  logger.info("Processing document job", { documentId: payload.documentId });

  const doc = await documentRepository.findById(payload.documentId);
  if (!doc || doc.userId !== payload.userId) {
    logger.warn("Document not found for processing", {
      documentId: payload.documentId,
    });
    return;
  }

  logger.info("Document processed", { documentId: payload.documentId });
}
