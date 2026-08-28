import type { Metadata } from "next";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";
import { employmentAnalysisService } from "@/services/employment/analysis.service";
import { JobMatchesView } from "@/components/employment/job-matches-view";

export const metadata: Metadata = {
  title: "Job Matches — Overseas Employment | Muntajar",
  description: "AI-matched overseas job openings ranked by compatibility score.",
};

export default async function EmploymentJobsPage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);
  const analysis = employmentAnalysisService.parseStored(profile?.aiAnalysis);

  return (
    <JobMatchesView
      analysisComplete={!!analysis}
      savedJobIds={[]}
    />
  );
}
