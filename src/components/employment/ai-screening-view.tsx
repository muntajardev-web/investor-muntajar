"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ECard,
  ESection,
  EBadge,
  EProgress,
  EScoreDial,
  EStepHeader,
  EEmptyState,
  EButton,
  EWorkflowStep,
  ERatingBar,
} from "@/components/employment/employment-ds";
import type { WorkerAnalysisResult } from "@/lib/employment/analysis.types";
import { formatSalary } from "@/lib/employment/format";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Globe,
  Lightbulb,
  AlertTriangle,
  FileText,
} from "lucide-react";


type WorkflowStep = {
  id: string;
  title: string;
  detail?: string;
  status: "completed" | "running" | "waiting" | "error";
};

interface AIScreeningViewProps {
  analysis: WorkerAnalysisResult | null;
  hasProfile: boolean;
  hasDocuments: boolean;
  onRunAnalysis: () => Promise<void>;
  isRunning?: boolean;
  workflowSteps?: WorkflowStep[];
}

const DEFAULT_WORKFLOW: WorkflowStep[] = [
  { id: "upload", title: "Profile & Documents Loaded", detail: "All data ready for analysis", status: "waiting" },
  { id: "extract", title: "Extracting Candidate Information", detail: "Name, nationality, education, experience", status: "waiting" },
  { id: "experience", title: "Analyzing Work Experience", detail: "Scoring years and relevance", status: "waiting" },
  { id: "skills", title: "Analyzing Skills & Languages", detail: "Technical + soft skill mapping", status: "waiting" },
  { id: "gaps", title: "Checking Missing Requirements", detail: "Visa, document, certification gaps", status: "waiting" },
  { id: "report", title: "Generating Candidate Report", detail: "Employability score + recommendations", status: "waiting" },
];

function buildLiveWorkflow(isRunning: boolean, analysis: WorkerAnalysisResult | null): WorkflowStep[] {
  if (analysis) {
    return DEFAULT_WORKFLOW.map((s) => ({ ...s, status: "completed" as const }));
  }
  if (!isRunning) return DEFAULT_WORKFLOW;

  // Simulate step progression — in production this comes from backend polling
  return DEFAULT_WORKFLOW.map((s, i) => ({
    ...s,
    status: i === 0 ? "completed" : i === 1 ? "running" : "waiting",
  }));
}

