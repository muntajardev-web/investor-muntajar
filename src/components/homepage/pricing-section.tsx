"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, HelpCircle } from "lucide-react";
import { transition } from "@/lib/motion";
import { pricingPlans } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { ...transition.slow, delay },
});

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#FAF9F7] text-stone-950 border-t border-stone-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
          <div className="lg:col-span-7 space-y-4">
            <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Transparent Pricing & Plans</span>
            </motion.div>
            <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
              Flexible Memberships Built Around Outcomes.
            </motion.h2>
          </div>
          <div className="lg:col-span-5">
            <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              Pick a track, unlock dedicated mentors, and combine training, direct university matching, and legal support under one transparent stack.
            </motion.p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {pricingPlans.map((plan, i) => {
            const isPopular = plan.highlighted;
            return (
              <motion.div
                key={plan.id}
                {...fadeUp(i * 0.1)}
                className={cn(
                  "relative rounded-3xl p-8 border flex flex-col justify-between space-y-6 transition-all duration-300 bg-white",
                  isPopular
                    ? "border-amber-400 shadow-xs ring-1 ring-amber-400/50"
                    : "border-stone-200 hover:border-stone-300",
                )}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <span className="absolute top-6 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  {/* Segment Badge */}
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-bold border",
                    plan.segment.includes("T1") && "bg-amber-50 text-amber-800 border-amber-200",
                    plan.segment.includes("T2") && "bg-emerald-50 text-emerald-800 border-emerald-200",
                    plan.segment.includes("T3") && "bg-sky-50 text-sky-800 border-sky-200",
                  )}>
                    {plan.segment}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-stone-950">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-stone-950 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-stone-500">
                      / {plan.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal pt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="pt-6 border-t border-stone-100 space-y-4 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link
                    href="/contact"
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-none cursor-pointer",
                      isPopular
                        ? "bg-stone-950 text-white hover:bg-stone-800"
                        : "bg-[#FAF9F7] text-stone-950 border border-stone-200 hover:bg-stone-100",
                    )}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Money-Back Guarantee Note */}
        <motion.div
          {...fadeUp(0.35)}
          className="max-w-2xl mx-auto text-center p-6 rounded-2xl bg-white border border-stone-200 flex items-center justify-center gap-3 text-xs sm:text-sm text-stone-700 shadow-2xs"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>100% Fee Transparency:</strong> All university application fees and embassy charges are billed at official government rates with zero broker markups.
          </span>
        </motion.div>

      </div>
    </section>
  );
}
