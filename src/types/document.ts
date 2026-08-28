export interface DocumentDTO {
  id: string;
  userId: string;
  documentTypeId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  s3Key: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface UploadDocumentInput {
  userId: string;
  documentTypeId: string;
  applicationId?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  s3Key: string;
  expiresAt: Date;
}
