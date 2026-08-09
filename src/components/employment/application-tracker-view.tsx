"use client";

import * as React from "react";
import {
  ECard,
  ESection,
  EBadge,
  EStepHeader,
  EEmptyState,
  EButton,
} from "@/components/employment/employment-ds";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Briefcase,
  Calendar,
  MessageSquare,
  Plane,
  FileText,
  Star,
  Building2,
} from "lucide-react";

type TrackingStage =
  | "applied"
  | "under_review"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_received"
  | "visa_processing"
  | "relocation"
  | "completed";

interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  country: string;
  salary: string;
  appliedDate: string;
  currentStage: TrackingStage;
  stages: {
    stage: TrackingStage;
    label: string;
    date?: string;
    notes?: string;
    nextAction?: string;
    status: "completed" | "active" | "pending";
  }[];
}

const STAGE_CONFIG: Record<TrackingStage, { label: string; icon: React.ElementType; description: string }> = {
  applied: { label: "Applied", icon: FileText, description: "Your application was submitted successfully." },
  under_review: { label: "Under Review", icon: Clock, description: "The employer is reviewing your profile and documents." },
  interview_scheduled: { label: "Interview Scheduled", icon: Calendar, description: "An interview has been arranged with the employer." },
  interview_completed: { label: "Interview Completed", icon: MessageSquare, description: "You have completed the employer interview." },
  offer_received: { label: "Offer Received", icon: Star, description: "A job offer letter has been issued." },
  visa_processing: { label: "Visa Processing", icon: FileText, description: "Your visa application is being processed by the embassy." },
  relocation: { label: "Relocation", icon: Plane, description: "Your travel and accommodation arrangements are underway." },
  completed: { label: "Completed", icon: CheckCircle2, description: "You have successfully started your overseas placement." },
};

const STAGE_ORDER: TrackingStage[] = [
  "applied",
  "under_review",
  "interview_scheduled",
  "interview_completed",
  "offer_received",
  "visa_processing",
  "relocation",
  "completed",
];

// Sample applications for demo
const DEMO_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "APP-001",
    jobId: "JOB-001",
    jobTitle: "Chef de Partie",
    company: "Qatar Airways Catering",
    country: "Qatar",
    salary: "QAR 5,500",
    appliedDate: "July 22, 2026",
    currentStage: "under_review",
    stages: [
      { stage: "applied", label: "Applied", date: "July 22, 2026", notes: "Application submitted with all required documents.", status: "completed" },
      { stage: "under_review", label: "Under Review", date: "July 24, 2026", notes: "Shortlisted — employer reviewing profile.", nextAction: "Wait for interview invitation. Expected response: Aug 5, 2026.", status: "active" },
      { stage: "interview_scheduled", label: "Interview", status: "pending" },
      { stage: "interview_completed", label: "Interview Done", status: "pending" },
      { stage: "offer_received", label: "Offer", status: "pending" },
      { stage: "visa_processing", label: "Visa", status: "pending" },
      { stage: "relocation", label: "Relocation", status: "pending" },
      { stage: "completed", label: "Placed", status: "pending" },
    ],
  },
  {
    id: "APP-002",
    jobId: "JOB-002",
    jobTitle: "Senior Chef de Partie",
    company: "Marriott Doha",
    country: "Qatar",
    salary: "QAR 6,800",
    appliedDate: "July 18, 2026",
    currentStage: "applied",
    stages: [
      { stage: "applied", label: "Applied", date: "July 18, 2026", notes: "Application submitted.", nextAction: "Awaiting employer review. Expected response: Aug 1, 2026.", status: "active" },
      { stage: "under_review", label: "Under Review", status: "pending" },
      { stage: "interview_scheduled", label: "Interview", status: "pending" },
      { stage: "interview_completed", label: "Interview Done", status: "pending" },
      { stage: "offer_received", label: "Offer", status: "pending" },
      { stage: "visa_processing", label: "Visa", status: "pending" },
      { stage: "relocation", label: "Relocation", status: "pending" },
      { stage: "completed", label: "Placed", status: "pending" },
    ],
  },
];

interface ApplicationTrackerViewProps {
  applications?: ApplicationRecord[];
}

