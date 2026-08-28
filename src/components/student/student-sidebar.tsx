"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { studentNavItems } from "@/lib/student/nav";
import { X, Calendar, ChevronDown, Home } from "lucide-react";

interface StudentSidebarProps {
  open?: boolean;
  onClose?: () => void;
  profileComplete?: boolean;
}

export function StudentSidebar({ open, onClose }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/25 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-svh w-[250px] shrink-0 flex-col border-r border-slate-100 bg-white transition-transform duration-200 lg:static lg:translate-x-0 select-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* ── 1. LOGO HEADER (STYLIZED ORANGE RIBBON M LOGO + MUNTAJAR TITLE) ── */}
        <div className="flex items-center justify-between px-6 pt-7 pb-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* Orange Ribbon M Logo Mark */}
            <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
              <path
                d="M5 23V10C5 8.89543 5.89543 8 7 8C8.10457 8 9 8.89543 9 10V22L16 12L23 22V10C23 8.89543 23.8954 8 25 8C26.1046 8 27 8.89543 27 10V23"
                stroke="url(#orange_m_grad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="orange_m_grad" x1="5" y1="8" x2="27" y2="23" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF5500" />
                  <stop offset="1" stopColor="#FF8800" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Muntajar
            </span>
          </Link>

          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 lg:hidden hover:bg-slate-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── 2. NAVIGATION LIST (ROUNDED-2XL ACTIVE OVERVIEW PILL IN SOFT PEACH) ── */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
          {studentNavItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) && item.href !== "/dashboard";
            const Icon = item.title === "Overview" ? Home : item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                prefetch={false}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[15px] transition-all",
                  active
                    ? "bg-[#FFF0E6] text-[#F97316] font-bold shadow-2xs"
                    : "text-[#475569] font-medium hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    active ? "text-[#F97316]" : "text-[#64748B]",
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── 3. BOTTOM SECTION (BOOK A CONSULTATION & USER FOOTER) ── */}
        <div className="p-4 space-y-4 border-t border-slate-100">
          {/* Book a Consultation Card */}
          <Link
            href="/dashboard/appointments"
            onClick={onClose}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF7F2] border border-[#FFE8DA] hover:bg-[#FFEFE5] transition-all cursor-pointer group"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900">Book a Consultation</p>
              <p className="text-xs text-slate-500 font-normal">Get expert guidance</p>
            </div>
            <Calendar className="w-6 h-6 text-slate-700 shrink-0 group-hover:scale-105 transition-transform stroke-[1.75]" />
          </Link>

          {/* User Profile Footer */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-200/80 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt="Tashin Khan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0 leading-none">
                <p className="text-xs font-bold text-slate-900 truncate">Tashin Khan</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Student</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
