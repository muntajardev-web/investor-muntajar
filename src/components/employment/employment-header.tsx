"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  HelpCircle,
  LogOut,
  User,
  FileText,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  X,
  Search,
  MessageSquare,
} from "lucide-react";
import type { AuthUser } from "@/types";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";

interface EmploymentHeaderProps {
  user: AuthUser;
  unreadCount?: number;
  onMenuClick: () => void;
  pageTitle?: string;
}

export function EmploymentHeader({
  user,
  unreadCount = 2,
  onMenuClick,
}: EmploymentHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  let clerk: any = null;
  try {
    clerk = useClerk();
  } catch {
    // Fallback if ClerkProvider is not wrapping in local dev
  }

  const initial = (user.name ?? user.email).charAt(0).toUpperCase();
  const firstName = user.name?.split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      if (clerk?.signOut) {
        await clerk.signOut({ redirectUrl: "/" });
        return;
      }
    } catch {
      // Ignore fallback
    }
    window.location.href = "/";
  };

  return (
    <header className="z-30 shrink-0 border-b border-stone-200 bg-white no-print">
      <div className="mx-auto flex h-14 max-w-[1720px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: hamburger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right Actions & Search Bar */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Search Bar */}
          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search jobs, companies, countries..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-stone-400 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Message Icon */}
          <Link
            href="/work/employment/advisor"
            className="rounded-xl p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            title="Messages"
          >
            <MessageSquare className="w-4.5 h-4.5 text-stone-600" />
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-xl p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-stone-200 shadow-xl p-4 space-y-3 z-50">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="text-xs font-extrabold text-stone-950 uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Documents Verified</span>
                    </div>
                    <p className="text-stone-600 text-[11px]">Bangladeshi Passport & NID Smart Card verified with 98% AI confidence.</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-700">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>3 Job Matches Found</span>
                    </div>
                    <p className="text-stone-600 text-[11px]">Senior Electrical Inspector roles open in UAE & Saudi Arabia.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="rounded-xl p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            title="Help & Support"
          >
            <HelpCircle className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} strokeWidth={2} />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-stone-200 mx-1" />

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 transition-all cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-xs font-bold text-white select-none shadow-2xs">
                {initial}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-stone-950 leading-none">{user.name ?? "Demo Professional"}</p>
                <p className="text-[10px] text-stone-500 mt-0.5 leading-none font-medium">Verified Candidate</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
            </button>

            {/* Profile Menu Box */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-stone-200 shadow-xl p-2 space-y-1 z-50">
                <div className="p-3 border-b border-stone-100 space-y-0.5">
                  <p className="text-xs font-extrabold text-stone-950">{user.name ?? "Demo Professional"}</p>
                  <p className="text-[11px] text-stone-500 truncate">{user.email ?? "candidate@muntajar.com"}</p>
                </div>

                <Link
                  href="/work/employment/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-100 transition-all"
                >
                  <User className="w-4 h-4 text-stone-500" />
                  <span>Worker Profile</span>
                </Link>

                <Link
                  href="/work/employment/builder"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-100 transition-all"
                >
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>Resume Builder Studio</span>
                </Link>

                <Link
                  href="/work/employment/jobs"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-100 transition-all"
                >
                  <Briefcase className="w-4 h-4 text-stone-500" />
                  <span>Job Matches</span>
                </Link>

                <div className="pt-1 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-950">Overseas Mobility Assistance</h3>
              <button type="button" onClick={() => setHelpOpen(false)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Need assistance with document verification, passport audit, or resume building? Our AI Mobility Agent is available 24/7.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="font-bold text-stone-900">Support Desk Email</p>
                <p className="text-stone-600">support@muntajar.com</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="w-full py-3 rounded-2xl bg-stone-950 text-white font-extrabold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
