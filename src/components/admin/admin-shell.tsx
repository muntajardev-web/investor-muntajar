"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/types";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { CommandPalette } from "./command-palette";

interface AdminShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="admin-shell flex min-h-screen bg-background">
      <AdminSidebar
        role={user.role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <main className="flex-1 overflow-auto admin-scrollbar p-4 lg:p-6">
          {children}
        </main>
      </div>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
