import type { Metadata } from "next";
import { requireAuth } from "@/server/auth/session";
import { employmentTrackingService } from "@/services/employment/tracking.service";
import { ApplicationTrackerView } from "@/components/employment/application-tracker-view";

export const metadata: Metadata = {
  title: "Application Tracker — Overseas Employment | Muntajar",
  description: "Track your overseas employment application from submission to successful placement.",
};

export default async function EmploymentTrackerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuth();
  const { applications } = await employmentTrackingService.getApplicationTracking(session.user.id);

  // Map real DB applications to the shape ApplicationTrackerView expects
  // (falls back to demo data if none exist)
  const mapped = applications.map((app) => ({
    id: app.id,
    jobId: app.jobListing?.id ?? "APP",
    jobTitle: app.jobListing?.title ?? "Overseas Employment",
    company: app.jobListing?.company ?? "Employer",
    country: app.jobListing?.country ?? "—",
    salary: "—",
    appliedDate: new Date(app.createdAt).toLocaleDateString("en-US", { dateStyle: "long" }),
    currentStage: "applied" as const,
    stages: [
      { stage: "applied" as const, label: "Applied", date: new Date(app.createdAt).toLocaleDateString(), status: "active" as const },
      { stage: "under_review" as const, label: "Under Review", status: "pending" as const },
      { stage: "interview_scheduled" as const, label: "Interview", status: "pending" as const },
      { stage: "interview_completed" as const, label: "Interview Done", status: "pending" as const },
      { stage: "offer_received" as const, label: "Offer", status: "pending" as const },
      { stage: "visa_processing" as const, label: "Visa", status: "pending" as const },
      { stage: "relocation" as const, label: "Relocation", status: "pending" as const },
      { stage: "completed" as const, label: "Placed", status: "pending" as const },
    ],
  }));

  return <ApplicationTrackerView applications={mapped.length > 0 ? mapped : undefined} />;
}
