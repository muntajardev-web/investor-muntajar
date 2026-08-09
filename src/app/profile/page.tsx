"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Download,
  Award,
  Sparkles,
  ArrowRight,
  FileText,
  Globe2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useLang } from "@/context/lang-context";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { lang } = useLang();
  const isBn = lang === "bn";
  const [showReportModal, setShowReportModal] = React.useState(false);

  const handleDownloadAll = () => {
    const files = [
      { url: "/downloads/data-presentation.pptx", name: "data-presentation.pptx" },
      { url: "/downloads/Muntajar-Global-Limited-Project-Profile.docx", name: "Muntajar-Global-Limited-Project-Profile.docx" },
      { url: "/downloads/Porters-Theory-Evaluation-Muntajar.doc", name: "Porters-Theory-Evaluation-Muntajar.doc" },
    ];
    files.forEach((file, index) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 350);
    });
  };

  return (
    <PageLayout showCta={false}>
      <div className="bg-[#FAF9F7] min-h-screen pt-24 pb-32">
        {/* Header Breadcrumb Banner */}
        <section className="bg-stone-900 text-white py-16 md:py-24 border-b border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-400 mb-6 uppercase tracking-wider">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                {isBn ? "হোম" : "Home"}
              </Link>
              <span>/</span>
              <span className="text-amber-400">{isBn ? "কোম্পানি প্রোফাইল" : "Company Profile"}</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
                <Building2 className="w-4 h-4 text-amber-400" />
                {isBn ? "কর্পোরেট গভার্নেন্স ও ভিশন" : "Corporate Governance & Vision"}
              </span>
              <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                {isBn
                  ? "মুনতাজার কোনো সাধারণ স্টার্টআপ নয়; এটি উদীয়মান তরুণ ও প্রবাসীদের (NRBs) ভাগ্য পরিবর্তন, তাদের স্বপ্নকে বাস্তবে রূপদান এবং বিশ্বমঞ্চে বাংলাদেশের ভবিষ্যৎকে পুনর্গঠনের একটি আন্দোলন।"
                  : "Muntajar is not just another startup; it’s a movement to transform the fate of aspiring youth & NRBs, empower their dreams, and reshape Bangladesh’s future for the world."}
              </h1>
              <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-normal">
                {isBn
                  ? "মুনতাজার একটি নিবন্ধিত ডিজিটাল ইনফ্রাস্ট্রাকচার প্ল্যাটফর্ম যা আন্তর্জাতিক শিক্ষা, বৈদেশিক কর্মসংস্থান এবং মাইগ্রেশন প্রসেসিংকে দালালমুক্ত ও সম্পূর্ণ স্বচ্ছ করে তুলেছে।"
                  : "Muntajar is a registered digital infrastructure platform transforming international education, workforce placement, and migration pathways. We eliminate predatory intermediaries using direct institution APIs and AI document automation."}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 space-y-20">
          
          {/* Executive Overview & Key Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
                {isBn ? "আমাদের ভিশন ও মিশন" : "Mission & Core Architecture"}
              </h2>
              <p className="text-stone-600 text-base leading-relaxed">
                {isBn
                  ? "বাংলাদেশে প্রতি বছর লক্ষ লক্ষ শিক্ষার্থী ও দক্ষ কর্মী বিদেশে উচ্চশিক্ষা ও কর্মসংস্থানের জন্য আবেদন করেন। সনাতনী মধ্যস্বত্বভোগী ও দালালদের সিন্ডিকেটের কারণে তাদের হাজার হাজার টাকা লোকসান হয়। মুনতাজার সরাসরি বিশ্ববিদ্যালয় ও গ্লোবাল এম্পলয়ারদের সাথে কানেক্ট করে এআই চালিত এলিজিবিলিটি ও ডকুমেন্ট প্রসেসিং প্রদান করে।"
                  : "Over 400,000 students and skilled workers migrate from Bangladesh annually, facing opaque broker commissions and high fraud risk. Muntajar builds direct API integrations with universities and licensed overseas employers, standardizing visa documentation through proprietary AI engines."}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200/80">
                  <p className="text-xs font-bold text-stone-500 uppercase">Incorporation</p>
                  <p className="text-sm font-extrabold text-stone-900 mt-1">RJSC Registered</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200/80">
                  <p className="text-xs font-bold text-stone-500 uppercase">Platform Reach</p>
                  <p className="text-sm font-extrabold text-stone-900 mt-1">150+ Global Partners</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-stone-200/80 col-span-2 sm:col-span-1">
                  <p className="text-xs font-bold text-stone-500 uppercase">Target Market</p>
                  <p className="text-sm font-extrabold text-amber-600 mt-1">$4.2B South Asia TAM</p>
                </div>
              </div>
            </div>

            {/* Regulatory Shield Box */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-8 bg-stone-950 text-white space-y-6 shadow-2xl border border-stone-800 relative overflow-hidden">
                <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Regulatory Shield</p>
                    <p className="text-base font-extrabold text-white">100% ILO & RJSC Compliance</p>
                  </div>
                </div>

                <ul className="space-y-4 text-sm text-stone-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Audited Financial Statements & 24-Month Ledger</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Direct Investor Partner Shareholding Certificate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Preferred Partner Asset Protection Rights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Quarterly Dividend Disbursal & Legal Moat Protection</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBn ? "ডাউনলোড প্রোফাইল ও পিচ ডেক ফাইলস" : "Download Pitch Deck & Profile Spec"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Official Pitch Deck & Spec Sheet Documents Section */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  {isBn ? "অফিশিয়াল ইনভেস্টর ও প্রজেক্ট পেপারস" : "Official Pitch Deck Documents"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
                  {isBn ? "মুনতাজার গ্লোবাল প্রজেক্ট ডক্যুমেন্টস" : "Official Project Profile & Pitch Deck Bundle"}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-normal">
                  {isBn
                    ? "নিচের অফিশিয়াল ৩টি ফাইল থেকে আপনার প্রয়োজনীয় ডক্যুমেন্ট সরাসরি ডাউনলোড করুন অথবা একসাথে সব ৩টি ফাইল সেভ করুন।"
                    : "Select from the 3 lawyer-vetted official files below to review Muntajar's project valuation & growth trajectory:"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadAll}
                className="bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isBn ? "সব ৩টি ফাইল একসাথে ডাউনলোড করুন" : "Download All 3 Files (Bundle)"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/downloads/data-presentation.pptx"
                download
                className="p-5 rounded-2xl bg-[#FAF9F7] hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-amber-700 transition-colors">
                      1. Data Presentation Deck (.pptx)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">Muntajar Financial & Market Valuation</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-700 transition-colors shrink-0" />
              </a>

              <a
                href="/downloads/Muntajar-Global-Limited-Project-Profile.docx"
                download
                className="p-5 rounded-2xl bg-[#FAF9F7] hover:bg-sky-50/60 border border-stone-200 hover:border-sky-300 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-sky-700 transition-colors">
                      2. Official Project Profile (.docx)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">Full Company Registration & Ops Profile</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-sky-700 transition-colors shrink-0" />
              </a>

              <a
                href="/downloads/Porters-Theory-Evaluation-Muntajar.doc"
                download
                className="p-5 rounded-2xl bg-[#FAF9F7] hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-300 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      3. Porter&apos;s Theory Evaluation (.doc)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">Competitive Advantage & Corridor Analysis</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition-colors shrink-0" />
              </a>
            </div>
          </div>

          {/* Pillars of Governance */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold text-stone-950">
                {isBn ? "গভার্নেন্স ও ইনস্টিটিউশনাল সিকিউরিটি" : "Pillars of Institutional Security"}
              </h2>
              <p className="text-stone-600 text-sm">
                {isBn
                  ? "আমাদের বিনিয়োগকারী ও ব্যবহারকারীদের নিরাপত্তার জন্য নির্ধারিত ৪টি সুনির্দিষ্ট মানদণ্ড।"
                  : "Four key structural safeguards ensuring investor capital and operational transparency."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-extrabold text-lg text-stone-900">RJSC Legal Structure</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Registered under Bangladesh Joint Stock Companies & Firms with equity holding documentation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-extrabold text-lg text-stone-900">ILO Ethical Standards</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Adheres strictly to Fair Recruitment Guidelines ensuring 0 candidate exploitation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-extrabold text-lg text-stone-900">Transparent Audits</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Quarterly audited financial statements published directly to investor dashboards.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="font-extrabold text-lg text-stone-900">Founder Led Tech</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Over 10+ years combined experience in global mobility platforms and software architecture.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal for PDF & Pitch Deck Bundle Download */}
      {showReportModal && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 relative"
          >
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                {isBn ? "অফিশিয়াল ইনভেস্টর পেপারস" : "Official Pitch Deck Documents"}
              </span>
              <h3 className="font-sans font-extrabold text-2xl text-stone-950">
                {isBn ? "মুনতাজার ইনভেস্টর রিপোর্ট ও প্রেজেন্টেশন" : "Download Official Pitch Deck Bundle"}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal">
                {isBn
                  ? "নিচের অফিশিয়াল ৩টি পেপার থেকে আপনার প্রয়োজনীয় ফাইলটি সিলেক্ট করে সরাসরি ডাউনলোড করুন।"
                  : "Select from the 3 lawyer-vetted official files below to review Muntajar's project valuation & growth trajectory:"}
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/downloads/data-presentation.pptx"
                download
                className="p-4 rounded-2xl bg-[#FAF9F7] hover:bg-stone-100 border border-stone-200 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors">
                      1. Data Presentation Deck (.pptx)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">Muntajar Financial & Market Valuation</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors shrink-0" />
              </a>

              <a
                href="/downloads/Muntajar-Global-Limited-Project-Profile.docx"
                download
                className="p-4 rounded-2xl bg-[#FAF9F7] hover:bg-stone-100 border border-stone-200 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-sky-600 transition-colors">
                      2. Official Project Profile (.docx)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">Full Company Registration & Ops Profile</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-sky-600 transition-colors shrink-0" />
              </a>

              <a
                href="/downloads/Porters-Theory-Evaluation-Muntajar.doc"
                download
                className="p-4 rounded-2xl bg-[#FAF9F7] hover:bg-stone-100 border border-stone-200 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-emerald-600 transition-colors">
                      3. Porter&apos;s Theory Evaluation (.doc)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">Competitive Advantage & Corridor Analysis</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0" />
              </a>
            </div>

            {/* Instant Download All 3 Files Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownloadAll}
                className="w-full bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isBn ? "একসাথে সব ৩টি ফাইল ডাউনলোড করুন" : "Download All 3 Files (Bundle)"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </PageLayout>
  );
}
