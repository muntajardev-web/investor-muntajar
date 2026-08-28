import type { Metadata } from "next";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";
import { employmentAnalysisService } from "@/services/employment/analysis.service";
import { computeProfileCompletion } from "@/lib/employment/profile/completion";
import { EmploymentDashboardHome } from "@/components/employment/dashboard-home";

export const metadata: Metadata = {
  title: "Dashboard — Overseas Employment | Muntajar",
  description: "Your overseas employment command center. Track your journey, matched jobs, documents, and visa status.",
};

export default async function EmploymentDashboardPage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);
  const analysis = employmentAnalysisService.parseStored(profile?.aiAnalysis);
  const profileCompletion = profile ? computeProfileCompletion(profile) : 0;
  const workflowStep = (profile as any)?.workflowStep ?? 1;

  return (
    <EmploymentDashboardHome
      candidateName={session.user.name?.split(" ")[0] ?? "Candidate"}
      profileCompletion={profileCompletion}
      workflowStep={workflowStep}
      documentsUploaded={0}
      documentsTotal={8}
      applicationsCount={0}
      analysis={analysis}
    />
  );
}
