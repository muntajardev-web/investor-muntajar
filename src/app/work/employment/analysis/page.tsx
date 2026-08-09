import type { Metadata } from "next";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";
import { employmentAnalysisService } from "@/services/employment/analysis.service";
import { computeProfileCompletion } from "@/lib/employment/profile/completion";
import { AnalysisPageClient } from "./analysis-client";

export const metadata: Metadata = {
  title: "AI Profile Screening — Overseas Employment | Muntajar",
  description: "AI-powered candidate screening: employability score, strengths, gaps, and salary estimate.",
};

export default async function EmploymentAnalysisPage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);
  const analysis = employmentAnalysisService.parseStored(profile?.aiAnalysis);

  const profileCompletion = profile ? computeProfileCompletion(profile) : 0;

  const hasProfile = profileCompletion > 20;
  const hasDocuments = false; // Will be populated from DB when available

  return (
    <AnalysisPageClient
      analysis={analysis}
      hasProfile={hasProfile}
      hasDocuments={hasDocuments}
    />
  );
}
