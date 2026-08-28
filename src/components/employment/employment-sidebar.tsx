"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { JOURNEY_STEPS, employmentNavItems } from "@/lib/employment/nav";
import { X, CheckCircle2, Sparkles, ChevronRight, Home, GraduationCap, Briefcase, Award, BookOpen, Lock } from "lucide-react";
import { EProgress } from "./employment-ds";

interface EmploymentSidebarProps {
  open?: boolean;
  onClose?: () => void;
  profileComplete?: boolean;
  profileCompletion?: number;
  workflowStep?: number;
}

const NAV_GROUPS = [
  {
    label: "Journey",
    items: employmentNavItems.filter((i) => i.href === "/work/employment" || i.step !== undefined),
  },
  {
    label: "Tools",
    items: employmentNavItems.filter(
      (i) =>
        !i.step &&
        i.href !== "/work/employment" &&
        [
          "/work/employment/education",
          "/work/employment/experience",
          "/work/employment/languages",
          "/work/employment/advisor",
          "/work/employment/cover-letter",
          "/work/employment/payment",
          "/work/employment/confirmation",
          "/work/employment/submission",
          "/work/employment/receipt",
        ].includes(i.href),
    ),
  },
];

export function EmploymentSidebar({
  open,
  onClose,
  profileComplete = false,
  profileCompletion = 42,
  workflowStep = 1,
}: EmploymentSidebarProps) {
  const pathname = usePathname();

  const journeyStepsList = [
    { step: 1, title: "Complete Profile", href: "/work/employment/profile", status: "completed" },
    { step: 2, title: "Upload Documents", href: "/work/employment/documents", status: "warning" },
    { step: 3, title: "AI Screening", href: "/work/employment/analysis", status: "pending" },
    { step: 4, title: "AI Report", href: "/work/employment/analysis", status: "locked" },
    { step: 5, title: "Skill Analysis", href: "/work/employment/skills", status: "locked" },
    { step: 6, title: "Job Matches", href: "/work/employment/jobs", status: "locked" },
    { step: 7, title: "Resume Builder", href: "/work/employment/builder", status: "locked" },
    { step: 8, title: "Apply", href: "/work/employment/review", status: "locked" },
    { step: 9, title: "Track Progress", href: "/work/employment/tracker", status: "locked" },
  ];

  const toolItems = [
    { title: "Education", href: "/work/employment/education", icon: GraduationCap },
    { title: "Experience", href: "/work/employment/experience", icon: Briefcase },
    { title: "Certification", href: "/work/employment/languages", icon: Award },
    { title: "Career Resources", href: "/work/employment/advisor", icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-svh w-[275px] shrink-0 flex-col bg-white border-r border-stone-200 transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-100 px-6">
          <Link href="/work/employment" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-white text-lg shadow-xs">
              M
            </div>
            <span className="text-xl font-extrabold text-stone-950 tracking-tight font-sans">Muntajar</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 lg:hidden transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Journey Progress Mini-Card */}
        <div className="mx-4 mt-5 p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500">Journey Progress</span>
            <span className="text-[11px] font-extrabold text-stone-900 tabular-nums">11%</span>
          </div>
          <p className="text-[10px] font-semibold text-stone-400">Step 1 of 9</p>
          <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[11%]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Overview */}
          <Link
            href="/work/employment"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all",
              pathname === "/work/employment"
                ? "bg-amber-50/80 text-amber-900 border border-amber-200/70 shadow-2xs"
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
            )}
          >
            <Home className="w-4 h-4 text-amber-600" />
            <span>Overview</span>
          </Link>

          {/* YOUR JOURNEY */}
          <div className="space-y-1.5">
            <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
              YOUR JOURNEY
            </p>
            <div className="space-y-1">
              {journeyStepsList.map((step) => {
                const isActive = pathname.startsWith(step.href) && step.href !== "/work/employment";
                return (
                  <Link
                    key={step.step}
                    href={step.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group",
                      isActive
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-stone-400 font-bold text-[11px] w-4">{step.step}</span>
                      <span className="truncate">{step.title}</span>
                    </div>

                    {step.status === "completed" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    {step.status === "warning" && (
                      <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px] font-black text-amber-800 shrink-0">
                        !
                      </div>
                    )}
                    {step.status === "locked" && (
                      <Lock className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* TOOLS */}
          <div className="space-y-1.5">
            <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
              TOOLS
            </p>
            <div className="space-y-1">
              {toolItems.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;
                return (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                      isActive
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
                    )}
                  >
                    <Icon className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
                    <span>{tool.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom: AI Profile Analysis Prompter */}
        <div className="p-4 border-t border-stone-100">
          <Link
            href="/work/employment/analysis"
            onClick={onClose}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/70 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-amber-950">AI Profile Analysis</p>
              <p className="text-[10px] text-amber-700 font-medium">Run screening engine</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-700 transition-colors shrink-0" />
          </Link>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  pathname,
  onClick,
  label,
  Icon,
  exact,
}: {
  href: string;
  pathname: string;
  onClick?: () => void;
  label: string;
  Icon: React.ElementType;
  exact?: boolean;
}) {
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors",
        active
          ? "bg-stone-100 text-stone-900"
          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", active ? "text-stone-800" : "text-stone-400")}
        strokeWidth={1.75}
      />
      <span className="text-[13px] font-semibold">{label}</span>
    </Link>
  );
}
