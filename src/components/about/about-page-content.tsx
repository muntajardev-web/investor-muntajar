"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Globe2,
  TrendingUp,
  HeartHandshake,
  MapPin,
  Mail,
  Phone,
  Building2,
  Sparkles,
  Target,
  Compass,
  Check,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";
import { contact } from "@/lib/site-data";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { ...transition.slow, delay },
});

/* ─── Impact Metrics ─────────────────────────────────────────── */
const stats = [
  { value: "$4.2M+", label: "Student & Worker Fees Saved", subtext: "Zero middleman markups" },
  { value: "150+", label: "Partner Universities", subtext: "Direct admissions in UK, US, CA, AU" },
  { value: "99.4%", label: "Visa Approval Rate", subtext: "Strict legal audit compliance" },
  { value: "12,400+", label: "Lives Transformed", subtext: "Across students, professionals & workforce" },
];

/* ─── Core Values / Four Commitments ──────────────────────────── */
const pillars = [
  {
    icon: ShieldCheck,
    title: "100% Fee Transparency",
    description: "Every cost, timeline, and institution fee is disclosed upfront before you spend a single Taka. No hidden charges, ever.",
    tag: "Zero Markup",
  },
  {
    icon: GraduationCap,
    title: "Direct University Portals",
    description: "Submit applications directly to university admissions teams without sketchy third-party agents altering your credentials.",
    tag: "Direct Admissions",
  },
  {
    icon: Briefcase,
    title: "ILO-Aligned Employment",
    description: "Vetted overseas employers with legal job offers, guaranteed minimum wages, and dignity for every overseas worker.",
    tag: "Ethical Migration",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Scholar Support",
    description: "Our dedicated counsellors support you from initial eligibility assessment all the way to airport arrival and settlement.",
    tag: "End-to-End Care",
  },
];

/* ─── Service Tracks ─────────────────────────────────────────── */
const tracks = [
  {
    badge: "T1 — Skilled Professionals",
    title: "Career Acceleration for Tech & Executive Talent",
    description: "Global job matching, visa sponsorship pathways, and legal immigration support for Bangladeshi engineers, doctors, and specialists.",
    href: "/services/skilled-professionals",
    accent: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    badge: "T2 — Students & Scholars",
    title: "From Profile Shortlisting to Full Scholarship",
    description: "Direct university applications, SOP guidance, scholarship matching up to $25,000/yr, and embassy interview prep.",
    href: "/services/study-abroad",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    badge: "T3 — Workforce & Skilled Labor",
    title: "Dignified Overseas Employment & Fair Mobility",
    description: "Ethical overseas jobs in construction, hospitality, and healthcare with zero recruitment fees and government compliance.",
    href: "/services/workforce",
    accent: "bg-sky-50 text-sky-700 border-sky-200",
  },
];

/* ─── Leadership / Advisory Team ─────────────────────────────── */
const team = [
  {
    name: "Tashin Ahmed",
    role: "Founder & Chief Executive",
    bio: "Former international education strategist passionate about dismantling predatory immigration agency networks across South Asia.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    badge: "Leadership",
  },
  {
    name: "Dr. Rafiqul Islam",
    role: "Head of Academic Partnerships",
    bio: "Ex-Admissions Dean with 18+ years of university relation experience across the UK, Canada, and Australia.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    badge: "Admissions",
  },
  {
    name: "Nusrat Jahan",
    role: "Director of Legal & Compliance",
    bio: "Immigration legal counsel specializing in student visa compliance, work permit verification, and ILO labor standards.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    badge: "Immigration Law",
  },
];

/* ─── Company Roadmap ────────────────────────────────────────── */
const milestones = [
  {
    year: "2023",
    title: "The Problem Identified",
    desc: "Exposed $50M+ lost annually by Bangladeshi families to unlicensed brokers. Started building Muntajar's transparent engine.",
  },
  {
    year: "2024",
    title: "Direct Portal Launch",
    desc: "Partnered with 50+ UK & Canadian universities. Onboarded the first 2,500 students with 0% broker commissions.",
  },
  {
    year: "2025",
    title: "Workforce & Skilled Expansion",
    desc: "Expanded into European tech hiring and Gulf ethical labor recruitment under strict ILO migration standards.",
  },
  {
    year: "2026 & Beyond",
    title: "South Asian Mobility Standard",
    desc: "Scaling direct mobility tech to Nepal, India, and Sri Lanka to permanently liberate applicants from middleman exploitation.",
  },
];

