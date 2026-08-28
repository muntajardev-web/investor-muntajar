"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Globe2,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  Building2,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { ...transition.slow, delay },
});

type PortalType = "student" | "professional" | "immigration";

const PORTALS = [
  {
    id: "student" as PortalType,
    badge: "Student / Scholar",
    badgeColor: "bg-amber-100/80 text-amber-900 border-amber-200",
    icon: GraduationCap,
    title: "Student & Scholar Portal",
    subtitle: "For Study Abroad Applicants",
    description: "Track university offer letters, SOP drafting, CAS issuance, scholarship grants, and embassy interview schedules.",
    highlights: ["150+ Partner Uni Portals", "Real-Time SOP Review", "CAS & Scholarship Status"],
    cta: "Sign In as Student",
  },
  {
    id: "professional" as PortalType,
    badge: "Professional / Workforce",
    badgeColor: "bg-emerald-100/80 text-emerald-900 border-emerald-200",
    icon: Briefcase,
    title: "Worker & Professional Portal",
    subtitle: "For Overseas Career Applicants",
    description: "Access verified overseas job matches, ILO-compliant work contracts, medical clearance, and visa audit tracking.",
    highlights: ["ILO Contract Verification", "Direct Employer Matching", "Embassy Visa Clearance"],
    cta: "Sign In as Professional",
  },
  {
    id: "immigration" as PortalType,
    badge: "Immigration / Visa",
    badgeColor: "bg-sky-100/80 text-sky-900 border-sky-200",
    icon: Globe2,
    title: "Immigration Dashboard",
    subtitle: "For Visa & Immigration Applicants",
    description: "Track your immigration case status, visa application milestones, document checklist, appointment scheduling, and country-specific pathways.",
    highlights: ["Live Visa Case Tracker", "Document Checklist & Upload", "Country Immigration Pathways"],
    cta: "Sign In to Immigration",
  },
];

export function LoginPortalPageContent() {
  const [selectedPortal, setSelectedPortal] = React.useState<PortalType | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const portal = params.get("portal");
      if (portal === "student" || portal === "professional" || portal === "immigration") {
        setSelectedPortal(portal as PortalType);
      }
    }
  }, []);

  const activePortalObj = PORTALS.find((p) => p.id === selectedPortal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      if (selectedPortal === "professional") {
        document.cookie = "muntajar_demo_role=EMPLOYMENT; path=/; max-age=86400";
        window.location.href = "/work/employment";
      } else if (selectedPortal === "immigration") {
        window.location.href = "/dashboard?tab=immigration";
      } else {
        document.cookie = "muntajar_demo_role=STUDY; path=/; max-age=86400";
        window.location.href = "/dashboard";
      }
    }, 1200);
  };

  return (
    <div className="bg-[#FAF9F7] text-stone-950 min-h-screen pt-28 pb-24 selection:bg-amber-100 selection:text-amber-900">
      <Container>
        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Muntajar Secure Access
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight leading-[1.1]">
            Choose Your Portal To Sign In.
          </h1>

          <p className="text-stone-600 text-base sm:text-lg font-normal leading-relaxed">
            Select your account role below to access your personal dashboard, track milestones, or manage portfolio equity.
          </p>
        </motion.div>

        {/* 3 Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 items-stretch">
          {PORTALS.map((portal, idx) => {
            const Icon = portal.icon;
            const isSelected = selectedPortal === portal.id;
            return (
              <motion.div
                key={portal.id}
                {...fadeUp(idx * 0.1)}
                onClick={() => {
                  setSelectedPortal(portal.id);
                  setIsSubmitted(false);
                }}
                className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer bg-white ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/50 shadow-md"
                    : "border-stone-200 hover:border-stone-300 hover:-translate-y-1"
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF9F7] border border-stone-200 flex items-center justify-center text-stone-900">
                      <Icon className="w-7 h-7 text-amber-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-2xl font-bold text-stone-950 leading-snug">{portal.title}</h3>
                    <p className="text-xs font-semibold text-amber-700 mt-1">{portal.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{portal.description}</p>
                </div>

                {/* Highlights Checklist */}
                <div className="pt-4 border-t border-stone-100 space-y-2.5 flex-1">
                  {portal.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2.5 text-xs font-semibold text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm transition-all ${
                      isSelected
                        ? "bg-stone-950 text-white"
                        : "bg-[#FAF9F7] text-stone-950 border border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span>{portal.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Portal Login Form Section */}
        <AnimatePresence mode="wait">
          {selectedPortal && activePortalObj && (
            <motion.div
              key={selectedPortal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={transition.slow}
              className="max-w-xl mx-auto bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xs"
            >
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <activePortalObj.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Sign In to {activePortalObj.title}</h3>
                  <p className="text-xs text-stone-500">Enter your credentials to access your portal</p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-stone-950">Authenticating...</h4>
                  <p className="text-xs text-stone-500">Redirecting to your secure dashboard portal...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Email Address or Application ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com or MUN-10492"
                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F7] rounded-xl border border-stone-200 text-sm text-stone-950 focus:outline-none focus:border-stone-950 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                        Password / Security PIN
                      </label>
                      <a href="#" className="text-xs text-amber-700 hover:underline font-medium">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F7] rounded-xl border border-stone-200 text-sm text-stone-950 focus:outline-none focus:border-stone-950 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-stone-950 text-white font-bold text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-none cursor-pointer"
                  >
                    <span>Log In to {activePortalObj.badge} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-stone-500">
                      Don&apos;t have an account yet?{" "}
                      <Link href="/check-eligibility" className="text-amber-700 font-bold hover:underline">
                        Apply for Free Assessment
                      </Link>
                    </span>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Assurance */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-16 max-w-xl mx-auto text-center p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-600 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Encrypted 256-bit SSL connection • Authorized Muntajar Account Access</span>
        </motion.div>
      </Container>
    </div>
  );
}
