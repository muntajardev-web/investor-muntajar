"use client";

import { useState } from "react";
import type { AuthUser } from "@/types";
import { EmploymentSidebar } from "./employment-sidebar";
import { EmploymentHeader } from "./employment-header";
import { cn } from "@/lib/utils";

interface EmploymentShellProps {
  user: AuthUser;
  unreadNotifications?: number;
  profileComplete?: boolean;
  profileCompletion?: number;
  workflowStep?: number;
  children: React.ReactNode;
}

export function EmploymentShell({
  user,
  unreadNotifications = 0,
  profileComplete = false,
  profileCompletion = 0,
  workflowStep = 1,
  children,
}: EmploymentShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-[#FAF9F7]">
      <EmploymentSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profileComplete={profileComplete}
        profileCompletion={profileCompletion}
        workflowStep={workflowStep}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EmploymentHeader
          user={user}
          unreadCount={unreadNotifications}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className={cn("mx-auto max-w-[1720px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
