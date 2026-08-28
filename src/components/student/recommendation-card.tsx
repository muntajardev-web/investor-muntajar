"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreBreakdown {
  academic?: number;
  budget?: number;
  subject?: number;
  intake?: number;
  scholarship?: number;
  employment?: number;
  ranking?: number;
  [key: string]: number | undefined;
}

interface KeyFactors {
  whyThisUniversity?: string;
  pros?: string[];
  cons?: string[];
  admissionChance?: string;
  scholarshipChance?: string;
  visaChance?: string;
  employmentOpportunity?: string;
  overallScore?: number;
  eligibilityScore?: number;
  scoreBreakdown?: ScoreBreakdown;
}

interface RecommendationCardProps {
  id: string;
  name: string;
  country?: string;
  city?: string | null;
  program?: string | null;
  matchScore?: number;
  logoUrl?: string | null;
  admissionChance?: string;
  tuitionFee?: number | null;
  currency?: string;
  keyFactors?: KeyFactors | null;
  justification?: string | null;
  rank?: number;
  className?: string;
}

const scoreLabelMap: Record<string, string> = {
  academic: "Academic fit",
  budget: "Budget fit",
  subject: "Subject match",
  intake: "Intake timing",
  scholarship: "Scholarship",
  employment: "Work outlook",
  ranking: "Ranking",
};

function tidyCopy(text: string) {
  return text.replace(/(\d+\.\d{2})\d+/g, (_full, trimmed: string) => {
    const n = Number(trimmed);
    return Number.isFinite(n) ? String(Math.round(n)) : trimmed;
  });
}

function formatChance(level?: string) {
  if (!level) return null;
  if (level === "insufficient_data") return "Limited data";
  return level.replace(/_/g, " ");
}

function chanceTone(level?: string) {
  const key = (level ?? "").toLowerCase();
  if (key === "high") return "text-emerald-700";
  if (key === "medium") return "text-orange-700";
  if (key === "low") return "text-stone-500";
  return "text-stone-500";
}

function UniversityMark({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-stone-200/80 bg-white sm:h-24 sm:w-24">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={96}
          height={96}
          className="h-[72%] w-[72%] object-contain"
        />
      ) : (
        <span className="text-3xl text-stone-300">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function RecommendationCard({
  name,
  country,
  city,
  program,
  matchScore,
  logoUrl,
  tuitionFee,
  currency,
  keyFactors,
  rank,
  className,
}: RecommendationCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [logoFailed, setLogoFailed] = React.useState(false);

  const kf = keyFactors;
  const scoreBreakdown = kf?.scoreBreakdown;
  const breakdownEntries = scoreBreakdown
    ? Object.entries(scoreBreakdown).filter(
        ([, value]) => value != null && value > 0,
      )
    : [];
  const score = Math.round(matchScore ?? kf?.overallScore ?? 0);

  const formattedTuition =
    tuitionFee != null
      ? `${currency ?? "USD"} ${Number(tuitionFee).toLocaleString()}/yr`
      : null;

  const place = [city, country].filter(Boolean).join(", ");
  const resolvedLogo = logoFailed ? null : logoUrl;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-stone-200/70 bg-white p-5 sm:p-7",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(232,93,26,0.10),transparent_55%)]" />

      <div className="relative flex items-start gap-4 sm:gap-6">
        <div className="pt-0.5">
          {resolvedLogo ? (
            <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-stone-200/80 bg-white sm:h-24 sm:w-24">
              <Image
                src={resolvedLogo}
                alt={`${name} logo`}
                width={96}
                height={96}
                className="h-[72%] w-[72%] object-contain"
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <UniversityMark name={name} logoUrl={null} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2.5">
              {rank != null && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600">
                  Match #{rank}
                </p>
              )}
              <h3 className="text-[1.7rem] leading-[1.15] tracking-[-0.03em] text-stone-900 sm:text-[2rem]">
                {name}
              </h3>
              {place && (
                <p className="flex items-center gap-1.5 text-[15px] text-stone-500 sm:text-base">
                  <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {place}
                </p>
              )}
              {program && (
                <p className="inline-flex rounded-full bg-stone-900 px-3.5 py-1 text-sm font-medium text-white">
                  {program}
                </p>
              )}
            </div>

            <div className="shrink-0 rounded-2xl border border-stone-200/80 bg-[#faf8f5] px-5 py-4 lg:min-w-[8.5rem] lg:text-center">
              <p className="text-[2.6rem] leading-none tracking-[-0.04em] text-stone-900 tabular-nums">
                {score}
                <span className="ml-0.5 text-lg text-stone-400">%</span>
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Match score
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {formattedTuition && (
              <div className="rounded-2xl bg-[#f7f5f1] px-4 py-3.5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                  Tuition
                </p>
                <p className="mt-1 text-[15px] font-semibold text-stone-800">
                  {formattedTuition}
                </p>
              </div>
            )}
            {kf?.admissionChance && (
              <div className="rounded-2xl bg-[#f7f5f1] px-4 py-3.5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                  Admission
                </p>
                <p
                  className={cn(
                    "mt-1 text-[15px] font-semibold capitalize",
                    chanceTone(kf.admissionChance),
                  )}
                >
                  {formatChance(kf.admissionChance)}
                </p>
              </div>
            )}
            {kf?.scholarshipChance && (
              <div className="rounded-2xl bg-[#f7f5f1] px-4 py-3.5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                  Scholarship
                </p>
                <p
                  className={cn(
                    "mt-1 text-[15px] font-semibold capitalize",
                    chanceTone(kf.scholarshipChance),
                  )}
                >
                  {formatChance(kf.scholarshipChance)}
                </p>
              </div>
            )}
          </div>

          {kf?.whyThisUniversity && (
            <p className="mt-6 max-w-3xl text-[1.05rem] leading-relaxed text-stone-600">
              {tidyCopy(kf.whyThisUniversity)}
            </p>
          )}

          {breakdownEntries.length > 0 && (
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {breakdownEntries.map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-stone-500">
                      {scoreLabelMap[key] ?? key}
                    </span>
                    <span className="tabular-nums font-semibold text-stone-800">
                      {Math.round(value!)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(100, Math.round(value!))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {((kf?.pros && kf.pros.length > 0) ||
            (kf?.cons && kf.cons.length > 0)) && (
            <>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-stone-800 transition-colors hover:text-orange-600"
              >
                {expanded ? "Hide notes" : "Pros & cons"}
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expanded && (
                <div className="mt-5 grid gap-6 border-t border-stone-100 pt-5 sm:grid-cols-2">
                  {kf?.pros && kf.pros.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                        Strengths
                      </p>
                      <ul className="space-y-2.5 text-[15px] leading-relaxed text-stone-700">
                        {kf.pros.map((pro, i) => (
                          <li
                            key={i}
                            className="border-l-2 border-emerald-500/80 pl-3"
                          >
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {kf?.cons && kf.cons.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                        Watch-outs
                      </p>
                      <ul className="space-y-2.5 text-[15px] leading-relaxed text-stone-700">
                        {kf.cons.map((con, i) => (
                          <li
                            key={i}
                            className="border-l-2 border-stone-300 pl-3"
                          >
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
