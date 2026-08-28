"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Award,
  FileText,
  Users,
  Star,
  Globe,
  Zap,
  Building2,
  BadgeCheck,
  CheckCircle2,
  Calendar,
  Lock,
  FileCheck2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";
import { CalendlyWidget } from "@/components/ui/calendly-widget";
import { Logos3 } from "@/components/ui/logos3";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const VISA_LOGOS = [
  { id: "1", description: "UK Visas & Immigration" },
  { id: "2", description: "Germany Chancenkarte (Opportunity Card)" },
  { id: "3", description: "IRCC Canada Express Entry" },
  { id: "4", description: "Australia Home Affairs" },
  { id: "5", description: "USCIS United States" },
  { id: "6", description: "EU Blue Card Network" },
  { id: "7", description: "Japan Immigration Bureau" },
  { id: "8", description: "UAE Golden Visa Portal" },
  { id: "9", description: "Schengen Legal Council" },
  { id: "10", description: "VFS Global Verified" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { ...transition.slow, delay },
});

function FlagImg({ code, name }: { code: string; name: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      alt={`${name} flag`}
      className="w-5 h-3.5 object-cover rounded-xs border border-stone-200 inline-block shrink-0"
      loading="lazy"
    />
  );
}

const MIGRATION_CORRIDORS: Record<
  string,
  {
    code: string;
    country: string;
    tagline?: string;
    title: string;
    type: string;
    timeline: string;
    reqs: string;
    details: string;
    image: string;
  }
> = {
  ca: {
    code: "ca",
    country: "Canada",
    title: "Express Entry & Provincial Nominee Program (PNP)",
    type: "Direct Permanent Residency (PR)",
    timeline: "6 - 12 Months",
    reqs: "Bachelor's / Master's + 2 Years Exp + IELTS CLB 8/9",
    details: "Direct PR status upon landing. Provincial Nominee Programs (PNP) award 600 bonus CRS points for accelerated processing.",
    image: "https://images.unsplash.com/photo-1517935703635-27c7078861d6?auto=format&fit=crop&w=800&q=80",
  },
  de: {
    code: "de",
    country: "Germany",
    title: "Germany Opportunity Card (Chancenkarte)",
    type: "Points-Based Work Entry",
    timeline: "2 - 4 Months",
    reqs: "Degree / Skilled Trade Cert + Points Criteria",
    details: "Enter Germany legally without a pre-existing job offer. Blocked account (€11,904) required for visa issuance.",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
  },
  gb: {
    code: "gb",
    country: "United Kingdom",
    tagline: "UK Skilled Worker & Graduate Route",
    title: "5-Year PR Pathway (ILR)",
    type: "Work & Graduate Visas",
    timeline: "3 - 8 Weeks",
    reqs: "Licensed UK Sponsor Job Offer / UK Graduate",
    details: "Post-study 2-year Graduate Route. Skilled Worker visa leads directly to Indefinite Leave to Remain.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  au: {
    code: "au",
    country: "Australia",
    title: "Australia Skilled Independent (Subclass 189/190)",
    type: "Permanent Residency Visa",
    timeline: "8 - 14 Months",
    reqs: "Skills Assessment (ACS, EA, VETASSESS) + 65+ Points",
    details: "Direct PR visa for engineers, IT, healthcare, and finance professionals with immediate Medicare rights.",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80",
  },
};

const featuresList = [
  {
    icon: Lock,
    title: "Zero Fake Promises",
    description: "Decisions rest entirely with embassy immigration officers. We maintain a 99.4% approval rate by only submitting 100% compliant, viable files.",
  },
  {
    icon: ShieldCheck,
    title: "Financial Proof Audit Desk",
    description: "Strict verification of liquid bank balances, sponsor affidavits, and tax documents to prevent financial refusal letters.",
  },
  {
    icon: Users,
    title: "1-on-1 Embassy Mock Interviews",
    description: "Live simulated interview practice using real question banks from former visa officers for US, UK, Canada, and Schengen desks.",
  },
  {
    icon: FileText,
    title: "Attestation & Translation Hub",
    description: "Ministry of Foreign Affairs (MOFA) attestation, notary seals, WES credential evaluation filing, and sworn certified translations.",
  },
  {
    icon: BadgeCheck,
    title: "Post-Approval Relocation Care",
    description: "Pre-departure briefings, spouse and child dependant visa processing, and settlement advice upon landing.",
  },
  {
    icon: FileCheck2,
    title: "Real-Time Milestone Dashboard",
    description: "Track your visa application stage live with official timestamps and legal fee receipts.",
  },
];

