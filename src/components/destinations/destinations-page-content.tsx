"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Calendar,
  Building2,
  Search,
  Award,
  TrendingUp,
} from "lucide-react";
import { transition } from "@/lib/motion";
import { destinationDetails } from "@/lib/pages-data";
import { destinationPhotos, images } from "@/lib/images";
import type { PathwayTag } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";
import { CalendlyWidget } from "@/components/ui/calendly-widget";
import { Logos3 } from "@/components/ui/logos3";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { ...transition.slow, delay },
});

function flagUrl(code: string) {
  return `https://flagcdn.com/w160/${code.toLowerCase()}.png`;
}

const FILTERS = [
  { id: "All", label: "All Destinations" },
  { id: "Study", label: "Study Abroad" },
  { id: "Work", label: "Skilled Work" },
  { id: "Visa", label: "PR & Visa Pathways" },
];

const PARTNER_LOGOS = [
  { id: "1", description: "UK Universities" },
  { id: "2", description: "DAAD Germany" },
  { id: "3", description: "Canada Immigration" },
  { id: "4", description: "Chevening" },
  { id: "5", description: "Erasmus+" },
  { id: "6", description: "British Council" },
  { id: "7", description: "IELTS Official" },
  { id: "8", description: "Cambridge" },
  { id: "9", description: "IDP Education" },
  { id: "10", description: "Study in Europe" },
];

