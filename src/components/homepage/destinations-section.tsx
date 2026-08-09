"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe2, Sparkles, GraduationCap, Briefcase, FileText } from "lucide-react";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { ...transition.slow, delay },
});

function flagUrl(code: string) {
  return `https://flagcdn.com/w160/${code}.png`;
}

interface Destination {
  id: string;
  flagCode: string;
  name: string;
  region: string;
  headline: string;
  description: string;
  image: string;
  stats: { label: string; value: string };
  pathways: ("Study" | "Work" | "Visa")[];
}

const DESTINATIONS: Destination[] = [
  {
    id: "germany",
    flagCode: "de",
    name: "Germany",
    region: "Europe",
    headline: "Tuition-Free Public Universities",
    description: "Study at top-ranked universities with €0 tuition fee, plus access the new Opportunity Card job route.",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80",
    stats: { label: "Tuition Fee", value: "€0 / Year" },
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "uk",
    flagCode: "gb",
    name: "United Kingdom",
    region: "Europe",
    headline: "2-Year Graduate Post-Study Visa",
    description: "Direct university applications with up to £10,000 Chevening & institution scholarships.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
    stats: { label: "Graduate Visa", value: "2 Years Full Work" },
    pathways: ["Study", "Visa"],
  },
  {
    id: "japan",
    flagCode: "jp",
    name: "Japan",
    region: "East Asia",
    headline: "Specified Skilled Worker Program",
    description: "Accelerated job placements across 12 sectors with language training & visa sponsorship.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    stats: { label: "Sectors Open", value: "12 Skilled Fields" },
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "canada",
    flagCode: "ca",
    name: "Canada",
    region: "North America",
    headline: "PGWP & Express Entry Route",
    description: "Post-Graduation Work Permits up to 3 years with direct Express Entry points for graduates.",
    image: "https://images.unsplash.com/photo-1517935703635-27c7078861d6?auto=format&fit=crop&w=600&q=80",
    stats: { label: "Work Permit", value: "Up to 3 Years" },
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "malaysia",
    flagCode: "my",
    name: "Malaysia",
    region: "Southeast Asia",
    headline: "Affordable Global Degrees",
    description: "UK & Australian dual-degree branch campuses at 60% lower tuition and living costs.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
    stats: { label: "Cost Savings", value: "60% Vs West" },
    pathways: ["Study", "Work"],
  },
  {
    id: "australia",
    flagCode: "au",
    name: "Australia",
    region: "Oceania",
    headline: "Subclass 485 Graduate Visa",
    description: "High-earning graduate careers, regional migration points, and world-class universities.",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80",
    stats: { label: "Post-Study Work", value: "2 - 4 Years" },
    pathways: ["Study", "Work", "Visa"],
  },
];

const FILTERS = [
  { id: "all", label: "All Destinations" },
  { id: "Study", label: "Study Abroad" },
  { id: "Work", label: "Skilled Work" },
  { id: "Visa", label: "PR & Visa Pathways" },
];

export function DestinationsSection() {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");

  const filteredDestinations = React.useMemo(() => {
    if (activeFilter === "all") return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.pathways.includes(activeFilter as any));
  }, [activeFilter]);

  return (
    <section id="destinations" className="py-20 md:py-28 bg-white text-stone-950 border-t border-stone-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <motion.div {...fadeUp(0)} className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-amber-600" />
              Global Reach & Destinations
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 tracking-tight leading-[1.1]">
              Where Muntajar Can Take You.
            </h2>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
              Explore top study, career, and migration destinations — each backed by verified university admissions, 0% middleman fees, and direct visa compliance.
            </p>
          </motion.div>

          {/* Top Right CTA */}
          <motion.div {...fadeUp(0.1)} className="shrink-0">
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#FAF9F7] text-stone-950 font-medium text-sm border border-stone-200 hover:bg-stone-100 transition-colors"
            >
              <span>View All 45+ Destinations</span>
              <ArrowRight className="w-4 h-4 ml-2 text-stone-700" />
            </Link>
          </motion.div>
        </div>

        {/* Filter Pills */}
        <motion.div {...fadeUp(0.12)} className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border",
                  isActive
                    ? "bg-stone-950 text-white border-stone-950"
                    : "bg-[#FAF9F7] text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              {...fadeUp(idx * 0.08)}
              className="bg-[#FAF9F7] rounded-3xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-stone-300 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative w-full h-[200px] overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                  {/* Flag & Name Badge Overlay */}
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

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-stone-950 leading-snug group-hover:text-amber-700 transition-colors">
                    {dest.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {dest.description}
                  </p>

                  {/* Stats Tag */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-200/80">
                    <span className="text-stone-500 font-medium">{dest.stats.label}:</span>
                    <span className="font-bold text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {dest.stats.value}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Pathways Row */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-stone-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Verified Pathways
                </span>
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
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
