"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  ChevronRight,
  Search,
  Sparkles,
  GraduationCap,
  Award,
  Globe2,
  Building2,
  TrendingUp,
  FileCheck2,
  Filter,
} from "lucide-react";
import { UniversityLogoBadge } from "@/components/student/university-logo-badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface CuratedProgramItem {
  id: string;
  universityName: string;
  universitySlug: string;
  city?: string;
  countryName: string;
  countryCode: string;
  flagCode: string;
  degreeLevel: string;
  programName: string;
  field: string;
  matchScore: number;
  qsRank?: string;
  tuitionFormatted: string;
  applicationDeadline: string;
  scholarshipAvailable: string | null;
  scholarshipType?: string;
  requirements: {
    status: "MET" | "REQUIRED";
    label: string;
  }[];
  fitReasons: string[];
}

interface RecommendationsClientProps {
  initialPrograms?: CuratedProgramItem[];
}

const DEFAULT_PROGRAMS: CuratedProgramItem[] = [
  {
    id: "utoronto-msc-cs",
    universityName: "University of Toronto",
    universitySlug: "university-of-toronto",
    city: "Toronto",
    countryName: "Canada",
    countryCode: "CA",
    flagCode: "ca",
    degreeLevel: "Master's Degree",
    programName: "MSc in Computer Science & AI",
    field: "Computer Science",
    matchScore: 98,
    qsRank: "#21 QS World Ranking • #1 Canada",
    tuitionFormatted: "$18,500 / year",
    applicationDeadline: "January 15, 2027",
    scholarshipAvailable: "Up to $10,000 Entrance Merit Scholarship",
    scholarshipType: "Merit Grant",
    requirements: [
      { status: "MET", label: "GPA Requirement Met (Verified 4.50/5.00)" },
      { status: "MET", label: "IELTS Academic Requirement Met (Band 7.5)" },
      { status: "REQUIRED", label: "Statement of Purpose (SOP) Required" },
      { status: "REQUIRED", label: "2 Academic Letters of Recommendation" },
    ],
    fitReasons: [
      "Your academic CGPA exceeds the minimum admission criteria for graduate entry.",
      "Annual tuition fits within your specified budget cap ($25,000 USD/year).",
      "Eligible for 3-Year Post-Graduation Work Permit (PGWP) in Canada.",
    ],
  },
  {
    id: "tum-msc-ai",
    universityName: "Technical University of Munich",
    universitySlug: "technical-university-of-munich",
    city: "Munich",
    countryName: "Germany",
    countryCode: "DE",
    flagCode: "de",
    degreeLevel: "Master's Degree",
    programName: "MSc in Data Engineering & Analytics",
    field: "Data Science",
    matchScore: 95,
    qsRank: "#28 QS World Ranking • #1 Germany",
    tuitionFormatted: "Tuition-Free (€150 semester fee)",
    applicationDeadline: "May 31, 2027",
    scholarshipAvailable: "DAAD Merit Stipend (€934/month)",
    scholarshipType: "100% Tuition Waiver",
    requirements: [
      { status: "MET", label: "Academic CGPA Met (1.6 German Grade Equivalence)" },
      { status: "MET", label: "English Proficiency Verified (IELTS 7.5)" },
      { status: "REQUIRED", label: "Course Syllabus Matching Form" },
    ],
    fitReasons: [
      "Tuition-free public university education matching your financial preferences.",
      "High graduate employment outcome rate across the European Union.",
      "Offers 18-month post-study job search visa for international graduates.",
    ],
  },
  {
    id: "ubc-msc-se",
    universityName: "University of British Columbia",
    universitySlug: "university-of-british-columbia",
    city: "Vancouver",
    countryName: "Canada",
    countryCode: "CA",
    flagCode: "ca",
    degreeLevel: "Master's Degree",
    programName: "Master of Software Systems",
    field: "Software Engineering",
    matchScore: 92,
    qsRank: "#34 QS World Ranking",
    tuitionFormatted: "$22,400 / year",
    applicationDeadline: "February 28, 2027",
    scholarshipAvailable: "International Faculty Entrance Grant ($8,500)",
    scholarshipType: "Faculty Award",
    requirements: [
      { status: "MET", label: "Bachelor's Degree Equivalence Verified" },
      { status: "MET", label: "IELTS Band 7.5 Accepted" },
      { status: "REQUIRED", label: "Official Transcripts Copy" },
    ],
    fitReasons: [
      "Strong curriculum alignment with your computer science background.",
      "Co-op industry internship placement program included in degree.",
      "Direct pathway for Canadian permanent residency via provincial nominee stream.",
    ],
  },
];

function CountryFlag({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      className="w-4.5 h-3.5 object-cover rounded-xs border border-stone-200/80 shrink-0 inline-block"
    />
  );
}

