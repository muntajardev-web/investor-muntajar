import type {
  ApplicationStatus,
  VerificationStatus,
  ConsultationStatus,
  NotificationType,
} from "@prisma/client";

export function formatDate(date: Date | string, style: "short" | "long" = "short") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelative(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

export function formatApplicationStatus(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under review",
    DOCUMENTS_REQUESTED: "Documents requested",
    INTERVIEW_SCHEDULED: "Interview scheduled",
    OFFER_RECEIVED: "Offer received",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
    DEFERRED: "Deferred",
  };
  return labels[status];
}

export function applicationStatusTone(
  status: ApplicationStatus,
): "neutral" | "accent" | "success" | "warning" | "danger" {
  if (status === "ACCEPTED" || status === "OFFER_RECEIVED") return "success";
  if (status === "REJECTED" || status === "WITHDRAWN") return "danger";
  if (
    status === "DOCUMENTS_REQUESTED" ||
    status === "INTERVIEW_SCHEDULED" ||
    status === "DEFERRED"
  )
    return "warning";
  if (status === "UNDER_REVIEW" || status === "SUBMITTED") return "accent";
  return "neutral";
}

export function formatVerificationStatus(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    PENDING: "Pending review",
    IN_REVIEW: "In review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    RESUBMISSION_REQUIRED: "Resubmit required",
  };
  return labels[status];
}

export function verificationStatusTone(
  status: VerificationStatus,
): "neutral" | "accent" | "success" | "warning" | "danger" {
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  if (status === "RESUBMISSION_REQUIRED") return "warning";
  if (status === "IN_REVIEW") return "accent";
  return "neutral";
}

export function formatConsultationStatus(status: ConsultationStatus): string {
  const labels: Record<ConsultationStatus, string> = {
    SCHEDULED: "Scheduled",
    CONFIRMED: "Confirmed",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No show",
  };
  return labels[status];
}

export function formatConsultationType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export function formatNotificationType(type: NotificationType): string {
  const labels: Record<NotificationType, string> = {
    APPLICATION_UPDATE: "Application",
    DOCUMENT_STATUS: "Document",
    PAYMENT: "Payment",
    RECOMMENDATION: "Recommendation",
    MESSAGE: "Message",
    DEADLINE_REMINDER: "Deadline",
    CONSULTATION: "Consultation",
    SYSTEM: "System",
  };
  return labels[type];
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
