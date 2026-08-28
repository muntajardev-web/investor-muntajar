"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type {
  ResumeData,
  ResumeAccentColor,
} from "./types";

const ACCENT_STYLES: Record<
  ResumeAccentColor,
  {
    text: string;
    bg: string;
    border: string;
    dotActive: string;
  }
> = {
  teal: {
    text: "text-teal-800",
    bg: "bg-teal-700",
    border: "border-teal-700",
    dotActive: "bg-teal-700",
  },
  orange: {
    text: "text-amber-700",
    bg: "bg-amber-600",
    border: "border-amber-600",
    dotActive: "bg-amber-600",
  },
  navy: {
    text: "text-slate-900",
    bg: "bg-slate-900",
    border: "border-slate-900",
    dotActive: "bg-slate-900",
  },
  slate: {
    text: "text-stone-900",
    bg: "bg-stone-800",
    border: "border-stone-800",
    dotActive: "bg-stone-800",
  },
  crimson: {
    text: "text-rose-800",
    bg: "bg-rose-700",
    border: "border-rose-700",
    dotActive: "bg-rose-700",
  },
};

/** 5-Dot Skill Rating Indicator */
function DotRating({
  level,
  accentColor,
}: {
  level: number;
  accentColor: ResumeAccentColor;
}) {
  const dots = [1, 2, 3, 4, 5];
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.teal;

  return (
    <div className="flex items-center gap-1 shrink-0">
      {dots.map((dot) => (
        <span
          key={dot}
          className={cn(
            "w-2 h-2 rounded-full transition-all [-webkit-print-color-adjust:exact] [print-color-adjust:exact]",
            dot <= level ? accent.dotActive : "bg-stone-200",
          )}
        />
      ))}
    </div>
  );
}

