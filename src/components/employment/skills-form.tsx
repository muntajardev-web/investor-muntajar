"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Wrench,
  Cpu,
  Stethoscope,
  Utensils,
  Briefcase,
  Search,
  Plus,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EMPLOYMENT_SKILLS } from "@/lib/employment/constants";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Skills" },
  { id: "trades", label: "Trades & Technical" },
  { id: "engineering", label: "Engineering & IT" },
  { id: "healthcare", label: "Healthcare & Care" },
  { id: "hospitality", label: "Hospitality & Services" },
  { id: "business", label: "Business & Corporate" },
] as const;

function getSkillCategory(skill: string) {
  if (
    [
      "Construction",
      "Electrician",
      "Plumber",
      "Welder",
      "Mason",
      "HVAC Technician",
      "Automotive Mechanic",
      "Factory Worker",
      "Agriculture Worker",
    ].includes(skill)
  )
    return "trades";

  if (
    [
      "Civil Engineer",
      "Mechanical Engineer",
      "Software Engineer",
      "IT Support",
      "Network Engineer",
    ].includes(skill)
  )
    return "engineering";

  if (["Nurse", "Doctor", "Caregiver", "Pharmacist", "Lab Technician"].includes(skill))
    return "healthcare";

  if (
    [
      "Chef",
      "Hotel Staff",
      "Housekeeping",
      "Driver",
      "Warehouse",
      "Security Guard",
      "Customer Support",
    ].includes(skill)
  )
    return "hospitality";

  return "business";
}

function getSkillIcon(category: string) {
  switch (category) {
    case "trades":
      return Wrench;
    case "engineering":
      return Cpu;
    case "healthcare":
      return Stethoscope;
    case "hospitality":
      return Utensils;
    default:
      return Briefcase;
  }
}

