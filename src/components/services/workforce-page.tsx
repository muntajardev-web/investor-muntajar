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
  Briefcase,
  Award,
  FileText,
  Headphones,
  Users,
  Star,
  Globe,
  Zap,
  Building2,
  BadgeCheck,
  CheckCircle2,
  Calendar,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";
import { CalendlyWidget } from "@/components/ui/calendly-widget";
import { Logos3 } from "@/components/ui/logos3";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const WORKFORCE_LOGOS = [
  { id: "1", description: "NHS Healthcare UK" },
  { id: "2", description: "Siemens Germany" },
  { id: "3", description: "BMW Group DE" },
  { id: "4", description: "Express Entry Canada" },
  { id: "5", description: "BHP Australia" },
  { id: "6", description: "ILO Global Workforce" },
  { id: "7", description: "Care UK Nursing" },
  { id: "8", description: "Tech Mahindra EU" },
  { id: "9", description: "Gulf Talent Network" },
  { id: "10", description: "EU Blue Card Council" },
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

const JOB_POSITIONS = [
  {
    code: "de",
    country: "Germany",
    title: "CNC & Mechanical Technician",
    employer: "Industrial Precision GmbH",
    location: "Stuttgart, Germany",
    salary: "€3,800 / month",
    details: "Free 3-Month Housing · EU Blue Card Route",
    category: "engineering",
  },
  {
    code: "gb",
    country: "United Kingdom",
    title: "Registered Staff Nurse (NHS)",
    employer: "NHS Foundation Trust",
    location: "London, UK",
    salary: "£3,200 / month",
    details: "5-Year PR Route · NHS Pension & Benefits",
    category: "healthcare",
  },
  {
    code: "jp",
    country: "Japan",
    title: "Software & DevOps Engineer",
    employer: "NextGen Technologies Japan",
    location: "Tokyo, Japan",
    salary: "¥420,000 / month",
    details: "SSW-2 Visa · Permanent Residency Route",
    category: "engineering",
  },
  {
    code: "ae",
    country: "UAE",
    title: "Site HSE & Safety Specialist",
    employer: "Emirates Contracting LLC",
    location: "Dubai, UAE",
    salary: "AED 12,000 / month (Tax-Free)",
    details: "100% Tax-Free · Housing & Annual Return Flight",
    category: "trades",
  },
  {
    code: "ca",
    country: "Canada",
    title: "Heavy Equipment Mechanic",
    employer: "Ontario Resource Corp",
    location: "Toronto, Canada",
    salary: "CAD $5,200 / month",
    details: "Approved LMIA Job Offer · Express Entry Points",
    category: "trades",
  },
  {
    code: "de",
    country: "Germany",
    title: "Automotive Systems Engineer",
    employer: "Bavaria Auto Tech",
    location: "Munich, Germany",
    salary: "€4,500 / month",
    details: "EU Blue Card · 21-Month PR Path",
    category: "engineering",
  },
];

const WORK_DESTINATIONS: Record<
  string,
  {
    code: string;
    country: string;
    tagline: string;
    avgSalary: string;
    workRights: string;
    industries: string[];
    details: string;
    image: string;
  }
> = {
  germany: {
    code: "de",
    country: "Germany",
    tagline: "EU Blue Card & Opportunity Card (Chancenkarte)",
    avgSalary: "€3,500 – €5,500 / month",
    workRights: "Full PR Route in 21 Months with German B1",
    industries: ["Engineering & CNC", "Automotive Tech", "Healthcare & Nursing", "IT & DevOps"],
    details: "Germany's Opportunity Card allows skilled workers to enter for job seeking, while the EU Blue Card provides fast-track Permanent Residency.",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
  },
  uk: {
    code: "gb",
    country: "United Kingdom",
    tagline: "Skilled Worker Visa & NHS Healthcare Corridors",
    avgSalary: "£2,800 – £4,800 / month",
    workRights: "5-Year Direct Pathway to Indefinite Leave to Remain",
    industries: ["NHS Staff Nurses", "Care Workers", "Software Engineers", "Construction Managers"],
    details: "Pre-approved employer sponsorship certificates (CoS) enable legal employment with full spouse work authorization.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  japan: {
    code: "jp",
    country: "Japan",
    tagline: "Specified Skilled Worker (SSW-1 & SSW-2) Visas",
    avgSalary: "¥350,000 – ¥550,000 / month",
    workRights: "Unlimited Renewals & Family Sponsorship under SSW-2",
    industries: ["IT & DevOps", "Automotive Mechanics", "Hospitality", "Industrial Maintenance"],
    details: "Government-backed visa framework with direct employer matching, language training, and permanent residency options.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
  },
  uae: {
    code: "ae",
    country: "UAE",
    tagline: "Tax-Free Salaries & Direct Corporate Contracts",
    avgSalary: "AED 8,000 – 18,000 / month",
    workRights: "2-Year Renewable Residence Visa + Family Sponsorship",
    industries: ["Site Engineering & Safety", "Hospitality Management", "Logistics & Supply", "Aviation"],
    details: "Zero income tax with full employer coverage for accommodation, health insurance, and annual return flights.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
  canada: {
    code: "ca",
    country: "Canada",
    tagline: "LMIA Approved Work Permits & Express Entry Points",
    avgSalary: "CAD $4,000 – $7,000 / month",
    workRights: "Employer Specific Work Permit + PNP/Express Entry PR",
    industries: ["Heavy Mechanics", "Construction Management", "IT Specialists", "Healthcare"],
    details: "LMIA-backed job offers grant up to 200 CRS points for Express Entry Permanent Residency applications.",
    image: "https://images.unsplash.com/photo-1517935703635-27c7078861d6?auto=format&fit=crop&w=800&q=80",
  },
};

const featuresList = [
  {
    icon: Building2,
    title: "100% Vetted Employers",
    description: "Every employer is legally verified for minimum wage compliance, safe working conditions, and government sponsorship licenses.",
  },
  {
    icon: ShieldCheck,
    title: "ILO Standard Contracts",
    description: "No verbal promises. Bimodal employment contracts in English and Bangla aligned with International Labour Organization standards.",
  },
  {
    icon: BadgeCheck,
    title: "Zero Illegal Agent Fees",
    description: "Eliminate middleman agent exploitation. Transparent direct application matching with no extortionate recruitment fees.",
  },
  {
    icon: FileText,
    title: "Medical & Visa Clearance",
    description: "Complete GAMCA/EU medical appointment guidance, police clearance checks, and embassy document verification.",
  },
  {
    icon: Headphones,
    title: "Pre-Departure Briefings",
    description: "Orientation sessions on destination labor laws, employee rights, wage protection systems, and emergency hotline access.",
  },
  {
    icon: Users,
    title: "Post-Arrival Welfare Desk",
    description: "Airport pickup coordination, local SIM & bank account opening, employer check-in, and 24/7 worker helpline.",
  },
];

const workerStories = [
  {
    name: "Engr. Mahmudul Hasan",
    destination: "Germany",
    code: "de",
    role: "CNC Industrial Technician",
    salary: "€3,800 / month",
    quote: "Muntajar connected me directly with a Bavarian precision engineering firm. My contract was 100% ILO compliant and my EU Blue Card was granted smoothly.",
  },
  {
    name: "Farhana Parvin",
    destination: "United Kingdom",
    code: "gb",
    role: "NHS Registered Staff Nurse",
    salary: "£3,200 / month",
    quote: "Zero agent fees! Muntajar guided me through NMC registration, CBT exams, and NHS interview prep. Now working in London with a 5-year PR track.",
  },
  {
    name: "Tanvir Rahman",
    destination: "Japan",
    code: "jp",
    role: "DevOps & Cloud Specialist",
    salary: "¥450,000 / month",
    quote: "The SSW-2 visa process was crystal clear. Muntajar took care of my employer match in Tokyo and my family is joining me next month.",
  },
];

const pricingPlans = [
  {
    name: "Worker Profile Audit",
    badge: "Free Assessment",
    price: "$0",
    period: "forever",
    description: "Check your CV, skill eligibility, and job match across Europe, UK, Japan, and Canada.",
    features: [
      "Skill & Experience Audit",
      "Eligible Countries Assessment",
      "Salary Benchmark Report",
      "Visa Eligibility Check",
    ],
    ctaText: "Check Job Eligibility Free",
    popular: false,
    href: "/check-eligibility",
  },
  {
    name: "Skilled Placement Track",
    badge: "Most Popular",
    price: "$399",
    period: "one-time",
    description: "Direct employer matching, ILO contract verification, and embassy visa file preparation.",
    features: [
      "Everything in Free Audit",
      "Direct Vetted Employer Matching",
      "ILO Standard Contract Verification",
      "Embassy Visa File Preparation",
      "Pre-Departure Briefing & Guidance",
      "Dedicated Mobility Advisor",
    ],
    ctaText: "Get Skilled Placement Track",
    popular: true,
    href: "/work/employment",
  },
  {
    name: "Executive & Family Mobility",
    badge: "Full Service",
    price: "$699",
    period: "one-time",
    description: "Complete executive job matching, spouse visa processing, and post-arrival relocation support.",
    features: [
      "Everything in Placement Track",
      "Spouse & Family Visa Processing",
      "EU Blue Card / LMIA Expedited Filing",
      "Airport Pickup & Housing Setup",
      "Local Registration & Bank Account",
      "24/7 Relocation Support Desk",
    ],
    ctaText: "Get Executive Mobility",
    popular: false,
    href: "/work/employment",
  },
];

export function WorkforcePage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [activeDestTab, setActiveDestTab] = React.useState<string>("germany");

  const filteredJobs = React.useMemo(() => {
    if (activeCategory === "all") return JOB_POSITIONS;
    return JOB_POSITIONS.filter((j) => j.category === activeCategory);
  }, [activeCategory]);

  const destData = WORK_DESTINATIONS[activeDestTab] || WORK_DESTINATIONS.germany;

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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                <span>T3 — Overseas Jobs & Skilled Workforce</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.08 }}
                className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.14] text-stone-950 tracking-tight"
              >
                Dignified Overseas Careers With{" "}
                <span className="text-[#15803D] underline decoration-[#BBF7D0] decoration-wavy decoration-2">
                  0% Agent Fees.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.15 }}
                className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
              >
                Verified job placements in Germany, UK, Japan, UAE & Canada. ILO-compliant employment contracts, government labor clearance, and 99.4% visa approval.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.22 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <a
                  href="#open-positions"
                  className="inline-flex items-center justify-center bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Browse Open Positions</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>

                <a
                  href="#work-destinations"
                  className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 font-bold text-sm px-7 py-4 rounded-2xl transition-all cursor-pointer shadow-2xs"
                >
                  <span>Explore Work Destinations</span>
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
                  ILO Standard Contracts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Vetted Employers
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Zero Hidden Fees
                </span>
              </motion.div>

            </div>

            {/* Right Visual Frame & Floating Overlays */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Main Portrait Frame */}
              <div className="relative w-full max-w-[480px] h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                  alt="Skilled technician working in international facility"
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
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-950">100% ILO Contracts</p>
                  <p className="text-[10px] text-stone-500 font-medium">Legal Protection</p>
                  <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                    Guaranteed Minimum Wage
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
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Verified Placements</span>
                  <span className="text-xs font-bold text-emerald-600">4,850+</span>
                </div>

                <p className="text-xl font-extrabold text-stone-950">0% Agent Fees</p>
                <p className="text-[11px] text-stone-500 font-medium">Germany, UK, JP & UAE Corridors</p>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct Employer Matching</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Social Proof Auto-scrolling Ribbon */}
          <div className="mt-20 pt-10 border-t border-stone-200/80">
            <Logos3
              heading="Trusted by Multinational Employers, Health Services & Enterprise Networks"
              logos={WORKFORCE_LOGOS}
            />
          </div>

        </div>
      </section>

      {/* ─── 2. IMPACT METRICS BAR ───────────────────────────────── */}
      <section className="py-16 md:py-20 border-y border-stone-200/80 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <motion.div {...fadeUp(0.05)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-emerald-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={4850} suffix="+" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Verified Job Placements</p>
              <p className="text-xs text-stone-500 font-medium">Across Europe, Middle East & Asia</p>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-emerald-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={100} suffix="%" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">ILO-Compliant Contracts</p>
              <p className="text-xs text-stone-500 font-medium">Bilingual English & Bangla Contracts</p>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-emerald-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                €<AnimatedCounter to={3800} comma />/mo
              </p>
              <p className="text-sm font-extrabold text-stone-900">Avg Skilled Monthly Salary</p>
              <p className="text-xs text-stone-500 font-medium">With Relocation & Medical Benefits</p>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-emerald-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">$0</p>
              <p className="text-sm font-extrabold text-stone-900">Illegal Recruitment Charges</p>
              <p className="text-xs text-stone-500 font-medium">Zero Middleman Extortion</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 3. OPEN POSITIONS SHOWCASE ──────────────────────────── */}
      <section id="open-positions" className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCFCE7] border border-emerald-200 text-[#15803D] text-xs font-bold">
                <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                <span>Featured Opportunities</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Verified Overseas Job Openings
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Explore active employer positions with pre-approved work visas, clear salaries, and relocation support.
              </motion.p>
            </div>
          </div>

          {/* Filter Pills (rounded-2xl) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {[
              { id: "all", label: "All Roles" },
              { id: "engineering", label: "Engineering & Tech" },
              { id: "healthcare", label: "Healthcare & Nursing" },
              { id: "trades", label: "Skilled Trades & Safety" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveCategory(f.id)}
                className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeCategory === f.id
                    ? "bg-stone-950 text-white border-stone-950 shadow-md"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100 shadow-2xs"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Job Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job, idx) => (
              <motion.div
                key={job.title + idx}
                {...fadeUp(idx * 0.08)}
                className="p-7 rounded-3xl bg-white border border-stone-200 flex flex-col justify-between space-y-6 hover:border-stone-300 transition-all group shadow-2xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FlagImg code={job.code} name={job.country} />
                      <span className="text-xs font-bold text-stone-950">{job.country}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                      {job.salary}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-sans font-extrabold text-xl text-stone-950 group-hover:text-emerald-700 transition-colors leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-stone-400" />
                      {job.employer}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-normal bg-[#FAF9F7] p-3.5 rounded-2xl border border-stone-200/80">
                    <span className="font-semibold text-stone-900">Relocation Perks: </span>
                    {job.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs transition-all shadow-md"
                  >
                    <span>Apply for Position</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WORK DESTINATIONS SHOWCASE ───────────────────────── */}
      <section id="work-destinations" className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCFCE7] border border-emerald-200 text-[#15803D] text-xs font-bold">
                <span>Employment Corridors</span>
              </motion.div>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Top Global Work Destinations
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Compare average monthly salaries, PR pathways, key industries, and legal visa routes.
              </p>
            </div>
          </div>

          {/* Country Tabs (rounded-2xl) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {Object.entries(WORK_DESTINATIONS).map(([key, d]) => (
              <button
                key={key}
                onClick={() => setActiveDestTab(key)}
                className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeDestTab === key
                    ? "bg-stone-950 text-white border-stone-950 shadow-md"
                    : "bg-[#FAF9F7] text-stone-700 border-stone-200 hover:bg-stone-100 shadow-2xs"
                }`}
              >
                <FlagImg code={d.code} name={d.country} />
                <span>{d.country}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Box */}
          <motion.div
            key={activeDestTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.slow}
            className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F7] border border-stone-200 grid lg:grid-cols-12 gap-8 items-center shadow-xs"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FlagImg code={destData.code} name={destData.country} />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    {destData.country} Employment Corridor
                  </span>
                </div>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">{destData.tagline}</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Avg Monthly Salary:</span>
                  <p className="text-sm font-bold text-stone-950">{destData.avgSalary}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">PR & Residency Pathway:</span>
                  <p className="text-sm font-bold text-stone-950">{destData.workRights}</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  High-Demand Industries:
                </span>
                <div className="flex flex-wrap gap-2">
                  {destData.industries.map((ind) => (
                    <span key={ind} className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-800">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {destData.details}
              </p>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-stone-950 text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md"
                >
                  <span>Apply for {destData.country} Job Corridor</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-[340px] sm:h-[400px] rounded-3xl overflow-hidden border border-stone-200">
              <Image
                src={destData.image}
                alt={destData.country}
                fill
                className="object-cover object-center"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 5. OLD EXPLOITATIVE BROKER VS MUNTAJAR ETHICAL DIRECT ── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Ethical Standard</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Ending Exploitative Middleman Recruitment
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Bangladeshi workers lose thousands of dollars to fake job promises and illegal sub-agents. Muntajar guarantees 100% legal dignity.
              </motion.p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Old Way */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Traditional Unlicensed Broker
                </span>
                <h3 className="text-2xl font-extrabold text-stone-950 mb-4">Extortionate Fees & Fake Contracts</h3>
                <ul className="space-y-3.5 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Extortionate Agent Fees:</strong> Charging $3,000 – $8,000 upfront with zero refund guarantee.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Fake Job Offers:</strong> Unverified contracts with lower wages or nonexistent employers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Zero Post-Arrival Care:</strong> Stranded overseas without housing or emergency legal support.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-200 text-xs text-rose-600 font-semibold">
                High risk of passport confiscation & wage theft
              </div>
            </div>

            {/* Muntajar Direct Way */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                  Muntajar Direct Platform
                </span>
                <h3 className="text-2xl font-extrabold text-stone-950 mb-4">100% Legal, Dignified & Transparent</h3>
                <ul className="space-y-3.5 text-sm text-stone-700">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>$0 Illegal Recruitment Fees:</strong> Billed strictly at transparent government & visa costs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>ILO Standard Contracts:</strong> Legally binding bilingual contracts guaranteeing minimum wage.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>Full Relocation Network:</strong> Airport pickup, housing allocation, and 24/7 worker helpline.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-200 text-xs text-emerald-700 font-extrabold flex items-center justify-between">
                <span>Average worker fee savings: $3,000 – $6,500</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SIX PILLARS OF ETHICAL MOBILITY ─────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Deliverables</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Six Commitments to Overseas Workers
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
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-stone-200 flex items-center justify-center text-emerald-700 font-bold">
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

      {/* ─── 7. WORKER TESTIMONIALS SHOWCASE ───────────────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Placements</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Real Bangladeshi Workers Thriving Overseas
              </motion.h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {workerStories.map((st, idx) => (
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
                      {st.salary}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed pt-2">
                    &ldquo;{st.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/80 space-y-0.5">
                  <h4 className="text-base font-bold text-stone-950">{st.name}</h4>
                  <p className="text-xs text-stone-600 font-medium">{st.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. TRANSPARENT PLACEMENT PACKAGES ─────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Transparent Packages</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Ethical & Outcome-Based Job Packages
              </motion.h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-12">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                {...fadeUp(idx * 0.1)}
                className={`rounded-3xl p-8 border flex flex-col justify-between space-y-6 bg-white ${
                  plan.popular ? "border-emerald-500 ring-1 ring-emerald-500/50 shadow-md" : "border-stone-200"
                }`}
              >
                <div className="space-y-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
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

      {/* ─── 9. CONSULTATION CALENDLY CARD ───────────────────────── */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F7] border border-stone-200 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Book Free Consultation</span>
              </div>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">
                Talk 1-on-1 With A Senior Workforce Advisor.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Book a free 30-minute job eligibility check. We review your technical skills, language level, target countries, and employer placement options — zero obligation.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free Skill & Resume Audit</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct Employer Placement Mapping</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#FAF9F7] rounded-2xl border border-stone-200 p-2 sm:p-4">
              <CalendlyWidget height={640} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
