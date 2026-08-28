"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  ChevronRight,
  Filter,
  Save,
  Clock,
  Send,
  Eye,
  ArrowLeft,
  X,
  CreditCard,
  PieChart,
  Newspaper,
  FileCode,
  Sparkles,
  Lock,
  Mail,
  Key,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import {
  getStoredInvestorData,
  saveStoredInvestorData,
  type Investor,
  type ExecutiveLetter,
  type PayoutRequest,
  type InvestorConfig,
} from "@/lib/investor-store";
import { cn } from "@/lib/utils";

export default function InvestorAdminPage() {
  // ── AUTHENTICATION STATE ──
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState("admin@muntajar.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"directory" | "metrics" | "letters" | "payouts">("directory");
  
  // Local state initialized from store
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [letters, setLetters] = useState<ExecutiveLetter[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [config, setConfig] = useState<InvestorConfig>({
    ticketPriceBDT: 20000,
    projectedMultiplier: 1.6,
    nextDividendPayout: "Oct 15, 2026",
    dividendCycleLabel: "Q3 2026 Distribution Cycle",
    shareClass: "Class A Seed Preferred Equity",
    referralCommissionPercent: 5,
    promoCode: "MUNTAJAR-SEED88",
    referralBaseLink: "https://muntajar.com/investors?ref=MJR-INV-8842",
  });

  // Search & Filter state for Investors
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VIP" | "CONFIRMED" | "PENDING">("ALL");

  // Modal states
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  
  const [showAddLetterModal, setShowAddLetterModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState<ExecutiveLetter | null>(null);

  // Form inputs for new/edit investor
  const [investorForm, setInvestorForm] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1,
    status: "CONFIRMED" as "CONFIRMED" | "PENDING" | "VIP",
    paymentMethod: "Bank Transfer",
    transactionId: "",
  });

  // Form inputs for new/edit letter
  const [letterForm, setLetterForm] = useState({
    title: "",
    author: "Muntajar Executive Board",
    category: "Operational Audit",
    preview: "",
    readTime: "4 min read",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  });

  // Load auth & store on mount
  useEffect(() => {
    const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("muntajar_admin_auth") : null;
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);

    // Load local store first (fast)
    const localData = getStoredInvestorData();
    setInvestors(localData.investors);
    setLetters(localData.letters);
    setPayouts(localData.payouts);
    setConfig(localData.config);

    // Fetch server-side store (includes newly registered investors from OTP flow)
    const fetchServerStore = async () => {
      try {
        const res = await fetch("/api/investors/admin");
        const json = await res.json();
        if (json.success && json.data) {
          const serverData = json.data;

          // Merge: prefer server records, then add any local-only records
          const merged = (data: { id: string }[], server: { id: string }[]) => {
            const serverIds = new Set(server.map((x) => x.id));
            const localOnly = data.filter((x) => !serverIds.has(x.id));
            return [...server, ...localOnly];
          };

          const mergedInvestors = merged(localData.investors, serverData.investors) as typeof localData.investors;
          const mergedPayouts = merged(localData.payouts, serverData.payouts) as typeof localData.payouts;
          const mergedLetters = merged(localData.letters, serverData.letters) as typeof localData.letters;

          setInvestors(mergedInvestors);
          setPayouts(mergedPayouts);
          setLetters(mergedLetters);
          setConfig(serverData.config || localData.config);
        }
      } catch (err) {
        // Silent — already showing local data
      }
    };

    fetchServerStore();

    const loadStore = () => {
      const refreshed = getStoredInvestorData();
      setInvestors(refreshed.investors);
      setLetters(refreshed.letters);
      setPayouts(refreshed.payouts);
      setConfig(refreshed.config);
      // Re-fetch server to pick up any new OTP registrations
      fetchServerStore();
    };

    window.addEventListener("muntajar-investor-data-updated", loadStore);
    return () => window.removeEventListener("muntajar-investor-data-updated", loadStore);
  }, []);

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const res = await fetch("/api/investors/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          portalType: "admin",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Authentication failed.");
        setAuthLoading(false);
        return;
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("muntajar_admin_auth", "true");
      toast.success("Authenticated! Welcome to Muntajar Investor Admin Console.");
      setAuthLoading(false);
    } catch (err) {
      toast.error("Network error authenticating admin.");
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("muntajar_admin_auth");
    toast.info("Logged out from Investor Admin Console.");
  };

  // Save changes helper
  const updateStore = (updated: {
    investors?: Investor[];
    letters?: ExecutiveLetter[];
    payouts?: PayoutRequest[];
    config?: InvestorConfig;
  }) => {
    if (updated.investors) setInvestors(updated.investors);
    if (updated.letters) setLetters(updated.letters);
    if (updated.payouts) setPayouts(updated.payouts);
    if (updated.config) setConfig(updated.config);

    saveStoredInvestorData(updated);

    fetch("/api/investors/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  // Filter investors
  const filteredInvestors = investors.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.deedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.phone.includes(searchQuery);

    const matchesFilter = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // KPI Calculations
  const totalRaisedBDT = investors.reduce((sum, inv) => sum + inv.amount, 0);
  const totalTickets = investors.reduce((sum, inv) => sum + inv.tickets, 0);
  const pendingPayoutsCount = payouts.filter((p) => p.status === "Processing").length;

  // Handlers for Investor CRUD
  const handleSaveInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketsNum = Math.max(1, parseInt(investorForm.tickets.toString(), 10) || 1);
    const amountNum = ticketsNum * config.ticketPriceBDT;

    if (editingInvestor) {
      const updated = investors.map((inv) =>
        inv.id === editingInvestor.id
          ? {
              ...inv,
              name: investorForm.name,
              email: investorForm.email,
              phone: investorForm.phone,
              tickets: ticketsNum,
              amount: amountNum,
              status: investorForm.status,
              paymentMethod: investorForm.paymentMethod,
              transactionId: investorForm.transactionId || inv.transactionId,
            }
          : inv
      );
      updateStore({ investors: updated });
      toast.success(`Investor record updated for ${investorForm.name}`);
    } else {
      const newId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      const randomSeq = Math.floor(10000 + Math.random() * 90000);
      const newInv: Investor = {
        id: newId,
        name: investorForm.name,
        email: investorForm.email,
        phone: investorForm.phone,
        tickets: ticketsNum,
        amount: amountNum,
        deedId: `MJR-2026-${Math.floor(8000 + Math.random() * 1000)}`,
        serialNumber: `MNT-SEC-2026-${randomSeq}`,
        status: investorForm.status,
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        paymentMethod: investorForm.paymentMethod,
        transactionId: investorForm.transactionId || `SSL-TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      updateStore({ investors: [newInv, ...investors] });
      toast.success(`New investor ${investorForm.name} added successfully!`);
    }

    setShowAddInvestorModal(false);
    setEditingInvestor(null);
  };

  const handleDeleteInvestor = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove investor "${name}"?`)) {
      const updated = investors.filter((inv) => inv.id !== id);
      updateStore({ investors: updated });
      toast.success(`Investor "${name}" removed.`);
    }
  };

  const handleToggleInvestorStatus = (id: string) => {
    const updated = investors.map((inv) => {
      if (inv.id === id) {
        const nextStatus: Investor["status"] =
          inv.status === "CONFIRMED" ? "VIP" : inv.status === "VIP" ? "PENDING" : "CONFIRMED";
        return { ...inv, status: nextStatus };
      }
      return inv;
    });
    updateStore({ investors: updated });
    toast.success("Investor status updated.");
  };

  // Handlers for Letter CRUD
  const handleSaveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLetter) {
      const updated = letters.map((l) =>
        l.id === editingLetter.id
          ? {
              ...l,
              title: letterForm.title,
              author: letterForm.author,
              category: letterForm.category,
              preview: letterForm.preview,
              readTime: letterForm.readTime,
              date: letterForm.date,
            }
          : l
      );
      updateStore({ letters: updated });
      toast.success("Executive letter updated.");
    } else {
      const newLetter: ExecutiveLetter = {
        id: `letter-${Date.now()}`,
        title: letterForm.title,
        author: letterForm.author,
        category: letterForm.category,
        preview: letterForm.preview,
        readTime: letterForm.readTime,
        date: letterForm.date,
      };
      updateStore({ letters: [newLetter, ...letters] });
      toast.success("New executive letter published!");
    }

    setShowAddLetterModal(false);
    setEditingLetter(null);
  };

  const handleDeleteLetter = (id: string) => {
    if (confirm("Delete this executive letter?")) {
      const updated = letters.filter((l) => l.id !== id);
      updateStore({ letters: updated });
      toast.success("Executive letter deleted.");
    }
  };

  // Payout Request Handlers
  const handleApprovePayout = (id: string) => {
    const updated = payouts.map((p) => (p.id === id ? { ...p, status: "Completed" as const } : p));
    updateStore({ payouts: updated });
    toast.success(`Payout ${id} approved and marked as Completed.`);
  };

  const handleDeclinePayout = (id: string) => {
    const updated = payouts.map((p) => (p.id === id ? { ...p, status: "Declined" as const } : p));
    updateStore({ payouts: updated });
    toast.error(`Payout ${id} declined.`);
  };

  const handleDeletePayout = (id: string) => {
    if (confirm(`Are you sure you want to delete payout request "${id}"?`)) {
      const updated = payouts.filter((p) => p.id !== id);
      updateStore({ payouts: updated });
      toast.success(`Payout request ${id} deleted.`);
    }
  };

  // Save config form
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore({ config });
    toast.success("Investor portal settings & data metrics updated!");
  };

  // ── AUTHENTICATION GATE ──
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0F0F11] flex items-center justify-center text-white">
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
          {/* Subtle texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-35" />

          <div className="w-full max-w-md bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-9 shadow-xl space-y-6 text-left relative z-10">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF5ED] border border-[#FDDBC9] flex items-center justify-center text-[#EA580C] mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                Investor Admin Login
              </h2>
              <p className="text-xs text-stone-500 font-medium max-w-xs mx-auto">
                Authorized executive portal for Muntajar shareholding &amp; investor administration.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
                    placeholder="admin@muntajar.com"
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
                    Verifying Credentials…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Unlock Executive Console →
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100 text-center text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bcrypt Cost 16 Password Protected</span>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ── AUTHENTICATED ADMIN CONSOLE ──
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950 flex flex-col justify-between">
      <Toaster position="top-right" richColors />
      <Navbar />

      <main className="pt-28 pb-20 sm:pt-36 sm:pb-28 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* ── TOP ADMIN BANNER ── */}
          <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#EA580C]/20 blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C]/20 text-[#FF7A30] border border-[#EA580C]/40 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Executive Governance Console</span>
                </span>
                <span className="text-xs font-mono font-bold text-stone-400 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Protected: /investor-admin</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Investor &amp; Shareholder Control Center
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
                Manage registered angel investors, edit valuation data shown to investors, publish company briefings, and process affiliate payouts.
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10 flex-wrap">
              <Link
                href="/investor-dashboard"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all border border-stone-700 shadow-sm"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>View Investor Portal →</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setInvestorForm({
                    name: "",
                    email: "",
                    phone: "",
                    tickets: 1,
                    status: "CONFIRMED",
                    paymentMethod: "Bank Transfer",
                    transactionId: "",
                  });
                  setEditingInvestor(null);
                  setShowAddInvestorModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] text-white text-xs font-bold transition-all shadow-md cursor-pointer select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Investor</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                title="Log out of Admin Console"
                className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400 border border-stone-700 text-xs font-bold transition-colors cursor-pointer select-none flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          {/* ── KPI METRIC CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Capital Raised */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Equity Capital Raised</span>
                <DollarSign className="w-4 h-4 text-[#EA580C]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-950">৳{totalRaisedBDT.toLocaleString()}</span>
                <span className="text-xs font-bold text-stone-400">BDT</span>
              </div>
              <p className="text-xs text-stone-500 font-medium">{totalTickets} Total Tickets Allocated</p>
            </div>

            {/* Total Active Investors */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Shareholder Count</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-950">{investors.length}</span>
                <span className="text-xs font-bold text-emerald-600 font-bold">Partners</span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {investors.filter((i) => i.status === "VIP").length} VIP Angel Investors
              </p>
            </div>

            {/* Next Dividend Cycle */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Target Exit Valuation</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#EA580C]">
                  +{Math.round((config.projectedMultiplier - 1) * 100)}%
                </span>
                <span className="text-xs font-bold text-stone-400">Multiple</span>
              </div>
              <p className="text-xs text-stone-500 font-medium truncate">{config.nextDividendPayout}</p>
            </div>

            {/* Pending Payout Requests */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 text-left shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Pending Payout Requests</span>
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-950">{pendingPayoutsCount}</span>
                <span className="text-xs font-bold text-amber-600">Action Required</span>
              </div>
              <p className="text-xs text-stone-500 font-medium">Affiliate commission withdrawals</p>
            </div>

          </div>

          {/* ── TABS NAVIGATION ── */}
          <div className="flex items-center gap-2 border-b border-stone-300 pb-2 overflow-x-auto select-none">
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "directory"
                  ? "bg-stone-950 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <Users className="w-4 h-4" />
              <span>Investors Directory ({investors.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("metrics")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "metrics"
                  ? "bg-stone-950 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <Settings className="w-4 h-4" />
              <span>Edit Data &amp; Metrics Shown to Investors</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("letters")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "letters"
                  ? "bg-stone-950 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <Newspaper className="w-4 h-4" />
              <span>Company Letters &amp; Briefings ({letters.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("payouts")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0",
                activeTab === "payouts"
                  ? "bg-stone-950 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              )}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payout Requests</span>
              {pendingPayoutsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#EA580C] text-white text-[10px] font-bold">
                  {pendingPayoutsCount}
                </span>
              )}
            </button>
          </div>

          {/* ── TAB 1: INVESTORS DIRECTORY ── */}
          {activeTab === "directory" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Controls Bar */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, deed ID or phone…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF9F7] border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                {/* Filter & Add */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1 bg-[#FAF9F7] p-1 rounded-xl border border-stone-200">
                    {(["ALL", "VIP", "CONFIRMED", "PENDING"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          statusFilter === st
                            ? "bg-stone-900 text-white shadow-xs"
                            : "text-stone-600 hover:text-stone-900"
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInvestorForm({
                        name: "",
                        email: "",
                        phone: "",
                        tickets: 1,
                        status: "CONFIRMED",
                        paymentMethod: "Bank Transfer",
                        transactionId: "",
                      });
                      setEditingInvestor(null);
                      setShowAddInvestorModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer select-none"
                  >
                    + Add Investor
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-100/80 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-4 px-5">Investor Name &amp; Contact</th>
                        <th className="py-4 px-5">Tickets / Capital</th>
                        <th className="py-4 px-5">Deed Reference</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5">Joined Date</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredInvestors.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-stone-500 font-medium">
                            No investor records found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredInvestors.map((inv) => (
                          <tr key={inv.id} className="hover:bg-stone-50/60 transition-colors">
                            
                            <td className="py-4 px-5">
                              <div className="font-bold text-stone-950 text-sm">{inv.name}</div>
                              <div className="text-stone-500 text-xs flex items-center gap-2 mt-0.5">
                                <span>{inv.email}</span>
                                <span>•</span>
                                <span>{inv.phone}</span>
                              </div>
                            </td>

                            <td className="py-4 px-5">
                              <div className="font-extrabold text-stone-900">
                                ৳{inv.amount.toLocaleString()} BDT
                              </div>
                              <div className="text-xs text-stone-500 font-medium">
                                {inv.tickets} Ticket{inv.tickets > 1 ? "s" : ""} @ ৳{config.ticketPriceBDT.toLocaleString()}
                              </div>
                            </td>

                            <td className="py-4 px-5">
                              <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                                {inv.deedId}
                              </span>
                              <div className="text-[11px] text-stone-400 mt-1 font-mono">{inv.serialNumber}</div>
                            </td>

                            <td className="py-4 px-5">
                              <button
                                type="button"
                                onClick={() => handleToggleInvestorStatus(inv.id)}
                                className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition-transform hover:scale-105",
                                  inv.status === "VIP"
                                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                                    : inv.status === "CONFIRMED"
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                    : "bg-stone-100 text-stone-700 border border-stone-300"
                                )}
                              >
                                {inv.status}
                              </button>
                            </td>

                            <td className="py-4 px-5 text-stone-600 text-xs font-medium">
                              {inv.joinDate}
                            </td>

                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  title="Edit Investor"
                                  onClick={() => {
                                    setEditingInvestor(inv);
                                    setInvestorForm({
                                      name: inv.name,
                                      email: inv.email,
                                      phone: inv.phone,
                                      tickets: inv.tickets,
                                      status: inv.status,
                                      paymentMethod: inv.paymentMethod,
                                      transactionId: inv.transactionId,
                                    });
                                    setShowAddInvestorModal(true);
                                  }}
                                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  title="Delete Record"
                                  onClick={() => handleDeleteInvestor(inv.id, inv.name)}
                                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

          {/* ── TAB 2: EDIT METRICS SHOWN TO INVESTORS ── */}
          {activeTab === "metrics" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Form Column */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-8 text-left space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">
                    Edit Live Investor Portal Data &amp; Metrics
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Updates made here immediately change the figures, dividend schedule, and ticket prices displayed to investors on `/investor-dashboard`.
                  </p>
                </div>

                <form onSubmit={handleSaveConfig} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Ticket Price (BDT)
                      </label>
                      <input
                        type="number"
                        required
                        value={config.ticketPriceBDT}
                        onChange={(e) => setConfig({ ...config, ticketPriceBDT: parseInt(e.target.value, 10) || 20000 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-bold focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Target Exit Valuation Multiplier (e.g. 1.6 = +60%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={config.projectedMultiplier}
                        onChange={(e) => setConfig({ ...config, projectedMultiplier: parseFloat(e.target.value) || 1.6 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-bold focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Next Dividend Payout Date
                      </label>
                      <input
                        type="text"
                        required
                        value={config.nextDividendPayout}
                        onChange={(e) => setConfig({ ...config, nextDividendPayout: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Dividend Cycle Description
                      </label>
                      <input
                        type="text"
                        required
                        value={config.dividendCycleLabel}
                        onChange={(e) => setConfig({ ...config, dividendCycleLabel: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Statutory Share Class
                      </label>
                      <input
                        type="text"
                        required
                        value={config.shareClass}
                        onChange={(e) => setConfig({ ...config, shareClass: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Referral Commission (%)
                      </label>
                      <input
                        type="number"
                        required
                        value={config.referralCommissionPercent}
                        onChange={(e) => setConfig({ ...config, referralCommissionPercent: parseInt(e.target.value, 10) || 5 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-bold focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md select-none flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Live Changes →</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Column */}
              <div className="space-y-6 text-left">
                <div className="bg-stone-900 text-white rounded-3xl p-6 space-y-4 border border-stone-800 shadow-xl">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Preview Card</span>
                    <span className="text-[10px] font-mono text-stone-400">/investor-dashboard</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold">1 Ticket Value</span>
                      <p className="text-2xl font-black text-white">৳{config.ticketPriceBDT.toLocaleString()} BDT</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold">Target Exit Value (1 Ticket)</span>
                      <p className="text-2xl font-black text-[#FF7A30]">
                        ৳{(config.ticketPriceBDT * config.projectedMultiplier).toLocaleString()} BDT
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold">Next Dividend Payout</span>
                      <p className="text-sm font-bold text-emerald-400">{config.nextDividendPayout}</p>
                      <p className="text-xs text-stone-500">{config.dividendCycleLabel}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold">Class</span>
                      <p className="text-xs font-mono text-stone-300">{config.shareClass}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 3: EXECUTIVE LETTERS & BRIEFINGS ── */}
          {activeTab === "letters" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-8 text-left space-y-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-stone-950">Executive Company Letters</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Publish official financial letters, operational audits, and expansion reports for investors.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLetterForm({
                        title: "",
                        author: "Muntajar Executive Board",
                        category: "Operational Audit",
                        preview: "",
                        readTime: "4 min read",
                        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                      });
                      setEditingLetter(null);
                      setShowAddLetterModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] text-white text-xs font-bold transition-all shadow-sm cursor-pointer select-none flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Letter</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {letters.map((lettr) => (
                    <div
                      key={lettr.id}
                      className="p-5 rounded-2xl bg-[#FAF9F7] border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-stone-300 transition-colors"
                    >
                      <div className="space-y-1.5 text-left max-w-3xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
                            {lettr.category}
                          </span>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500">{lettr.date}</span>
                        </div>
                        <h4 className="text-base font-bold text-stone-950">{lettr.title}</h4>
                        <p className="text-xs text-stone-600 line-clamp-2">{lettr.preview}</p>
                        <span className="text-[11px] text-stone-400 block pt-1">Author: {lettr.author}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLetter(lettr);
                            setLetterForm({
                              title: lettr.title,
                              author: lettr.author,
                              category: lettr.category,
                              preview: lettr.preview,
                              readTime: lettr.readTime,
                              date: lettr.date,
                            });
                            setShowAddLetterModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLetter(lettr.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 4: PAYOUT REQUESTS ── */}
          {activeTab === "payouts" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-8 text-left space-y-5 shadow-xs">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Affiliate Commission Payouts</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Review and approve cash withdrawal requests submitted by angel equity partners.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Payout ID</th>
                        <th className="py-3.5 px-4">Investor Partner</th>
                        <th className="py-3.5 px-4">Method / Account</th>
                        <th className="py-3.5 px-4">Requested Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {payouts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/50">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{p.id}</td>
                          <td className="py-3.5 px-4 font-bold text-stone-950">{p.investorName}</td>
                          <td className="py-3.5 px-4 text-stone-700 font-medium">{p.method}</td>
                          <td className="py-3.5 px-4 font-black text-stone-950">৳{p.amount.toLocaleString()} BDT</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                p.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : p.status === "Processing"
                                  ? "bg-[#FFF5ED] text-[#EA580C] border border-[#FDDBC9]"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              )}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {p.status === "Processing" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApprovePayout(p.id)}
                                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeclinePayout(p.id)}
                                    className="px-3 py-1 rounded-lg bg-stone-200 hover:bg-rose-100 text-stone-700 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                title="Delete Payout Record"
                                onClick={() => handleDeletePayout(p.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* ── MODAL: ADD / EDIT INVESTOR ── */}
      {showAddInvestorModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAddInvestorModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-lg w-full text-left space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowAddInvestorModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-950">
                {editingInvestor ? "Edit Investor Record" : "Add New Angel Investor"}
              </h3>
              <p className="text-xs text-stone-500">
                Enter investor details. Deed reference and serial numbers will be generated automatically.
              </p>
            </div>

            <form onSubmit={handleSaveInvestor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Anisur Rahman"
                  value={investorForm.name}
                  onChange={(e) => setInvestorForm({ ...investorForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anis@example.com"
                    value={investorForm.email}
                    onChange={(e) => setInvestorForm({ ...investorForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+8801711223344"
                    value={investorForm.phone}
                    onChange={(e) => setInvestorForm({ ...investorForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={investorForm.tickets}
                    onChange={(e) => setInvestorForm({ ...investorForm, tickets: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-bold focus:outline-none focus:border-[#EA580C]"
                  />
                  <span className="text-[10px] text-stone-500">
                    Total: ৳{(investorForm.tickets * config.ticketPriceBDT).toLocaleString()} BDT
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Status Category
                  </label>
                  <select
                    value={investorForm.status}
                    onChange={(e) =>
                      setInvestorForm({
                        ...investorForm,
                        status: e.target.value as "CONFIRMED" | "PENDING" | "VIP",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-bold focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="CONFIRMED">CONFIRMED (Active)</option>
                    <option value="VIP">VIP Shareholder</option>
                    <option value="PENDING">PENDING Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Payment Method &amp; Gateway
                </label>
                <input
                  type="text"
                  placeholder="e.g. SSLCommerz / City Bank Transfer"
                  value={investorForm.paymentMethod}
                  onChange={(e) => setInvestorForm({ ...investorForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md select-none"
              >
                {editingInvestor ? "Save Investor Changes →" : "Register Investor →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT EXECUTIVE LETTER ── */}
      {showAddLetterModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAddLetterModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-lg w-full text-left space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowAddLetterModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-950">
                {editingLetter ? "Edit Executive Briefing" : "Publish Executive Letter"}
              </h3>
              <p className="text-xs text-stone-500">
                This report will be listed under "Company Letters &amp; Reports" on the investor dashboard.
              </p>
            </div>

            <form onSubmit={handleSaveLetter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 2026 Expansion & Audit Report"
                  value={letterForm.title}
                  onChange={(e) => setLetterForm({ ...letterForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <select
                    value={letterForm.category}
                    onChange={(e) => setLetterForm({ ...letterForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="Operational Audit">Operational Audit</option>
                    <option value="Financial Letter">Financial Letter</option>
                    <option value="Vision & Strategy">Vision & Strategy</option>
                    <option value="Compliance Update">Compliance Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Author / Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={letterForm.author}
                    onChange={(e) => setLetterForm({ ...letterForm, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Brief Summary / Preview
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize the core takeaways of this update…"
                  value={letterForm.preview}
                  onChange={(e) => setLetterForm({ ...letterForm, preview: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E06] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md select-none"
              >
                {editingLetter ? "Save Report Changes →" : "Publish Briefing →"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
