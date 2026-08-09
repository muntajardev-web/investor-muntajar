import { documentRepository } from "@/repositories";
import { NotFoundError } from "@/lib";
import type { DocumentDTO, PresignedUploadResult } from "@/types";
import { s3Service } from "./s3.service";

export interface UploadDocumentInput {
  userId: string;
  documentTypeId: string;
  applicationId?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export const documentService = {
  async createPresignedUpload(
    input: UploadDocumentInput,
  ): Promise<PresignedUploadResult> {
    s3Service.validateUpload(input.mimeType, input.sizeBytes);

    const s3Key = s3Service.buildKey(input.userId, input.fileName);
    const uploadUrl = await s3Service.getPresignedUploadUrl(
      s3Key,
      input.mimeType,
    );

    const expiresAt = new Date(Date.now() + 3600 * 1000);

    return { uploadUrl, s3Key, expiresAt };
  },

  async confirmUpload(
    input: UploadDocumentInput & { s3Key: string },
  ): Promise<DocumentDTO> {
    const doc = await documentRepository.create({
      userId: input.userId,
      applicationId: input.applicationId,
      documentTypeId: input.documentTypeId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      s3Key: input.s3Key,
      s3Bucket: s3Service.getBucket(),
    });

    return this.toDTO(doc);
  },

  async getDownloadUrl(documentId: string, userId: string): Promise<string> {
    const doc = await documentRepository.findById(documentId);
    if (!doc || doc.userId !== userId) {
      throw new NotFoundError("Document", documentId);
    }

    return s3Service.getPresignedDownloadUrl(doc.s3Key);
  },

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const doc = await documentRepository.findById(documentId);
    if (!doc || doc.userId !== userId) {
      throw new NotFoundError("Document", documentId);
    }

    await s3Service.deleteObject(doc.s3Key);
    await documentRepository.delete(documentId);
  },

  async listByUser(userId: string): Promise<DocumentDTO[]> {
    const docs = await documentRepository.findByUserId(userId);
    return docs.map(this.toDTO);
  },

  toDTO(doc: {
    id: string;
    userId: string;
    documentTypeId: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    s3Key: string;
    status: string;
    createdAt: Date;
  }): DocumentDTO {
    return {
      id: doc.id,
      userId: doc.userId,
      documentTypeId: doc.documentTypeId,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
      s3Key: doc.s3Key,
      isVerified: false,
      createdAt: doc.createdAt,
    };
  },
};