export function RecommendationsClient({ initialPrograms }: RecommendationsClientProps) {
  const [savedPrograms, setSavedPrograms] = React.useState<Record<string, boolean>>({});
  const [selectedCountryFilter, setSelectedCountryFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const programs = initialPrograms?.length ? initialPrograms : DEFAULT_PROGRAMS;

  const filteredPrograms = React.useMemo(() => {
    return programs.filter((p) => {
      const matchCountry = selectedCountryFilter === "ALL" || p.countryCode === selectedCountryFilter;
      const matchSearch =
        !searchQuery ||
        p.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.field.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCountry && matchSearch;
    });
  }, [programs, selectedCountryFilter, searchQuery]);

  const toggleSave = (id: string) => {
    setSavedPrograms((prev) => {
      const nextState = !prev[id];
      toast.success(nextState ? "Saved university program!" : "Removed from saved shortlist");
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-stone-900 pb-20">
      
      {/* ── HEADER BANNER ── */}
      <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Matched Admissions & Scholarships</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
              Matched University Programs
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Matched based on your verified transcripts, GPA, IELTS score, and tuition budget.
            </p>
          </div>

          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <FileCheck2 className="w-4 h-4 text-orange-400" />
            <span>Update Assessment</span>
          </Link>
        </div>

        {/* 4 TOP STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Matches Found</span>
            <span className="text-base font-extrabold text-stone-900 block">{programs.length} Universities</span>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-1">
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block">Max Scholarship</span>
            <span className="text-base font-extrabold text-orange-700 block">Up to $18,500/yr</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Average AI Fit</span>
            <span className="text-base font-extrabold text-stone-900 block">95% Match Score</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">OCR Status</span>
            <span className="text-base font-extrabold text-emerald-800 block">Verified ✓</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & COUNTRY FILTER BAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search university or degree program..."
            className="w-full h-11 pl-11 pr-4 rounded-2xl border border-stone-200/90 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-2xs"
          />
        </div>

        {/* Country Filter Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-200/90 text-xs font-bold shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setSelectedCountryFilter("ALL")}
            className={cn(
              "px-4 py-2 rounded-xl transition-all cursor-pointer",
              selectedCountryFilter === "ALL"
                ? "bg-stone-950 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50",
            )}
          >
            All ({programs.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCountryFilter("CA")}
            className={cn(
              "px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
              selectedCountryFilter === "CA"
                ? "bg-stone-950 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50",
            )}
          >
            <CountryFlag code="ca" />
            <span>Canada</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCountryFilter("DE")}
            className={cn(
              "px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
              selectedCountryFilter === "DE"
                ? "bg-stone-950 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50",
            )}
          >
            <CountryFlag code="de" />
            <span>Germany</span>
          </button>
        </div>
      </div>

      {/* ── CURATED RECOMMENDATION CARDS LIST ── */}
      <div className="space-y-6">
        {filteredPrograms.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/90 space-y-3">
            <Building2 className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No universities match your search query</h3>
            <p className="text-xs text-stone-500">Try clearing your search query or selecting a different country filter.</p>
          </div>
        ) : (
          filteredPrograms.map((program) => {
            const isSaved = savedPrograms[program.id];

            return (
              <div
                key={program.id}
                className="p-6 sm:p-8 rounded-3xl border border-stone-200/90 bg-white hover:border-orange-500/50 hover:shadow-md transition-all space-y-6 group"
              >
                {/* Card Header: Logo, Name, Ranking & AI Match Badge */}
                <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-5">
                  <div className="flex items-start gap-4">
                    <UniversityLogoBadge
                      name={program.universityName}
                      className="w-14 h-14 shrink-0 rounded-2xl border border-stone-200/80 shadow-2xs group-hover:scale-105 transition-transform"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-extrabold text-stone-950 tracking-tight">
                          {program.universityName}
                        </h2>
                        {program.qsRank && (
                          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                            {program.qsRank}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 font-semibold flex items-center gap-1.5">
                        <CountryFlag code={program.flagCode} />
                        <span>
                          {program.city ? `${program.city}, ` : ""}
                          {program.countryName}
                        </span>
                      </p>

                      <p className="text-sm font-bold text-stone-900 pt-0.5">
                        {program.degreeLevel} in {program.programName.replace(/^MSc in |^Master of /, "")}
                      </p>
                    </div>
                  </div>

                  {/* AI Match Badge & Bookmark Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black shadow-2xs">
                      {program.matchScore}% AI Match
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSave(program.id)}
                      className={cn(
                        "p-2.5 rounded-2xl border transition-all cursor-pointer shrink-0",
                        isSaved
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-stone-50 border-stone-200/80 text-stone-500 hover:bg-stone-100 hover:text-stone-900",
                      )}
                      title={isSaved ? "Saved" : "Save Program"}
                    >
                      <Heart className={cn("w-4 h-4", isSaved && "fill-rose-600")} />
                    </button>
                  </div>
                </div>

                {/* Key Program Facts: Tuition, Deadline & Highlighted Scholarship Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Annual Tuition
                    </span>
                    <span className="text-sm font-extrabold text-stone-950">
                      {program.tuitionFormatted}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Application Deadline
                    </span>
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      {program.applicationDeadline}
                    </span>
                  </div>

                  {/* Highlighted Scholarship Card */}
                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block">
                        Scholarship Guarantee
                      </span>
                      {program.scholarshipType && (
                        <span className="text-[9px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded border border-orange-200">
                          {program.scholarshipType}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-orange-900 block truncate">
                      🎁 {program.scholarshipAvailable || "Institutional Grants Available"}
                    </span>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                    Admission Requirements Checklist
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {program.requirements.map((req, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold",
                          req.status === "MET"
                            ? "bg-emerald-50/60 border-emerald-200/80 text-emerald-950"
                            : "bg-amber-50/60 border-amber-200/80 text-amber-950",
                        )}
                      >
                        {req.status === "MET" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Three Fit Reasons */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                    Profile Compatibility Factors
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600 font-semibold">
                    {program.fitReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-2 flex items-center justify-end gap-3 text-xs font-bold">
                  <Link
                    href={`/services/study-abroad`}
                    className="px-5 py-2.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-all cursor-pointer"
                  >
                    View Details
                  </Link>

                  <Link
                    href="/dashboard/applications"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white transition-all cursor-pointer shadow-2xs font-extrabold hover:-translate-y-0.5"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </Link>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
