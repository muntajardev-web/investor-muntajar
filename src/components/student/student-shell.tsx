"use client";

import { useState } from "react";
import type { AuthUser } from "@/types";
import { StudentSidebar } from "./student-sidebar";
import { StudentHeader } from "./student-header";
import { cn } from "@/lib/utils";

interface StudentShellProps {
  user: AuthUser;
  unreadNotifications?: number;
  profileComplete?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}

export function StudentShell({
  user,
  unreadNotifications = 0,
  profileComplete = true,
  compact = false,
  children,
}: StudentShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="student-shell flex h-svh overflow-hidden bg-stone-50 text-base">
      {!compact && (
        <StudentSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          profileComplete={profileComplete}
        />
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <StudentHeader
          user={user}
          unreadCount={unreadNotifications}
          onMenuClick={() => setSidebarOpen(true)}
          showMenu={!compact}
          compact={compact}
        />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className={cn(
              "mx-auto px-5 py-7 sm:px-8 lg:px-10 lg:py-9",
              compact ? "max-w-3xl py-10" : "max-w-[1720px]",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
