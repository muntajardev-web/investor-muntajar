"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Calculator,
  Lock,
  Check,
  XCircle,
  Calendar,
  PhoneCall,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";
import { pricingPlans } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendlyWidget } from "@/components/ui/calendly-widget";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { ...transition.slow, delay },
});

const PRICING_FAQS = [
  {
    question: "Are there any hidden broker commissions or extra agent fees?",
    answer: "No. All Muntajar plans are 100% transparent. Official university application fees, WES evaluations, and embassy visa charges are billed directly at official government rates with zero middleman markups.",
  },
  {
    question: "What is the difference between Student, Professional, and Workforce tracks?",
    answer: "The Student track focuses on 150+ direct university applications, SOP writing, and DAAD/Chevening scholarship finding. The Professional track covers tech/executive career sprint, resume makeover, and visa sponsorship. The Workforce track manages ILO-compliant skilled job placements, medical clearance, and trade contracts.",
  },
  {
    question: "Can I upgrade or switch my membership plan later?",
    answer: "Yes, you can upgrade or switch your plan at any time through your student dashboard or by speaking with your assigned mobility counselor.",
  },
  {
    question: "What happens if my visa application gets delayed or rejected?",
    answer: "Our 99.4% visa approval rate is built on strict pre-submission legal audits. If an embassy requires additional financial or sponsor documents, your dedicated counselor prepares free re-audit filings.",
  },
];

const MATRIX_FEATURES = [
  { feature: "Direct Portal Submissions (0% Agent Markup)", muntajar: true, traditional: false },
  { feature: "Native Academic SOP & CV Editing Desk", muntajar: true, traditional: false },
  { feature: "1-on-1 Simulated Embassy Mock Interviews", muntajar: true, traditional: false },
  { feature: "Bilingual ILO Standard Employment Contracts", muntajar: true, traditional: false },
  { feature: "Real-Time Student Milestone Dashboard", muntajar: true, traditional: false },
  { feature: "Guaranteed Post-Arrival Relocation & Housing", muntajar: true, traditional: false },
];

