import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function writeDocumentAudit(input: {
  userId: string;
  action: AuditAction;
  documentId: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: "EmploymentDocument",
      entityId: input.documentId,
      metadata: input.metadata,
    },
  });
}
