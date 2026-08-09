import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { DocumentsClient } from "./documents-client";

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    where: { deletedAt: null },
    include: {
      user: { select: { name: true, email: true } },
      documentType: { select: { name: true } },
      verification: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Review and verify student documents."
      />
      <DocumentsClient documents={documents} />
    </div>
  );
}