export function AboutPageContent() {
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
                <Globe2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Who We Are & Our Story</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.08 }}
                className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.14] text-stone-950 tracking-tight"
              >
                Empowering Millions With{" "}
                <span className="text-[#B45309] underline decoration-[#FDE68A] decoration-wavy decoration-2">
                  Honest
                </span>{" "}
                Global Mobility.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.15 }}
                className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
              >
                Muntajar is Bangladesh&apos;s pioneering broker-free global mobility platform — replacing predatory agency markups with direct university admissions, ethical workforce placements, and verified visa tracking.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.22 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  href="/investors"
                  className="inline-flex items-center justify-center bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>View Investor Deck</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  href="/destinations"
                  className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 font-bold text-sm px-7 py-4 rounded-2xl transition-all cursor-pointer shadow-2xs"
                >
                  <span>Explore Destinations</span>
                </Link>
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
                  Government Registered
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ILO Labor Aligned
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  150+ Direct Unis
                </span>
              </motion.div>

            </div>

            {/* Right Visual Frame & Floating Overlays */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Main Portrait Frame */}
              <div className="relative w-full max-w-[480px] h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Muntajar team helping students"
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
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-950">12,450+ Applicants</p>
                  <p className="text-[10px] text-stone-500 font-medium">Successful Mobility</p>
                  <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                    99.4% Visa Success
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
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Broker Fees Saved</span>
                  <span className="text-xs font-bold text-emerald-600">$4,250,000</span>
                </div>

                <p className="text-xl font-extrabold text-stone-950">0% Commission</p>
                <p className="text-[11px] text-stone-500 font-medium">Direct Portal Submissions</p>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Transparent Global Mobility</span>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 2. IMPACT METRICS GRID ──────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white border-y border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((st, idx) => (
              <motion.div
                key={st.label}
                {...fadeUp(idx * 0.08)}
                className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                  {st.value}
                </p>
                <p className="text-sm font-extrabold text-stone-900">{st.label}</p>
                <p className="text-xs text-stone-500 font-medium">{st.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. THE PROBLEM VS THE MUNTAJAR SOLUTION ─────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Why We Exist</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                The Traditional Broker Model Is Broken. We Rebuilt It.
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                For decades, students and workforce applicants in South Asia have faced hidden fees, fraudulent offers, and zero support. Muntajar replaces chaos with clarity.
              </motion.p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* The Old Broker Way (Red/Stone outline) */}
            <motion.div
              {...fadeUp(0.1)}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 space-y-6 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Traditional Unlicensed Agency
                </div>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mb-4">
                  High Risk, Hidden Fees & Exploitation
                </h3>
                <ul className="space-y-3.5 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Exorbitant Broker Fees:</strong> Demanding $3,000 – $9,000 upfront with zero refund guarantee.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Fake Admission Offers:</strong> Forged documents and unaccredited college placements.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Opaque Visa Process:</strong> Applicants left in the dark with no tracking or legal backup.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <span><strong>Zero Post-Arrival Care:</strong> Stranded overseas without accommodation or job protection.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs text-rose-600 font-semibold">
                Average cost per applicant: $5,500+ in broker markups
              </div>
            </motion.div>

            {/* The Muntajar Direct Platform Way (Emerald/Amber outline) */}
            <motion.div
              {...fadeUp(0.2)}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 space-y-6 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                  Muntajar Direct Platform
                </div>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mb-4">
                  100% Direct, Verified & Transparent
                </h3>
                <ul className="space-y-3.5 text-sm text-stone-700">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>Zero Broker Commission:</strong> Direct portal submissions to partner universities & employers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>Verified Credentials:</strong> 150+ globally accredited university partners in UK, US, CA, AU.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>Real-Time Visa Audit:</strong> Transparent milestone dashboard from embassy prep to passport stamp.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                    <span><strong>Full Settlement Network:</strong> Airport pickup, student housing, and emergency scholar helpline.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs text-emerald-700 font-extrabold flex items-center justify-between">
                <span>Average savings per applicant: $3,500 – $7,000</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── 4. OUR FOUR COMMITMENTS / PILLARS ───────────────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Core Principles</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Four Pillars of the Muntajar Guarantee
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Built on legal rigor, radical transparency, and human empathy to give every Bangladeshi applicant the global start they deserve.
              </motion.p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  {...fadeUp(idx * 0.08)}
                  className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 flex flex-col justify-between space-y-6 hover:border-amber-300 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 font-bold">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100/60 border border-amber-200/80 text-[11px] font-bold text-amber-900">
                      {p.tag}
                    </span>
                    <h3 className="font-sans font-extrabold text-xl text-stone-950">{p.title}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed font-normal">{p.description}</p>
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

      {/* ─── 5. THREE SERVICE TRACKS ──────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Service Ecosystem</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Tailored Pathways for Every Global Aspirant
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Whether you are an ambitious student, a skilled professional, or a workforce applicant, Muntajar provides a dedicated direct pathway.
              </motion.p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {tracks.map((tr, idx) => (
              <motion.div
                key={tr.title}
                {...fadeUp(idx * 0.1)}
                className="p-8 rounded-3xl bg-white border border-stone-200 flex flex-col justify-between space-y-6 shadow-2xs hover:border-stone-300 transition-all duration-300"
              >
                <div className="space-y-4">
                  <span className={`inline-block px-3.5 py-1 rounded-full border text-xs font-bold ${tr.accent}`}>
                    {tr.badge}
                  </span>
                  <h3 className="font-sans font-extrabold text-xl text-stone-950 leading-snug">{tr.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-normal">{tr.description}</p>
                </div>
                <Link
                  href={tr.href}
                  className="inline-flex items-center text-sm font-bold text-stone-950 hover:text-amber-600 transition-colors pt-4 border-t border-stone-100"
                >
                  <span>Explore Pathway</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-amber-500" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. LEADERSHIP TEAM SHOWCASE ─────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Leadership & Counsel</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Guided by Industry Veterans & Legal Experts
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Our team combines decades of higher education admissions, immigration law, and mobility technology experience.
              </motion.p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <motion.div
                key={m.name}
                {...fadeUp(idx * 0.1)}
                className="p-6 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-5"
              >
                <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-stone-200">
                  <Image src={m.image} alt={m.name} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-stone-900 border border-stone-200">
                    {m.badge}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-extrabold text-xl text-stone-950">{m.name}</h3>
                  <p className="text-xs font-bold text-amber-700">{m.role}</p>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">{m.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. ROADMAP & MILESTONES TIMELINE ────────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Our Journey</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Building South Asia&apos;s Most Trusted Platform
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                From a single office in Dhaka to an international network serving thousands of scholars and global workers.
              </motion.p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((ms, idx) => (
              <motion.div
                key={ms.year}
                {...fadeUp(idx * 0.08)}
                className="p-6 rounded-3xl bg-white border border-stone-200 space-y-3 relative shadow-2xs"
              >
                <div className="text-3xl font-extrabold text-amber-600">{ms.year}</div>
                <h3 className="font-sans font-extrabold text-lg text-stone-950">{ms.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">{ms.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. COMPANY & LEGAL REGISTRATION ───────────────────────── */}
      <section className="py-20 bg-[#FAF9F7] border-t border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-10 space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-black uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Company &amp; Legal Registration
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-stone-950 tracking-tight">
              About Muntajar Global Ltd.
            </h2>
            <p className="text-stone-600 text-base max-w-2xl font-normal">
              Muntajar Global Ltd. is a legally registered company in Bangladesh, operating under the jurisdiction of Dhaka South City Corporation (DSCC).
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Company Name", value: "Muntajar Global Ltd." },
              { label: "Trade License No.", value: "TRAD/DSCC/003932/2025" },
              { label: "Issuing Authority", value: "Dhaka South City Corporation (DSCC)" },
              { label: "Registered Address", value: "332/A, Khilgaon, Tilpapara, Khilgaon, Dhaka-1219, Bangladesh" },
              { label: "Business Type", value: "Private Limited Company — Technology & EdTech" },
              { label: "Year Established", value: "2024" },
            ].map((item) => (
              <div key={item.label} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{item.label}</p>
                <p className="text-sm font-bold text-stone-900 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Management section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-2xs">
            <h3 className="font-sans font-extrabold text-xl text-stone-950 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Management &amp; Leadership
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: "Founder & CEO", title: "Muntajar Global Ltd.", desc: "Visionary behind Bangladesh's first broker-free global mobility platform." },
                { name: "Chief Technology Officer", title: "Platform & Engineering", desc: "Leads the tech infrastructure powering seamless global mobility services." },
                { name: "Chief Operations Officer", title: "Operations & Compliance", desc: "Oversees regulatory compliance, partner relations, and service delivery." },
              ].map((person) => (
                <div key={person.name} className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200">
                  <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center shrink-0 text-stone-500 font-black text-sm">
                    {person.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-stone-900">{person.name}</p>
                    <p className="text-[11px] text-orange-600 font-bold mb-1">{person.title}</p>
                    <p className="text-[11px] text-stone-500 leading-relaxed">{person.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. OFFICE & CONTACT CARD ────────────────────────────── */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F7] border border-stone-200 grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/70 border border-stone-300 text-stone-800 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Visit Our Headquarters</span>
              </div>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">
                Have Questions? Talk With Our Senior Mobility Counsellors.
              </h3>
              <p className="text-stone-600 text-sm sm:text-base font-normal">
                {contact.address}
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-stone-700">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <a href={`mailto:${contact.email}`} className="hover:underline font-semibold">{contact.email}</a>
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">{contact.phone}</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex md:justify-end">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-stone-950 text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md"
              >
                <span>Book In-Person Consultation</span>
                <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
