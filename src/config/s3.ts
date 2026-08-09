import { env } from "./env";

function resolveEndpoint() {
  if (env.AWS_S3_ENDPOINT) return env.AWS_S3_ENDPOINT;
  if (env.R2_ACCOUNT_ID) {
    return `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  return undefined;
}

export const s3Config = {
  region: env.AWS_REGION || "auto",
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  bucket: env.AWS_S3_BUCKET,
  documentsPrefix: env.AWS_S3_DOCUMENTS_PREFIX,
  endpoint: resolveEndpoint(),
  publicUrl: env.R2_PUBLIC_URL || undefined,
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
  allowedMimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const,
} as const;
