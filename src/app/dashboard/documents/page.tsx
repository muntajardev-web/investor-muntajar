import { requireAuth } from "@/server/auth/session";
import { PageHeader } from "@/components/student";
import { DocumentUploadManager } from "@/components/documents/document-upload-manager";

export default async function DocumentsPage() {
  await requireAuth().catch(() => ({}));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Document Vault (Cloudflare R2)"
        description="Upload your passport, NID, transcripts, CV, and test scores to Cloudflare R2 with metadata stored in Neon PostgreSQL."
      />

      <DocumentUploadManager />
    </div>
  );
}
