"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Layers,
  Landmark,
  ShieldCheck,
  Globe,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Users,
  Check,
  ChevronRight,
  DollarSign,
  PieChart,
} from "lucide-react";
import { useLang } from "@/context/lang-context";
import { cn } from "@/lib/utils";

const PROCESS_STEPS = [
  {
    id: 0,
    icon: Compass,
    titleEn: "Direct Institutional Corridors & Zero-Broker Moat",
    titleBn: "সরাসরি প্রাতিষ্ঠানিক সংযোগ ও দালাল-মুক্ত ব্যবসায়িক ভিত্তি",
    descEn:
      "Muntajar establishes direct integration with global universities and verified employer sponsors, bypassing unaccredited agents and securing 100% of candidate processing fees.",
    descBn:
      "অস্বচ্ছ দালাল নেটওয়ার্ক এড়িয়ে সরাসরি আন্তর্জাতিক বিশ্ববিদ্যালয় ও অনুমোদিত নিয়োগকারীদের সাথে যুক্ত হয়ে পুরো প্রসেসিং ফি নিশ্চিত করে মুনতাজার।",
  },
  {
    id: 1,
    icon: Layers,
    titleEn: "Multi-Stream High-Margin Revenue Model",
    titleBn: "বহুমাত্রিক উচ্চ-মুনাফাযুক্ত আয়ের মডেল",
    descEn:
      "Monetizing across university tuition deposits, corporate employer hiring bounties, and legal visa workflow modules—averaging ৳40,000–৳60,000 gross fee per candidate.",
    descBn:
      "বিশ্ববিদ্যালয় ভর্তি ফি, করপোরেট হায়ার বোনাস এবং ভিসা সার্ভিস—প্রার্থী প্রতি গড়ে ৪০,০০০–৬০,০০০ টাকা আয় নিশ্চিত করে মুনতাজারের বিজনেস মডেল।",
  },
  {
    id: 2,
    icon: Landmark,
    titleEn: "100% Compliant Banking & Escrow Architecture",
    titleBn: "শতভাগ স্বচ্ছ ব্যাংকিং ও এসক্রো পরিকাঠামো",
    descEn:
      "Candidate payments flow directly into institutional IBAN escrows and verified government rails, eliminating cash leakages and ensuring transparent audited reporting.",
    descBn:
      "সকল লেনদেন সরাসরি প্রাতিষ্ঠানিক ব্যাংক অ্যাকাউন্ট ও সরকারি চ্যানেলে সম্পন্ন হয়, যা আর্থিক অনিয়ম দূর করে পূর্ণ নিরীক্ষিত স্বচ্ছতা প্রদান করে।",
  },
  {
    id: 3,
    icon: ShieldCheck,
    titleEn: "AI Legal Engine & <2% Visa Refusal Risk",
    titleBn: "এআই লিগ্যাল ইঞ্জিন ও ২%-এর নিচে ভিসা রিজেকশন ঝুঁকি",
    descEn:
      "Automated SOP audits, fraud detection, and 1-on-1 consular officer mock simulations minimize visa rejections, protecting candidate capital and boosting institutional brand trust.",
    descBn:
      "অটোমেটেড এসওপি অডিট এবং ১-অন-১ কনস্যুলার মক ইন্টারভিউ সিস্টেম ভিসা রিজেকশন ২% এর নিচে নামিয়ে আনে এবং ব্র্যান্ডের গ্রহণযোগ্যতা বহুগুণ বাড়িয়ে তোলে।",
  },
  {
    id: 4,
    icon: Globe,
    titleEn: "150+ Direct Global Gateway Integrations",
    titleBn: "১৫০+ আন্তর্জাতিক বিশ্ববিদ্যালয়ের সাথে সরাসরি চুক্তি",
    descEn:
      "Immediate operational footprint across top UK, German, Canadian, and Australian institutions, positioning Muntajar for rapid multi-market expansion across South Asia.",
    descBn:
      "ইউকে, জার্মানি, কানাডা ও অস্ট্রেলিয়ার শীর্ষ প্রতিষ্ঠানের সাথে সরাসরি চুক্তির মাধ্যমে সমগ্র দক্ষিণ এশিয়ায় দ্রুত সম্প্রসারণের প্রস্তুতি সম্পন্ন।",
  },
  {
    id: 5,
    icon: TrendingUp,
    titleEn: "Real-Time Operational Transparency & Investor Yields",
    titleBn: "রিয়েল-টাইম অপারেশনাল স্বচ্ছতা ও ইনভেস্টর রিটার্ন",
    descEn:
      "Every angel partner receives verified real-time candidate processing metrics, certified quarterly dividend statements, and legal deed governance under Bangladesh law.",
    descBn:
      "প্রতিটি ইনভেস্টর লাইভ প্ল্যাটফর্ম ট্র্যাকিং, ত্রৈমাসিক ডিভিডেন্ড স্টেটমেন্ট এবং বাংলাদেশ কোম্পানি আইনের অধীনে সুরক্ষার শতভাগ নিশ্চয়তা লাভ করেন।",
  },
];

