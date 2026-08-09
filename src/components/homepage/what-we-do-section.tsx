"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Briefcase, Globe } from "lucide-react";
import { transition } from "@/lib/motion";

const FEATURES = [
  {
    id: "study",
    icon: GraduationCap,
    iconBg: "bg-[#DCFCE7] text-[#15803D]", // Pastel green circle
    title: "Study Abroad & Admissions",
    description:
      "Data-backed university shortlisting, SOP drafting, and direct CAS issuance across 150+ partner institutions in the UK, EU, Canada & Australia.",
    link: "/services/study-abroad",
    isProminent: false,
  },
  {
    id: "employment",
    icon: Briefcase,
    iconBg: "bg-stone-950 text-white", // Dark prominent center circle
    title: "Overseas Work & Job Placements",
    description:
      "Direct employer matching, ILO-compliant work contracts, salary negotiation, and verified job placements for skilled workforce & professionals in Europe, Gulf & North America.",
    link: "/work/employment",
    isProminent: true, // Center elevated card
  },
  {
    id: "visa",
    icon: Globe,
    iconBg: "bg-[#FFE4E6] text-[#BE123C]", // Pastel pink circle
    title: "Visa, PR & Migration Routes",
    description:
      "Express Entry Canada, Germany Opportunity Card, and UK Skilled Worker processing with complete legal document audit and embassy mock interviews.",
    link: "/services/visa-migration",
    isProminent: false,
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF9F7] text-stone-900 border-t border-stone-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ── FINEDGE SECTION HEADER (Yellow Pill + Left Title + Right Paragraph) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
          <div className="lg:col-span-7 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={transition.slow}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
            >
              <span>Our Features</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.08 }}
              className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight"
            >
              Global Mobility Built for Students & Job Seekers.
            </motion.h2>
          </div>

          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.14 }}
              className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal"
            >
              Our platform streamlines everything from university admissions and full scholarships to legal work placements, verified overseas jobs, and visa clearance.
            </motion.p>
          </div>
        </div>

        {/* ── FINEDGE 3 FEATURE CARDS (CENTER CARD PROMINENT WHITE WITH SHADOW) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {FEATURES.map((feat, i) => {
            const IconComponent = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...transition.slow, delay: i * 0.1 }}
                className={feat.isProminent ? "z-10 -my-2" : ""}
              >
                <div
                  className={`rounded-3xl p-8 sm:p-9 transition-all duration-300 flex flex-col justify-between h-full space-y-6 bg-white border border-stone-200`}
                >
                  <div className="space-y-6">
                    {/* Circle Icon */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${feat.iconBg}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-stone-950 leading-snug">
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </div>

                  {/* Link Button */}
                  <div className="pt-2">
                    <Link
                      href={feat.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-950 hover:text-amber-600 transition-colors group"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