const visaStories = [
  {
    name: "Dr. Kazi Ariful Islam",
    destination: "Canada",
    code: "ca",
    visaType: "Express Entry PR",
    timeline: "Approved in 7 Months",
    quote: "Muntajar performed a thorough audit of my CRS points and ECA files. Express Entry PR invitation received and stamped cleanly.",
  },
  {
    name: "Nusrat Jahan & Family",
    destination: "Germany",
    code: "de",
    visaType: "Opportunity Card + Family Dependant",
    timeline: "Approved in 6 Weeks",
    quote: "Zero agent extortion! The embassy mock interviews gave us complete confidence. Blocked account and visa audit was 100% accurate.",
  },
  {
    name: "Sajid & Farhana",
    destination: "United Kingdom",
    code: "gb",
    visaType: "UK Skilled Worker & Dependant Visa",
    timeline: "Approved in 3 Weeks",
    quote: "Our sponsor job offer and financial proof were vetted meticulous by Muntajar. Received both passports stamped without any delays.",
  },
];

const pricingPlans = [
  {
    name: "Free Visa Eligibility Audit",
    badge: "Free Assessment",
    price: "$0",
    period: "forever",
    description: "Check your visa chances, points score, and document readiness across target countries.",
    features: [
      "CRS Points & Eligibility Scorecard",
      "Financial Proof Seasoning Review",
      "Document Checklist & MOFA Advice",
      "Embassy Refusal Risk Check",
    ],
    ctaText: "Check Visa Eligibility Free",
    popular: false,
    href: "/check-eligibility",
  },
  {
    name: "Complete File Audit & Mocks",
    badge: "Most Popular",
    price: "$349",
    period: "one-time",
    description: "Full visa document audit, sponsor bank statement verification, and 1-on-1 mock interviews.",
    features: [
      "Everything in Free Audit",
      "Line-by-Line Document Verification",
      "Sponsor Bank Statement Seasoning Audit",
      "2x Simulated Embassy Mock Interviews",
      "WES & MOFA Attestation Filing",
      "Dedicated Immigration Legal Counsel",
    ],
    ctaText: "Get File Audit & Mocks",
    popular: true,
    href: "/check-eligibility",
  },
  {
    name: "Family PR & Relocation",
    badge: "Full Service",
    price: "$649",
    period: "one-time",
    description: "Complete primary applicant + spouse & child dependant filing with post-arrival settlement.",
    features: [
      "Everything in File Audit & Mocks",
      "Primary + Spouse + Child Dependant Filing",
      "Express Entry / PNP Profile Management",
      "Pre-Departure Relocation Briefing",
      "Post-Arrival Airport Pickup & Housing",
      "24/7 Priority Immigration Helpline",
    ],
    ctaText: "Get Family PR Package",
    popular: false,
    href: "/check-eligibility",
  },
];

