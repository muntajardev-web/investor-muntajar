import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Config } from "@/config";
import { ValidationError } from "@/lib";

const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
  },
  ...(s3Config.endpoint
    ? {
        endpoint: s3Config.endpoint,
        forcePathStyle: true,
      }
    : {}),
});

export const r2Storage = {
  buildKey(userId: string, kind: string, fileName: string): string {
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    return `${s3Config.documentsPrefix}/employment/${userId}/${kind}/${timestamp}-${sanitized}`;
  },

  validateUpload(mimeType: string, sizeBytes: number): void {
    if (
      !s3Config.allowedMimeTypes.includes(
        mimeType as (typeof s3Config.allowedMimeTypes)[number],
      )
    ) {
      throw new ValidationError(`File type '${mimeType}' is not allowed`);
    }

    if (sizeBytes > s3Config.maxFileSizeBytes) {
      throw new ValidationError(
        `File exceeds maximum size of ${s3Config.maxFileSizeBytes} bytes`,
      );
    }
  },

  async getPresignedUploadUrl(
    key: string,
    mimeType: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
      ContentType: mimeType,
    });

    return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  },

  async getPresignedDownloadUrl(
    key: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  },

  async headObject(key: string) {
    const command = new HeadObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });
    return s3Client.send(command);
  },

  async getObjectBuffer(key: string): Promise<{
    buffer: Buffer;
    contentType?: string;
  }> {
    const command = new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });
    const response = await s3Client.send(command);
    const bytes = await response.Body?.transformToByteArray();
    if (!bytes) {
      throw new ValidationError("Empty object from storage");
    }
    return {
      buffer: Buffer.from(bytes),
      contentType: response.ContentType,
    };
  },

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });
    await s3Client.send(command);
  },

  getBucket(): string {
    return s3Config.bucket;
  },
};

/** @deprecated use r2Storage — kept for student document service compatibility */
export const s3Service = {
  buildKey(userId: string, fileName: string): string {
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    return `${s3Config.documentsPrefix}/${userId}/${timestamp}-${sanitized}`;
  },
  validateUpload: r2Storage.validateUpload,
  getPresignedUploadUrl: r2Storage.getPresignedUploadUrl,
  getPresignedDownloadUrl: r2Storage.getPresignedDownloadUrl,
  deleteObject: r2Storage.deleteObject,
  getBucket: r2Storage.getBucket,
};