export function SkillsForm({
  initialSkills,
  initialCustom,
}: {
  initialSkills?: string[];
  initialCustom?: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSuggestedList, setAiSuggestedList] = useState<
    { skill: string; demand: string; matchScore: number; salary: string; icon: string }[]
  >([]);
  const [skills, setSkills] = useState<string[]>(initialSkills ?? []);
  const [customSkills, setCustomSkills] = useState<string[]>(initialCustom ?? []);
  const [customInput, setCustomInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  function toggle(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  function addCustom() {
    const value = customInput.trim();
    if (!value) return;
    if (!customSkills.includes(value) && !skills.includes(value)) {
      setCustomSkills((prev) => [...prev, value]);
    }
    setCustomInput("");
  }

  function removeCustom(skill: string) {
    setCustomSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function handleAiSuggest() {
    setAiSuggesting(true);
    // Simulate AI Career Engine market analysis
    await new Promise((r) => setTimeout(r, 1200));

    const recommendations = [
      {
        skill: "Electrician",
        demand: "98% Demand in UAE, KSA & Qatar",
        matchScore: 98,
        salary: "$1,400 - $2,800/month",
        icon: "trades",
      },
      {
        skill: "HVAC Technician",
        demand: "95% Demand in Middle East & EU",
        matchScore: 95,
        salary: "$1,600 - $3,200/month",
        icon: "trades",
      },
      {
        skill: "Civil Engineer",
        demand: "94% High Visa Route Priority",
        matchScore: 94,
        salary: "$2,500 - $5,000/month",
        icon: "engineering",
      },
      {
        skill: "Plumber",
        demand: "92% Fast-Track Trade Visa",
        matchScore: 92,
        salary: "$1,200 - $2,400/month",
        icon: "trades",
      },
      {
        skill: "Welder",
        demand: "91% Industrial & Shipyard Demand",
        matchScore: 91,
        salary: "$1,500 - $3,000/month",
        icon: "trades",
      },
      {
        skill: "Nurse",
        demand: "97% High-Priority Healthcare Route",
        matchScore: 97,
        salary: "$2,200 - $4,500/month",
        icon: "healthcare",
      },
    ];

    setAiSuggestedList(recommendations);
    setAiSuggesting(false);
    setAiModalOpen(true);
  }

  function applyAiSuggestions() {
    const suggestedNames = aiSuggestedList.map((item) => item.skill);
    setSkills((prev) => Array.from(new Set([...prev, ...suggestedNames])));
    setAiModalOpen(false);
    toast.success(`Applied ${suggestedNames.length} AI-recommended high-demand skills!`);
  }

  const filteredSkills = useMemo(() => {
    return EMPLOYMENT_SKILLS.filter((skill) => {
      const matchesSearch = skill.toLowerCase().includes(search.toLowerCase());
      const category = getSkillCategory(skill);
      const matchesCategory = activeCategory === "all" || category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch("/api/employment/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, customSkills, workflowStep: 5 }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message);
      toast.success("Skills saved successfully");
      router.push("/work/employment/languages");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      setLoading(false);
    }
  }

  const totalSelected = skills.length + customSkills.length;

  return (
    <div className="space-y-8">
      {/* ── TOP COUNTER & SEARCH HUB WITH PROMINENT AI SUGGEST BUTTON ── */}
      <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Trade & Professional Skill Matrix
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-950">
              Select Your Core Competencies
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Select all trade qualifications, certifications, and skills relevant to your overseas target jobs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* ── PROMINENT AI SUGGEST SKILLS BUTTON ── */}
            <button
              type="button"
              onClick={handleAiSuggest}
              disabled={aiSuggesting}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer border border-amber-400 shrink-0"
            >
              {aiSuggesting ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-100" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-100 animate-pulse" />
              )}
              <span>{aiSuggesting ? "Analyzing Market Demand…" : "AI Suggest Skills"}</span>
            </button>

            <div className="px-5 py-3 rounded-2xl bg-[#FAF9F7] border border-stone-200 text-center shrink-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Selected Skills
              </span>
              <span className="text-lg font-extrabold text-stone-900 tabular-nums">
                {totalSelected} Active
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Category Filter Tabs */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search trade or professional skills (e.g. Electrician, Nurse)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF9F7] border border-stone-200 text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border",
                    active
                      ? "bg-stone-950 text-white border-stone-950 shadow-xs"
                      : "bg-[#FAF9F7] text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── AI SKILLS AUTO-SUGGESTION POPUP MODAL ── */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-950">
                    AI Recommended High-Demand Skills
                  </h3>
                  <p className="text-xs text-stone-500">
                    Based on current Gulf, Europe & North America job placement quotas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {aiSuggestedList.map((item) => {
                const IconComp = getSkillIcon(item.icon);
                const isSelected = skills.includes(item.skill);

                return (
                  <div
                    key={item.skill}
                    onClick={() => toggle(item.skill)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer",
                      isSelected
                        ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-500/20"
                        : "bg-[#FAF9F7] border-stone-200 hover:bg-white hover:border-stone-300",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold",
                          isSelected
                            ? "bg-amber-500 text-white"
                            : "bg-white border border-stone-200 text-stone-600",
                        )}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-stone-950 truncate">
                            {item.skill}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold shrink-0 border border-emerald-200">
                            {item.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-medium truncate mt-0.5">
                          {item.demand} • Est. {item.salary}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                        isSelected
                          ? "bg-amber-500 text-white"
                          : "border border-stone-300 bg-white text-stone-300",
                      )}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <span className="text-xs text-stone-500 font-semibold">
                Click any skill to customize your selection
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={applyAiSuggestions}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-100" />
                  <span>Apply AI Suggestions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SKILLS MATRIX CARDS GRID ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-xs">
          Available Trade & Industry Skills ({filteredSkills.length})
        </h3>

        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
            <p className="text-sm font-bold text-stone-700">No skills match &quot;{search}&quot;</p>
            <p className="text-xs text-stone-500">Add it as a custom skill below or clear your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredSkills.map((skill) => {
              const active = skills.includes(skill);
              const category = getSkillCategory(skill);
              const IconComp = getSkillIcon(category);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggle(skill)}
                  className={cn(
                    "group relative p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer",
                    active
                      ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-xs"
                      : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors",
                        active
                          ? "bg-amber-500 text-white"
                          : "bg-[#FAF9F7] text-stone-500 group-hover:text-stone-900",
                      )}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                        active
                          ? "bg-amber-500 text-white scale-100 opacity-100"
                          : "border border-stone-200 opacity-0 group-hover:opacity-100",
                      )}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-xs font-bold leading-tight transition-colors",
                      active ? "text-amber-950" : "text-stone-800 group-hover:text-stone-950",
                    )}
                  >
                    {skill}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CUSTOM SKILLS ADDITION SECTION ── */}
      <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-stone-950">Add Custom Skills</h3>
          <p className="text-xs text-stone-500">
            Have specialized certifications or niche skills not listed above? Add them here.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              placeholder="e.g. Scaffolding Inspection, CNC Machining, TIG Welding..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF9F7] border border-stone-200 text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={addCustom}
            className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            Add Custom Skill
          </button>
        </div>

        {/* Custom skills badges */}
        {customSkills.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {customSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeCustom(skill)}
                  className="p-0.5 rounded-full hover:bg-amber-200 text-amber-700 hover:text-amber-950 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── ACTION FOOTER ── */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400" />
          )}
          <span>{loading ? "Saving Skills…" : "Save & Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