export function PricingPageContent() {
  const [selectedTrack, setSelectedTrack] = React.useState<string>("all");

  const filteredPlans = React.useMemo(() => {
    if (selectedTrack === "all") return pricingPlans;
    return pricingPlans.filter((p) => p.segment.toLowerCase().includes(selectedTrack));
  }, [selectedTrack]);

  return (
    <div className="bg-[#FAF9F7] text-stone-950 min-h-screen pt-12 pb-24 selection:bg-amber-100 selection:text-amber-900">
      
      {/* ─── 1. FINEDGE HERO SECTION ───────────────────────────── */}
      <section className="relative pt-16 pb-24 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div {...fadeUp(0)} className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Transparent No-Broker Pricing
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-stone-950 leading-[1.1]">
              Simple Plans Built Around <span className="underline decoration-amber-400 decoration-wavy underline-offset-8">Real Outcomes</span>.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
              No hidden agency commissions, no silent waiting periods. Billed at 0% broker markup with transparent legal receipts and guaranteed advisor access.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#pricing-cards"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-stone-950 text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md"
              >
                <span>View Membership Plans</span>
                <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
              </a>

              <a
                href="#comparison-matrix"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-stone-950 font-bold text-sm border border-stone-200 hover:bg-stone-100 transition-all shadow-2xs"
              >
                Compare With Traditional Brokers
              </a>
            </div>

            {/* Verified Badges */}
            <div className="pt-6 flex items-center justify-center gap-6 text-xs font-medium text-stone-500 border-t border-stone-200/80 max-w-xl mx-auto">
              <span className="flex items-center gap-1.5 text-stone-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                0% Middleman Markup
              </span>
              <span className="flex items-center gap-1.5 text-stone-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Official Govt Fees Only
              </span>
              <span className="flex items-center gap-1.5 text-stone-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Transparent Receipts
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. PRICING CARDS GRID ───────────────────────────────── */}
      <section id="pricing-cards" className="py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Track Filters (rounded-2xl) */}
          <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-4 mb-12 no-scrollbar">
            {[
              { id: "all", label: "All Membership Tracks" },
              { id: "t1", label: "T1 — Skilled Professionals" },
              { id: "t2", label: "T2 — Students & Scholars" },
              { id: "t3", label: "T3 — Workforce Mobility" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedTrack(f.id)}
                className={cn(
                  "px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border whitespace-nowrap",
                  selectedTrack === f.id
                    ? "bg-stone-950 text-white border-stone-950 shadow-md"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100 shadow-2xs",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
            {filteredPlans.map((plan, i) => {
              const isPopular = plan.highlighted;
              return (
                <motion.div
                  key={plan.id}
                  {...fadeUp(i * 0.1)}
                  className={cn(
                    "relative rounded-3xl p-8 border flex flex-col justify-between space-y-6 transition-all duration-300 bg-white",
                    isPopular
                      ? "border-amber-400 ring-1 ring-amber-400/50 shadow-md"
                      : "border-stone-200 hover:border-stone-300 shadow-2xs",
                  )}
                >
                  {isPopular && (
                    <span className="absolute top-6 right-6 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-4">
                    <span className={cn(
                      "inline-block px-3.5 py-1 rounded-full text-xs font-bold border",
                      plan.segment.includes("T1") && "bg-amber-50 text-amber-800 border-amber-200",
                      plan.segment.includes("T2") && "bg-emerald-50 text-emerald-800 border-emerald-200",
                      plan.segment.includes("T3") && "bg-sky-50 text-sky-800 border-sky-200",
                    )}>
                      {plan.segment}
                    </span>

                    <h3 className="font-sans font-extrabold text-2xl text-stone-950">{plan.name}</h3>

                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="font-sans font-extrabold text-4xl sm:text-5xl text-stone-950 tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-sm font-medium text-stone-500">
                        / {plan.period}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                      {plan.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-100 space-y-4 flex-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      Deliverables Included:
                    </span>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/contact"
                      className={cn(
                        "w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md",
                        isPopular
                          ? "bg-stone-950 text-white hover:bg-stone-800"
                          : "bg-[#FAF9F7] text-stone-950 border border-stone-200 hover:bg-stone-100",
                      )}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Guarantee Callout */}
          <motion.div
            {...fadeUp(0.35)}
            className="max-w-3xl mx-auto text-center p-6 rounded-3xl bg-white border border-stone-200 flex items-center justify-center gap-3 text-xs sm:text-sm text-stone-700 shadow-2xs"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong className="font-bold text-stone-950">100% Fee Transparency Guarantee:</strong> Official university application fees and embassy charges are billed at government cost with zero agent commissions.
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── 3. COMPARISON MATRIX (MUNTAJAR VS BROKERS) ─────────── */}
      <section id="comparison-matrix" className="py-24 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Feature Matrix</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Muntajar Direct Platform vs Traditional Brokers
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Compare deliverables line-by-line to see why thousands of Bangladeshi scholars and professionals switch to Muntajar.
              </motion.p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-[#FAF9F7] rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="grid grid-cols-12 bg-stone-100/90 p-5 font-bold text-xs sm:text-sm text-stone-900 border-b border-stone-200">
              <div className="col-span-6 sm:col-span-7">Platform Deliverable</div>
              <div className="col-span-3 sm:col-span-3 text-center text-emerald-800">Muntajar Direct</div>
              <div className="col-span-3 sm:col-span-2 text-center text-rose-700">Traditional Agency</div>
            </div>

            <div className="divide-y divide-stone-200/80">
              {MATRIX_FEATURES.map((item) => (
                <div key={item.feature} className="grid grid-cols-12 p-5 items-center text-xs sm:text-sm font-medium text-stone-800 hover:bg-stone-50/80 transition-colors">
                  <div className="col-span-6 sm:col-span-7 pr-2 font-semibold">{item.feature}</div>
                  <div className="col-span-3 sm:col-span-3 text-center flex justify-center">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-700" /> Included
                    </span>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-center flex justify-center">
                    <span className="inline-flex items-center gap-1 text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 text-xs">
                      <XCircle className="w-3.5 h-3.5 text-rose-500" /> Opaque
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. PRICING FAQS ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>Pricing Questions</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                Frequently Asked Questions About Billing & Fees
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Everything you need to know about official fees, university commissions, and payment milestones.
              </motion.p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {PRICING_FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${i}`}
                  className="border border-stone-200/80 rounded-2xl bg-[#FAF9F7] px-5 sm:px-6 py-2 transition-all"
                >
                  <AccordionTrigger className="text-left text-base font-bold text-stone-950 hover:text-amber-700 hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal pt-1 pb-4 border-t border-stone-200/60">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ─── 5. CONSULTATION CALENDLY SECTION ────────────────────── */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F7] border border-stone-200 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Free Plan Consultation</span>
              </div>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-950">
                Unsure Which Membership Track Fits Your Goals?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Book a free 30-minute 1-on-1 session with our senior advisors. We review your profile, budget, and target intakes — zero sales pressure.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free Track Recommendation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct University & Job Eligibility Check</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-2 sm:p-4">
              <CalendlyWidget height={640} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
