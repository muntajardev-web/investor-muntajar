"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Printer,
  Copy,
  FileText,
  Check,
  RefreshCw,
  User,
  Briefcase,
  Wrench,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ResumeData,
  ResumeTemplateId,
  ResumeAccentColor,
} from "@/components/employment/resume-templates/types";
import {
  ExecutiveTemplate,
  NequeTemplate,
  OriginalTemplate,
  BoldTemplate,
  ExpressiveTemplate,
} from "@/components/employment/resume-templates/templates";

const TEMPLATES: { id: ResumeTemplateId; name: string; badge: string }[] = [
  { id: "executive", name: "Executive I", badge: "Standard" },
  { id: "neque", name: "Neque", badge: "Modern" },
  { id: "original", name: "Original", badge: "ATS Serif" },
  { id: "bold", name: "Bold", badge: "Dark Sidebar" },
  { id: "expressive", name: "Expressive", badge: "Banner" },
];

const ACCENT_PICKER: { id: ResumeAccentColor; name: string; hex: string }[] = [
  { id: "teal", name: "Teal Green", hex: "#0f766e" },
  { id: "orange", name: "Amber Orange", hex: "#d97706" },
  { id: "navy", name: "Navy Blue", hex: "#0f172a" },
  { id: "slate", name: "Slate Charcoal", hex: "#292524" },
  { id: "crimson", name: "Crimson Red", hex: "#be123c" },
];

