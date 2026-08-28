"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Briefcase, Award, ShieldCheck, ArrowRight, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ServiceChoice = "STUDY" | "SCHOLARSHIPS" | "EMPLOYMENT" | "MIGRATION";

const options = [
  {
    id: "STUDY" as ServiceChoice,
    title: "Study Abroad & Admissions",
    description: "University shortlisting, SOP/LOR drafting, CAS support across 150+ partner universities.",
    icon: GraduationCap,
    emoji: "🎓",
    badge: "150+ Partner Unis",
    unauthRedirect: "https://dash-muntajarx.vercel.app",
    authRedirect: "/get-started",
    accentColor: "hover:border-orange-400 group-hover:text-orange-600",
  },
  {
    id: "SCHOLARSHIPS" as ServiceChoice,
    title: "Scholarships & Funding",
    description: "Find DAAD, Chevening, Erasmus & Vice-Chancellor merit grants with 100% full tuition & stipends.",
    icon: Award,
    emoji: "💰",
    badge: "$4.2M+ Secured",
    unauthRedirect: "https://dash-muntajarx.vercel.app",
    authRedirect: "/services/study-abroad",
    accentColor: "hover:border-emerald-400 group-hover:text-emerald-600",
  },
  {
    id: "EMPLOYMENT" as ServiceChoice,
    title: "Overseas Jobs & Workforce",
    description: "Direct placement with vetted international employers. 100% ILO compliant with zero predatory sub-agent fees.",
    icon: Briefcase,
    emoji: "💼",
    badge: "Zero Agent Fees",
    unauthRedirect: "https://dash-muntajarx.vercel.app",
    authRedirect: "/work/employment",
    accentColor: "hover:border-blue-400 group-hover:text-blue-600",
  },
  {
    id: "MIGRATION" as ServiceChoice,
    title: "Visa & PR Migration Pathways",
    description: "Express Entry Canada, Germany Opportunity Card, UK Skilled Worker & embassy mock interview prep.",
    icon: ShieldCheck,
    emoji: "🛂",
    badge: "50+ PR Routes",
    unauthRedirect: "https://dash-muntajarx.vercel.app",
    authRedirect: "/services/visa-migration",
    accentColor: "hover:border-purple-400 group-hover:text-purple-600",
  },
];

export function ServiceSelectionClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<ServiceChoice | null>(null);
  const [loading, setLoading] = useState(false);

  async function selectOption(option: typeof options[number]) {
    setSelected(option.id);
    setLoading(true);

    if (!isLoggedIn) {
      // Unauthenticated: route directly to the tailored login / sign-in portal
      router.push(option.unauthRedirect);
      return;
    }

    // Logged in: update user's service preference in DB
    try {
      const res = await fetch("/api/employment/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: option.id === "EMPLOYMENT" ? "EMPLOYMENT" : "STUDY",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Could not save service selection");
      }
      router.push(option.authRedirect);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-full inline-block">
          MUNTAJAR SERVICE PORTAL
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
          Select Your Target Service Pathway
        </h1>
        <p className="mx-auto max-w-xl text-base text-stone-600 font-normal">
          Before logging in or starting your application, choose the service pathway you are pursuing below.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={loading}
              onClick={() => selectOption(option)}
              className={cn(
                "group rounded-3xl border bg-white p-6 text-left transition-all duration-300 hover:shadow-lg disabled:opacity-60 flex flex-col justify-between cursor-pointer border-stone-200",
                active && "border-orange-500 ring-2 ring-orange-200 bg-orange-50/50"
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-2xl border border-stone-200/80">
                    <span aria-hidden>{option.emoji}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-stone-600 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full">
                    {option.badge}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-stone-700 shrink-0" strokeWidth={2} />
                    <h2 className="text-xl font-extrabold text-stone-900 group-hover:text-orange-600 transition-colors tracking-tight">
                      {option.title}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600 font-normal">
                    {option.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                <span>
                  {loading && active ? (
                    <span className="inline-flex items-center gap-2 text-orange-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Opening Portal…
                    </span>
                  ) : (
                    "Open Portal & Sign In"
                  )}
                </span>
                <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-stone-500">
          Already know your portal?{" "}
          <a href="https://dash-muntajarx.vercel.app" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1">
            <LogIn className="w-3.5 h-3.5" /> Go straight to Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
