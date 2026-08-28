"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Compass,
  FileCheck2,
  Award,
  ShieldCheck,
  Plane,
} from "lucide-react";
import { transition } from "@/lib/motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { ...transition.slow, delay },
});

const STEPS = [
  {
    num: "01",
    icon: Compass,
    title: "Profile & Target Evaluation",
    tagline: "Evaluation & Strategy",
    description:
      "Complete academic, financial, and career audit to identify your exact eligible universities, 100% tuition scholarships, or accredited overseas job tracks.",
    points: ["Academic & GPA Audit", "Scholarship Eligibility Check", "Country & Budget Mapping"],
  },
  {
    num: "02",
    icon: FileCheck2,
    title: "Application & Document Prep",
    tagline: "SOP & Submissions",
    description:
      "Data-backed program shortlisting, tailored Statement of Purpose (SOP) drafting, recommendation letter formatting, and direct portal submissions.",
    points: ["Professional SOP Drafting", "150+ Uni Direct Submissions", "Document Verification"],
  },
  {
    num: "03",
    icon: Award,
    title: "Offer Letter & CAS Clearance",
    tagline: "Offers & Grants",
    description:
      "Receive official unconditional university offer letters, CAS issuance, DAAD/Chevening scholarship award letters, or 100% ILO-compliant work contracts.",
    points: ["Unconditional CAS Letters", "Tuition Waiver Confirmation", "Zero Broker Work Contracts"],
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Embassy Visa Audit & Mocks",
    tagline: "Visa Approval",
    description:
      "Comprehensive legal document audit, financial bank statement verification, and 1-on-1 embassy mock interview coaching with legal advisors.",
    points: ["Financial Document Audit", "Embassy Mock Interviews", "99.4% Visa Success Rate"],
  },
  {
    num: "05",
    icon: Plane,
    title: "Pre-Departure & Arrival Support",
    tagline: "Flight & Housing",
    description:
      "Pre-departure orientation briefings, flight booking assistance, airport pickup coordination, housing key collection, and local registration.",
    points: ["Pre-Departure Briefings", "Airport Pickup Coordination", "Student/Worker Housing Setup"],
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#FAF9F7] text-stone-950 border-t border-stone-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Step-By-Step Process
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 tracking-tight leading-[1.1]">
            A Transparent, 5-Step Journey To Your Global Future.
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
            No hidden agency broker fees, no silent waiting periods. Track every milestone live from application preparation to university arrival.
          </p>
        </motion.div>

        {/* 5-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                {...fadeUp(i * 0.08)}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200 flex flex-col justify-between space-y-6 hover:border-stone-300 transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Header with Icon and Step Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-stone-200 flex items-center justify-center text-amber-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-600">
                        STEP {step.num}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                        {step.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-stone-950 group-hover:text-amber-700 transition-colors leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-stone-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Bullet Highlights */}
                <div className="pt-4 border-t border-stone-100 space-y-2.5">
                  {step.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2.5 text-xs font-semibold text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* 6th Highlight Box in FINEDGE style */}
          <motion.div
            {...fadeUp(0.4)}
            className="bg-[#FAF9F7] rounded-3xl p-7 sm:p-8 border border-stone-200 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Guaranteed Journey
              </div>

              <h3 className="text-2xl font-bold text-stone-950 leading-snug">
                100% Direct Admission & Visa Tracking
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed">
                Every step of your global journey is logged on your personal student dashboard — complete with official university timestamps, legal fee breakdowns, and embassy status alerts.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-200/80 space-y-2 text-xs font-semibold text-stone-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Middleman Broker Markups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24/7 Scholar & Worker Support</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Bottom CTA Banner */}
        <motion.div
          {...fadeUp(0.48)}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Ready To Begin Your Pathway?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-950">
              Take the first step toward your global future today.
            </h3>
            <p className="text-stone-600 text-sm max-w-xl">
              Book a free 1-on-1 profile evaluation with a senior Muntajar education and migration advisor.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors shadow-none"
            >
              Start Free Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <a
              href="tel:+8801886728855"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white text-stone-950 font-medium text-sm border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <PhoneCall className="w-4 h-4 mr-2 text-amber-600" />
              <span>Call +880 1886-728855</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
