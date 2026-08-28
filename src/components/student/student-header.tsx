"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, MessageCircle, Menu } from "lucide-react";
import type { AuthUser } from "@/types";

interface StudentHeaderProps {
  user?: AuthUser;
  unreadCount?: number;
  onMenuClick?: () => void;
  showMenu?: boolean;
  compact?: boolean;
}

export function StudentHeader({
  unreadCount = 3,
  onMenuClick,
  showMenu = true,
}: StudentHeaderProps) {
  const displayCount = unreadCount && unreadCount > 0 ? unreadCount : 3;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between lg:justify-end border-b border-slate-100 bg-white/95 backdrop-blur-md px-6 lg:px-8 select-none">
      {/* Mobile Menu Trigger */}
      {showMenu && (
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search Input Bar & Top Right Icons */}
      <div className="flex items-center gap-4">
        {/* Search Pill */}
        <div className="relative hidden sm:block w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-50/80 border border-slate-200/80 text-xs font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:bg-white transition-all"
          />
        </div>

        {/* Bell Icon with Red Count 3 Badge */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.75]" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-2xs">
            {displayCount}
          </span>
        </Link>

        {/* Message Bubble Icon */}
        <Link
          href="/dashboard/messages"
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          title="Messages"
        >
          <MessageCircle className="w-5 h-5 stroke-[1.75]" />
        </Link>
      </div>
    </header>
  );
}