export function ApplicationTrackerView({ applications = DEMO_APPLICATIONS }: ApplicationTrackerViewProps) {
  const [selectedApp, setSelectedApp] = React.useState<ApplicationRecord>(applications[0]);

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <EStepHeader
          number={9}
          title="Application Tracker"
          description="Track every application from submission to successful placement."
          status="pending"
        />
        <EEmptyState
          icon={Briefcase}
          title="No applications yet"
          description="Apply for jobs from the Job Matches section to start tracking your progress."
          action={
            <Link href="/work/employment/jobs">
              <EButton variant="primary" iconRight={ArrowRight}>Browse Job Matches</EButton>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EStepHeader
        number={9}
        title="Application Tracker"
        description={`Tracking ${applications.length} application${applications.length !== 1 ? "s" : ""} — from submission to overseas placement.`}
        status="active"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Application list */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">Your Applications</p>
          {applications.map((app) => {
            const cfg = STAGE_CONFIG[app.currentStage];
            const isSelected = selectedApp.id === app.id;
            return (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-stone-950 border-stone-950 text-white"
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${isSelected ? "text-stone-400" : "text-stone-400"} uppercase tracking-widest`}>
                      {app.jobId}
                    </p>
                    <p className={`text-sm font-bold mt-0.5 ${isSelected ? "text-white" : "text-stone-900"}`}>
                      {app.jobTitle}
                    </p>
                    <p className={`text-xs mt-0.5 ${isSelected ? "text-stone-400" : "text-stone-500"}`}>
                      {app.company}
                    </p>
                  </div>
                  <EBadge
                    tone={
                      app.currentStage === "completed" ? "success" :
                      app.currentStage === "offer_received" ? "success" :
                      app.currentStage === "under_review" ? "amber" :
                      "neutral"
                    }
                  >
                    {cfg.label}
                  </EBadge>
                </div>
                <div className={`flex items-center gap-1.5 mt-3 text-xs ${isSelected ? "text-stone-400" : "text-stone-500"}`}>
                  <Calendar className="w-3 h-3" />
                  Applied {app.appliedDate}
                </div>
              </button>
            );
          })}

          <Link href="/work/employment/jobs">
            <EButton variant="secondary" size="sm" className="w-full justify-center">
              + Add Application
            </EButton>
          </Link>
        </div>

        {/* Timeline detail */}
        <div className="lg:col-span-2 space-y-5">
          {/* App header */}
          <ECard>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center font-black text-stone-600 text-lg shrink-0">
                {selectedApp.company.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{selectedApp.jobId}</p>
                <h2 className="text-lg font-bold text-stone-950 mt-0.5">{selectedApp.jobTitle}</h2>
                <p className="text-sm text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {selectedApp.company} · {selectedApp.country}
                </p>
              </div>
              <EBadge tone="success" className="shrink-0">{selectedApp.salary}</EBadge>
            </div>
          </ECard>

          {/* Progress bar across stages */}
          <ECard>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Application Progress</p>
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar pb-2">
              {selectedApp.stages.map((s, i) => (
                <React.Fragment key={s.stage}>
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${
                        s.status === "completed"
                          ? "border-emerald-400 bg-emerald-50"
                          : s.status === "active"
                          ? "border-amber-400 bg-amber-50 ring-4 ring-amber-100"
                          : "border-stone-200 bg-white"
                      }`}
                    >
                      {s.status === "completed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : s.status === "active" ? (
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-stone-300" />
                      )}
                    </div>
                    <span className={`text-[9px] font-semibold text-center mt-1 leading-tight max-w-[52px] ${
                      s.status === "completed" ? "text-emerald-700" :
                      s.status === "active" ? "text-amber-800" :
                      "text-stone-400"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < selectedApp.stages.length - 1 && (
                    <div className={`h-0.5 flex-1 min-w-[8px] mb-4 ${
                      selectedApp.stages[i + 1].status !== "pending" ? "bg-emerald-300" : "bg-stone-200"
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </ECard>

          {/* Stage details */}
          <ECard>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Stage Timeline</p>
            <div className="space-y-0">
              {selectedApp.stages.map((s) => {
                const StageCfg = STAGE_CONFIG[s.stage];
                const Icon = StageCfg.icon;
                return (
                  <div
                    key={s.stage}
                    className={`flex items-start gap-4 py-4 border-b border-stone-100 last:border-0 ${
                      s.status === "pending" ? "opacity-40" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        s.status === "completed"
                          ? "bg-emerald-50 border border-emerald-200"
                          : s.status === "active"
                          ? "bg-amber-50 border border-amber-200"
                          : "bg-stone-50 border border-stone-200"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          s.status === "completed" ? "text-emerald-600" :
                          s.status === "active" ? "text-amber-600" :
                          "text-stone-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-stone-900">{StageCfg.label}</p>
                        {s.status === "active" && <EBadge tone="amber" dot>Active</EBadge>}
                        {s.status === "completed" && <EBadge tone="success">Done</EBadge>}
                      </div>
                      {s.date && (
                        <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {s.date}
                        </p>
                      )}
                      {s.notes && (
                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{s.notes}</p>
                      )}
                      {s.nextAction && s.status === "active" && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                          <p className="text-xs font-bold text-amber-800">Next Action</p>
                          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{s.nextAction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ECard>
        </div>
      </div>
    </div>
  );
}
