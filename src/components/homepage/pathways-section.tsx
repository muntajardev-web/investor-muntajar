"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { transition } from "@/lib/motion";

const REASONS = [
  "Strategies that align with your individual goals",
  "Platform provides real-time application insights",
  "Global mobility professionals are here to guide you",
  "We focus on sustainable long-term career growth",
];

const QUICK_MILESTONES = [
  {
    icon: GraduationCap,
    iconBg: "bg-amber-50 text-amber-600",
    title: "University Admission",
    desc: "150+ Partner Unis",
    status: "Completed",
    statusBg: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Award,
    iconBg: "bg-emerald-50 text-emerald-600",
    title: "Scholarship Grant",
    desc: "$12,500/yr Stipend",
    status: "Awarded",
    statusBg: "bg-amber-50 text-amber-700",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-sky-50 text-sky-600",
    title: "Embassy Visa Audit",
    desc: "Mock Interview",
    status: "Scheduled",
    statusBg: "bg-rose-50 text-rose-700",
  },
];

export function PathwaysSection() {
  return (
    <section id="why-choose-us" className="py-24 md:py-32 bg-[#FAF9F7] text-stone-900 border-t border-stone-200/60 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ── FINEDGE WHY CHOOSE US (LEFT TEXT + RIGHT PHOTO WITH QUICK MENU & PROGRESS FLOATING CARDS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Title, Paragraph, 4 Yellow Checkmarks & Dark Pill Button ── */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Soft Yellow Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={transition.slow}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
            >
              <span>Why Choose Us</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.08 }}
              className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.85rem] leading-[1.12] text-stone-950 tracking-tight"
            >
              Why Trust Us With Your Global Future.
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.14 }}
              className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal"
            >
              We believe that international success is not just about numbers; it&apos;s about empowerment, confidence, and achieving the life you envision.
            </motion.p>

            {/* 4 Yellow Checkmarks */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.2 }}
              className="space-y-3 pt-2"
            >
              {REASONS.map((reason) => (
                <div key={reason} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-[#FEF3C7] text-[#92400E]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 leading-snug">
                    {reason}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* More Details Button */}
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

          {/* ── RIGHT COLUMN: Photo & 2 Floating Overlay Cards (Quick Menu & Progress Card) ── */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            
            {/* Main Portrait Frame */}
            <div className="relative w-full max-w-[460px] h-[480px] sm:h-[520px] rounded-3xl overflow-hidden border border-stone-200">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
                alt="Muntajar Team and Applicants"
                fill
                className="object-cover object-center"
                unoptimized
              />
              <div className="absolute inset-0 bg-stone-950/10 pointer-events-none" />
            </div>

            {/* Floating Card 1 (Top Left of Photo) */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.2 }}
              className="absolute top-8 -left-4 sm:left-2 bg-white rounded-2xl p-4 border border-stone-200 max-w-[220px] sm:max-w-[240px] z-20 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-500">Execution is Excellent</span>
                <span className="text-[9px] font-extrabold bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded-full">
                  100% Legal
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div key={bar} className="h-3 flex-1 bg-emerald-400 rounded-xs" />
                ))}
              </div>
            </motion.div>

            {/* Floating Card 2 (Bottom Left Overlap - Quick Menu Widget) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.3 }}
              className="absolute bottom-6 -left-6 sm:-left-8 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 max-w-[280px] sm:max-w-[310px] z-30 space-y-3"
            >
              <p className="text-xs font-bold text-stone-400">Quick Menu</p>

              <div className="space-y-2.5">
                {QUICK_MILESTONES.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl bg-stone-50/80 border border-stone-100"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{item.title}</p>
                          <p className="text-[10px] text-stone-500 truncate">{item.desc}</p>
                        </div>
                      </div>

                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${item.statusBg}`}>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
