"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavGroups } from "@/lib/admin/nav";
import { hasPermission } from "@/lib/admin/permissions";
import type { UserRole } from "@prisma/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  role: UserRole;
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ role, open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[var(--admin-sidebar-width)] flex-col border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[var(--admin-header-height)] items-center justify-between border-b border-border px-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="Muntajar"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-sm font-semibold tracking-tight">
              Muntajar
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto admin-scrollbar px-3 py-4">
          {adminNavGroups.map((group, gi) => (
            <div key={gi} className={cn(gi > 0 && "mt-6")}>
              {group.label && (
                <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items
                  .filter(
                    (item) =>
                      !item.permission || hasPermission(role, item.permission),
                  )
                  .map((item) => {
                    const active =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                            active
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-70" />
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <p className="px-2 text-[11px] text-muted-foreground">Admin Console</p>
        </div>
      </aside>
    </>
  );
}