// ── TEMPLATE 1: EXECUTIVE I (Exact A4 Fit & Print Color Accuracy) ──
export function ExecutiveTemplate({
  data,
  accent = "teal",
  showPhoto = true,
}: {
  data: ResumeData;
  accent?: ResumeAccentColor;
  showPhoto?: boolean;
}) {
  const p = data.personalInfo;
  const style = ACCENT_STYLES[accent] || ACCENT_STYLES.teal;

  return (
    <div className="w-full bg-white text-stone-900 font-sans text-[10.5pt] leading-relaxed border border-stone-200 print:border-none rounded-xl overflow-hidden min-h-[950px] print:min-h-[297mm] print:h-[297mm] [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      <div className="grid grid-cols-12 min-h-[950px] print:min-h-[297mm] print:h-[297mm]">
        {/* Full-Height Left Sidebar */}
        <div className="col-span-4 bg-[#F8F9FA] p-6 sm:p-7 border-r border-stone-200 space-y-6 flex flex-col justify-between [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
          <div className="space-y-6">
            {/* Candidate Photo */}
            {showPhoto && p.photoUrl && (
              <div className="w-28 h-32 mx-auto rounded-lg overflow-hidden border border-stone-300 shrink-0">
                <img
                  src={p.photoUrl}
                  alt={p.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Personal Details */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
                Personal Details
              </h3>
              <div className="space-y-2 text-[9.5pt] text-stone-700">
                <div>
                  <span className="text-[9px] font-bold uppercase text-stone-400 block">Address</span>
                  <span className="font-semibold text-stone-900">{p.address}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-stone-400 block">Phone</span>
                  <span className="font-semibold text-stone-900 whitespace-nowrap">{p.phone}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-stone-400 block">Email</span>
                  <span className="font-semibold text-stone-900 break-all">{p.email}</span>
                </div>
                {p.passportNumber && (
                  <div>
                    <span className="text-[9px] font-bold uppercase text-stone-400 block">Passport</span>
                    <span className="font-bold text-stone-950">{p.passportNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
                  Skills
                </h3>
                <div className="space-y-2.5">
                  {data.skills.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[9.5pt]">
                        <span className="font-bold text-stone-900 truncate">{s.name}</span>
                      </div>
                      <DotRating level={s.level} accentColor={accent} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
                  Languages
                </h3>
                <div className="space-y-1 text-[9.5pt]">
                  {data.languages.map((l, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="font-bold text-stone-900">{l.name}</span>
                      <span className="text-stone-500 text-xs">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-[9px] text-stone-400 pt-4 border-t border-stone-200 uppercase tracking-widest font-semibold text-center">
            Verified Employment CV
          </div>
        </div>

        {/* Main Column */}
        <div className="col-span-8 p-7 sm:p-9 space-y-6">
          {/* Header Name & Title */}
          <div className="border-b-2 border-stone-900 pb-4 space-y-1">
            <h1 className={cn("text-3xl font-extrabold tracking-tight uppercase leading-none", style.text)}>
              {p.fullName}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-stone-600 uppercase tracking-wider">
              {p.jobTitle}
            </p>
          </div>

          {/* Summary */}
          {data.summary && (
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-950 border-b border-stone-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-stone-700 text-[10pt] leading-relaxed font-normal">{data.summary}</p>
            </div>
          )}

          {/* Employment History */}
          {data.experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-950 border-b border-stone-200 pb-1">
                Employment History
              </h2>
              <div className="space-y-4">
                {data.experience.map((e) => (
                  <div key={e.id} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-extrabold text-stone-950 text-[10.5pt]">
                        {e.position} <span className="text-stone-500 font-semibold">— {e.company}</span>
                      </h3>
                      <span className="text-xs text-stone-500 font-bold shrink-0">
                        {e.startDate} - {e.current ? "Present" : e.endDate}
                      </span>
                    </div>
                    <p className="text-stone-700 text-[9.5pt] leading-relaxed">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-950 border-b border-stone-200 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-extrabold text-stone-950 text-[10pt]">{ed.degree}</h3>
                      <p className="text-stone-600 text-[9.5pt]">{ed.institution}</p>
                      {ed.description && <p className="text-stone-500 text-[9pt] mt-0.5">{ed.description}</p>}
                    </div>
                    <span className="text-xs text-stone-500 font-bold shrink-0">
                      {ed.startDate} - {ed.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TEMPLATE 2: NEQUE ──
export function NequeTemplate({
  data,
  accent = "orange",
  showPhoto = true,
}: {
  data: ResumeData;
  accent?: ResumeAccentColor;
  showPhoto?: boolean;
}) {
  const p = data.personalInfo;
  const style = ACCENT_STYLES[accent] || ACCENT_STYLES.orange;

  return (
    <div className="w-full bg-white text-stone-900 font-sans text-[10.5pt] leading-relaxed p-7 sm:p-9 border border-stone-200 print:border-none rounded-xl min-h-[950px] print:min-h-[297mm] print:h-[297mm] space-y-6 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      <div className="border-b-2 border-stone-950 pb-5 flex items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className={cn("text-3xl font-extrabold tracking-tight uppercase leading-none", style.text)}>
            {p.fullName}
          </h1>
          <p className="text-xs font-bold text-stone-600 uppercase tracking-widest">{p.jobTitle}</p>
          <div className="flex flex-wrap items-center gap-3 text-[9.5pt] text-stone-600 pt-1 font-medium">
            <span>📍 {p.address}</span>
            <span>•</span>
            <span className="whitespace-nowrap">📞 {p.phone}</span>
            <span>•</span>
            <span>✉️ {p.email}</span>
          </div>
        </div>

        {showPhoto && p.photoUrl && (
          <div className="w-20 h-20 rounded-full overflow-hidden border border-stone-300 shrink-0">
            <img src={p.photoUrl} alt={p.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="col-span-8 space-y-6">
          {data.summary && (
            <div className="space-y-2">
              <h2 className={cn("text-xs font-extrabold uppercase tracking-wider border-b pb-1", style.border, style.text)}>
                Professional Summary
              </h2>
              <p className="text-stone-700 text-[10pt] leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="space-y-4">
              <h2 className={cn("text-xs font-extrabold uppercase tracking-wider border-b pb-1", style.border, style.text)}>
                Employment History
              </h2>
              <div className="space-y-4">
                {data.experience.map((e) => (
                  <div key={e.id} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-extrabold text-stone-950 text-[10.5pt]">
                        {e.position} — <span className="text-stone-600 font-semibold">{e.company}</span>
                      </h3>
                      <span className="text-xs text-stone-500 font-bold shrink-0">
                        {e.startDate} - {e.current ? "Present" : e.endDate}
                      </span>
                    </div>
                    <p className="text-stone-700 text-[9.5pt] leading-relaxed">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-6 border-l border-stone-200 pl-6">
          {data.skills.length > 0 && (
            <div className="space-y-2.5">
              <h3 className={cn("text-[10px] font-extrabold uppercase tracking-widest border-b pb-1", style.border, style.text)}>
                Skills
              </h3>
              <div className="space-y-2.5">
                {data.skills.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[9.5pt] font-bold text-stone-900 block truncate">{s.name}</span>
                    <DotRating level={s.level} accentColor={accent} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TEMPLATE 3: ORIGINAL ──
export function OriginalTemplate({
  data,
}: {
  data: ResumeData;
  accent?: ResumeAccentColor;
}) {
  const p = data.personalInfo;

  return (
    <div className="w-full bg-white text-stone-900 font-serif text-[10.5pt] leading-relaxed p-8 sm:p-12 border border-stone-200 print:border-none rounded-xl min-h-[950px] print:min-h-[297mm] print:h-[297mm] space-y-6 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      <div className="text-center space-y-1.5 border-b pb-5">
        <h1 className="text-3xl font-normal text-stone-950 tracking-wide font-serif">{p.fullName}</h1>
        <p className="text-xs uppercase tracking-widest font-sans font-bold text-stone-600">{p.jobTitle}</p>
        <p className="text-xs text-stone-600 font-sans">
          {p.address} • {p.phone} • {p.email}
        </p>
      </div>

      {data.summary && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-center text-stone-950 border-b pb-1 font-sans">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-stone-700 text-[10pt] leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="space-y-4 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-center text-stone-950 border-b pb-1">
            EMPLOYMENT HISTORY
          </h2>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id} className="space-y-1 text-[10pt]">
                <div className="flex justify-between font-bold text-stone-950">
                  <span>
                    {e.position}, {e.company}
                  </span>
                  <span className="text-stone-500 text-xs">
                    {e.startDate} - {e.current ? "Present" : e.endDate}
                  </span>
                </div>
                <p className="text-stone-700 text-[9.5pt]">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TEMPLATE 4: BOLD ──
export function BoldTemplate({
  data,
  showPhoto = true,
}: {
  data: ResumeData;
  accent?: ResumeAccentColor;
  showPhoto?: boolean;
}) {
  const p = data.personalInfo;

  return (
    <div className="w-full bg-white text-stone-900 font-sans text-[10.5pt] leading-relaxed border border-stone-200 print:border-none rounded-xl overflow-hidden min-h-[950px] print:min-h-[297mm] print:h-[297mm] [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      <div className="grid grid-cols-12 min-h-[950px] print:min-h-[297mm] print:h-[297mm]">
        <div className="col-span-4 bg-slate-950 text-white p-6 sm:p-7 space-y-6 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
          {showPhoto && p.photoUrl && (
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border border-stone-800 shrink-0">
              <img src={p.photoUrl} alt={p.fullName} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-1 text-center">
            <h1 className="text-xl font-black uppercase text-white tracking-tight">{p.fullName}</h1>
            <p className="text-xs font-bold text-sky-400 uppercase tracking-widest">{p.jobTitle}</p>
          </div>

          <div className="space-y-2 text-[9.5pt] text-stone-300 border-t border-stone-800 pt-4">
            <p className="font-bold text-white uppercase text-[10px] tracking-widest border-b border-stone-800 pb-1">
              Contact
            </p>
            <p className="break-words">📍 {p.address}</p>
            <p className="whitespace-nowrap">📞 {p.phone}</p>
            <p className="break-all text-[9pt]">✉️ {p.email}</p>
          </div>

          {data.skills.length > 0 && (
            <div className="space-y-2.5 text-xs border-t border-stone-800 pt-4">
              <p className="font-bold text-white uppercase text-[10px] tracking-widest border-b border-stone-800 pb-1">
                Skills
              </p>
              <div className="space-y-2">
                {data.skills.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[9.5pt] font-semibold text-stone-200">
                      <span>{s.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={cn("w-2 h-2 rounded-full [-webkit-print-color-adjust:exact] [print-color-adjust:exact]", dot <= s.level ? "bg-sky-400" : "bg-stone-800")}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-8 p-7 sm:p-9 space-y-6">
          {data.summary && (
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-950 border-b border-stone-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-stone-700 text-[10pt] leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-950 border-b border-stone-200 pb-1">
                Employment History
              </h2>
              <div className="space-y-4">
                {data.experience.map((e) => (
                  <div key={e.id} className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5pt]">
                      <span className="font-extrabold text-stone-950">
                        {e.position} — <span className="text-stone-600 font-semibold">{e.company}</span>
                      </span>
                      <span className="text-xs text-stone-500 font-bold shrink-0">
                        {e.startDate} - {e.current ? "Present" : e.endDate}
                      </span>
                    </div>
                    <p className="text-stone-700 text-[9.5pt] leading-relaxed">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TEMPLATE 5: EXPRESSIVE ──
export function ExpressiveTemplate({
  data,
  accent = "orange",
  showPhoto = true,
}: {
  data: ResumeData;
  accent?: ResumeAccentColor;
  showPhoto?: boolean;
}) {
  const p = data.personalInfo;
  const style = ACCENT_STYLES[accent] || ACCENT_STYLES.orange;

  return (
    <div className="w-full bg-white text-stone-900 font-sans text-[10.5pt] leading-relaxed p-7 sm:p-9 border border-stone-200 print:border-none rounded-xl min-h-[950px] print:min-h-[297mm] print:h-[297mm] space-y-6 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      <div className={cn("p-6 rounded-xl text-white flex items-center justify-between gap-6 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]", style.bg)}>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{p.fullName}</h1>
          <p className="text-xs font-extrabold uppercase tracking-widest text-stone-100">{p.jobTitle}</p>
          <p className="text-xs text-stone-100 pt-1 font-medium">
            📍 {p.address} • 📞 {p.phone} • ✉️ {p.email}
          </p>
        </div>

        {showPhoto && p.photoUrl && (
          <img
            src={p.photoUrl}
            alt={p.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-white shrink-0"
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="col-span-8 space-y-6">
          {data.summary && (
            <div className="space-y-2">
              <h2 className={cn("text-xs font-extrabold uppercase tracking-wider border-b pb-1", style.border, style.text)}>
                Professional Summary
              </h2>
              <p className="text-stone-700 text-[10pt] leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="space-y-4">
              <h2 className={cn("text-xs font-extrabold uppercase tracking-wider border-b pb-1", style.border, style.text)}>
                Employment History
              </h2>
              <div className="space-y-4">
                {data.experience.map((e) => (
                  <div key={e.id} className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5pt]">
                      <span className="font-extrabold text-stone-950">
                        {e.position} — <span className="text-stone-600 font-semibold">{e.company}</span>
                      </span>
                      <span className="text-xs text-stone-500 font-bold shrink-0">
                        {e.startDate} - {e.current ? "Present" : e.endDate}
                      </span>
                    </div>
                    <p className="text-stone-700 text-[9.5pt] leading-relaxed">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-6 border-l border-stone-200 pl-6">
          {data.skills.length > 0 && (
            <div className="space-y-2.5">
              <h3 className={cn("text-[10px] font-extrabold uppercase tracking-widest border-b pb-1", style.border, style.text)}>
                Skills Matrix
              </h3>
              <div className="space-y-2">
                {data.skills.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[9.5pt] font-bold text-stone-900 block truncate">{s.name}</span>
                    <DotRating level={s.level} accentColor={accent} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
