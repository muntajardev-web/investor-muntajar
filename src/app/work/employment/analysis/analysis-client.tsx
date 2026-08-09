"use client";

import * as React from "react";
import { AIScreeningView } from "@/components/employment/ai-screening-view";
import type { WorkerAnalysisResult } from "@/lib/employment/analysis.types";

interface AnalysisPageClientProps {
  analysis: WorkerAnalysisResult | null;
  hasProfile: boolean;
  hasDocuments: boolean;
}

export function AnalysisPageClient({ analysis, hasProfile, hasDocuments }: AnalysisPageClientProps) {
  const [currentAnalysis, setCurrentAnalysis] = React.useState(analysis);

  const handleRunAnalysis = async () => {
    const res = await fetch("/api/employment/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      // Refresh will be triggered via router.refresh() in the view
    }
  };

  return (
    <AIScreeningView
      analysis={currentAnalysis}
      hasProfile={hasProfile}
      hasDocuments={hasDocuments}
      onRunAnalysis={handleRunAnalysis}
    />
  );
}