export function VisaMigrationPage() {
  const [activeTab, setActiveTab] = React.useState<string>("ca");
  const corridorData = MIGRATION_CORRIDORS[activeTab] || MIGRATION_CORRIDORS.ca;

  return (
    <div className="bg-[#FAF9F7] text-stone-950 min-h-screen pb-24 selection:bg-amber-100 selection:text-amber-900">
      
      {/* ─── 1. HOMEPAGE-STYLE HERO SECTION ───────────────────────────── */}
      <section className="relative bg-[#FAF9F7] text-stone-900 pt-28 sm:pt-32 lg:pt-36 pb-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-7 text-left">
              
              {/* Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition.slow}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Immigration & Visa Audit Desk</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.08 }}
                className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.14] text-stone-950 tracking-tight"
              >
                Transparent Visa Processing &{" "}
                <span className="text-[#B45309] underline decoration-[#FDE68A] decoration-wavy decoration-2">
                  Embassy Mocks.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.15 }}
                className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
              >
                Honest eligibility audits, financial proof seasoning checks, WES credential evaluation, and 99.4% visa approval rate across Canada, Germany, UK & Australia.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.22 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Start Visa Eligibility Audit</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <a
                  href="#migration-corridors"
                  className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 font-bold text-sm px-7 py-4 rounded-2xl transition-all cursor-pointer shadow-2xs"
                >
                  <span>Explore Migration Pathways</span>
                </a>
              </motion.div>

              {/* Verified Badges Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.28 }}
                className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-stone-700 border-t border-stone-200/80"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Legal Audits
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Real Mock Interviews
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Zero Broker Scams
                </span>
              </motion.div>

            </div>

            {/* Right Visual Frame & Floating Overlays */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Main Portrait Frame */}
              <div className="relative w-full max-w-[480px] h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                  alt="Immigration advisor consulting client"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating Top Left Overlay Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transition.slow, delay: 0.35 }}
                className="absolute top-10 -left-4 sm:left-4 bg-white rounded-2xl p-4 border border-stone-200 flex items-center gap-3.5 max-w-[240px] z-20 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-950">99.4% Cleared</p>
                  <p className="text-[10px] text-stone-500 font-medium">Visa Approval Rate</p>
                  <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                    Strict Legal Audit
                  </span>
                </div>
              </motion.div>

              {/* Floating Bottom Right Overlay Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transition.slow, delay: 0.42 }}
                className="absolute bottom-10 -right-4 sm:right-4 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-2 max-w-[260px] z-20 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Verified Applications</span>
                  <span className="text-xs font-bold text-emerald-600">6,200+ Files</span>
                </div>

                <p className="text-xl font-extrabold text-stone-950">0% Fake Proofs</p>
                <p className="text-[11px] text-stone-500 font-medium">Canada, DE, UK & AU Pathways</p>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Embassy Mock Coaching</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Social Proof Auto-scrolling Ribbon */}
          <div className="mt-20 pt-10 border-t border-stone-200/80">
            <Logos3
              heading="Trusted by Official Visa Authorities, Immigration Portals & Legal Councils"
              logos={VISA_LOGOS}
            />
          </div>

        </div>
      </section>

      {/* ─── 2. IMPACT METRICS BAR ───────────────────────────────── */}
      <section className="py-16 md:py-20 border-y border-stone-200/80 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <motion.div {...fadeUp(0.05)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={99.4} decimals={1} suffix="%" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Embassy Approval Rate</p>
              <p className="text-xs text-stone-500 font-medium">Strict File Screening Compliance</p>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={6200} comma suffix="+" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Visa Files Approved</p>
              <p className="text-xs text-stone-500 font-medium">Students, Workers & Families</p>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={100} suffix="%" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Honest Document Audit</p>
              <p className="text-xs text-stone-500 font-medium">Zero Fake Funds or Forged Papers</p>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">$0</p>
              <p className="text-sm font-extrabold text-stone-900">Sub-Agent Surcharges</p>
              <p className="text-xs text-stone-500 font-medium">Transparent Official Fee Billing</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 3. MIGRATION CORRIDORS TABS ─────────────────────────── */}
      <section id="migration-corridors" className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Legal Migration Routes</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Explore Verified Visa & PR Pathways
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Compare processing timelines, eligibility rules, points criteria, and permanent residency options.
              </motion.p>
            </div>
          </div>

          {/* Country Tabs (rounded-2xl) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {Object.entries(MIGRATION_CORRIDORS).map(([key, d]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeTab === key
                    ? "bg-stone-950 text-white border-stone-950 shadow-md"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100 shadow-2xs"
                }`}
              >
                <FlagImg code={d.code} name={d.country} />
                <span>{d.country}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Card */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.slow}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 grid lg:grid-cols-12 gap-8 items-center shadow-xs"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FlagImg code={corridorData.code} name={corridorData.country} />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    {corridorData.country} Migration Route
                  </span>
                </div>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">{corridorData.title}</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200 space-y-1">
                  <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Visa Type:</span>
                  <p className="text-sm font-bold text-stone-950">{corridorData.type}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200 space-y-1">
                  <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Processing Timeline:</span>
                  <p className="text-sm font-bold text-stone-950">{corridorData.timeline}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong className="font-bold">Eligibility Requirements: </strong>
                <span>{corridorData.reqs}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {corridorData.details}
              </p>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-stone-950 text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md"
                >
                  <span>Check {corridorData.country} Visa Eligibility</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-[340px] sm:h-[400px] rounded-3xl overflow-hidden border border-stone-200">
              <Image
                src={corridorData.image}
                alt={corridorData.country}
                fill
                className="object-cover object-center"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 4. OLD BROKER FRAUD VS MUNTAJAR LEGAL AUDIT ─────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Legal Integrity</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Why Unlicensed Agents Lead To 10-Year Embassy Bans
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Submitting forged financial statements or fake job offers results in catastrophic refusal letters. Muntajar audits your file for 100% compliance.
              </motion.p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Old Way */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Unlicensed Agency Scams
                </span>
                <h3 className="text-2xl font-extrabold text-stone-950 mb-4">&quot;Guaranteed Visa&quot; Claims & Fake Proofs</h3>
                <ul className="space-y-3.5 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Forged Financial Statements:</strong> Using fake bank certificates that cause 10-year embassy ban letters.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Zero Mock Interview Prep:</strong> Applicants sent to embassy interviews completely unprepared for Q&A.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Hidden Sub-Agent Surcharges:</strong> Opaque extra charges added without written receipts or contracts.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-200 text-xs text-rose-600 font-semibold">
                High risk of embassy refusal & permanent record blacklisting
              </div>
            </div>

            {/* Muntajar Direct Way */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                  Muntajar Legal Audit Engine
                </span>
                <h3 className="text-2xl font-extrabold text-stone-950 mb-4">100% Genuine, Audited & Verified</h3>
                <ul className="space-y-3.5 text-sm text-stone-700">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>Real Bank Seasoning Audit:</strong> Verification of genuine sponsor balances and tax filings.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>1-on-1 Embassy Mocks:</strong> Simulated interview practice using real officer question banks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>0% Hidden Surcharges:</strong> Billed strictly at transparent government & official rates.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-200 text-xs text-emerald-700 font-extrabold flex items-center justify-between">
                <span>99.4% Verified visa approval success</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FIVE PILLARS OF VISA AUDIT ───────────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Deliverables</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Six Pillars of Visa File Clearance
              </motion.h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuresList.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  {...fadeUp(idx * 0.08)}
                  className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4 flex flex-col justify-between hover:border-stone-300 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-stone-200 flex items-center justify-center text-amber-600 font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-stone-950">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">{feat.description}</p>
                  </div>
                  <div className="pt-2 text-xs font-semibold text-stone-900 flex items-center gap-1">
                    Verified Standard <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. VERIFIED VISA SUCCESS STORIES ────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Approved Cases</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Real Visa Approvals Cleared By Muntajar
              </motion.h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {visaStories.map((st, idx) => (
              <motion.div
                key={st.name}
                {...fadeUp(idx * 0.1)}
                className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FlagImg code={st.code} name={st.destination} />
                      <span className="text-xs font-bold text-stone-900">{st.destination}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                      {st.timeline}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed pt-2">
                    &ldquo;{st.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/80 space-y-0.5">
                  <h4 className="text-base font-bold text-stone-950">{st.name}</h4>
                  <p className="text-xs text-amber-700 font-semibold">{st.visaType}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. TRANSPARENT VISA AUDIT PACKAGES ──────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Transparent Packages</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Simple Visa & File Audit Pricing
              </motion.h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-12">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                {...fadeUp(idx * 0.1)}
                className={`rounded-3xl p-8 border flex flex-col justify-between space-y-6 bg-white ${
                  plan.popular ? "border-amber-400 ring-1 ring-amber-400/50 shadow-md" : "border-stone-200"
                }`}
              >
                <div className="space-y-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {plan.badge}
                  </span>
                  <h3 className="text-2xl font-extrabold text-stone-950">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-stone-950">{plan.price}</span>
                    <span className="text-xs text-stone-500">/ {plan.period}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">{plan.description}</p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={plan.href}
                    className={`w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all ${
                      plan.popular
                        ? "bg-stone-950 text-white hover:bg-stone-800 shadow-md"
                        : "bg-[#FAF9F7] text-stone-950 border border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. CONSULTATION CALENDLY CARD ───────────────────────── */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F7] border border-stone-200 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Book Free Consultation</span>
              </div>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">
                Talk 1-on-1 With A Senior Visa Audit Advisor.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Schedule a free 30-minute visa file evaluation. We review your bank proof, sponsor documents, and embassy refusal risks — zero obligation, 100% honest advice.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free Bank Statement & Proof Seasoning Audit</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Simulated Embassy Mock Interview Assessment</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-2 sm:p-4">
              <CalendlyWidget height={640} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
