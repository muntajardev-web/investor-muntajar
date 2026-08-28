"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Copy,
  ExternalLink,
  ShieldCheck,
  Building2,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { CalendlyWidget } from "@/components/ui/calendly-widget";
import { useLang } from "@/context/lang-context";
import { cn } from "@/lib/utils";

const INQUIRY_TYPES = [
  { id: "investment", en: "Angel Investment / Seed Round", bn: "এঞ্জেল ইনভেস্টমেন্ট / সিড রাউন্ড" },
  { id: "partnership", en: "University & Recruiter Partner", bn: "বিশ্ববিদ্যালয় ও রিক্রুটার পার্টনার" },
  { id: "student", en: "Student & Skilled Pathways", bn: "উচ্চশিক্ষা ও ভিসা তথ্য" },
  { id: "general", en: "General Inquiry", bn: "সাধারণ জিজ্ঞাসা" },
];

export default function ContactPage() {
  const { lang } = useLang();
  const isBn = lang === "bn";

  const [selectedType, setSelectedType] = useState("investment");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("investors@muntajar.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20 sm:pt-36 sm:pb-28 flex-1">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-35" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* ── HEADER ── */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF5ED] border border-[#FDDBC9] text-[#EA580C] text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              <span>{isBn ? "সরাসরি ইনভেস্টর ও পার্টনার ডেস্ক" : "Direct Founder & Investor Desk"}</span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-600 font-medium">Dhaka HQ</span>
            </div>

            <h1 className={`font-sans font-extrabold text-3xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] text-stone-950 tracking-tight ${isBn ? "font-solaimanlipi" : ""}`}>
              {isBn ? (
                <>
                  আমাদের সাথে যোগাযোগ করুন ও <br className="hidden sm:inline" />
                  <span className="text-[#EA580C]">আগামীর পথ তৈরি করুন</span>
                </>
              ) : (
                <>
                  Let&apos;s Connect &amp; <br className="hidden sm:inline" />
                  <span className="text-[#EA580C]">Build the Future.</span>
                </>
              )}
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              {isBn
                ? "এঞ্জেল সিড রাউন্ডে অংশগ্রহণ, পার্টনারশিপ আলোচনা বা যেকোনো তথ্যের জন্য আমাদের ঢাকা সদর দপ্তরের সাথে সরাসরি যুক্ত হন।"
                : "Whether you are looking to join our Angel Seed Round, explore institutional university partnerships, or get verified guidance — our direct desk is here for you."}
            </p>
          </div>

          {/* ── MAIN 2-COLUMN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            
            {/* ── LEFT COLUMN: Interactive Contact Form ── */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-9 text-left relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Form Title */}
                    <div>
                      <h2 className="text-xl font-bold text-stone-950">
                        {isBn ? "বার্তা পাঠান" : "Send a Direct Message"}
                      </h2>
                      <p className="text-xs text-stone-500 mt-1">
                        {isBn ? "আমরা সাধারণত ২-৪ কার্যঘণ্টার মধ্যে রেসপন্স করি।" : "We typically respond within 2–4 business hours."}
                      </p>
                    </div>

                    {/* Inquiry Type Pills */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                        {isBn ? "যোগাযোগের কারণ" : "Select Topic of Interest"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {INQUIRY_TYPES.map((type) => {
                          const isSelected = selectedType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setSelectedType(type.id)}
                              className={cn(
                                "py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer select-none",
                                isSelected
                                  ? "bg-stone-950 text-white border-stone-950 shadow-xs"
                                  : "bg-[#FAF9F7] text-stone-700 border-stone-200 hover:bg-stone-100"
                              )}
                            >
                              {isBn ? type.bn : type.en}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Email Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          {isBn ? "আপনার পুরো নাম *" : "Full Name *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={isBn ? "উদা: তানভীর আহমেদ" : "e.g. Tanvir Ahmed"}
                          className="w-full px-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          {isBn ? "ইমেইল এড্রেস *" : "Email Address *"}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        {isBn ? "ফোন / হোয়াটসঅ্যাপ নম্বর" : "Phone / WhatsApp Number"}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 17XX-XXXXXX"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] transition-all"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        {isBn ? "আপনার বার্তা" : "Message / Inquiry Details"}
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          isBn
                            ? "আপনার লক্ষ্য বা প্রস্তাবনা সম্পর্কে সংক্ষেপে লিখুন..."
                            : "Tell us about your investment ticket, partnership query, or goals..."
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex items-center justify-between gap-4">
                      <LiquidMetalButton
                        label={isBn ? "বার্তা পাঠান →" : "Send Message →"}
                        onClick={() => {
                          const form = document.querySelector("form");
                          if (form?.reportValidity()) {
                            setSubmitted(true);
                          }
                        }}
                        height={46}
                        width={220}
                      />

                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{isBn ? "১০০% গোপনীয়তা সুরক্ষিত" : "Strict NDA Protected"}</span>
                      </div>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-950">
                      {isBn ? "বার্তা সফলভাবে পাঠানো হয়েছে!" : "Message Sent Successfully!"}
                    </h3>
                    <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                      {isBn
                        ? "আমাদের ইনভেস্টর ও পার্টনারশিপ টিম শীঘ্রই আপনার সাথে ইমেইল ও ফোনে যোগাযোগ করবে।"
                        : "Thank you for reaching out. Our investor relations and executive desk will get back to you shortly."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isBn ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT COLUMN: Direct Channels & Office Info ── */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Direct Channels Card */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-400">
                  {isBn ? "সরাসরি যোগাযোগের মাধ্যম" : "Direct Channels"}
                </h3>

                {/* Email Item with Copy */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF9F7] border border-stone-200/80">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        {isBn ? "অফিশিয়াল ইমেইল" : "Investor & General Email"}
                      </p>
                      <a
                        href="mailto:investors@muntajar.com"
                        className="text-sm font-bold text-stone-900 hover:text-[#EA580C] transition-colors"
                      >
                        investors@muntajar.com
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* WhatsApp & Hotline */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF9F7] border border-stone-200/80">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        {isBn ? "হোয়াটসঅ্যাপ ও হটলাইন" : "WhatsApp Concierge"}
                      </p>
                      <a
                        href="https://chat.whatsapp.com/BuyZDTg3CSe89U1pnAbWgv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-stone-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                      >
                        <span>+880 1712-345678</span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                      </a>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-2 mr-1" title="Online" />
                </div>

                {/* Office Location */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF9F7] border border-stone-200/80">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {isBn ? "ঢাকা সদর দপ্তর" : "Dhaka Headquarters"}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-stone-900 leading-snug mt-0.5">
                      332/A, Khilgaon, Tilpapara, Dhaka-1219, Bangladesh
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {isBn ? "সাপ্তাহিক কর্মদিবস: রবি — বৃহস্পতি (সকাল ১০:০০ — সন্ধ্যা ৬:০০)" : "Working Hours: Sun – Thu (10:00 AM – 6:00 PM)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Call Banner Card */}
              <div className="bg-[#0F0E0C] text-white rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wide uppercase">
                  <Calendar className="w-4 h-4" />
                  <span>{isBn ? "ফাউন্ডারের সাথে সরাসরি কথা বলুন" : "Direct Video Consultation"}</span>
                </div>
                <h4 className="text-lg font-bold text-white leading-snug">
                  {isBn
                    ? "১৫-মিনিটের প্রাইভেট ইনভেস্টর ব্রিফিং বুক করুন"
                    : "Book a 15-Minute Founder Briefing Call"}
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed font-normal">
                  {isBn
                    ? "সরাসরি ক্যালেন্ডারে সুবিধাজনক সময় নির্ধারণ করে মুনতাজারের অগ্রগতি ও সুযোগ সম্পর্কে জেনে নিন।"
                    : "Choose a convenient slot to discuss our seed valuation, financial model, and expansion strategy."}
                </p>
                <button
                  type="button"
                  onClick={() => setShowCalendly(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D94E06] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all cursor-pointer select-none"
                >
                  <span>{isBn ? "ক্যালেন্ডার ওপেন করুন" : "Open Booking Calendar"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Calendly Modal */}
      {showCalendly && (
        <CalendlyWidget
          isOpen={showCalendly}
          onClose={() => setShowCalendly(false)}
        />
      )}

      <Footer />
    </div>
  );
}
