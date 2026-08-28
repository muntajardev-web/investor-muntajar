"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Calculator, ShieldCheck, ArrowRight } from "lucide-react";
import { transition } from "@/lib/motion";

const COMPARISON_ROWS = [
  {
    feature: "Agency Broker Fees",
    traditional: "$3,500 – $9,000 hidden fees",
    muntajar: "0 Broker Fees (100% Transparent)",
    tradStatus: false,
    munStatus: true,
  },
  {
    feature: "Middlemen Sub-Agents",
    traditional: "Unlicensed 3rd-party brokers",
    muntajar: "Direct Portal Connection",
    tradStatus: false,
    munStatus: true,
  },
  {
    feature: "CAS & Offer Letter Speed",
    traditional: "3 – 6 Months with silent waiting",
    muntajar: "Direct Fast-Track Issuance",
    tradStatus: false,
    munStatus: true,
  },
  {
    feature: "Embassy Visa Coaching",
    traditional: "Zero prep (54.9% refusal rate)",
    muntajar: "1-on-1 Legal Mock Interview Coaching",
    tradStatus: false,
    munStatus: true,
  },
  {
    feature: "Workplace Contract Safety",
    traditional: "Unverified predatory contracts",
    muntajar: "100% ILO-Compliant Work Contracts",
    tradStatus: false,
    munStatus: true,
  },
  {
    feature: "Live Application Tracking",
    traditional: "WhatsApp forwards & ghosting",
    muntajar: "24/7 Live Applicant Dashboard",
    tradStatus: false,
    munStatus: true,
  },
];

const SAVINGS_DATA: Record<string, number> = {
  "study-UK": 4500,
  "study-DE": 3800,
  "study-CA": 5200,
  "study-AU": 4800,
  "study-US": 5500,
  "work-UK": 6500,
  "work-DE": 7200,
  "work-CA": 8500,
  "work-AU": 6800,
  "work-US": 9000,
};

export function ComparisonSection() {
  const [track, setTrack] = React.useState("study");
  const [country, setCountry] = React.useState("UK");

  const key = `${track}-${country}`;
  const savings = SAVINGS_DATA[key] || 4500;

  return (
    <section id="comparison" className="py-24 md:py-32 bg-[#FAF9F7] text-stone-900 border-t border-stone-200/60 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition.slow}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
          >
            <span>Direct Comparison</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-stone-950 tracking-tight leading-[1.1]">
            Muntajar vs. Traditional Agency Brokers
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
            See how our tech-enabled, broker-free platform eliminates predatory fees, hidden delays, and unverified contracts.
          </p>
        </div>

        {/* ── COMPARISON TABLE ── */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60">
                  <th className="p-5 sm:p-6 text-xs font-extrabold text-stone-400 uppercase tracking-wider w-1/3">
                    Feature / Milestone
                  </th>
                  <th className="p-5 sm:p-6 text-xs font-extrabold text-rose-600 uppercase tracking-wider w-1/3 border-l border-stone-200">
                    Traditional Agency Brokers
                  </th>
                  <th className="p-5 sm:p-6 text-xs font-extrabold text-emerald-700 uppercase tracking-wider w-1/3 bg-amber-500/10 border-l border-stone-200">
                    Muntajar Direct Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80 text-xs sm:text-sm font-semibold">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-stone-50/40 transition-colors">
                    <td className="p-5 sm:p-6 font-bold text-stone-900">
                      {row.feature}
                    </td>
                    <td className="p-5 sm:p-6 text-stone-600 border-l border-stone-200">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="p-5 sm:p-6 text-stone-950 font-bold bg-amber-500/[0.03] border-l border-stone-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-emerald-950">{row.muntajar}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── INTERACTIVE SAVINGS CALCULATOR ── */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-amber-600 text-xs font-extrabold uppercase tracking-wider">
                  <Calculator className="w-4 h-4" />
                  <span>Savings Calculator</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
                  Calculate Your Savings vs. Agency Fees
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  Select your journey track and target destination to see how much money you save by skipping sub-agent brokers.
                </p>
              </div>

              {/* Controls Grid */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-stone-400 uppercase tracking-wider mb-2">
                    1. Select Journey Track
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "study", label: "Study Abroad & Scholarships" },
                      { id: "work", label: "Overseas Jobs & Workforce" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTrack(t.id)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          track === t.id
                            ? "bg-stone-950 text-white border-stone-950"
                            : "bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-stone-400 uppercase tracking-wider mb-2">
                    2. Select Target Destination
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { code: "UK", name: "United Kingdom" },
                      { code: "DE", name: "Germany" },
                      { code: "CA", name: "Canada" },
                      { code: "AU", name: "Australia" },
                      { code: "US", name: "United States" },
                    ].map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setCountry(c.code)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          country === c.code
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Result Display Box (5 cols) */}
            <div className="lg:col-span-5 bg-stone-950 text-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                  ESTIMATED BROKER FEE SAVINGS
                </span>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  ${savings.toLocaleString()} USD
                </p>
                <p className="text-xs text-stone-400 pt-1 font-medium">
                  Direct savings in your pocket vs. traditional agency sub-agents.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800 space-y-2 text-xs text-stone-300 font-medium">
                <div className="flex items-center justify-between">
                  <span>Traditional Broker Charge:</span>
                  <span className="text-rose-400 font-bold">${(savings + 500).toLocaleString()} USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Muntajar Broker Fee:</span>
                  <span className="text-emerald-400 font-bold">$0 USD</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer"
              >
                <span>Check Your Eligibility Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
