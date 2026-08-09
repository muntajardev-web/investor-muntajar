"use client";

import { ArrowRight, Check, Calendar, ShieldCheck, Clock, Award, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";
import { CalendlyWidget } from "@/components/ui/calendly-widget";

const promises = [
  "No brokers or hidden charges — 100% direct application portal",
  "Confidential 1-on-1 consultation with senior mobility advisors",
  "Direct university shortlisting & scholarship eligibility audit",
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { ...transition.slow, delay },
});

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F7] border-t border-stone-200 py-24 md:py-32" id="book-free-consultation">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
          <div className="lg:col-span-7 space-y-4">
            <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>Free 1-on-1 Consultation</span>
            </motion.div>
            <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
              Ready to take the next step? Let&apos;s talk.
            </motion.h2>
          </div>
          <div className="lg:col-span-5">
            <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              Book a free 30-minute 1-on-1 session with our senior counsellors. Pick a time that suits your schedule — no obligation, zero broker sales pressure.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Value Props & Trust Highlights (5 cols) */}
          <motion.div
            className="lg:col-span-5 space-y-6 pt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={transition.slow}
          >
            <div className="space-y-3.5">
              {promises.map((item) => (
                <div key={item} className="flex items-start gap-3 text-xs sm:text-sm font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Key Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 text-center space-y-1 shadow-2xs">
                <p className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">99.4%</p>
                <p className="text-[11px] text-stone-500 font-semibold">Visa Approval</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-stone-200 text-center space-y-1 shadow-2xs">
                <p className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">$4.2M+</p>
                <p className="text-[11px] text-stone-500 font-semibold">Fees Saved</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-stone-200 text-center space-y-1 shadow-2xs">
                <p className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">150+</p>
                <p className="text-[11px] text-stone-500 font-semibold">Partner Unis</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Full-Width Calendly Container (7 cols) */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...transition.slow, delay: 0.15 }}
          >
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="bg-[#FAF9F7] px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-stone-950">Select a Date & Time</p>
                    <p className="text-xs text-stone-500 font-medium">30-Minute Free Consultation Slot</p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
                  ● Senior Advisors Online
                </span>
              </div>

              {/* Calendly Embed */}
              <div className="p-2 sm:p-4 bg-white">
                <CalendlyWidget height={680} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
