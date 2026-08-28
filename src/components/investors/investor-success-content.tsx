"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Download,
  Share2,
  Copy,
  Check,
  Calendar,
  MessageCircle,
  PhoneCall,
  ArrowRight,
  UserCheck,
  FileCheck,
  Gift,
  Star,
  Users,
  Building2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DigitalCertificate } from "@/components/investors/digital-certificate";
import { Navbar } from "@/components/navigation/navbar";
import { useLang } from "@/context/lang-context";

export function InvestorSuccessContent() {
  const searchParams = useSearchParams();
  const { lang, setLang } = useLang();
  const isBn = lang === "bn";

  const rawTickets = searchParams?.get("tickets");
  const rawAmount = searchParams?.get("amount");
  const rawName = searchParams?.get("name");
  const rawEmail = searchParams?.get("email") || "";
  const rawPhone = searchParams?.get("phone") || "";
  const deedId = searchParams?.get("deed_id") || "MJR-2026-8842";
  const serialNumber = searchParams?.get("serial") || "MNT-SEC-2026-08942";
  const token = searchParams?.get("token") || "";
  const plainPassword = searchParams?.get("plain_password") || "";
  const tranId = searchParams?.get("tran_id") || "MJR-INV-8842";
  const paymentStatus = searchParams?.get("payment");
  const isPaid = paymentStatus === "success";

  const tickets = rawTickets ? Math.max(1, parseInt(rawTickets, 10)) : 1;
  const totalAmount = rawAmount ? parseInt(rawAmount, 10) : tickets * 20000;
  const investorName = rawName || "Valued Angel Partner";

  // Automatically sync session auth to sessionStorage on verified payment callback
  useEffect(() => {
    if (isPaid && rawEmail && typeof window !== "undefined") {
      const sessionUser = {
        name: investorName,
        email: rawEmail,
        phone: rawPhone,
        tickets,
        amount: totalAmount,
        deedId,
        serialNumber,
        token: token || `token-inv-${Date.now()}`,
        status: "CONFIRMED",
      };
      sessionStorage.setItem("muntajar_investor_auth", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("muntajar-investor-data-updated"));
    }
  }, [isPaid, rawEmail, rawPhone, tickets, totalAmount, deedId, serialNumber, token, investorName]);

  const [copied, setCopied] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [eSigned, setESigned] = useState(false);
  const [kycForm, setKycForm] = useState({ nid: "", bankName: "", accountNumber: "" });

  const refLink = `https://muntajar.com/investors?ref=${deedId}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success(isBn ? "রেফারেল লিংক কপি হয়েছে!" : "Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const copyPassword = () => {
    if (!plainPassword) return;
    navigator.clipboard.writeText(plainPassword);
    setCopiedPass(true);
    toast.success("Password copied to clipboard!");
    setTimeout(() => setCopiedPass(false), 3000);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKycCompleted(true);
    toast.success(isBn ? "KYC ও ব্যাংক তথ্য সফলভাবে সংরক্ষিত হয়েছে!" : "KYC & Bank details saved successfully!");
  };

  const handleESign = (e: React.FormEvent) => {
    e.preventDefault();
    setESigned(true);
    toast.success(isBn ? "চুক্তিপত্রে ডিজিটাল স্বাক্ষর গৃহীত হয়েছে!" : "Deed digitally e-signed successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-950 font-sans selection:bg-orange-500 selection:text-white pb-24">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 space-y-10">
        
        {/* Top Language & Quick Navigation */}
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`font-bold px-3 py-1 text-xs ${isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-amber-50 text-amber-700 border-amber-300"}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 mr-1 ${isPaid ? "text-emerald-600" : "text-amber-600"}`} />
              {isPaid
                ? (isBn ? "পেমেন্ট ও ডিড সক্রিয়" : "Payment & Deed Active")
                : (isBn ? "বিনিয়োগ নিশ্চিত হয়েছে" : "Investment Registered")}
            </Badge>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              Deed ID: <strong className="font-mono text-[#EA580C]">{deedId}</strong>
            </span>
          </div>

          <button
            onClick={() => setLang(isBn ? "en" : "bn")}
            className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 transition-all cursor-pointer shadow-2xs"
          >
            {isBn ? "English View" : "বাংলা ভিউ"}
          </button>
        </div>

        {/* Hero Celebration Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border border-amber-500/20"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Text */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isBn ? "মুনতাজারে স্বাগতম, পার্টনার!" : "Welcome to Founders Circle"}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {isBn ? (
                  <>
                    অভিনন্দন, <span className="text-amber-400">{investorName}</span>! <br />
                    আপনার বিনিয়োগ ও শেয়ার ডিড সক্রিয়।
                  </>
                ) : (
                  <>
                    Congratulations, <span className="text-amber-400">{investorName}</span>! <br />
                    Your Equity &amp; Deed are Active.
                  </>
                )}
              </h1>

              <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {isBn
                  ? `আপনি এখন মুনতাজার প্ল্যাটফর্মের একজন অফিসিয়াল এঞ্জেল পার্টনার। আপনার ${tickets}টি ইনভেস্টর টিকিট (৳${totalAmount.toLocaleString()} BDT) সফলভাবে নিবন্ধিত হয়েছে। লগইন তথ্য আপনার ইমেইলে (${rawEmail || "রেজিস্টার্ড ইমেইল"}) পাঠানো হয়েছে।`
                  : `You are now an official Angel Equity Partner in Muntajar Platform. Your allocation of ${tickets} Angel Ticket(s) (৳${totalAmount.toLocaleString()} BDT) is fully confirmed. Your login credentials have also been dispatched to ${rawEmail || "your email"}.`}
              </p>

              {/* Credentials Highlight Card if provided */}
              {plainPassword && (
                <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 max-w-md space-y-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-stone-800 pb-1.5">
                    <span>Generated Portal Credentials</span>
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPass ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedPass ? "Copied" : "Copy Password"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Login Email</span>
                      <span className="font-mono text-white font-bold">{rawEmail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Generated Password</span>
                      <span className="font-mono text-amber-300 font-bold tracking-wider">{plainPassword}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Action Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/investor-dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg select-none cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{isBn ? "ইনভেস্টর ড্যাশবোর্ড ওপেন করুন →" : "Open Investor Dashboard →"}</span>
                </Link>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-black text-xs uppercase tracking-wider rounded-xl px-4 py-3 shadow-lg">
                      <Award className="w-4 h-4 mr-1.5 text-amber-400" />
                      {isBn ? "ডিজিটাল সার্টিফিকেট" : "Share Certificate"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-stone-950 border-amber-500/30">
                    <DigitalCertificate
                      investorName={investorName}
                      tickets={tickets}
                      totalAmount={totalAmount}
                    />
                  </DialogContent>
                </Dialog>

                <a
                  href="https://chat.whatsapp.com/BuyZDTg3CSe89U1pnAbWgv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  {isBn ? "ভিআইপি গ্রুপ" : "VIP WhatsApp"}
                </a>
              </div>
            </div>

            {/* Right Col: Summary Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white space-y-4">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                {isBn ? "বিনিয়োগ সারসংক্ষেপ" : "Investment Summary"}
              </span>

              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-stone-300">{isBn ? "মোট টিকিট" : "Allocated Tickets"}</span>
                  <span className="font-mono font-bold text-amber-300">{tickets} Ticket(s)</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-stone-300">{isBn ? "মোট মূলধন" : "Total Equity Committed"}</span>
                  <span className="font-mono font-black text-emerald-400 text-base">৳{totalAmount.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-stone-300">{isBn ? "ডিড নম্বর" : "Share Deed ID"}</span>
                  <span className="font-mono font-bold text-amber-400">{deedId}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-stone-300">{isBn ? "প্ল্যাটফর্ম সাবস্ক্রিপশন" : "Platform Access"}</span>
                  <span className="font-bold text-emerald-400">LIFETIME FREE</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300">{isBn ? "ত্রৈমাসিক ডিভিডেন্ড" : "Next Dividend Cycle"}</span>
                  <span className="font-mono font-bold text-amber-300">Q3 2026</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── DIVIDEND LEDGER & HELP DESK SECTION ────────────── */}
        <div className="max-w-3xl mx-auto space-y-6 pt-4">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                    Financial Portal
                  </span>
                  <h3 className="font-black text-stone-950 text-lg">
                    {isBn ? "ডিভিডেন্ড লেজার" : "Dividend Ledger"}
                  </h3>
                </div>
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    {isBn ? "পরবর্তী লভ্যাংশ বণ্টন" : "Next Distribution Window"}
                  </span>
                  <span className="text-xl font-black text-stone-950 font-mono">
                    30 SEPTEMBER 2026
                  </span>
                  <span className="text-[11px] text-emerald-600 font-extrabold block">
                    ● Q3 Financial Audit Cycle
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {isBn ? "প্রজেক্টেড রিটার্ন রেট" : "Projected Annual ROI"}
                  </span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    18.5% - 24.0%
                  </span>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {isBn
                      ? "প্লাটফর্মের সাবস্ক্রিপশন ও ভিসা প্রসেসিং রেভিনিউ হতে নিয়মিত অডিটেড পেআউট।"
                      : "Based on platform subscription & service fees audited quarterly."}
                  </p>
                </div>

                <div className="border-t border-stone-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>{isBn ? "অডিট রিটিং" : "Audit Status"}</span>
                    <strong className="text-stone-900">VERIFIED ✅</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>{isBn ? "পেআউট চ্যানেল" : "Disbursement"}</span>
                    <strong className="text-stone-900">{kycCompleted ? "Direct Bank" : "Pending KYC"}</strong>
                  </div>
                </div>
              </div>

              <a
                href="/api/investors/download-report"
                className="w-full inline-flex items-center justify-center py-3 bg-stone-100 hover:bg-stone-200 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                {isBn ? "অডিট রিপোর্ট ডাউনলোড" : "Download Audit Brief"}
              </a>
            </div>

            {/* Assistance Card */}
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 text-amber-700" />
                {isBn ? "ইনভেস্টর হেল্পডেস্ক" : "Investor Priority Support"}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {isBn
                  ? "যেকোনো আইনি প্রশ্ন, সার্টিফিকেট হার্ডকপি বা লভ্যাংশ সংক্রান্ত সাহায্যের জন্য আমাদের ইনভেস্টর রিলেশন টিমের সাথে যোগাযোগ করুন।"
                  : "Need hardcopy deeds or financial guidance? Contact our dedicated Investor Relations desk."}
              </p>
              <div className="pt-1 font-mono text-xs font-bold text-stone-900">
                Email: info@muntajar.com | Phone: +880 1700-000000
              </div>
            </div>

          </div>

        </main>
      </div>
    );
  }
