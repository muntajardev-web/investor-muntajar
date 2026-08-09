"use client";

import * as React from "react";
import Link from "next/link";
import {
  ECard,
  ESection,
  EBadge,
  EProgress,
  EStepHeader,
  EEmptyState,
  EButton,
} from "@/components/employment/employment-ds";
import { HIRING_JOBS_CATALOG, type HiringJob } from "@/lib/employment/hiring-jobs-catalog";
import {
  Building2,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Filter,
  Search,
  Shield,
  Plane,
  Heart,
  Home,
  Clock,
  ChevronDown,
} from "lucide-react";

type SortKey = "match" | "salary" | "country" | "newest";

interface JobMatchesViewProps {
  analysisComplete?: boolean;
  savedJobIds?: string[];
}

const COMPATIBILITY_SCORES: Record<string, number> = {
  "JOB-001": 96, "JOB-002": 94, "JOB-003": 88, "JOB-004": 92,
  "JOB-005": 85, "JOB-006": 90, "JOB-007": 93, "JOB-008": 87,
  "JOB-009": 89, "JOB-010": 82, "JOB-011": 80, "JOB-012": 78,
  "JOB-013": 91, "JOB-014": 86, "JOB-015": 84, "JOB-016": 83,
  "JOB-017": 81, "JOB-018": 79, "JOB-019": 77, "JOB-020": 85,
  "JOB-021": 75, "JOB-022": 88, "JOB-023": 70, "JOB-024": 72, "JOB-025": 91,
};

const MATCH_REASONS: Record<string, string[]> = {
  "JOB-001": ["Culinary background matches role", "Qatar visa sponsorship available", "Salary above your expectation"],
  "JOB-002": ["Senior level aligns with experience", "Marriott global brand opportunity", "Medical insurance included"],
  "JOB-007": ["Dubai hospitality hub", "Premium brand exposure", "Accommodation provided"],
  "JOB-013": ["Strong Sous Chef match", "QAR 7,500 exceeds target salary", "Housing benefit included"],
};

function extractSalaryNum(salary: string): number {
  const m = salary.match(/[\d,]+/);
  return m ? parseInt(m[0].replace(",", "")) : 0;
}

const COUNTRY_FLAGS: Record<string, string> = {
  "Qatar": "🇶🇦",
  "Saudi Arabia": "🇸🇦",
  "UAE": "🇦🇪",
  "Kuwait": "🇰🇼",
  "Oman": "🇴🇲",
  "Bahrain": "🇧🇭",
};

