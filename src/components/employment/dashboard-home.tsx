"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Send,
  Bookmark,
  Calendar,
  AlertCircle,
  ChevronDown,
  Filter,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Upload,
  FileText,
  Building2,
  Plus,
  Flame,
  Zap,
  Clock,
  ArrowRight,
  Circle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHomeProps {
  candidateName?: string;
  profileCompletion?: number;
  workflowStep?: number;
  documentsUploaded?: number;
  documentsTotal?: number;
  applicationsCount?: number;
  analysis?: any;
}

export function EmploymentDashboardHome({
  candidateName = "Student",
}: DashboardHomeProps) {
  const [bookmarkedJobs, setBookmarkedJobs] = React.useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarkedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 font-sans selection:bg-amber-100 selection:text-amber-900 pb-16">
      
      {/* ── 1. TOP GREETING HEADER ───────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-stone-950 tracking-tight flex items-center gap-2">
          Good evening, {candidateName} 👋
        </h1>
        <p className="text-sm text-stone-500 font-normal">
          Your journey to overseas employment starts here. Let&apos;s get you hired.
        </p>
      </div>

      {/* ── 2. 4 STAT CARDS ROW ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Active Jobs */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Active Jobs</p>
            <p className="text-2xl font-black text-stone-950 tracking-tight mt-0.5">25</p>
            <p className="text-[11px] text-stone-400 font-medium mt-1">Updated today</p>
          </div>
        </div>

        {/* Stat 2: Applications */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Applications</p>
            <p className="text-2xl font-black text-stone-950 tracking-tight mt-0.5">3</p>
            <p className="text-[11px] text-stone-400 font-medium mt-1">Submitted</p>
          </div>
        </div>

        {/* Stat 3: Shortlisted */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Shortlisted</p>
            <p className="text-2xl font-black text-stone-950 tracking-tight mt-0.5">2</p>
            <p className="text-[11px] text-stone-400 font-medium mt-1">By employers</p>
          </div>
        </div>

        {/* Stat 4: Interviews */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Interviews</p>
            <p className="text-2xl font-black text-stone-950 tracking-tight mt-0.5">1</p>
            <p className="text-[11px] text-stone-400 font-medium mt-1">This month</p>
          </div>
        </div>
      </div>

      {/* ── 3. ACTION REQUIRED CALLOUT BANNER ──────────────────────── */}
      <div className="bg-[#FFFBEB] rounded-2xl p-5 sm:p-6 border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-stone-950">
              2 actions needed to unlock better matches
            </p>
            <ul className="mt-1 space-y-1">
              <li className="text-xs text-stone-700 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                Upload GAMCA Medical Clearance
              </li>
              <li className="text-xs text-stone-700 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                Complete AI Screening
              </li>
            </ul>
          </div>
        </div>

        <Link href="/work/employment/documents" className="shrink-0">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D97706] text-white font-extrabold text-xs px-6 py-3 rounded-2xl transition-all shadow-sm cursor-pointer"
          >
            <span>Continue Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* ── 4. MAIN 2-COLUMN SPLIT GRID ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (8 of 12 width) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Job Matches Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans font-extrabold text-lg text-stone-950">Top Job Matches for You</h2>
              <Link href="/work/employment/jobs" className="text-xs font-extrabold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                <span>View all jobs</span>
                <span>→</span>
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
                <span>All Countries</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
                <span>Salary Range</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
                <Filter className="w-3.5 h-3.5 text-stone-500" />
                <span>Filters</span>
              </button>
            </div>

            {/* Job Card List */}
            <div className="space-y-3.5">
              {/* Job 1: Mechanical Technician */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#012169] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    aramco
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-sans font-extrabold text-base text-stone-950">Mechanical Technician</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold">
                        Excellent Match
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">Saudi Aramco • Saudi Arabia</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">Full Time</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">On-site</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  <div className="text-right">
                    <p className="text-xs text-stone-400 font-semibold">Salary</p>
                    <p className="text-sm font-extrabold text-stone-950">2,800 – 3,200 SAR</p>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">Deadline: <span className="text-stone-700 font-bold">15 Aug 2025</span></p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleBookmark("job1")}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        bookmarkedJobs["job1"]
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : "bg-white border-stone-200 text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <Link href="/work/employment/jobs">
                      <button type="button" className="px-4 py-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 font-extrabold text-xs transition-all cursor-pointer">
                        View Job
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Job 2: Cabin Crew */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#5C0632] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    QATAR
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-sans font-extrabold text-base text-stone-950">Cabin Crew</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold">
                        Excellent Match
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">Qatar Airways • Qatar</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">Full Time</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">On-site</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  <div className="text-right">
                    <p className="text-xs text-stone-400 font-semibold">Salary</p>
                    <p className="text-sm font-extrabold text-stone-950">5,500 – 6,500 QAR</p>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">Deadline: <span className="text-stone-700 font-bold">10 Aug 2025</span></p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleBookmark("job2")}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        bookmarkedJobs["job2"]
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : "bg-white border-stone-200 text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <Link href="/work/employment/jobs">
                      <button type="button" className="px-4 py-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 font-extrabold text-xs transition-all cursor-pointer">
                        View Job
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Job 3: Civil Site Engineer */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-black text-[10px] shrink-0 shadow-xs tracking-tighter">
                    DAMAC
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-sans font-extrabold text-base text-stone-950">Civil Site Engineer</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-extrabold">
                        Strong Match
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">DAMAC Properties • UAE</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">Full Time</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">On-site</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  <div className="text-right">
                    <p className="text-xs text-stone-400 font-semibold">Salary</p>
                    <p className="text-sm font-extrabold text-stone-950">6,000 – 7,500 AED</p>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">Deadline: <span className="text-stone-700 font-bold">20 Aug 2025</span></p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleBookmark("job3")}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        bookmarkedJobs["job3"]
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : "bg-white border-stone-200 text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <Link href="/work/employment/jobs">
                      <button type="button" className="px-4 py-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 font-extrabold text-xs transition-all cursor-pointer">
                        View Job
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link href="/work/employment/jobs" className="text-xs font-extrabold text-amber-700 hover:underline">
                View all 25 jobs →
              </Link>
            </div>
          </div>

          {/* Application Overview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans font-extrabold text-lg text-stone-950">Application Overview</h2>
              <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
                <span>This month</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center space-y-1 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mb-1" />
                <p className="text-[11px] font-semibold text-stone-500">Applied</p>
                <p className="text-xl font-black text-stone-950">3</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center space-y-1 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block mb-1" />
                <p className="text-[11px] font-semibold text-stone-500">Shortlisted</p>
                <p className="text-xl font-black text-stone-950">2</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center space-y-1 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block mb-1" />
                <p className="text-[11px] font-semibold text-stone-500">Interview</p>
                <p className="text-xl font-black text-stone-950">1</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center space-y-1 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mb-1" />
                <p className="text-[11px] font-semibold text-stone-500">Offered</p>
                <p className="text-xl font-black text-stone-950">0</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center space-y-1 shadow-2xs col-span-2 sm:col-span-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mb-1" />
                <p className="text-[11px] font-semibold text-stone-500">Rejected</p>
                <p className="text-xl font-black text-stone-950">0</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR COLUMN (4 of 12 width) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Completion Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-extrabold text-sm text-stone-950">Profile Completion</h3>
              <span className="text-sm font-extrabold text-amber-700 tabular-nums">42%</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[42%]" />
            </div>

            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Complete your profile to get better job matches.
            </p>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-center gap-2.5 text-stone-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personal Information</span>
              </div>

              <div className="flex items-center gap-2.5 text-stone-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Work Experience</span>
              </div>

              <div className="flex items-center gap-2.5 text-stone-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Education</span>
              </div>

              <div className="flex items-center gap-2.5 text-amber-900 font-bold">
                <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px] text-amber-800 font-black shrink-0">
                  !
                </div>
                <span>Documents</span>
              </div>

              <div className="flex items-center gap-2.5 text-stone-400 font-medium">
                <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                <span>Certifications</span>
              </div>

              <div className="flex items-center gap-2.5 text-stone-400 font-medium">
                <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                <span>AI Screening</span>
              </div>
            </div>
          </div>

          {/* Today's Tasks Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-extrabold text-sm text-stone-950">Today&apos;s Tasks</h3>
              <Link href="/work/employment/profile" className="text-xs text-amber-700 hover:underline font-extrabold">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {/* Task 1 */}
              <Link href="/work/employment/documents" className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-950 group-hover:text-amber-900 transition-colors">Upload GAMCA Medical Clearance</p>
                  <p className="text-[10px] text-stone-500 font-medium">Required for Gulf jobs</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 transition-colors shrink-0 mt-1" />
              </Link>

              {/* Task 2 */}
              <Link href="/work/employment/analysis" className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-950 group-hover:text-amber-900 transition-colors">Complete AI Screening</p>
                  <p className="text-[10px] text-stone-500 font-medium">Get matched with better jobs</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 transition-colors shrink-0 mt-1" />
              </Link>

              {/* Task 3 */}
              <Link href="/work/employment/experience" className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-950 group-hover:text-blue-900 transition-colors">Add Work Experience</p>
                  <p className="text-[10px] text-stone-500 font-medium">Improve your profile</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-blue-600 transition-colors shrink-0 mt-1" />
              </Link>
            </div>
          </div>

          {/* Recommended for You Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-extrabold text-sm text-stone-950">Recommended for You</h3>
              <Link href="/work/employment/jobs" className="text-xs text-amber-700 hover:underline font-extrabold">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    O
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-stone-950">Electrical Engineer</p>
                    <p className="text-[10px] text-stone-500 font-medium">Oman • Oil & Gas</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-stone-950">1,900 - 2,400 OMR</span>
                  <Bookmark className="w-3.5 h-3.5 text-stone-400 hover:text-stone-700 cursor-pointer" />
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    K
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-stone-950">HVAC Technician</p>
                    <p className="text-[10px] text-stone-500 font-medium">Kuwait • Facilities</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-stone-950">160 - 200 KWD</span>
                  <Bookmark className="w-3.5 h-3.5 text-stone-400 hover:text-stone-700 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
