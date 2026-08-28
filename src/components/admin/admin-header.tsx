"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Menu,
  Moon,
  Sun,
  Search,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuthUser } from "@/types";

interface AdminHeaderProps {
  user: AuthUser;
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function AdminHeader({
  user,
  onMenuClick,
  onSearchClick,
}: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-[var(--admin-header-height)] items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <button
        type="button"
        onClick={onSearchClick}
        className="hidden flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/70 sm:flex sm:max-w-sm"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1">Search...</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium md:inline-flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <Button
        variant="ghost"
        size="icon-sm"
        className="sm:hidden"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />
      </Button>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[11px] font-semibold text-white">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </span>
              <span className="hidden text-sm md:inline">
                {user.name ?? user.email.split("@")[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="text-xs capitalize">
              {user.role.toLowerCase()}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/admin/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/">Back to site</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
