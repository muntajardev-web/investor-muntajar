"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  FolderLock,
  Compass,
  MessageSquareText,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PortalBadge } from "./design-system/ui-components";

interface PortalShellProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  activeTab?: string;
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", href: "/work/employment", icon: LayoutDashboard },
  { id: "jobs", label: "Matched Overseas Jobs", href: "/work/employment/jobs", icon: Briefcase, badge: "6 New" },
  { id: "documents", label: "Document Vault", href: "/work/employment/documents", icon: FolderLock, badge: "7/8 Verified" },
  { id: "tracker", label: "Application Tracker", href: "/work/employment/tracker", icon: Compass },
  { id: "advisor", label: "Advisor Direct Desk", href: "/work/employment/advisor", icon: MessageSquareText },
  { id: "settings", label: "Security & Settings", href: "/work/employment/settings", icon: Settings },
];

export function WorkerProfessionalPortalShell({
  children,
  user,
  activeTab,
}: PortalShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const userName = user?.name || "Mahmudul Hasan";
  const userEmail = user?.email || "mahmudul.h@muntajar.com";

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-950 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* ─── TOP SYSTEM HEADER ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left Brand Title */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center text-white font-extrabold text-sm tracking-widest">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-stone-950 flex items-center gap-1.5">
                MUNTAJAR <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Worker Portal</span>
              </span>
              <span className="text-[10px] text-stone-500 font-normal">Global Mobility Command</span>
            </div>
          </Link>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search jobs, documents, visas..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F7] rounded-full border border-stone-200 text-xs text-stone-950 focus:outline-none focus:border-stone-950 transition-colors"
          />
        </div>

        {/* Right Action Icons & User Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Applicant ID: MN-84920
          </div>

          {/* Notifications Button */}
          <button className="w-9 h-9 rounded-full bg-[#FAF9F7] border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-full bg-[#FAF9F7] border border-stone-200 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                {userName.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 mr-1 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-none p-2 space-y-1 z-50"
                >
                  <div className="p-3 border-b border-stone-100 space-y-0.5">
                    <p className="text-sm font-bold text-stone-950 truncate">{userName}</p>
                    <p className="text-xs text-stone-500 truncate font-normal">{userEmail}</p>
                  </div>
                  <Link
                    href="/work/employment/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF9F7] hover:text-stone-950 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-stone-500" />
                    Security & Verification
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-[#FAF9F7] border border-stone-200 flex items-center justify-center text-stone-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* ─── MAIN BODY WITH SIDEBAR ─────────────────────────────── */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 gap-8">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-3 space-y-1">
            <span className="px-3 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Navigation Menu
            </span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (activeTab === item.id);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150",
                    isActive
                      ? "bg-stone-950 text-white shadow-none"
                      : "text-stone-700 hover:bg-[#FAF9F7] hover:text-stone-950",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-stone-500")} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-tight",
                        isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Dedicated Mobility Counselor Card */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Senior Advisor Assigned
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-900 text-xs">
                AH
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-950 truncate">Dr. Ariful Hasan</p>
                <p className="text-[11px] text-stone-500 truncate font-normal">Immigration Counsel</p>
              </div>
            </div>
            <Link
              href="/work/employment/advisor"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FAF9F7] border border-stone-200 text-xs font-bold text-stone-900 hover:bg-stone-950 hover:text-white transition-colors"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              Direct Message
            </Link>
          </div>
        </aside>

        {/* MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-stone-200 p-4 z-40 space-y-2 shadow-xs"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all",
                      isActive ? "bg-stone-950 text-white" : "text-stone-800 hover:bg-[#FAF9F7]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN PORTAL CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
}