export function AIScreeningView({
  analysis,
  hasProfile,
  hasDocuments,
  onRunAnalysis,
  isRunning = false,
}: AIScreeningViewProps) {
  const router = useRouter();
  const [running, setRunning] = React.useState(isRunning);
  const [workflow, setWorkflow] = React.useState<WorkflowStep[]>(buildLiveWorkflow(isRunning, analysis));
  const [activeTab, setActiveTab] = React.useState<"screening" | "report">(analysis ? "report" : "screening");

  // Simulate step-by-step progression when running
  React.useEffect(() => {
    if (!running || analysis) return;

    const steps = [...DEFAULT_WORKFLOW];
    let i = 0;

    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        return;
      }
      setWorkflow((prev) =>
        prev.map((s, idx) =>
          idx < i ? { ...s, status: "completed" } :
          idx === i ? { ...s, status: "running" } :
          { ...s, status: "waiting" },
        ),
      );
      i++;
    }, 1800);

    return () => clearInterval(interval);
  }, [running, analysis]);

  const handleRun = async () => {
    setRunning(true);
    setActiveTab("screening");
    try {
      await onRunAnalysis();
      router.refresh();
    } finally {
      setRunning(false);
    }
  };

  if (!hasProfile) {
    return (
      <div className="space-y-6">
        <EStepHeader number={3} title="AI Profile Screening" description="Automated analysis of your profile, skills, and documents." status="locked" />
        <EEmptyState
          icon={AlertTriangle}
          title="Complete your profile first"
          description="Add your personal information, education, and work experience before running AI screening."
          action={
            <Link href="/work/employment/profile">
              <EButton variant="primary" iconRight={ArrowRight}>Go to Profile Builder</EButton>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EStepHeader
        number={3}
        title="AI Profile Screening"
        description="Our AI engine analyzes your profile, skills, documents, and experience to generate a detailed candidate report."
        status={analysis ? "completed" : running ? "active" : "pending"}
      />

      {/* Tab Switcher */}
      {analysis && (
        <div className="flex gap-1 p-1 bg-stone-100 rounded-xl w-fit">
          {(["screening", "report"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab === "screening" ? "Screening Workflow" : "AI Report"}
            </button>
          ))}
        </div>
      )}

      {/* ── SCREENING WORKFLOW TAB ─────────────────────────────── */}
      {activeTab === "screening" && (
        <div className="space-y-5">
          {/* Trigger Card */}
          {!analysis && !running && (
            <ECard accent>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-stone-900">Ready to analyze your profile</h2>
                  <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                    {hasDocuments
                      ? "Your documents are uploaded. Run the AI engine to get your employability score, eligible markets, and salary estimate."
                      : "Profile is ready. For best results, upload your documents before running the analysis."}
                  </p>
                  {!hasDocuments && (
                    <Link href="/work/employment/documents" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-amber-700 hover:underline">
                      Upload documents first <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
                <EButton
                  variant="primary"
                  size="lg"
                  icon={Sparkles}
                  onClick={handleRun}
                  loading={running}
                >
                  {analysis ? "Re-run Analysis" : "Run AI Screening"}
                </EButton>
              </div>
            </ECard>
          )}

          {/* Running status */}
          {running && !analysis && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <svg className="animate-spin w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <div>
                <p className="text-sm font-bold text-amber-900">Analysis in progress…</p>
                <p className="text-xs text-amber-700">This takes 30–60 seconds. Do not close the page.</p>
              </div>
            </div>
          )}

          {/* Workflow steps */}
          <ECard>
            <h3 className="text-sm font-bold text-stone-900 mb-1">Analysis Workflow</h3>
            <p className="text-xs text-stone-400 mb-4">Real-time pipeline — each step runs sequentially.</p>
            {workflow.map((step) => (
              <EWorkflowStep key={step.id} title={step.title} status={step.status} detail={step.detail} />
            ))}
          </ECard>

          {/* Re-run if analysis exists */}
          {analysis && (
            <ECard className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-900">Analysis last run</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {new Date(analysis.analyzedAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                </p>
              </div>
              <EButton variant="secondary" icon={RefreshCw} onClick={handleRun} loading={running}>
                Re-run Analysis
              </EButton>
            </ECard>
          )}
        </div>
      )}

      {/* ── AI REPORT TAB ─────────────────────────────────────── */}
      {activeTab === "report" && analysis && (
        <AIReportView analysis={analysis} />
      )}
    </div>
  );
}

// ─── Step 4: AI Report View ────────────────────────────────────────────────

function AIReportView({ analysis }: { analysis: WorkerAnalysisResult }) {
  const salary = analysis.salaryEstimate
    ? formatSalary(analysis.salaryEstimate.monthlyMin, analysis.salaryEstimate.monthlyMax, analysis.salaryEstimate.currency)
    : "—";

  return (
    <div className="space-y-6">

      {/* Top row: Score + Summary */}
      <div className="grid sm:grid-cols-3 gap-5">
        <ECard className="flex flex-col items-center py-8 sm:col-span-1">
          <EScoreDial value={analysis.profileReadinessScore} size="lg" label="Employability Score" />
          <div className="mt-4 text-center">
            <p className="text-xs font-semibold text-stone-500">
              Analyzed {analysis.analyzedInputs.experienceCount} experience{analysis.analyzedInputs.experienceCount !== 1 ? "s" : ""} ·{" "}
              {analysis.analyzedInputs.skillsCount} skills
            </p>
          </div>
        </ECard>
        <ECard className="sm:col-span-2">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <h2 className="text-sm font-bold text-stone-900">Career Summary</h2>
          </div>
          <p className="text-sm leading-relaxed text-stone-600">
            {analysis.careerSummary || analysis.summary}
          </p>
          <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Est. Monthly Salary</p>
              <p className="text-xl font-black text-stone-900 tabular-nums mt-0.5">{salary}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Experience</p>
              <p className="text-xl font-black text-stone-900 mt-0.5">{analysis.analyzedInputs.experienceYears} yrs</p>
            </div>
          </div>
        </ECard>
      </div>

      {/* Ratings */}
      <ECard>
        <h3 className="text-sm font-bold text-stone-900 mb-5">Performance Ratings</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <ERatingBar label="Work Experience" value={Math.min(10, Math.round(analysis.analyzedInputs.experienceYears * 1.2))} />
          <ERatingBar label="Skills Coverage" value={Math.min(10, Math.round(analysis.analyzedInputs.skillsCount * 0.8))} />
          <ERatingBar label="Education Level" value={Math.min(10, analysis.analyzedInputs.educationCount * 3 + 4)} />
          <ERatingBar label="Profile Completeness" value={Math.round(analysis.profileReadinessScore / 10)} />
        </div>
      </ECard>

      {/* Strengths + Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-5">
        <ECard>
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strengths
          </h3>
          <ul className="space-y-2.5">
            {analysis.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-stone-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </ECard>
        <ECard>
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Areas to Improve
          </h3>
          <ul className="space-y-2.5">
            {analysis.weaknesses.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-stone-700">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </ECard>
      </div>

      {/* Eligible Countries + Industries */}
      <div className="grid sm:grid-cols-2 gap-5">
        <ECard>
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-stone-400" /> Recommended Countries
          </h3>
          <div className="space-y-3">
            {analysis.eligibleCountries.slice(0, 5).map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-stone-800">{c.name}</span>
                  <span className="text-xs font-bold tabular-nums text-stone-500">{c.score}%</span>
                </div>
                <EProgress value={c.score} showPct={false} size="sm" />
              </div>
            ))}
          </div>
        </ECard>
        <ECard>
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-stone-400" /> Suitable Industries
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.eligibleIndustries.map((i) => (
              <EBadge key={i.name} tone={i.score >= 70 ? "success" : i.score >= 50 ? "amber" : "neutral"}>
                {i.name} · {i.score}%
              </EBadge>
            ))}
          </div>
        </ECard>
      </div>

      {/* Missing docs + skills */}
      {(analysis.missingDocuments.length > 0 || analysis.missingSkills.length > 0) && (
        <ECard className="border-amber-200 bg-amber-50">
          <h3 className="text-sm font-bold text-amber-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Missing Requirements
          </h3>
          {analysis.missingDocuments.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Documents</p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingDocuments.map((d) => (
                  <EBadge key={d} tone="warning">{d}</EBadge>
                ))}
              </div>
            </div>
          )}
          {analysis.missingSkills.length > 0 && (
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((s) => (
                  <EBadge key={s} tone="warning">{s}</EBadge>
                ))}
              </div>
            </div>
          )}
        </ECard>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <ECard>
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" /> AI Recommendations
          </h3>
          <ul className="space-y-3">
            {analysis.suggestions.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500 shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </ECard>
      )}

      {/* CTA */}
      <div className="flex items-center gap-3">
        <Link href="/work/employment/jobs">
          <EButton variant="primary" iconRight={ArrowRight}>View Job Matches</EButton>
        </Link>
        <Link href="/work/employment/skills">
          <EButton variant="secondary">Improve Skills</EButton>
        </Link>
      </div>
    </div>
  );
}
