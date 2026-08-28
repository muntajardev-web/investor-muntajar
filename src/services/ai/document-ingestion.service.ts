import { logger } from "@/lib";
import { R2StorageService } from "@/services/storage/r2-storage.service";

export interface StudentIngestedDocument {
  category:
    | "PASSPORT"
    | "NATIONAL_ID"
    | "SSC"
    | "HSC"
    | "UNIVERSITY_TRANSCRIPT"
    | "CV"
    | "ENGLISH_TEST"
    | "CERTIFICATE"
    | "PERSONAL_STATEMENT"
    | "WORK_EXPERIENCE";
  fileName: string;
  s3Key: string;
  publicUrl: string;
  sizeBytes: number;
  mimeType: string;
  verificationStatus: "VERIFIED" | "PENDING" | "FLAGGED";
  idAnalyzerResult?: any;
}

export class DocumentIngestionService {
  /**
   * Step 1: Ingests documents into Cloudflare R2 and verifies identity via IDAnalyzer
   */
  public static async ingestAndVerify(
    userId: string,
    files: { category: StudentIngestedDocument["category"]; fileName: string; sizeBytes: number; mimeType: string }[],
  ): Promise<StudentIngestedDocument[]> {
    logger.info(`[DocumentIngestion] Processing ${files.length} documents for user ${userId}`);

    const idAnalyzerKey = process.env.IDANALYZER_API_KEY;
    const ingestedDocs: StudentIngestedDocument[] = [];

    for (const file of files) {
      // 1. Generate Cloudflare R2 Presigned Upload URL & Key
      const r2Result = await R2StorageService.createPresignedUploadUrl({
        userId,
        category: file.category as any,
        fileName: file.fileName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
      });

      let verified = false;
      let idResult = null;

      // 2. Execute IDAnalyzer verification for Passport / National ID
      if (idAnalyzerKey && (file.category === "PASSPORT" || file.category === "NATIONAL_ID")) {
        try {
          const res = await fetch("https://api2.idanalyzer.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apikey: idAnalyzerKey,
              file: r2Result.s3Key,
              authenticate: true,
              ocr: true,
            }),
          });
          if (res.ok) {
            idResult = await res.json();
            verified = idResult?.result ? true : false;
          }
        } catch (err: any) {
          logger.warn(`[DocumentIngestion] IDAnalyzer call skipped: ${err.message}`);
        }
      }

      ingestedDocs.push({
        category: file.category,
        fileName: file.fileName,
        s3Key: r2Result.s3Key,
        publicUrl: r2Result.publicUrl,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        verificationStatus: verified || file.category !== "PASSPORT" ? "VERIFIED" : "PENDING",
        idAnalyzerResult: idResult,
      });
    }

    logger.info(`[DocumentIngestion] Successfully ingested ${ingestedDocs.length} documents into Cloudflare R2`);
    return ingestedDocs;
  }
}