export function StickyFeatureShowcase() {
  const { lang } = useLang();
  const isBn = lang === "bn";
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // ── Auto-scroll detection: update active card as user scrolls ──────────────
  React.useEffect(() => {
    const handleScroll = () => {
      const windowCenter = window.innerHeight * 0.42;

      let closestIndex = 0;
      let minDistance = Infinity;

      stepRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - windowCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F7] border-b border-stone-200/70 text-stone-900 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] border border-stone-200/80 text-stone-800 text-xs font-semibold shadow-2xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            </span>
            <span>{isBn ? "বিজনেস আর্কিটেকচার ও প্রবৃদ্ধি" : "B2B Infrastructure & Revenue Moat"}</span>
          </div>

          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-stone-950 tracking-tight leading-[1.15]">
            {isBn ? (
              <>
                মুনতাজার যেভাবে প্রবৃদ্ধি ও{" "}
                <span className="text-[#EA580C]">উচ্চ মুনাফা তৈরি করে</span>
              </>
            ) : (
              <>
                How Muntajar Scales &amp;{" "}
                <span className="text-[#EA580C]">Generates Returns</span>
              </>
            )}
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
            {isBn
              ? "দালালদের অস্বচ্ছতা দূর করে সরাসরি প্রাতিষ্ঠানিক ডিজিটাল চ্যানেলের মাধ্যমে উচ্চ মার্জিনের রেভিনিউ এবং দ্রুততম মার্কেট দখল নিশ্চিত করে মুনতাজার।"
              : "Our proprietary direct-to-institution technology eliminates costly broker middlemen, unlocking high-margin fee capture and massive South Asian market dominance."}
          </p>
        </div>

        {/* ── 2-COLUMN RESPONSIVE / STICKY GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ── LEFT COLUMN: Features on Desktop, Stacked Steps with Dimming on Mobile ── */}
          <div className="lg:col-span-7 space-y-10 sm:space-y-12 text-left py-2">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = activeIndex === idx;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  onClick={() => {
                    setActiveIndex(idx);
                  }}
                  className={cn(
                    "transition-all duration-300 select-none relative",
                    "bg-transparent border-none p-0",
                    "lg:cursor-pointer lg:p-6 lg:rounded-3xl",
                    isActive
                      ? "opacity-100 filter-none lg:bg-white"
                      : "opacity-25 sm:opacity-35 hover:opacity-70 lg:bg-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-200 mt-0.5",
                          isActive
                            ? "bg-orange-50 text-[#EA580C]"
                            : "bg-stone-200/70 text-stone-500"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <h3
                          className={cn(
                            "font-sans text-base sm:text-lg leading-snug transition-colors",
                            isActive ? "text-stone-950 font-extrabold" : "text-stone-700 font-bold"
                          )}
                        >
                          {isBn ? step.titleBn : step.titleEn}
                        </h3>

                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                          {isBn ? step.descBn : step.descEn}
                        </p>
                      </div>
                    </div>

                    {/* Active Indicator Arrow Button */}
                    <div className="shrink-0 pt-0.5">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                          isActive
                            ? "bg-[#EA580C] text-white"
                            : "bg-stone-200/70 text-stone-400"
                        )}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* ── MOBILE ONLY: Smooth Orange Preview Card beneath each step ── */}
                  <div className="mt-5 lg:hidden">
                    <div className="bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FB923C] rounded-[2rem] p-4 sm:p-5 relative overflow-hidden flex items-center justify-center shadow-md">
                      {/* Background Texture */}
                      <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-20">
                        <div className="w-2.5 h-full bg-white rounded-full" />
                        <div className="w-2.5 h-full bg-white rounded-full" />
                        <div className="w-2.5 h-full bg-white rounded-full" />
                        <div className="w-2.5 h-full bg-white rounded-full" />
                      </div>

                      <div className="w-full relative z-10">
                        {renderStepCardContent(idx)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── RIGHT COLUMN: Desktop Only Sticky Card ── */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28 lg:top-32 self-start">
            <div className="bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FB923C] rounded-3xl p-6 sm:p-9 relative overflow-hidden flex items-center justify-center min-h-[460px]">
              
              {/* Background Vertical Pinstripe Texture */}
              <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
                <div className="w-3.5 h-full bg-white rounded-full" />
                <div className="w-3.5 h-full bg-white rounded-full" />
                <div className="w-3.5 h-full bg-white rounded-full" />
                <div className="w-3.5 h-full bg-white rounded-full" />
                <div className="w-3.5 h-full bg-white rounded-full" />
              </div>

              {/* Dynamic Center Card based on Active Index */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`desktop-card-${activeIndex}`}
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -15 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="w-full flex justify-center relative z-10"
                >
                  {renderStepCardContent(activeIndex)}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// ── Helper Function to Render Each Step's Card Content ──
function renderStepCardContent(index: number) {
  switch (index) {
    case 0:
      return (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border-none max-w-sm w-full text-left space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base sm:text-lg font-black text-stone-950 tracking-tight">Direct Desks</h4>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] text-[10px] font-bold">
              Institutional Moat
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs font-bold text-stone-700">4 Target Country Desks</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-stone-500">Live Sync</span>
              <div className="w-8 h-4 bg-[#EA580C] rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              Active Desks: UK, Germany, Canada
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF9F7]">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#EA580C] font-black text-xs flex items-center justify-center">
                  U
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">University Direct Desks</p>
                  <p className="text-[10px] text-stone-500">Direct CAS &amp; I-20 Desks</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF9F7]">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                  J
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Corporate Hiring Desks</p>
                  <p className="text-[10px] text-stone-500">Verified Employer Sponsorship</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF9F7]">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
                  V
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Embassy Visa Prep</p>
                  <p className="text-[10px] text-stone-500">Automated Mock Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 1:
      return (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border-none max-w-sm w-full text-left space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="text-sm sm:text-base font-extrabold text-stone-950 flex items-center gap-1.5">
              <span className="text-[#EA580C]">৳</span> Revenue Channels
            </h4>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              High Gross Margin
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-0.5 pb-2 border-b border-stone-100">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-900">University Direct Admission</span>
                <span className="text-[#EA580C]">৳40,000 / candidate</span>
              </div>
              <p className="text-[10px] text-stone-500">Official Institutional Intake Fee</p>
            </div>

            <div className="space-y-0.5 pb-2 border-b border-stone-100">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-900">Corporate Employer Placement</span>
                <span className="text-[#EA580C]">৳60,000 / hire</span>
              </div>
              <p className="text-[10px] text-stone-500">Employer Hiring Bounty</p>
            </div>

            <div className="space-y-0.5 pb-2 border-b border-stone-100">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-900">Direct Scholarship Filing</span>
                <span className="text-emerald-700">100% Scalable SaaS</span>
              </div>
              <p className="text-[10px] text-stone-500">DAAD, Chevening, Fulbright Portals</p>
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-900">Work Permit &amp; PR Route</span>
                <span className="text-[#EA580C]">Premium Tier</span>
              </div>
              <p className="text-[10px] text-stone-500">Tier 2, LMIA, Chancenkarte, TSS 482</p>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border-none max-w-sm w-full text-left space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-stone-950">Banking &amp; Escrow</h4>
              <p className="text-[10px] text-stone-500">Institutional Settlement</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
              $0 Broker Cut
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-stone-50 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-900">University Tuition &amp; Deposits</span>
                <span className="text-emerald-700">$0 Middlemen Markup</span>
              </div>
              <p className="text-[10px] text-stone-500">Direct to Official College Account</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-900">Work Permit &amp; Visa Gateways</span>
                <span className="text-emerald-700">Zero Commission</span>
              </div>
              <p className="text-[10px] text-stone-500">Official Government Portal Wire</p>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF5ED] space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-900">Muntajar Net Margin</span>
                <span className="text-[#EA580C]">100% Retained</span>
              </div>
              <p className="text-[10px] text-stone-600">Zero Agency Kickback Losses</p>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border-none max-w-sm w-full text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-[#EA580C] text-[10px] font-bold">
            Defensible Compliance Moat
          </span>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#EA580C] mx-auto">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-bold text-stone-950">AI Consular Verification</h4>
            <p className="text-xs text-stone-500 mt-1 font-normal">
              Reduces Visa Refusals Below 2%
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="p-2.5 rounded-xl bg-[#FAF9F7] text-left text-xs space-y-1">
              <div className="flex justify-between font-bold text-stone-900">
                <span>Historical Visa Success Rate:</span>
                <span className="text-emerald-600">98.4%</span>
              </div>
              <p className="text-[10px] text-stone-500">Compared to national agent average of 62%</p>
            </div>

            <div className="w-full py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold">
              Institutional Grade Verification
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border-none max-w-sm w-full text-left space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-extrabold text-stone-950">Global Expansion</h4>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
              High Scalability
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-stone-50">
              <span className="text-xl sm:text-2xl font-black text-stone-950">150+</span>
              <p className="text-[10px] text-stone-500 font-bold uppercase mt-0.5">Campuses</p>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-stone-50">
              <span className="text-xl sm:text-2xl font-black text-[#EA580C]">500+</span>
              <p className="text-[10px] text-stone-500 font-bold uppercase mt-0.5">Sponsors</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              Target Corridors
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold">🇬🇧 UK</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold">🇩🇪 Germany</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold">🇨🇦 Canada</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold">🇦🇺 Australia</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold">🇺🇸 USA</span>
            </div>
          </div>
        </div>
      );

    case 5:
    default:
      return (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border-none max-w-sm w-full text-left space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-extrabold text-stone-950">Investor Governance</h4>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Audited Yields
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">1. Candidate Volumes Realized</p>
                <p className="text-[10px] text-stone-500">Live transaction volume tracked on portal</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">2. Institutional Revenue Deposited</p>
                <p className="text-[10px] text-stone-500">Automated institutional bank escrow</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                3
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">3. Quarterly Dividend Distributed</p>
                <p className="text-[10px] text-stone-500">Certified payout directly to investor account</p>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
