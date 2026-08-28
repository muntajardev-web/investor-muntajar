import type { Document } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateDocumentData {
  userId: string;
  applicationId?: string;
  documentTypeId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  s3Key: string;
  s3Bucket: string;
}

export const documentRepository = {
  async findById(id: string): Promise<Document | null> {
    return prisma.document.findUnique({ where: { id } });
  },

  async findByUserId(userId: string): Promise<Document[]> {
    return prisma.document.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByUserAndType(
    userId: string,
    documentTypeId: string,
  ): Promise<Document[]> {
    return prisma.document.findMany({
      where: { userId, documentTypeId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(input: CreateDocumentData): Promise<Document> {
    return prisma.document.create({ data: input });
  },

  async delete(id: string): Promise<void> {
    await prisma.document.update({
      where: { id },
      data: { deletedAt: new Date(), status: "ARCHIVED" },
    });
  },
};
