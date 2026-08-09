import type { DocumentProcessingStatus } from "@prisma/client";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const LABELS: Record<DocumentProcessingStatus, string> = {
  PENDING_UPLOAD: "Waiting for upload",
  UPLOADED: "Uploaded to R2",
  SCANNING: "Virus scanning",
  SCAN_FAILED: "Scan failed",
  SCAN_CLEAN: "Scan clean",
  OCR_QUEUED: "OCR queued",
  OCR_PROCESSING: "OCR processing",
  OCR_COMPLETE: "OCR complete",
  OCR_FAILED: "OCR failed",
  AI_QUEUED: "AI extraction queued",
  AI_EXTRACTING: "AI extracting",
  AI_COMPLETE: "AI extraction complete",
  AI_FAILED: "AI extraction failed",
  AWAITING_REVIEW: "Awaiting your review",
  EMBEDDING_QUEUED: "Embedding queued",
  EMBEDDING: "Creating embeddings",
  EMBEDDING_COMPLETE: "Embeddings ready",
  PROFILE_UPDATING: "Updating profile",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

const TONES: Record<DocumentProcessingStatus, Tone> = {
  PENDING_UPLOAD: "neutral",
  UPLOADED: "accent",
  SCANNING: "warning",
  SCAN_FAILED: "danger",
  SCAN_CLEAN: "success",
  OCR_QUEUED: "accent",
  OCR_PROCESSING: "warning",
  OCR_COMPLETE: "success",
  OCR_FAILED: "danger",
  AI_QUEUED: "accent",
  AI_EXTRACTING: "warning",
  AI_COMPLETE: "success",
  AI_FAILED: "danger",
  AWAITING_REVIEW: "warning",
  EMBEDDING_QUEUED: "accent",
  EMBEDDING: "warning",
  EMBEDDING_COMPLETE: "success",
  PROFILE_UPDATING: "warning",
  COMPLETED: "success",
  FAILED: "danger",
};

export function formatProcessingStatus(status: DocumentProcessingStatus) {
  return LABELS[status] ?? status;
}

export function processingStatusTone(status: DocumentProcessingStatus): Tone {
  return TONES[status] ?? "neutral";
}

export function isProcessingTerminal(status: DocumentProcessingStatus) {
  return [
    "COMPLETED",
    "FAILED",
    "SCAN_FAILED",
    "OCR_FAILED",
    "AI_FAILED",
    "AWAITING_REVIEW",
  ].includes(status);
}

export function pipelineSteps(status: DocumentProcessingStatus) {
  const rank: Record<string, number> = {
    PENDING_UPLOAD: 0,
    UPLOADED: 1,
    SCANNING: 1,
    SCAN_FAILED: 1,
    SCAN_CLEAN: 2,
    OCR_QUEUED: 2,
    OCR_PROCESSING: 2,
    OCR_COMPLETE: 3,
    OCR_FAILED: 3,
    AI_QUEUED: 3,
    AI_EXTRACTING: 3,
    AI_COMPLETE: 4,
    AI_FAILED: 4,
    AWAITING_REVIEW: 4,
    EMBEDDING_QUEUED: 5,
    EMBEDDING: 5,
    EMBEDDING_COMPLETE: 5,
    PROFILE_UPDATING: 5,
    COMPLETED: 6,
    FAILED: 0,
  };

  const current = rank[status] ?? 0;

  return [
    { key: "upload", label: "Upload → R2", done: current >= 1 },
    { key: "scan", label: "Virus scan", done: current >= 2 },
    { key: "ocr", label: "OCR", done: current >= 3 },
    { key: "ai", label: "AI extraction", done: current >= 4 },
    { key: "embed", label: "Embeddings", done: current >= 5 },
    { key: "profile", label: "Profile update", done: current >= 6 },
  ] as const;
}