export function DestinationsPageContent() {
  const [filter, setFilter] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredDestinations = React.useMemo(() => {
    return destinationDetails.filter((d) => {
      const matchesFilter = filter === "All" ? true : d.pathways.includes(filter as PathwayTag);
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="bg-[#FAF9F7] text-stone-950 min-h-screen selection:bg-amber-100 selection:text-amber-900">
      
      {/* ─── 1. HOMEPAGE-STYLE HERO SECTION ───────────────────────────── */}
      <section className="relative bg-[#FAF9F7] text-stone-900 pt-28 sm:pt-32 lg:pt-36 pb-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          
          {/* Top Hero Row (Left Headline & CTAs + Right Portrait Frame with Overlays) */}
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
                <span>Global Reach & Destinations</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.08 }}
                className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.14] text-stone-950 tracking-tight"
              >
                Explore Where{" "}
                <span className="text-[#B45309] underline decoration-[#FDE68A] decoration-wavy decoration-2">
                  Muntajar
                </span>{" "}
                Can Take You.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.15 }}
                className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
              >
                From top tuition-free European universities to ethical workforce corridors, browse verified study, work, and visa pathways across 45+ countries.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.22 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  href="/check-eligibility"
                  className="inline-flex items-center justify-center bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Check Your Country Eligibility</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <a
                  href="#destinations-grid"
                  className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 font-bold text-sm px-7 py-4 rounded-2xl transition-all cursor-pointer shadow-2xs"
                >
                  <span>Browse 45+ Destinations</span>
                </a>
              </motion.div>

              {/* Applicants Guided & Verified Badges Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition.slow, delay: 0.28 }}
                className="pt-4 flex flex-wrap items-center gap-6 border-t border-stone-200/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Applicant"
                      width={36}
                      height={36}
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                      unoptimized
                    />
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Applicant"
                      width={36}
                      height={36}
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                      unoptimized
                    />
                    <Image
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                      alt="Applicant"
                      width={36}
                      height={36}
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                      unoptimized
                    />
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-stone-950 font-black text-xs ring-2 ring-white">
                      +
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-stone-950 leading-none">
                      <AnimatedCounter to={12000} suffix="+" />
                    </p>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Active applicants guided</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Direct Admissions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    0% Middleman Fees
                  </span>
                </div>
              </motion.div>

            </div>

            {/* Right Visual Frame & Floating Overlays */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Main Portrait Frame */}
              <div className="relative w-full max-w-[480px] h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border border-stone-200">
                <Image
                  src={images.hero.destinations}
                  alt="Muntajar Global Destinations"
                  fill
                  priority
                  className="object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating Overlay Card 1 (Top Left) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transition.slow, delay: 0.35 }}
                className="absolute top-10 -left-4 sm:left-4 bg-white rounded-2xl p-4 border border-stone-200 flex items-center gap-3.5 max-w-[240px] z-20 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-950">
                    <AnimatedCounter to={45} suffix="+ Countries" />
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">Global Network</p>
                  <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                    Study & Work Corridors
                  </span>
                </div>
              </motion.div>

              {/* Floating Overlay Card 2 (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transition.slow, delay: 0.42 }}
                className="absolute bottom-10 -right-4 sm:right-4 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-2 max-w-[260px] z-20 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Visa Success Rate</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> <AnimatedCounter to={99.4} decimals={1} suffix="%" />
                  </span>
                </div>

                <p className="text-xl font-extrabold text-stone-950">
                  <AnimatedCounter prefix="$" to={5640} suffix=" USD / Mo" />
                </p>
                <p className="text-[11px] text-stone-500 font-medium">Average post-grad salary abroad</p>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Strict Legal & Pre-Embassy Audit</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Social Proof Auto-scrolling Ribbon */}
          <div className="mt-20 pt-10 border-t border-stone-200/80">
            <Logos3
              heading="More than 10,000+ applicants trust Muntajar's global network"
              logos={PARTNER_LOGOS}
            />
          </div>

        </div>
      </section>

      {/* ─── 2. IMPACT METRICS BAR ───────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white border-y border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            <div className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={45} suffix="+" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Global Destination Countries</p>
              <p className="text-xs text-stone-500 font-medium">Europe, Asia, Americas & Oceania</p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={150} suffix="+" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Direct Partner Universities</p>
              <p className="text-xs text-stone-500 font-medium">Direct Admission & Scholarship Portals</p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={100} suffix="%" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">ILO-Compliant Job Placements</p>
              <p className="text-xs text-stone-500 font-medium">Legal Contracts & Wage Protection</p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <AnimatedCounter to={99.4} decimals={1} suffix="%" />
              </p>
              <p className="text-sm font-extrabold text-stone-900">Visa Success Rate</p>
              <p className="text-xs text-stone-500 font-medium">Pre-Embassy Document Audit</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. SEARCH & DESTINATIONS GRID ───────────────────────── */}
      <section id="destinations-grid" className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Header Block & Search Input */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12">
            
            <div className="lg:col-span-7 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={transition.slow}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
              >
                <span>Country Directory</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...transition.slow, delay: 0.08 }}
                className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight"
              >
                Browse Destination Pathways
              </motion.h2>
            </div>

            {/* Search Bar Input */}
            <div className="lg:col-span-5 flex justify-start lg:justify-end">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or region..."
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs font-medium text-stone-950 focus:outline-none focus:border-stone-950 transition-colors shadow-2xs"
                />
              </div>
            </div>

          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap",
                  filter === f.id
                    ? "bg-stone-950 text-white border-stone-950 shadow-xs"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                {...fadeUp(idx * 0.08)}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-stone-300 hover:-translate-y-1 transition-all duration-300 group shadow-xs"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative w-full h-[220px] overflow-hidden">
                    <Image
                      src={destinationPhotos[dest.id] ?? images.hero.destinations}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                    {/* Flag & Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 shadow-xs">
                        <div className="relative w-5 h-3.5 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                          <Image
                            src={flagUrl(dest.flagCode)}
                            alt={`${dest.name} flag`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-stone-950">{dest.name}</span>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-stone-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {dest.region}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-7 space-y-3">
                    <h3 className="text-xl font-extrabold text-stone-950 group-hover:text-amber-700 transition-colors leading-snug">
                      {dest.shortDescription}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                      {dest.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Card Footer Pathways */}
                <div className="px-7 pb-6 pt-2 flex items-center justify-between border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    {dest.pathways.map((p) => (
                      <span
                        key={p}
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                          p === "Study" && "bg-amber-50 text-amber-800 border-amber-200",
                          p === "Work" && "bg-emerald-50 text-emerald-800 border-emerald-200",
                          p === "Visa" && "bg-sky-50 text-sky-800 border-sky-200",
                        )}
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/check-eligibility"
                    className="inline-flex items-center text-xs font-bold text-stone-950 hover:text-amber-700 transition-colors group/link"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 4. CONSULTATION CALENDLY SECTION ───────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-t border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#FAF9F7] border border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Book Country Consultation</span>
              </div>
              
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-stone-950 leading-tight">
                Need Help Shortlisting Your Target Destination?
              </h3>
              
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Book a free 30-minute 1-on-1 session with our senior advisors. We evaluate your CGPA, budget, language score, and career goals to map your exact destination.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Country & Budget Mapping</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct University & Job Portal Match</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-3 sm:p-5 shadow-2xs">
              <CalendlyWidget height={640} />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

