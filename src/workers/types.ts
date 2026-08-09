import type { RecommendationInput } from "@/types/recommendation-engine";

export type JobName =
  | "generate-recommendations"
  | "sync-university-data"
  | "send-email"
  | "process-document";

export interface GenerateRecommendationsPayload
  extends Partial<RecommendationInput> {
  userId: string;
}

export interface SendEmailPayload {
  to: string;
  template: string;
  data: Record<string, unknown>;
}

export interface ProcessDocumentPayload {
  documentId: string;
  userId: string;
}

export interface SyncUniversityDataPayload {
  source: string;
}

export type JobPayload =
  | { name: "generate-recommendations"; data: GenerateRecommendationsPayload }
  | { name: "send-email"; data: SendEmailPayload }
  | { name: "process-document"; data: ProcessDocumentPayload }
  | { name: "sync-university-data"; data: SyncUniversityDataPayload };
