"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Send,
  Clock,
  Bookmark,
  Compass,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquare,
  Home,
  Edit,
  ShieldCheck,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StudentDashboardClient({
  userName = "Tashin",
}: {
  userName?: string;
}) {
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const displayName = userName === "Student Candidate" || !userName ? "Tashin" : userName;

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 sm:p-9 font-sans text-slate-900 select-none">
      <div className="max-w-[1440px] mx-auto space-y-9">
        
        {/* ── 1. GREETING HEADLINE ── */}
        <div className="space-y-1 pt-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            Good morning, {displayName} <span className="inline-block">👋</span>
          </h1>
          <p className="text-[#64748B] text-sm font-medium">
            Your application journey is on track. Let&apos;s achieve your study abroad goals!
          </p>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT CONTENT COLUMN (8 COLS ON DESKTOP) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-9">
            
            {/* ── 2. TOP STAT CARDS ROW (4 CARDS) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Universities Shortlisted */}
              <div className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-100/90 flex items-center gap-4 hover:border-slate-200 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 shadow-2xs">
                  <LayoutGrid className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-bold text-[#0F172A] leading-none">8</p>
                  <p className="text-xs text-[#64748B] font-medium leading-tight mt-1">
                    Universities<br />Shortlisted
                  </p>
                </div>
              </div>

              {/* Card 2: Applications Submitted */}
              <div className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-100/90 flex items-center gap-4 hover:border-slate-200 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 shadow-2xs">
                  <Send className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-bold text-[#0F172A] leading-none">3</p>
                  <p className="text-xs text-[#64748B] font-medium leading-tight mt-1">
                    Applications<br />Submitted
                  </p>
                </div>
              </div>

              {/* Card 3: Applications In Progress */}
              <div className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-100/90 flex items-center gap-4 hover:border-slate-200 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-bold text-[#0F172A] leading-none">4</p>
                  <p className="text-xs text-[#64748B] font-medium leading-tight mt-1">
                    Applications<br />In Progress
                  </p>
                </div>
              </div>

              {/* Card 4: Upcoming Deadlines */}
              <div className="p-6 rounded-2xl bg-white shadow-2xs border border-slate-100/90 flex items-center gap-4 hover:border-slate-200 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center shrink-0 shadow-2xs">
                  <Bookmark className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-bold text-[#0F172A] leading-none">2</p>
                  <p className="text-xs text-[#64748B] font-medium leading-tight mt-1">
                    Upcoming<br />Deadlines
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. RECOMMENDED FOR YOU SECTION ── */}
            <div className="p-8 rounded-2xl bg-white shadow-2xs border border-slate-100/90 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0F172A]">Recommended for You</h2>
                <Link
                  href="/dashboard/recommendations"
                  className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors"
                >
                  <span>View all recommendations</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>

              {/* UNIVERSITY RECOMMENDATION CARDS LIST */}
              <div className="space-y-4">
                {/* 1. TUM */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center shrink-0 tracking-wider shadow-2xs">
                      TUM
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0F172A] leading-tight">
                        Technical University of Munich
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">Germany • Munich</p>
                      <span className="inline-block px-3 py-1 rounded-lg bg-slate-100/80 text-slate-700 text-xs font-medium mt-1">
                        M.Sc. Data Engineering
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-10 self-end md:self-center">
                    <div className="space-y-1 text-right md:text-left">
                      <span className="text-sm font-semibold text-emerald-600 block">Excellent Fit</span>
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-1.5 rounded-xs bg-emerald-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-emerald-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-emerald-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-emerald-500" />
                      </div>
                      <p className="text-xs text-slate-400 font-normal">92% Match</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs text-slate-400 font-normal">Tuition</p>
                      <p className="text-sm font-bold text-[#0F172A]">€0 / year</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs text-slate-400 font-normal">Deadline</p>
                      <p className="text-sm font-bold text-[#0F172A]">31 May 2027</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark("tum")}
                      className={cn(
                        "w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                        bookmarks["tum"]
                          ? "bg-orange-50 border-orange-200 text-orange-500"
                          : "bg-white border-slate-200 text-slate-400 hover:text-slate-700",
                      )}
                    >
                      <Bookmark className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* 2. University of Alberta */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0 text-center leading-tight p-1 shadow-2xs">
                      U ALBERTA
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0F172A] leading-tight">
                        University of Alberta
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">Canada • Edmonton</p>
                      <span className="inline-block px-3 py-1 rounded-lg bg-slate-100/80 text-slate-700 text-xs font-medium mt-1">
                        MSc in Computer Science
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-10 self-end md:self-center">
                    <div className="space-y-1 text-right md:text-left">
                      <span className="text-sm font-semibold text-emerald-600 block">Strong Fit</span>
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-1.5 rounded-xs bg-emerald-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-emerald-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-emerald-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-slate-200" />
                      </div>
                      <p className="text-xs text-slate-400 font-normal">85% Match</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs text-slate-400 font-normal">Tuition</p>
                      <p className="text-sm font-bold text-[#0F172A]">CAD 19,000 / year</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs text-slate-400 font-normal">Deadline</p>
                      <p className="text-sm font-bold text-[#0F172A]">1 Mar 2027</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark("ualberta")}
                      className={cn(
                        "w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                        bookmarks["ualberta"]
                          ? "bg-orange-50 border-orange-200 text-orange-500"
                          : "bg-white border-slate-200 text-slate-400 hover:text-slate-700",
                      )}
                    >
                      <Bookmark className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* 3. TU Delft */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center shrink-0 tracking-wider shadow-2xs">
                      TU Delft
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0F172A] leading-tight">
                        Delft University of Technology
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">Netherlands • Delft</p>
                      <span className="inline-block px-3 py-1 rounded-lg bg-slate-100/80 text-slate-700 text-xs font-medium mt-1">
                        MSc in Data Science
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-10 self-end md:self-center">
                    <div className="space-y-1 text-right md:text-left">
                      <span className="text-sm font-semibold text-sky-600 block">Good Fit</span>
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-1.5 rounded-xs bg-sky-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-sky-500" />
                        <span className="w-4 h-1.5 rounded-xs bg-slate-200" />
                        <span className="w-4 h-1.5 rounded-xs bg-slate-200" />
                      </div>
                      <p className="text-xs text-slate-400 font-normal">78% Match</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs text-slate-400 font-normal">Tuition</p>
                      <p className="text-sm font-bold text-[#0F172A]">€16,500 / year</p>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs text-slate-400 font-normal">Deadline</p>
                      <p className="text-sm font-bold text-[#0F172A]">15 Apr 2027</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark("tudelft")}
                      className={cn(
                        "w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                        bookmarks["tudelft"]
                          ? "bg-orange-50 border-orange-200 text-orange-500"
                          : "bg-white border-slate-200 text-slate-400 hover:text-slate-700",
                      )}
                    >
                      <Bookmark className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Button (Explore more universities) */}
              <div className="pt-2">
                <Link
                  href="/dashboard/recommendations"
                  className="w-full p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 text-center font-bold text-sm text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-slate-500" strokeWidth={2} />
                  <span>Explore more universities</span>
                </Link>
              </div>
            </div>

            {/* ── 4. APPLICATION PROGRESS PIPELINE SECTION (EXACT MATCHING SCREENSHOT) ── */}
            <div className="p-8 rounded-2xl bg-white shadow-2xs border border-slate-100/90 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0F172A]">Application Progress</h2>
                <Link
                  href="/dashboard/applications"
                  className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors"
                >
                  <span>View all applications</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>

              {/* PLAIN STACKED STAGES CONNECTED BY ARROWS */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 overflow-x-auto pb-1 text-center sm:text-left">
                {/* Stage 1 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100/90 text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">
                      <Home className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-normal">Not Started</p>
                      <p className="text-lg font-bold text-[#0F172A] leading-none mt-0.5">5</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 ml-3" strokeWidth={2} />
                </div>

                {/* Stage 2 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center shrink-0 shadow-2xs">
                      <Edit className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-normal">In Progress</p>
                      <p className="text-lg font-bold text-[#0F172A] leading-none mt-0.5">4</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 ml-3" strokeWidth={2} />
                </div>

                {/* Stage 3 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 shadow-2xs">
                      <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-normal">Submitted</p>
                      <p className="text-lg font-bold text-[#0F172A] leading-none mt-0.5">3</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 ml-3" strokeWidth={2} />
                </div>

                {/* Stage 4 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0 shadow-2xs">
                      <FileCheck className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-normal">Under Review</p>
                      <p className="text-lg font-bold text-[#0F172A] leading-none mt-0.5">1</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 ml-3" strokeWidth={2} />
                </div>

                {/* Stage 5 */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageSquare className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-normal">Decision</p>
                    <p className="text-lg font-bold text-[#0F172A] leading-none mt-0.5">0</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDEBAR COLUMN (4 COLS ON DESKTOP) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-9">
            
            {/* 1. PROFILE COMPLETION CARD */}
            <div className="p-8 rounded-2xl bg-white shadow-2xs border border-slate-100/90 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0F172A]">Profile Completion</h3>
                <span className="text-base font-extrabold text-[#10B981]">82%</span>
              </div>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full w-[82%]" />
              </div>

              <p className="text-xs text-slate-500 font-normal leading-relaxed pt-1">
                Complete the remaining sections to unlock more personalised recommendations.
              </p>

              <Link
                href="/dashboard/profile"
                className="w-full h-11 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                Continue Profile
              </Link>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs font-medium">
                <div className="flex items-center gap-3 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2} />
                  <span>Personal Information</span>
                </div>
                <div className="flex items-center gap-3 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2} />
                  <span>Academic Background</span>
                </div>
                <div className="flex items-center gap-3 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2} />
                  <span>English Proficiency</span>
                </div>

                <div className="flex items-center gap-3 text-[#F97316] font-bold">
                  <div className="w-4 h-4 rounded-full bg-[#F97316] text-white flex items-center justify-center shrink-0 font-black text-[9px]">
                    ➔
                  </div>
                  <span>Upload Documents</span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 font-normal">
                  <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  <span>Work Experience (Optional)</span>
                </div>
              </div>
            </div>

            {/* 2. UPCOMING DEADLINES CARD (MATCHING EXACT SCREENSHOT WITH DATE CHIPS) */}
            <div className="p-8 rounded-2xl bg-white shadow-2xs border border-slate-100/90 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0F172A]">Upcoming Deadlines</h3>
                <Link href="/dashboard/applications" className="text-xs font-semibold text-[#F97316] hover:text-[#EA580C]">
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex flex-col items-center justify-center shrink-0 border border-orange-100 shadow-2xs">
                    <span className="text-xs font-bold leading-none">31</span>
                    <span className="text-[9px] font-bold uppercase leading-none mt-0.5 text-orange-500">MAY</span>
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate">Technical University of Munich</p>
                    <p className="text-xs text-slate-400 font-normal">Application Deadline</p>
                  </div>
                  <span className="text-xs font-medium text-slate-600 shrink-0">31 May 2027</span>
                </div>

                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex flex-col items-center justify-center shrink-0 border border-orange-100 shadow-2xs">
                    <span className="text-xs font-bold leading-none">01</span>
                    <span className="text-[9px] font-bold uppercase leading-none mt-0.5 text-orange-500">MAR</span>
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate">University of Alberta</p>
                    <p className="text-xs text-slate-400 font-normal">Application Deadline</p>
                  </div>
                  <span className="text-xs font-medium text-slate-600 shrink-0">1 Mar 2027</span>
                </div>

                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex flex-col items-center justify-center shrink-0 border border-orange-100 shadow-2xs">
                    <span className="text-xs font-bold leading-none">15</span>
                    <span className="text-[9px] font-bold uppercase leading-none mt-0.5 text-orange-500">APR</span>
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate">TU Delft</p>
                    <p className="text-xs text-slate-400 font-normal">Application Deadline</p>
                  </div>
                  <span className="text-xs font-medium text-slate-600 shrink-0">15 Apr 2027</span>
                </div>
              </div>
            </div>

            {/* 3. RECENT ACTIVITY CARD (MATCHING EXACT SCREENSHOT WITH SQUARE BADGES) */}
            <div className="p-8 rounded-2xl bg-white shadow-2xs border border-slate-100/90 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0F172A]">Recent Activity</h3>
                <Link href="/dashboard/notifications" className="text-xs font-semibold text-[#F97316] hover:text-[#EA580C]">
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] leading-tight">Document uploaded</p>
                    <p className="text-xs text-slate-500 font-medium truncate">HSC Transcript.pdf</p>
                  </div>
                  <span className="text-[11px] font-normal text-slate-400 shrink-0">2h ago</span>
                </div>

                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0 shadow-2xs">
                    <Send className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] leading-tight">Application submitted</p>
                    <p className="text-xs text-slate-500 font-medium truncate">University of Toronto</p>
                  </div>
                  <span className="text-[11px] font-normal text-slate-400 shrink-0">1d ago</span>
                </div>

                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageSquare className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] leading-tight">Message received</p>
                    <p className="text-xs text-slate-500 font-medium truncate">From: Study Abroad Advisor</p>
                  </div>
                  <span className="text-[11px] font-normal text-slate-400 shrink-0">2d ago</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
