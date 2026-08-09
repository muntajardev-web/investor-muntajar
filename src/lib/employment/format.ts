import type { EmploymentApplicationStatus } from "@prisma/client";

type StatusTone = "neutral" | "accent" | "success" | "warning" | "danger";

/** Happy-path pipeline (Rejected is a terminal branch). */
export const EMPLOYMENT_STATUS_FLOW: EmploymentApplicationStatus[] = [
  "DRAFT",
  "PREPARING",
  "WAITING_PAYMENT",
  "SUBMITTED",
  "EMPLOYER_REVIEWING",
  "INTERVIEW",
  "MEDICAL",
  "VISA_PROCESSING",
  "OFFER_LETTER",
  "ACCEPTED",
  "COMPLETED",
];

const STATUS_LABELS: Record<EmploymentApplicationStatus, string> = {
  DRAFT: "Draft",
  PREPARING: "Preparing",
  WAITING_PAYMENT: "Waiting Payment",
  SUBMITTED: "Submitted",
  EMPLOYER_REVIEWING: "Employer Reviewing",
  INTERVIEW: "Interview Scheduled",
  MEDICAL: "Medical",
  VISA_PROCESSING: "Visa Processing",
  OFFER_LETTER: "Offer Letter",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};

const STATUS_TONES: Record<EmploymentApplicationStatus, StatusTone> = {
  DRAFT: "neutral",
  PREPARING: "accent",
  WAITING_PAYMENT: "warning",
  SUBMITTED: "accent",
  EMPLOYER_REVIEWING: "warning",
  INTERVIEW: "warning",
  MEDICAL: "warning",
  VISA_PROCESSING: "accent",
  OFFER_LETTER: "success",
  ACCEPTED: "success",
  REJECTED: "danger",
  COMPLETED: "success",
};

export const STATUS_DESCRIPTIONS: Record<EmploymentApplicationStatus, string> = {
  DRAFT: "Your application draft is saved. Continue building your package.",
  PREPARING: "Your application package is being prepared.",
  WAITING_PAYMENT: "Pay the application fee to unlock submission.",
  SUBMITTED: "Your application was submitted and is with our team.",
  EMPLOYER_REVIEWING: "An employer is reviewing your application.",
  INTERVIEW: "An interview has been scheduled for your application.",
  MEDICAL: "Medical checks are in progress for your placement.",
  VISA_PROCESSING: "Visa processing has started for your destination country.",
  OFFER_LETTER: "An offer letter is available for your placement.",
  ACCEPTED: "You accepted the offer. Final onboarding steps may follow.",
  REJECTED: "This application was rejected. Contact support if you need help.",
  COMPLETED: "Your overseas employment process is complete.",
};

export function formatEmploymentStatus(status: EmploymentApplicationStatus) {
  return STATUS_LABELS[status] ?? status;
}

export function employmentStatusTone(
  status: EmploymentApplicationStatus,
): StatusTone {
  return STATUS_TONES[status] ?? "neutral";
}

export function employmentStatusDescription(
  status: EmploymentApplicationStatus,
) {
  return STATUS_DESCRIPTIONS[status] ?? "";
}

export function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value?: Date | string | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency = "USD",
) {
  if (min == null && max == null) return "Negotiable";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function employmentProgressPercent(status: EmploymentApplicationStatus) {
  if (status === "REJECTED") return 100;
  const index = EMPLOYMENT_STATUS_FLOW.indexOf(status);
  if (index < 0) return 0;
  return Math.round((index / (EMPLOYMENT_STATUS_FLOW.length - 1)) * 100);
}

export function employmentStatusIndex(status: EmploymentApplicationStatus) {
  if (status === "REJECTED") {
    return EMPLOYMENT_STATUS_FLOW.indexOf("SUBMITTED");
  }
  return EMPLOYMENT_STATUS_FLOW.indexOf(status);
}

export function isStatusReached(
  current: EmploymentApplicationStatus,
  target: EmploymentApplicationStatus,
  opts?: { paidAt?: Date | string | null },
) {
  if (current === "COMPLETED") return true;
  if (current === "REJECTED") {
    return (
      target === "DRAFT" ||
      target === "PREPARING" ||
      target === "WAITING_PAYMENT" ||
      target === "SUBMITTED"
    );
  }

  // Paid applicants have cleared the waiting-payment step even if still preparing.
  if (
    target === "WAITING_PAYMENT" &&
    opts?.paidAt &&
    (current === "PREPARING" ||
      employmentStatusIndex(current) >
        EMPLOYMENT_STATUS_FLOW.indexOf("WAITING_PAYMENT"))
  ) {
    return true;
  }

  return employmentStatusIndex(current) >= employmentStatusIndex(target);
}
