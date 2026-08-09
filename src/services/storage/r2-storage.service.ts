import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "@/lib";

const r2AccountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "1bcc061fdf9ab260ead275b289f90e0a";
const r2Endpoint = process.env.CLOUDFLARE_R2_S3_ENDPOINT || `https://${r2AccountId}.r2.cloudflarestorage.com`;
const r2Bucket = process.env.AWS_S3_BUCKET || "muntajar";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

// Safely log S3 initialization details without exposing secrets
console.log(`[R2_INIT] bucket: ${r2Bucket}`);
console.log(`[R2_INIT] endpoint: ${r2Endpoint}`);
console.log(`[R2_INIT] account_id: ${r2AccountId}`);
console.log(`[R2_INIT] access_key_length: ${accessKeyId.length}`);
console.log(`[R2_INIT] secret_key_exists: ${Boolean(secretAccessKey)}`);

// Configure AWS SDK v3 S3 Client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export interface UploadBufferOptions {
  userId: string;
  category: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}

export class R2StorageService {
  /**
   * Uploads a file buffer directly to Cloudflare R2 bucket & verifies via HeadObjectCommand
   */
  public static async uploadDirectBuffer(options: UploadBufferOptions) {
    const { userId, category, fileName, mimeType, buffer } = options;

    // 1. Validation before upload
    if (!accessKeyId) {
      throw new Error("Missing AWS_ACCESS_KEY_ID in environment configuration.");
    }
    if (!secretAccessKey) {
      throw new Error("Missing AWS_SECRET_ACCESS_KEY in environment configuration.");
    }
    if (!r2Bucket) {
      throw new Error("Missing AWS_S3_BUCKET in environment configuration.");
    }

    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2);
    console.log(`[R2_UPLOAD] File received: ${fileName}`);
    console.log(`[R2_UPLOAD] Size: ${sizeMb}MB (${buffer.length} bytes)`);
    console.log(`[R2_UPLOAD] Type: ${mimeType}`);

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const s3Key = `documents/${userId}/${category.toLowerCase()}/${Date.now()}-${sanitizedFileName}`;

    console.log(`[R2_UPLOAD] Connecting to Cloudflare R2... Endpoint: ${r2Endpoint} | Bucket: ${r2Bucket}`);

    // 2. PutObjectCommand Upload directly into 'muntajar' bucket
    const putCommand = new PutObjectCommand({
      Bucket: r2Bucket,
      Key: s3Key,
      Body: buffer,
      ContentType: mimeType,
    });

    try {
      await s3Client.send(putCommand);
      console.log(`[R2_UPLOAD] PutObjectCommand succeeded into bucket '${r2Bucket}'. Verifying via HeadObjectCommand...`);

      // 3. Immediately perform HeadObjectCommand to verify upload succeeded
      const headCommand = new HeadObjectCommand({
        Bucket: r2Bucket,
        Key: s3Key,
      });

      const headResult = await s3Client.send(headCommand);
      console.log(`[R2_UPLOAD] HeadObject verified ✓ Size: ${headResult.ContentLength} bytes | ETag: ${headResult.ETag}`);
      console.log(`[R2_UPLOAD] Object Key: ${s3Key}`);

      const publicUrl = `${r2Endpoint}/${r2Bucket}/${s3Key}`;

      return {
        success: true,
        s3Key,
        s3Bucket: r2Bucket,
        publicUrl,
        sizeBytes: headResult.ContentLength || buffer.length,
        eTag: headResult.ETag,
      };
    } catch (err: any) {
      const errorCode = err.name || err.code || "AWS_S3_R2_ERROR";
      console.error(`[R2_UPLOAD ERROR] ${errorCode}: ${err.message}`);
      logger.error(`[R2_UPLOAD ERROR] ${errorCode}: ${err.message}`, err);
      // Re-throw full AWS SDK error so caller stops OCR & AI immediately
      throw err;
    }
  }

  /**
   * Health Check: Performs a ListObjectsV2Command request to verify Cloudflare R2 connectivity & credentials
   */
  public static async checkHealth() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: r2Bucket,
        MaxKeys: 1,
      });

      const response = await s3Client.send(command);
      return {
        status: "Connected",
        statusCode: 200,
        bucket: r2Bucket,
        endpoint: r2Endpoint,
        keyCount: response.KeyCount || 0,
      };
    } catch (err: any) {
      const errName = err.name || "";
      const errMessage = err.message || "";

      let status = "Storage Error";
      if (errName === "AccessDenied" || errName === "InvalidAccessKeyId" || errMessage.includes("Signature")) {
        status = "Authentication Failed";
      } else if (errName === "NoSuchBucket" || errMessage.includes("Bucket")) {
        status = "Bucket Not Found";
      } else if (errName === "InvalidCredentials" || errMessage.includes("Credentials")) {
        status = "Invalid Credentials";
      }

      return {
        status,
        errorName: errName,
        errorMessage: errMessage,
        bucket: r2Bucket,
        endpoint: r2Endpoint,
      };
    }
  }

  /**
   * Presigned Upload URL Generator
   */
  public static async createPresignedUploadUrl(options: {
    userId: string;
    category: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }) {
    const { userId, category, fileName, mimeType } = options;
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const s3Key = `documents/${userId}/${category.toLowerCase()}/${Date.now()}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: r2Bucket,
      Key: s3Key,
      ContentType: mimeType,
    });

    let uploadUrl = "";
    try {
      uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (err: any) {
      uploadUrl = `${r2Endpoint}/${r2Bucket}/${s3Key}?presigned=true`;
    }

    const publicUrl = `${r2Endpoint}/${r2Bucket}/${s3Key}`;

    return {
      uploadUrl,
      publicUrl,
      s3Key,
      s3Bucket: r2Bucket,
      expiresInSeconds: 3600,
    };
  }
}