export function CvBuilder({ initialData }: { initialData?: Partial<ResumeData["personalInfo"]> }) {
  const [template, setTemplate] = useState<ResumeTemplateId>("executive");
  const [accent, setAccent] = useState<ResumeAccentColor>("teal");
  const [showPhoto, setShowPhoto] = useState(true);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [activeSection, setActiveSection] = useState<"personal" | "summary" | "skills" | "experience" | "education">("personal");

  const [data, setData] = useState<ResumeData>({
    personalInfo: {
      fullName: initialData?.fullName || "James Miller",
      jobTitle: initialData?.jobTitle || "IT Project Manager & Operations Lead",
      email: initialData?.email || "james.miller@email.com",
      phone: initialData?.phone || "+1 (555) 234-5678",
      address: initialData?.address || "Chicago, IL, USA",
      passportNumber: initialData?.passportNumber || "A09876543",
      passportExpiry: initialData?.passportExpiry || "2031-10-15",
      nationality: initialData?.nationality || "American",
      photoUrl: initialData?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    summary:
      "A highly successful, flexible, innovative, and enthusiastic project manager possessing considerable experience of managing projects from beginning to end; defining the project plan, timeline, scope and executing the analysis before providing detailed recommendations.",
    skills: [
      { name: "Project Management", level: 5 },
      { name: "Agile & Scrum", level: 4 },
      { name: "IT Infrastructure", level: 4 },
      { name: "Budget Planning", level: 5 },
      { name: "Team Leadership", level: 5 },
      { name: "Risk Management", level: 4 },
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "French", proficiency: "Fluent" },
      { name: "Spanish", proficiency: "Intermediate" },
    ],
    hobbies: ["Web Design", "Skiing", "Traveling"],
    experience: [
      {
        id: "exp-1",
        position: "IT Project Manager",
        company: "Telecommunications Ltd, Birmingham",
        startDate: "May 2017",
        endDate: "Present",
        current: true,
        description: "Lead a team of technical staff managing planning, procurement, and execution of high-budget telecommunication projects.",
      },
      {
        id: "exp-2",
        position: "IT Technician",
        company: "International Mobility, Birmingham",
        startDate: "Oct 2015",
        endDate: "Apr 2017",
        current: false,
        description: "Operated and maintained information systems, facilitating system unification across overseas offices.",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "BSc Computer Science (2:1)",
        institution: "University of Birmingham",
        startDate: "2014",
        endDate: "2017",
        description: "Graduated with Honors. Specialized in Software Architecture & Network Systems.",
      },
      {
        id: "edu-2",
        degree: "A Levels: ICT (A), Maths (C), Biology (B)",
        institution: "Westwood Health Technology College",
        startDate: "2011",
        endDate: "2014",
        description: "Top percentile academic achievement.",
      },
    ],
    honors: [
      {
        id: "hon-1",
        title: "PMP Certified Project Manager",
        issuer: "PMI Institute",
        date: "2021",
      },
    ],
  });

  async function enhanceSummaryWithAi() {
    setAiEnhancing(true);
    await new Promise((r) => setTimeout(r, 1200));

    setData((prev) => ({
      ...prev,
      summary: `Accomplished and strategic ${prev.personalInfo.jobTitle || "Operations Lead"} with a proven record of leading complex cross-functional initiatives from conception to completion. Expert in optimizing workflow efficiency, mitigating operational risk, and driving cross-border team productivity. Fully credentialed for fast-track international mobility placement.`,
    }));

    setAiEnhancing(false);
    toast.success("AI Enhanced Professional Summary!");
  }

  function handlePrint() {
    window.print();
  }

  function copyMarkdown() {
    const p = data.personalInfo;
    const text = `# ${p.fullName}
**Target Role:** ${p.jobTitle}
**Contact:** ${p.email} | ${p.phone} | ${p.address}

## Professional Summary
${data.summary}

## Key Skills
${data.skills.map((s) => `- ${s.name} (Level ${s.level}/5)`).join("\n")}

## Work Experience
${data.experience.map((e) => `### ${e.position} - ${e.company} (${e.startDate} - ${e.endDate})\n${e.description}`).join("\n\n")}

## Education
${data.education.map((ed) => `### ${ed.degree} - ${ed.institution} (${ed.startDate} - ${ed.endDate})\n${ed.description}`).join("\n\n")}
`;
    navigator.clipboard.writeText(text);
    toast.success("Resume text copied!");
  }

  function addExperience() {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          position: "New Role Position",
          company: "Company Name",
          startDate: "2022",
          endDate: "Present",
          current: true,
          description: "Describe key responsibilities and accomplishments.",
        },
      ],
    }));
  }

  function removeExperience(id: string) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  }

  return (
    <div className="space-y-6">
      {/* ── TOP STUDIO TOOLBAR (HIDDEN ON PRINT) ── */}
      <div className="no-print rounded-2xl bg-white border border-stone-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-900 text-xs font-extrabold">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              Executive Resume Studio
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-950 tracking-tight">
              CV & Resume Builder Canvas
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={enhanceSummaryWithAi}
              disabled={aiEnhancing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
            >
              {aiEnhancing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-100" />}
              <span>{aiEnhancing ? "AI Enhancing..." : "AI Enhance Summary"}</span>
            </button>

            <button
              type="button"
              onClick={copyMarkdown}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-all cursor-pointer border border-stone-200"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Text</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* Template & Color Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider shrink-0 mr-1">Template:</span>
            {TEMPLATES.map((t) => {
              const active = template === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1.5",
                    active
                      ? "bg-stone-950 text-white border-stone-950 shadow-2xs"
                      : "bg-[#FAF9F7] text-stone-700 border-stone-200 hover:bg-stone-100",
                  )}
                >
                  <span>{t.name}</span>
                  {active && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Color:</span>
            <div className="flex items-center gap-1.5">
              {ACCENT_PICKER.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAccent(c.id)}
                  title={c.name}
                  className={cn(
                    "w-5 h-5 rounded-full transition-all cursor-pointer border",
                    accent === c.id ? "scale-110 ring-2 ring-stone-400 border-white" : "border-transparent opacity-80 hover:opacity-100",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SIDE-BY-SIDE EDITOR & LIVE PREVIEW GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT EDIT CONTROLS (HIDDEN ON PRINT) */}
        <div className="no-print lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="rounded-2xl bg-white border border-stone-200 p-5 space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-sm font-extrabold text-stone-950">Content Editor</h2>
              <p className="text-[11px] text-stone-500">Edit fields to update the live resume canvas.</p>
            </div>

            {/* Section Nav */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: "personal", label: "Personal", icon: User },
                { id: "summary", label: "Summary", icon: FileText },
                { id: "skills", label: "Skills", icon: Wrench },
                { id: "experience", label: "Experience", icon: Briefcase },
              ].map((tab) => {
                const active = activeSection === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSection(tab.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer border",
                      active ? "bg-stone-950 text-white border-stone-950" : "bg-[#FAF9F7] text-stone-600 border-stone-200 hover:bg-stone-100",
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            {activeSection === "personal" && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.personalInfo.fullName}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, fullName: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF9F7] border border-stone-200 text-xs font-bold text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={data.personalInfo.jobTitle}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, jobTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF9F7] border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={data.personalInfo.phone}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          personalInfo: { ...p.personalInfo, phone: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F7] border border-stone-200 text-xs font-medium text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Email</label>
                    <input
                      type="text"
                      value={data.personalInfo.email}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          personalInfo: { ...p.personalInfo, email: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F7] border border-stone-200 text-xs font-medium text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Address / Location</label>
                  <input
                    type="text"
                    value={data.personalInfo.address}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, address: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF9F7] border border-stone-200 text-xs font-medium text-stone-900"
                  />
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-stone-50">
                    <span className="text-xs font-bold text-stone-700">Display Profile Photo Avatar</span>
                    <input
                      type="checkbox"
                      checked={showPhoto}
                      onChange={(e) => setShowPhoto(e.target.checked)}
                      className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeSection === "summary" && (
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-stone-700">Professional Summary</label>
                <textarea
                  value={data.summary}
                  onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF9F7] border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none leading-relaxed"
                />
              </div>
            )}

            {activeSection === "skills" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-700">Skills & 5-Dot Ratings</span>
                {data.skills.map((sk, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={sk.name}
                        onChange={(e) => {
                          const next = [...data.skills];
                          next[idx].name = e.target.value;
                          setData((p) => ({ ...p, skills: next }));
                        }}
                        className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-900 flex-1"
                      />
                      <span className="text-xs font-bold text-stone-500 tabular-nums">Level {sk.level}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={sk.level}
                      onChange={(e) => {
                        const next = [...data.skills];
                        next[idx].level = Number(e.target.value);
                        setData((p) => ({ ...p, skills: next }));
                      }}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSection === "experience" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">Employment History</span>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                {data.experience.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-xl bg-[#FAF9F7] border border-stone-200 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.position}
                      onChange={(e) => {
                        const next = data.experience.map((x) =>
                          x.id === exp.id ? { ...x, position: e.target.value } : x,
                        );
                        setData((p) => ({ ...p, experience: next }));
                      }}
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-900"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const next = data.experience.map((x) =>
                            x.id === exp.id ? { ...x, company: e.target.value } : x,
                          );
                          setData((p) => ({ ...p, experience: next }));
                        }}
                        className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-900"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={`${exp.startDate} - ${exp.endDate}`}
                        onChange={(e) => {
                          const next = data.experience.map((x) =>
                            x.id === exp.id ? { ...x, startDate: e.target.value } : x,
                          );
                          setData((p) => ({ ...p, experience: next }));
                        }}
                        className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-900"
                      />
                    </div>

                    <textarea
                      placeholder="Responsibilities..."
                      value={exp.description}
                      onChange={(e) => {
                        const next = data.experience.map((x) =>
                          x.id === exp.id ? { ...x, description: e.target.value } : x,
                        );
                        setData((p) => ({ ...p, experience: next }));
                      }}
                      rows={2}
                      className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs text-stone-800"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT LIVE DOCUMENT PREVIEW (ONLY THIS PRINTS TO PDF) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="printable-resume-canvas rounded-2xl border border-stone-200 bg-white p-2 sm:p-4 min-h-[950px]">
            {template === "executive" && (
              <ExecutiveTemplate
                data={data}
                accent={accent}
                showPhoto={showPhoto}
              />
            )}
            {template === "neque" && (
              <NequeTemplate
                data={data}
                accent={accent}
                showPhoto={showPhoto}
              />
            )}
            {template === "original" && (
              <OriginalTemplate data={data} accent={accent} />
            )}
            {template === "bold" && (
              <BoldTemplate
                data={data}
                accent={accent}
                showPhoto={showPhoto}
              />
            )}
            {template === "expressive" && (
              <ExpressiveTemplate
                data={data}
                accent={accent}
                showPhoto={showPhoto}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
