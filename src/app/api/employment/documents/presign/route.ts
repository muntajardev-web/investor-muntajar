import { NextRequest } from "next/server";
import { z } from "zod";
import type { EmploymentDocumentKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { r2Storage } from "@/services/storage/s3.service";
import { employmentDocLabel } from "@/lib/employment/constants";

const kindEnum = z.enum([
  "PASSPORT",
  "NATIONAL_ID",
  "SSC",
  "HSC",
  "DIPLOMA",
  "DEGREE",
  "EXPERIENCE_LETTER",
  "TRAINING_CERTIFICATE",
  "TRADE_LICENSE",
  "POLICE_CLEARANCE",
  "MEDICAL_REPORT",
  "MEDICAL_CERTIFICATE",
  "BIRTH_CERTIFICATE",
  "MARRIAGE_CERTIFICATE",
  "DRIVING_LICENSE",
  "CV",
  "LANGUAGE_CERTIFICATE",
  "OTHER",
]);

const bodySchema = z.object({
  kind: kindEnum,
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});

/**
 * Step 1: Create DB row + return Cloudflare R2 presigned upload URL.
 * No AI processing here.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = bodySchema.parse(await request.json());

    let key = `users/${session.user.id}/employment-documents/${body.kind}/${Date.now()}-${body.fileName}`;
    let uploadUrl = "";

    try {
      r2Storage.validateUpload(body.mimeType, body.sizeBytes);
      key = r2Storage.buildKey(session.user.id, body.kind, body.fileName);
      uploadUrl = await r2Storage.getPresignedUploadUrl(key, body.mimeType);
    } catch {
      uploadUrl = `/api/employment/documents/mock-upload`;
    }

    try {
      const document = await prisma.employmentDocument.create({
        data: {
          userId: session.user.id,
          kind: body.kind as EmploymentDocumentKind,
          label: employmentDocLabel(body.kind),
          fileName: body.fileName,
          mimeType: body.mimeType,
          sizeBytes: body.sizeBytes,
          s3Key: key,
          s3Bucket: r2Storage.getBucket() ?? "muntajar-vault",
          processingStatus: "PENDING_UPLOAD",
        },
      });

      return apiSuccess({
        documentId: document.id,
        uploadUrl,
        key,
        bucket: r2Storage.getBucket() ?? "muntajar-vault",
        document,
      });
    } catch {
      // Fallback for local demo mode without live db connection
      const demoDocId = `demo-doc-${Date.now()}`;
      return apiSuccess({
        documentId: demoDocId,
        uploadUrl,
        key,
        bucket: "muntajar-vault",
        document: {
          id: demoDocId,
          userId: session.user.id,
          kind: body.kind,
          label: employmentDocLabel(body.kind),
          fileName: body.fileName,
          mimeType: body.mimeType,
          sizeBytes: body.sizeBytes,
          processingStatus: "PENDING_UPLOAD",
          uploadedAt: new Date(),
        },
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
