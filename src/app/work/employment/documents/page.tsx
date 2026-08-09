import { PageHeader } from "@/components/employment";
import { DocumentsUploader } from "@/components/employment/documents-uploader";
import { requireAuth } from "@/server/auth/session";
import { getEmploymentDocuments } from "@/lib/employment/queries";
import type { DocumentAgentResult } from "@/services/employment/documents/document-agent.types";

export default async function EmploymentDocumentsPage() {
  const session = await requireAuth();
  const documents = await getEmploymentDocuments(session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload Documents"
        description="Step 6 — Upload to Cloudflare R2. Files are virus-scanned, OCR’d, then read by the AI Document Agent. Extractions below 90% confidence require your review before the profile updates."
      />
      <DocumentsUploader
        initial={documents.map((d) => ({
          id: d.id,
          kind: d.kind,
          fileName: d.fileName,
          processingStatus: d.processingStatus,
          processingError: d.processingError,
          uploadedAt: d.uploadedAt,
          scannedAt: d.scannedAt,
          ocrCompletedAt: d.ocrCompletedAt,
          extractedAt: d.extractedAt,
          embeddedAt: d.embeddedAt,
          processedAt: d.processedAt,
          extractionConfidence: d.extractionConfidence,
          needsReview: d.needsReview,
          reviewStatus: d.reviewStatus,
          extractedData: d.extractedData as DocumentAgentResult | null,
        }))}
      />
    </div>
  );
}
