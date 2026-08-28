"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Award,
  FileText,
  Headphones,
  Users,
  Star,
  Globe,
  X,
  Zap,
  CheckCircle2,
  Calendar,
  Building2,
  Compass,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendlyWidget } from "@/components/ui/calendly-widget";
import { Logos3 } from "@/components/ui/logos3";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const STUDY_LOGOS = [
  { id: "1", description: "University of Oxford" },
  { id: "2", description: "DAAD Germany" },
  { id: "3", description: "University of Toronto" },
  { id: "4", description: "Chevening Scholarship" },
  { id: "5", description: "Erasmus+ Grants" },
  { id: "6", description: "TUM Munich" },
  { id: "7", description: "University of Melbourne" },
  { id: "8", description: "British Council" },
  { id: "9", description: "IELTS Official" },
  { id: "10", description: "IDP Education" },
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

const DESTINATIONS: Record<
  string,
  {
    code: string;
    country: string;
    tagline: string;
    tuition: string;
    workRights: string;
    universities: string[];
    scholarships: string;
    details: string;
    image: string;
  }
> = {
  uk: {
    code: "gb",
    country: "United Kingdom",
    tagline: "1-Year Master's Programs & 2-Year Post-Study Work Visa",
    tuition: "£12,000 – £22,000 / year",
    workRights: "20 hrs/wk term-time + 2-Year Graduate Route PSW",
    universities: ["University of Manchester", "University of Leeds", "Queen Mary London", "University of Bristol"],
    scholarships: "Vice-Chancellor Awards (up to £10,000) & Chevening Scholarships",
    details: "Short 1-year Master's degrees significantly reduce overall living expenses. Direct MOI English waivers accepted.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  germany: {
    code: "de",
    country: "Germany",
    tagline: "Tuition-Free Public Universities in Europe's Tech Capital",
    tuition: "€0 Tuition (Nominal semester fee €150-€350)",
    workRights: "120 full days/yr + 18-Month Opportunity Job Visa",
    universities: ["TUM Munich", "LMU Munich", "RWTH Aachen", "TU Berlin"],
    scholarships: "DAAD Scholarships & Heinrich Böll Foundation Grants",
    details: "Top public universities charge zero tuition for international students. Requires blocked account (€11,904) for visa clearance.",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
  },
  usa: {
    code: "us",
    country: "United States",
    tagline: "World-Leading Universities & 3-Year STEM OPT Extension",
    tuition: "$18,000 – $35,000 / year",
    workRights: "20 hrs/wk on-campus + 3-Year STEM OPT Extension",
    universities: ["Northeastern University", "UIC Chicago", "Arizona State Uni", "NYU"],
    scholarships: "Graduate Assistantships (TA/RA) & Merit Tuition Waivers",
    details: "STEM-designated degree programs allow up to 3 years of post-graduation work authorization in major US technology hubs.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  canada: {
    code: "ca",
    country: "Canada",
    tagline: "High Quality Education & Direct PR Pathway via PGWP",
    tuition: "CAD $16,000 – $28,000 / year",
    workRights: "20 hrs/wk work + 3-Year Post-Graduation Work Permit (PGWP)",
    universities: ["University of Waterloo", "McMaster University", "University of Alberta", "Conestoga College"],
    scholarships: "International Entrance Scholarships & Provincial Grants",
    details: "Post-Graduation Work Permits provide a direct pathway toward Express Entry (CEC) and Provincial Nominee (PNP) Permanent Residency.",
    image: "https://images.unsplash.com/photo-1517935703635-27c7078861d6?auto=format&fit=crop&w=800&q=80",
  },
  australia: {
    code: "au",
    country: "Australia",
    tagline: "Group of Eight Universities & Extended Post-Study Work Rights",
    tuition: "AUD $20,000 – $36,000 / year",
    workRights: "48 hrs/fortnight work + 2 to 4-Year Subclass 485 Visa",
    universities: ["University of Melbourne", "UNSW Sydney", "University of Queensland", "Monash University"],
    scholarships: "Australia Awards & Go8 Vice-Chancellor Scholarships",
    details: "High minimum student wages with extended post-study work rights available for regional university campuses.",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80",
  },
};

const featuresList = [
  {
    icon: GraduationCap,
    title: "Direct University Submissions",
    description: "Submit applications directly to admissions boards at 150+ partner universities in UK, US, Canada & Australia with 0% broker fees.",
  },
  {
    icon: Award,
    title: "100% Scholarship Matcher",
    description: "Scan 5,000+ government, departmental, and merit grants (DAAD, Chevening, Vice-Chancellor Awards) tailored to your CGPA.",
  },
  {
    icon: FileText,
    title: "Native Academic SOP Desk",
    description: "Line-by-line Statement of Purpose, LOR, and academic CV editing by native English scholars to maximize admission odds.",
  },
  {
    icon: ShieldCheck,
    title: "Financial & Embassy Visa Audit",
    description: "Verify bank statement fund seasoning, sponsor affidavits, and simulated 1-on-1 embassy mock interviews with legal advisors.",
  },
  {
    icon: Headphones,
    title: "Dedicated Senior Counsellor",
    description: "1-on-1 advisor matching for CAS/I-20 tracking, tuition deposit clearance, and emergency application reviews.",
  },
  {
    icon: Globe,
    title: "Post-Arrival Alumni Network",
    description: "Airport pickup coordination, student housing booking, local bank account setup, and university alumni community onboarding.",
  },
];

const studentStories = [
  {
    name: "Tashfin Ahmed",
    destination: "Germany",
    code: "de",
    uni: "Technical University of Munich (TUM)",
    degree: "M.Sc. Data Engineering",
    funding: "100% Tuition-Free Admission",
    quote: "Muntajar mapped my academic profile to public universities in Germany. I secured admission at TUM and my visa was approved in 3 weeks.",
  },
  {
    name: "Sabrina Hossain",
    destination: "United Kingdom",
    code: "gb",
    uni: "University of Manchester",
    degree: "M.Sc. Artificial Intelligence",
    funding: "£8,000 Merit Award",
    quote: "The counselor feedback on my Statement of Purpose made a massive difference. I received an £8,000 scholarship and smooth CAS issuance.",
  },
  {
    name: "Ayman Rahman",
    destination: "United States",
    code: "us",
    uni: "Northeastern University",
    degree: "MS in Computer Science (STEM)",
    funding: "$14,000 Dean's Scholarship",
    quote: "The F1 visa mock interviews gave me complete confidence at the embassy. Now studying CS in Boston with 3 years of STEM OPT ahead.",
  },
];

const pricingPlans = [
  {
    name: "Starter Profile Audit",
    badge: "Free Assessment",
    price: "$0",
    period: "forever",
    description: "Ideal for exploring options and checking initial eligibility across top universities.",
    features: [
      "Profile & CGPA Audit",
      "University Shortlist (3 Unis)",
      "Scholarship Eligibility Search",
      "General Visa Checklist",
    ],
    ctaText: "Check Eligibility Free",
    popular: false,
    href: "/check-eligibility",
  },
  {
    name: "Pro Admission Track",
    badge: "Most Popular",
    price: "$299",
    period: "one-time",
    description: "Complete university application management with native SOP editing & scholarship applications.",
    features: [
      "Everything in Starter",
      "Up to 5 University Submissions",
      "Native Academic SOP Desk",
      "100% Scholarship Applications",
      "CAS / I-20 Document Audit",
      "Dedicated Senior Advisor",
    ],
    ctaText: "Get Pro Admission Track",
    popular: true,
    href: "/get-started",
  },
  {
    name: "VIP Platinum & Visa Guarantee",
    badge: "Full Service",
    price: "$599",
    period: "one-time",
    description: "Unlimited university applications, embassy mock coaching, and post-arrival housing setup.",
    features: [
      "Everything in Pro Track",
      "Unlimited University Applications",
      "1-on-1 Embassy Mock Interview Coaching",
      "Sponsor Bank Statement Verification",
      "Post-Arrival Student Housing Booking",
      "Airport Pickup & Alumni Onboarding",
    ],
    ctaText: "Get VIP Platinum",
    popular: false,
    href: "/get-started",
  },
];

export function StudyAbroadPage() {
  const [activeTab, setActiveTab] = React.useState<string>("uk");
  const destData = DESTINATIONS[activeTab] || DESTINATIONS.uk;

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
                <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                <span>T2 — Study Abroad & Scholarships</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.08 }}
                className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.14] text-stone-950 tracking-tight"
              >
                From Profile Shortlisting To{" "}
                <span className="text-[#B45309] underline decoration-[#FDE68A] decoration-wavy decoration-2">
                  100% Scholarship.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.15 }}
                className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
              >
                Direct university applications, native SOP editing, verified scholarship matching, and 99.4% embassy visa approval across UK, Germany, USA, Canada & Australia.
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
                  <span>Start Free Profile Audit</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <a
                  href="#destinations-tabs"
                  className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 font-bold text-sm px-7 py-4 rounded-2xl transition-all cursor-pointer shadow-2xs"
                >
                  <span>Explore Destinations</span>
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
                  0% Broker Fee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  150+ Partner Unis
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  99.4% Visa Rate
                </span>
              </motion.div>

            </div>

            {/* Right Visual Frame & Floating Overlays */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Main Portrait Frame */}
              <div className="relative w-full max-w-[480px] h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                  alt="Students studying at international university"
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
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-950">$4,250,000 USD</p>
                  <p className="text-[10px] text-stone-500 font-medium">Scholarships Secured</p>
                  <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                    Chevening & DAAD
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
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Direct Admissions</span>
                  <span className="text-xs font-bold text-emerald-600">150+ Unis</span>
                </div>

                <p className="text-xl font-extrabold text-stone-950">0% Commission</p>
                <p className="text-[11px] text-stone-500 font-medium">Direct Portal Submissions</p>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Transparent Terms</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Social Proof Auto-scrolling Ribbon */}
          <div className="mt-20 pt-10 border-t border-stone-200/80">
            <Logos3
              heading="Trusted by 150+ Top International Universities & Scholarship Grants"
              logos={STUDY_LOGOS}
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
                $<AnimatedCounter to={4.2} decimals={1} suffix="M+" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Scholarships Awarded</p>
              <p className="text-xs text-stone-500 font-medium">DAAD, Chevening & Merit Grants</p>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={150} suffix="+" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Partner Universities</p>
              <p className="text-xs text-stone-500 font-medium">UK, US, Canada, Germany, AU</p>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={99.4} decimals={1} suffix="%" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Visa Success Rate</p>
              <p className="text-xs text-stone-500 font-medium">Strict Embassy Proof Audits</p>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={5000} suffix="+" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Active Scholars</p>
              <p className="text-xs text-stone-500 font-medium">Enrolled Across Global Campuses</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 3. DESTINATIONS TABS & SHOWCASE ─────────────────────── */}
      <section id="destinations-tabs" className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Homepage 12-Column Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>Target Countries</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Explore Top Study Abroad Destinations
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Compare tuition fees, work rights, partner universities, and scholarship options tailored to Bangladeshi applicants.
              </motion.p>
            </div>
          </div>

          {/* Country Tab Pills (rounded-2xl) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {Object.entries(DESTINATIONS).map(([key, d]) => (
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

          {/* Tab Content Box */}
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
                  <FlagImg code={destData.code} name={destData.country} />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    {destData.country} Study Track
                  </span>
                </div>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">{destData.tagline}</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200 space-y-1">
                  <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Est. Tuition Fee:</span>
                  <p className="text-sm font-bold text-stone-950">{destData.tuition}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200 space-y-1">
                  <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Work Permit Rights:</span>
                  <p className="text-sm font-bold text-stone-950">{destData.workRights}</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Top Partner Universities:
                </span>
                <div className="flex flex-wrap gap-2">
                  {destData.universities.map((uni) => (
                    <span key={uni} className="px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800">
                      {uni}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong className="font-bold">Available Grants: </strong>
                <span>{destData.scholarships}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {destData.details}
              </p>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-stone-950 text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md"
                >
                  <span>Apply for {destData.country} Pathway</span>
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

      {/* ─── 4. OLD BROKER WAY VS MUNTAJAR DIRECT WAY ────────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Broker vs Muntajar Direct</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Why Students Switch From Traditional Agents To Muntajar
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Traditional brokers profit off hidden markups and low-tier partner commissions. Muntajar works directly for your success.
              </motion.p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Old Way */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Traditional Unlicensed Agency
                </span>
                <h3 className="text-2xl font-extrabold text-stone-950 mb-4">Opaque Fees & Biased Selection</h3>
                <ul className="space-y-3.5 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>High File Fees:</strong> Demanding $1,500+ upfront plus hidden university kickbacks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Copy-Pasted SOPs:</strong> Reused Statement of Purpose templates that get flagged and rejected.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Biased Recommendations:</strong> Pushing low-tier colleges that pay high agent commissions.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-200 text-xs text-rose-600 font-semibold">
                High risk of embassy rejections & wasted savings
              </div>
            </div>

            {/* Muntajar Direct Way */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                  Muntajar Direct Platform
                </span>
                <h3 className="text-2xl font-extrabold text-stone-950 mb-4">100% Direct, Transparent & Guaranteed</h3>
                <ul className="space-y-3.5 text-sm text-stone-700">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>0% Broker Fee:</strong> $0 Free audit or transparent $299 flat Pro admission track.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>Native SOP Desk:</strong> Line-by-line SOP editing by native academic scholars.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>99.4% Visa Rate:</strong> Bank statement seasoning checks and simulated 1-on-1 embassy mock interviews.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-200 text-xs text-emerald-700 font-extrabold flex items-center justify-between">
                <span>Average student scholarship won: $8,500 – $25,000</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CORE SERVICE FEATURES ────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Deliverables</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Six Pillars of Student Success
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

      {/* ─── 6. STUDENT STORIES SHOWCASE ─────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Success Stories</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Real Bangladeshi Scholars Studying Abroad
              </motion.h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {studentStories.map((st, idx) => (
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
                      {st.funding}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed pt-2">
                    &ldquo;{st.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/80 space-y-0.5">
                  <h4 className="text-base font-bold text-stone-950">{st.name}</h4>
                  <p className="text-xs text-stone-600 font-medium">{st.degree}</p>
                  <p className="text-[11px] text-amber-700 font-semibold">{st.uni}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. TRANSPARENT PRICING PLANS ────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Transparent Admission Plans</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Simple, Outcome-Based Student Pricing
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
                Talk 1-on-1 With A Senior Student Advisor Today.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Schedule a 30-minute 1-on-1 eligibility check. We review your CGPA, budget, target intakes, and scholarship odds — zero pressure, 100% direct advice.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free Profile & CGPA Audit</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct University Admission Shortlist</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-2 sm:p-4">
              <CalendlyWidget height={640} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
