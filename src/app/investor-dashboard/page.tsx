"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Award,
  Download,
  Share2,
  Copy,
  Check,
  Calendar,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  DollarSign,
  PieChart,
  Mail,
  Newspaper,
  Printer,
  X,
  CreditCard,
  QrCode,
  Landmark,
  Lock,
  Key,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { InvestorInvoice } from "@/components/investors/investor-invoice";
import { DigitalCertificate } from "@/components/investors/digital-certificate";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { useLang } from "@/context/lang-context";
import { cn } from "@/lib/utils";
import {
  getStoredInvestorData,
  submitPayoutRequest,
  type Investor,
  type ExecutiveLetter,
  type InvestorConfig,
  type PayoutRequest,
} from "@/lib/investor-store";

// Initial Demo Withdrawal Records
const INITIAL_WITHDRAWALS = [
  { id: "WTH-9921", date: "Aug 22, 2026", method: "bKash (01712-***678)", amount: 2000, status: "Completed", tranId: "BK9928190" },
  { id: "WTH-9918", date: "Aug 15, 2026", method: "City Bank (A/C: 1102***891)", amount: 4000, status: "Completed", tranId: "CBL8829102" },
];

function InvestorDashboardContent() {
  const searchParams = useSearchParams();
  const { lang } = useLang();
  const isBn = lang === "bn";

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"portfolio" | "affiliate" | "newsletter" | "documents">("portfolio");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Dynamic store data from Investor Admin
  const [companyLetters, setCompanyLetters] = useState<ExecutiveLetter[]>([]);
  const [payoutsList, setPayoutsList] = useState<PayoutRequest[]>([]);
  const [investorConfig, setInvestorConfig] = useState<InvestorConfig>({
    ticketPriceBDT: 20000,
    projectedMultiplier: 1.6,
    nextDividendPayout: "Oct 15, 2026",
    dividendCycleLabel: "Q3 2026 Distribution Cycle",
    shareClass: "Class A Seed Preferred Equity",
    referralCommissionPercent: 5,
    promoCode: "MUNTAJAR-SEED88",
    referralBaseLink: "https://muntajar.com/investors?ref=MJR-INV-8842",
  });

  // Investor User State
  const [investorUser, setInvestorUser] = useState<{
    name: string;
    email: string;
    tickets: number;
    amount: number;
    deedId: string;
    serialNumber: string;
  }>({
    name: "Dr. Anisur Rahman",
    email: "anis.rahman@example.com",
    tickets: 5,
    amount: 100000,
    deedId: "MJR-2026-8842",
    serialNumber: "MNT-SEC-2026-08942",
  });

  // Sync auth & store on mount
  useEffect(() => {
    // 1. Load stored data
    const loadStoreData = () => {
      const stored = getStoredInvestorData();
      if (stored.letters) setCompanyLetters(stored.letters);
      if (stored.config) setInvestorConfig(stored.config);
      if (stored.payouts) setPayoutsList(stored.payouts);
    };

    loadStoreData();

    // 2. Check session authentication ONLY — never trust URL params for auth
    const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("muntajar_investor_auth") : null;

    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        // Validate the session token has the required fields
        if (parsed && parsed.email && parsed.deedId && parsed.token) {
          setInvestorUser(parsed);
          setIsAuthenticated(true);
        } else {
          // Malformed session — clear it
          sessionStorage.removeItem("muntajar_investor_auth");
          setIsAuthenticated(false);
        }
      } catch (err) {
        sessionStorage.removeItem("muntajar_investor_auth");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsCheckingAuth(false);

    window.addEventListener("muntajar-investor-data-updated", loadStoreData);
    return () => window.removeEventListener("muntajar-investor-data-updated", loadStoreData);
  }, [searchParams]);

  // Login handler
  const handleInvestorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const localData = getStoredInvestorData();
      const res = await fetch("/api/investors/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          portalType: "investor",
          localInvestors: localData.investors,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Login failed. Please check your credentials.");
        setAuthLoading(false);
        return;
      }

      setInvestorUser(data.user);
      setIsAuthenticated(true);
      sessionStorage.setItem("muntajar_investor_auth", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
      setAuthLoading(false);
    } catch (err) {
      toast.error("Network error authenticating investor.");
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("muntajar_investor_auth");
    toast.info("Logged out from Investor Dashboard.");
  };

  // Affiliate state
  const [balance, setBalance] = useState(0);
  const [withdrawForm, setWithdrawForm] = useState({
    method: "bKash",
    accountNumber: "",
    amount: "2000",
  });

  // Build real referral link using this investor's deedId
  const refLink = investorUser?.deedId
    ? `${typeof window !== "undefined" ? window.location.origin : "https://muntajar.com"}/investors?ref=${investorUser.deedId}`
    : investorConfig.referralBaseLink;
  const promoCode = investorConfig.promoCode;

  // Compute referrals from the stored investor list
  const [allInvestors, setAllInvestors] = useState<Investor[]>([]);
  useEffect(() => {
    const loadAll = async () => {
      try {
        const res = await fetch("/api/investors/admin");
        const json = await res.json();
        if (json.success) setAllInvestors(json.data.investors || []);
      } catch {
        const local = getStoredInvestorData();
        setAllInvestors(local.investors);
      }
    };
    if (isAuthenticated) loadAll();
  }, [isAuthenticated]);

  const myReferrals = investorUser?.deedId
    ? allInvestors.filter((inv) => inv.referredBy === investorUser.deedId)
    : [];

  const commissionRate = investorConfig.referralCommissionPercent / 100;
  const totalEarned = myReferrals.reduce((sum, inv) => sum + inv.amount * commissionRate, 0);

  // Keep balance in sync with earned commissions
  useEffect(() => {
    if (totalEarned > 0) setBalance(totalEarned);
  }, [totalEarned]);

  const copyRefLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopiedLink(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(true);
    toast.success("Promo code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmt = parseInt(withdrawForm.amount, 10);
    if (isNaN(withdrawAmt) || withdrawAmt <= 0 || withdrawAmt > balance) {
      toast.error("Invalid withdrawal amount or exceeds available balance.");
      return;
    }

    const newRecord = submitPayoutRequest({
      investorName: investorUser.name,
      method: withdrawForm.method,
      accountNumber: withdrawForm.accountNumber,
      amount: withdrawAmt,
    });

    setBalance((prev) => prev - withdrawAmt);
    toast.success(`Payout request ${newRecord.id} of ৳${withdrawAmt.toLocaleString()} BDT submitted to Admin!`);
    setShowWithdrawModal(false);
    setWithdrawForm({ method: "bKash", accountNumber: "", amount: "2000" });
  };

  // ── AUTHENTICATION GATE ──
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center text-stone-900 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#EA580C]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-stone-900 font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
        <Toaster position="top-right" richColors />
        <Navbar />

        <main className="pt-28 pb-20 sm:pt-36 sm:pb-28 flex-1 flex items-center justify-center px-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-35" />

          <div className="w-full max-w-md bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-9 shadow-xl space-y-6 text-left relative z-10">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF5ED] border border-[#FDDBC9] flex items-center justify-center text-[#EA580C] mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                Investor Portal Login
              </h2>
              <p className="text-xs text-stone-500 font-medium max-w-xs mx-auto">
                Sign in with your email &amp; generated password sent after payment verification.
              </p>
            </div>

            <form onSubmit={handleInvestorLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Investor Email / Deed ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
                    placeholder="anis.rahman@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Unlock Investor Portal →
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100 text-center text-[11px] text-stone-500 font-medium">
              <p>Forgot credentials? Check your inbox or contact moderator.</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ── AUTHENTICATED DASHBOARD ──
  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950 flex flex-col justify-between">
      <Toaster position="top-right" richColors />
      <Navbar />

      <main className="pt-28 pb-20 sm:pt-36 sm:pb-28 flex-1">
        {/* Subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-35" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

          {/* ── TOP WELCOME BANNER ── */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isBn ? "ভেরিফাইড এঞ্জেল পার্টনার" : "Verified Angel Shareholder"}</span>
                </span>
                <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                  Deed ID: #{investorUser.deedId}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
                {isBn ? `স্বাগতম, ${investorUser.name}` : `Welcome, ${investorUser.name}`}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-normal">
                {isBn
                  ? "আপনার পোর্টফোলিও পারফরম্যান্স, ডিভিডেন্ড শিডিউল, এবং অ্যাফিলিয়েট কমিশন ট্র্যাক করুন।"
                  : "Track your equity valuation, scheduled dividend distributions, affiliate earnings, and company letters."}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF9F7] hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
              >
                <Printer className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>{isBn ? "ট্যাক্স ইনভয়েস দেখুন" : "Tax Invoice"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? "ডিজিটাল সনদপত্র" : "Share Deed Certificate"}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                title="Log Out"
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer select-none flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          {/* ── NAVIGATION TABS ── */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto select-none">
            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "portfolio"
                  ? "bg-stone-950 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <PieChart className="w-4 h-4" />
              <span>{isBn ? "পোর্টফোলিও ও রিটার্ন" : "Portfolio & Valuation"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("affiliate")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "affiliate"
                  ? "bg-stone-950 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <Wallet className="w-4 h-4" />
              <span>{isBn ? "অ্যাফিলিয়েট ড্যাশবোর্ড" : "Affiliate & Commission"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("newsletter")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "newsletter"
                  ? "bg-stone-950 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <Newspaper className="w-4 h-4" />
              <span>{isBn ? "কোম্পানি রিপোর্ট ও নিউজলেটার" : "Company Briefings & Reports"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "documents"
                  ? "bg-stone-950 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>{isBn ? "লিগ্যাল ও লিগ্যাসি ডকুমেন্টস" : "Legal Deed & Proofs"}</span>
            </button>
          </div>

          {/* ── TAB 1: PORTFOLIO & VALUATION ── */}
          {activeTab === "portfolio" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Invested Capital</span>
                    <DollarSign className="w-4 h-4 text-[#EA580C]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-950">৳{investorUser.amount.toLocaleString()}</span>
                    <span className="text-xs font-bold text-stone-400">BDT</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">{investorUser.tickets} Ticket{investorUser.tickets > 1 ? "s" : ""} Owned</p>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Target Valuation</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-600">
                      ৳{Math.round(investorUser.amount * investorConfig.projectedMultiplier).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">BDT</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">+{Math.round((investorConfig.projectedMultiplier - 1) * 100)}% Target Multiple</p>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Next Dividend Distribution</span>
                    <Calendar className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-stone-950">{investorConfig.nextDividendPayout}</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium truncate">{investorConfig.dividendCycleLabel}</p>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Statutory Share Class</span>
                    <ShieldCheck className="w-4 h-4 text-stone-700" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-stone-950">Seed Preferred</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium truncate">{investorConfig.shareClass}</p>
                </div>
              </div>

              {/* Performance Timeline Card */}
              <div className="bg-stone-950 text-white rounded-3xl p-7 sm:p-8 shadow-xl border border-stone-800 text-left space-y-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#EA580C]/20 text-[#FF7A30] border border-[#EA580C]/40 text-xs font-bold">
                      Seed Growth Roadmap
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
                      Muntajar Capital Growth Milestones
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-stone-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                    Share Deed Ref: #{investorUser.deedId}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                    <span className="text-xs font-bold text-amber-400">Phase 1: Seed Entry</span>
                    <p className="text-xl font-bold text-white">৳{investorUser.amount.toLocaleString()} BDT</p>
                    <p className="text-xs text-stone-400">Issued at ৳{investorConfig.ticketPriceBDT.toLocaleString()}/ticket</p>
                  </div>
                  <div className="space-y-2 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                    <span className="text-xs font-bold text-emerald-400">Phase 2: Distribution</span>
                    <p className="text-xl font-bold text-white">{investorConfig.nextDividendPayout}</p>
                    <p className="text-xs text-stone-400">{investorConfig.dividendCycleLabel}</p>
                  </div>
                  <div className="space-y-2 p-4 rounded-2xl bg-[#EA580C]/20 border border-[#EA580C]/40">
                    <span className="text-xs font-bold text-[#FF7A30]">Phase 3: Series A Target</span>
                    <p className="text-xl font-bold text-white">৳{Math.round(investorUser.amount * investorConfig.projectedMultiplier).toLocaleString()} BDT</p>
                    <p className="text-xs text-stone-300">+{Math.round((investorConfig.projectedMultiplier - 1) * 100)}% Target Appreciation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 2: AFFILIATE DASHBOARD ── */}
          {activeTab === "affiliate" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Balance Card */}
                <div className="bg-white rounded-3xl border border-stone-200/90 p-7 text-left space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Available Commission</span>
                    <Wallet className="w-5 h-5 text-[#EA580C]" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-stone-950">৳{balance.toLocaleString()} BDT</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium">Earn {investorConfig.referralCommissionPercent}% on every investor ticket referred</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(true)}
                    className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md select-none"
                  >
                    Request Payout →
                  </button>
                </div>

                {/* Referral Link Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/90 p-7 text-left space-y-4 shadow-xs">
                  <div>
                    <h4 className="text-lg font-bold text-stone-950">Your Angel Referral Link</h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Share your unique referral link to invite fellow investors to Muntajar.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      readOnly
                      value={refLink}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-xs font-mono font-bold text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={copyRefLink}
                      className="px-5 py-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* ── REFERRED INVESTORS TABLE ── */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-7 text-left space-y-4 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-stone-950">Referred Investors</h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Investors who joined via your referral link within 24 hours.
                      Commission rate: <strong>{investorConfig.referralCommissionPercent}%</strong> per ticket value.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">Total Earned</span>
                    <span className="text-xl font-black text-[#EA580C]">৳{totalEarned.toLocaleString()} BDT</span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Investor Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Tickets</th>
                        <th className="py-3 px-4">Investment</th>
                        <th className="py-3 px-4">Date Joined</th>
                        <th className="py-3 px-4 text-right">Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {myReferrals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-stone-400 text-xs font-medium">
                            No referrals yet. Share your link and earn {investorConfig.referralCommissionPercent}% commission on every investment.
                          </td>
                        </tr>
                      ) : (
                        myReferrals.map((ref) => (
                          <tr key={ref.id} className="hover:bg-stone-50/50">
                            <td className="py-3.5 px-4 font-bold text-stone-950">{ref.name}</td>
                            <td className="py-3.5 px-4 text-stone-500 text-xs">{ref.email}</td>
                            <td className="py-3.5 px-4 font-medium text-stone-700">{ref.tickets}</td>
                            <td className="py-3.5 px-4 font-bold text-stone-950">৳{ref.amount.toLocaleString()} BDT</td>
                            <td className="py-3.5 px-4 text-stone-500">{ref.joinDate}</td>
                            <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                              +৳{Math.round(ref.amount * commissionRate).toLocaleString()} BDT
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payout History Table */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-7 text-left space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-stone-950">Payout Activity</h4>
                    <p className="text-xs text-stone-500">Real-time settlement to your bKash, Nagad, or Bank Account.</p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">Payout ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Method / Account</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {payoutsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-stone-400 text-xs">No payout requests yet.</td>
                        </tr>
                      ) : (
                        payoutsList.map((w) => (
                          <tr key={w.id} className="hover:bg-stone-50/50">
                            <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{w.id}</td>
                            <td className="py-3.5 px-4 text-stone-600">{w.date}</td>
                            <td className="py-3.5 px-4 font-medium text-stone-800">{w.method}</td>
                            <td className="py-3.5 px-4 font-bold text-stone-950">৳{w.amount.toLocaleString()} BDT</td>
                            <td className="py-3.5 px-4 text-right">
                              <span
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider",
                                  w.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                )}
                              >
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 3: COMPANY BRIEFINGS ── */}
          {activeTab === "newsletter" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-8 text-left space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Executive Company Briefings</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Official financial audits, operational updates, and board letters for Muntajar angel partners.
                  </p>
                </div>

                <div className="space-y-4">
                  {companyLetters.map((lettr) => (
                    <div
                      key={lettr.id}
                      className="p-5 rounded-2xl bg-[#FAF9F7] border border-stone-200 space-y-2 hover:border-stone-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
                          {lettr.category}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-500">{lettr.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-950">{lettr.title}</h4>
                      <p className="text-xs text-stone-600">{lettr.preview}</p>
                      <span className="text-[11px] text-stone-400 block pt-1">Author: {lettr.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 4: LEGAL PROOFS & DEED ── */}
          {activeTab === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-8 text-left space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Legal Deeds &amp; Proof of Allocation</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Download official PDF share certificates, statutory tax invoices, and partnership deeds.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#FAF9F7] border border-stone-200 flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-stone-950">Share Deed Certificate (PDF)</h5>
                      <p className="text-xs text-stone-500">Deed #{investorUser.deedId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
                    >
                      View &amp; Print
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF9F7] border border-stone-200 flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-stone-950">Official Tax Invoice</h5>
                      <p className="text-xs text-stone-500">SSL Transaction Proof</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInvoiceModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold hover:bg-[#D94E06] transition-colors"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* ── MODALS ── */}
      {showInvoiceModal && (
        <Dialog open={showInvoiceModal} onOpenChange={(v) => !v && setShowInvoiceModal(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white border-stone-200">
            <InvestorInvoice
              investorName={investorUser.name}
              investorEmail={investorUser.email}
              invoiceNo={investorUser.deedId}
              tickets={investorUser.tickets}
              amount={investorUser.amount}
              transactionId="SSL-TXN-2026-8842"
              onClose={() => setShowInvoiceModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showCertificateModal && (
        <Dialog open={showCertificateModal} onOpenChange={(v) => !v && setShowCertificateModal(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-stone-950 border-amber-500/30">
            <DigitalCertificate
              investorName={investorUser.name}
              investorId={investorUser.deedId}
              tickets={investorUser.tickets}
              amount={investorUser.amount}
              issueDate="August 2026"
            />
          </DialogContent>
        </Dialog>
      )}

      {showWithdrawModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-md w-full text-left space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-950">Request Affiliate Payout</h3>
              <p className="text-xs text-stone-500">Available Balance: ৳{balance.toLocaleString()} BDT</p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Payout Method
                </label>
                <select
                  value={withdrawForm.method}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#EA580C]"
                >
                  <option value="bKash">bKash (Personal / Agent)</option>
                  <option value="Nagad">Nagad (Personal / Agent)</option>
                  <option value="Rocket">Rocket</option>
                  <option value="City Bank">City Bank Account</option>
                  <option value="BRAC Bank">BRAC Bank Account</option>
                  <option value="Eastern Bank">Eastern Bank Ltd.</option>
                  <option value="Islami Bank">Islami Bank Bangladesh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Account / Mobile Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01712-345678"
                  value={withdrawForm.accountNumber}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Withdrawal Amount (BDT)
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  max={balance}
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer select-none"
              >
                Submit Payout Request →
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function InvestorDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7] text-stone-900 font-sans">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Loading Investor Dashboard…
            </p>
          </div>
        </div>
      }
    >
      <InvestorDashboardContent />
    </React.Suspense>
  );
}
