import { z } from "zod";

const documentType = z.enum([
  "PASSPORT",
  "TRANSCRIPT",
  "IELTS_CERTIFICATE",
  "STATEMENT_OF_PURPOSE",
  "RECOMMENDATION_LETTER",
  "FINANCIAL_PROOF",
  "OTHER",
]);

export const documentUploadSchema = z.object({
  type: documentType,
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});