export function JobMatchesView({
  analysisComplete = true,
  savedJobIds: initialSaved = [],
}: JobMatchesViewProps) {
  const [sortBy, setSortBy] = React.useState<SortKey>("match");
  const [filterCountry, setFilterCountry] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [saved, setSaved] = React.useState<Set<string>>(new Set(initialSaved));
  const [expandedJob, setExpandedJob] = React.useState<string | null>(null);

  const countries = ["all", ...Array.from(new Set(HIRING_JOBS_CATALOG.map((j) => j.country)))];

  const filteredJobs = React.useMemo(() => {
    let jobs = [...HIRING_JOBS_CATALOG];

    // Filter by country
    if (filterCountry !== "all") {
      jobs = jobs.filter((j) => j.country === filterCountry);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.country.toLowerCase().includes(q),
      );
    }

    // Sort
    jobs.sort((a, b) => {
      if (sortBy === "match") return (COMPATIBILITY_SCORES[b.id] ?? 0) - (COMPATIBILITY_SCORES[a.id] ?? 0);
      if (sortBy === "salary") return extractSalaryNum(b.salary) - extractSalaryNum(a.salary);
      if (sortBy === "country") return a.country.localeCompare(b.country);
      // newest = by id descending
      return parseInt(b.id.split("-")[1]) - parseInt(a.id.split("-")[1]);
    });

    return jobs;
  }, [sortBy, filterCountry, search]);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!analysisComplete) {
    return (
      <div className="space-y-6">
        <EStepHeader
          number={6}
          title="Live Job Matching"
          description="Available after AI screening is complete."
          status="locked"
        />
        <EEmptyState
          icon={Sparkles}
          title="Complete AI Screening first"
          description="Run the AI analysis to unlock personalised job matches with compatibility scores and employer insights."
          action={
            <Link href="/work/employment/analysis">
              <EButton variant="primary" icon={Sparkles} iconRight={ArrowRight}>
                Run AI Screening
              </EButton>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EStepHeader
        number={6}
        title="Live Job Matching"
        description={`${filteredJobs.length} positions matched to your profile — ranked by AI compatibility score.`}
        status="active"
      />

      {/* Filters + Search */}
      <ECard className="!p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, countries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="appearance-none pl-3 pr-8 py-2.5 text-xs font-semibold border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
            >
              <option value="match">Highest Match</option>
              <option value="salary">Highest Salary</option>
              <option value="country">By Country</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Country Filters */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCountry(c)}
              className={`flex-none inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filterCountry === c
                  ? "bg-stone-950 text-white border-stone-950"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
              }`}
            >
              {c !== "all" && <span>{COUNTRY_FLAGS[c] ?? "🌍"}</span>}
              {c === "all" ? `All ${HIRING_JOBS_CATALOG.length} Jobs` : c}
            </button>
          ))}
        </div>
      </ECard>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <EEmptyState
            icon={Search}
            title="No jobs found"
            description="Try a different search or remove filters."
          />
        ) : (
          filteredJobs.map((job) => {
            const score = COMPATIBILITY_SCORES[job.id] ?? 75;
            const isExpanded = expandedJob === job.id;
            const isSaved = saved.has(job.id);
            const reasons = MATCH_REASONS[job.id] ?? [
              "Matches your experience level",
              `${job.country} is in your preferred region`,
              "Salary within your target range",
            ];

            return (
              <ECard key={job.id} className="!p-0 overflow-hidden">
                {/* Card header */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    {/* Company Initial */}
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 font-black text-lg shrink-0">
                      {job.company.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                            {job.id} · {job.industry}
                          </p>
                          <h3 className="text-base font-bold text-stone-950 mt-0.5 leading-snug">{job.title}</h3>
                          <p className="text-sm text-stone-500 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.company}
                          </p>
                        </div>

                        {/* Match score */}
                        <div className="text-right shrink-0">
                          <div
                            className={`text-2xl font-black tabular-nums ${
                              score >= 90 ? "text-emerald-600" :
                              score >= 80 ? "text-amber-700" :
                              "text-stone-600"
                            }`}
                          >
                            {score}%
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">match</p>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 text-xs text-stone-600">
                          <span>{COUNTRY_FLAGS[job.country] ?? "🌍"}</span>
                          {job.city}, {job.country}
                        </span>
                        <span className="text-stone-300">·</span>
                        <EBadge tone="success">{job.salary}/mo</EBadge>
                        <EBadge tone="neutral">{job.experience}</EBadge>
                      </div>
                    </div>
                  </div>

                  {/* Benefit tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.benefits.split(",").map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-[10px] font-semibold text-stone-600"
                      >
                        {b.toLowerCase().includes("accommodation") && <Home className="w-3 h-3" />}
                        {b.toLowerCase().includes("medical") && <Heart className="w-3 h-3" />}
                        {b.toLowerCase().includes("transport") && <Plane className="w-3 h-3" />}
                        {b.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link href={`/work/employment/review?job=${job.id}`}>
                      <EButton variant="primary" size="sm">Apply Now</EButton>
                    </Link>
                    <button
                      onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                      className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                    <button
                      onClick={() => toggleSave(job.id)}
                      className="p-2 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors ml-auto"
                      title={isSaved ? "Unsave" : "Save job"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-stone-100 p-5 sm:p-6 bg-stone-50/50 space-y-4">
                    {/* Why this job matches */}
                    <div>
                      <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Why this matches you</p>
                      <ul className="space-y-1.5">
                        {reasons.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-stone-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Education</p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">{job.education}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">English Required</p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">{job.english}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Visa</p>
                        <EBadge tone="success" className="mt-0.5">Employer Sponsored</EBadge>
                      </div>
                    </div>
                  </div>
                )}
              </ECard>
            );
          })
        )}
      </div>
    </div>
  );
}
