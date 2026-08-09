"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Award, TrendingUp, Plus } from "lucide-react";
import { transition } from "@/lib/motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const CHECKMARKS = [
  "Comprehensive Global Admissions & Visa Solutions",
  "Data-backed technology to offer real-time tracking",
  "The highest level of legal expertise and support",
  "Building strong, lifelong relationships with our applicants",
];

export function WhySection() {
  return (
    <section id="about-us" className="py-24 md:py-32 bg-[#FAF9F7] text-stone-900 border-t border-stone-200/60 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ── FINEDGE ABOUT US (LEFT PHOTO WITH 2 CARDS + RIGHT CONTENT WITH CHECKMARKS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Photo Frame & 2 Floating Overlay Cards ── */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            
            {/* Main Portrait Frame */}
            <div className="relative w-full max-w-[460px] h-[480px] sm:h-[520px] rounded-3xl overflow-hidden border border-stone-200">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                alt="Muntajar Advisors and Applicants"
                fill
                className="object-cover object-center"
                unoptimized
              />
              <div className="absolute inset-0 bg-stone-950/10 pointer-events-none" />
            </div>

            {/* Floating Overlay Card 1 (Top Left) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.2 }}
              className="absolute top-8 -left-2 sm:left-2 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 max-w-[220px] sm:max-w-[240px] z-20 space-y-2"
            >
              <div className="w-9 h-9 rounded-full bg-[#FFE4E6] text-[#BE123C] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold text-stone-400">Total Scholarship</p>
                <p className="text-lg font-extrabold text-stone-950">
                  <AnimatedCounter prefix="$" to={18652} decimals={2} />
                </p>
                <p className="text-[10px] text-stone-500 font-medium">9 of 10 goals complete</p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[10px] font-extrabold text-amber-600 cursor-pointer">
                <Plus className="w-3 h-3" />
                <span>Add scholarship goal</span>
              </div>
            </motion.div>

            {/* Floating Overlay Card 2 (Bottom Right - Income/Stipend Graph Widget) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.3 }}
              className="absolute bottom-8 -right-2 sm:right-2 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 max-w-[250px] sm:max-w-[270px] z-20 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-extrabold bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded-full">
                  Stipend
                </span>
                <span className="text-[9px] font-extrabold bg-[#FFE4E6] text-[#BE123C] px-2 py-0.5 rounded-full">
                  Grant
                </span>
                <span className="text-[10px] text-stone-400 font-bold">•••</span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Average Monthly Stipend</p>
                <p className="text-xl font-extrabold text-stone-950">
                  <AnimatedCounter prefix="$" to={12500} decimals={2} />
                </p>
              </div>

              {/* Simulated Bar Graph */}
              <div className="flex items-end justify-between gap-1.5 h-12 pt-2 border-t border-stone-100">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, idx) => (
                  <div key={m} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-full rounded-t-xs transition-all ${
                        idx === 3 ? "bg-[#5EEAD4] h-10" : idx === 2 ? "bg-[#FDE047] h-7" : "bg-stone-200 h-4"
                      }`}
                    />
                    <span className="text-[8px] font-bold text-stone-400">{m}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN: Title, Paragraph, Checkmarks & Button ── */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Yellow Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={transition.slow}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
            >
              <span>About Us</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.08 }}
              className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.85rem] leading-[1.12] text-stone-950 tracking-tight"
            >
              Our goal elevating your Global Potential.
            </motion.h2>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.14 }}
              className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal"
            >
              We believe that international success is not just about numbers or paperwork; it&apos;s about empowerment, confidence, and achieving the life you envision.
            </motion.p>

            {/* 4 Yellow Checkmarks */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.2 }}
              className="space-y-3 pt-2"
            >
              {CHECKMARKS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-[#FEF3C7] text-[#92400E]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* More Details Dark Pill Button */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.26 }}
              className="pt-4"
            >
              <Link
                href="/about"
                className="inline-flex items-center justify-center bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-2xl transition-all shadow-md cursor-pointer"
              >
                More Details
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
