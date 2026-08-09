"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  FileText,
  FileCheck2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. PORTAL CARD CONTAINER ---
export function PortalCard({
  children,
  className,
  title,
  subtitle,
  action,
  padding = "p-6 sm:p-8",
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  padding?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl border border-stone-200 shadow-none transition-all duration-200 hover:border-stone-300",
        padding,
        className,
      )}
    >
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-stone-100">
          <div>
            {title && <h3 className="text-xl sm:text-2xl font-extrabold text-stone-950 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-stone-600 font-normal mt-1 leading-relaxed">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// --- 2. PORTAL BADGE ---
export type BadgeVariant = "trust" | "success" | "warning" | "danger" | "neutral";

export function PortalBadge({
  children,
  variant = "neutral",
  icon,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}) {
  const styles: Record<BadgeVariant, string> = {
    trust: "bg-sky-50 text-sky-900 border-sky-200",
    success: "bg-emerald-50 text-emerald-900 border-emerald-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    neutral: "bg-stone-100 text-stone-800 border-stone-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-tight shrink-0",
        styles[variant],
      )}
    >
      {icon && <span className="w-3.5 h-3.5 shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

// --- 3. TRUST VAULT HEADER BANNER ---
export function TrustVaultHeader() {
  return (
    <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-sky-400 shrink-0">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              256-Bit Encrypted Legal Vault
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              ILO Compliant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 font-normal leading-relaxed">
            Your passports, credentials, and employment affidavits are protected by enterprise privacy protocols. Billed at 0% broker markup.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-stone-400 bg-stone-900 px-4 py-2 rounded-xl border border-stone-800 shrink-0">
        <Lock className="w-4 h-4 text-stone-400" />
        <span>Bank-Grade Encryption</span>
      </div>
    </div>
  );
}

// --- 4. DOCUMENT ITEM ROW ---
export function DocumentItemRow({
  label,
  kind,
  uploaded,
  verified,
  required,
  onUpload,
}: {
  label: string;
  kind: string;
  uploaded: boolean;
  verified?: boolean;
  required?: boolean;
  onUpload?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FAF9F7] border border-stone-200 hover:border-stone-300 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-800 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-stone-950 truncate">{label}</span>
            {required && <span className="text-[10px] font-extrabold text-amber-700 uppercase bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200">Required</span>}
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-normal truncate">
            {uploaded
              ? verified
                ? "Legally verified by embassy immigration desk"
                : "Uploaded • Pending embassy verification"
              : "Not uploaded yet"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/60">
        {uploaded ? (
          verified ? (
            <PortalBadge variant="success" icon={<CheckCircle2 className="w-4 h-4" />}>
              Verified
            </PortalBadge>
          ) : (
            <PortalBadge variant="warning" icon={<Clock className="w-4 h-4" />}>
              In Review
            </PortalBadge>
          )
        ) : (
          <PortalBadge variant="danger" icon={<AlertCircle className="w-4 h-4" />}>
            Action Needed
          </PortalBadge>
        )}

        <button
          onClick={onUpload}
          className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-900 hover:bg-stone-950 hover:text-white transition-colors cursor-pointer"
        >
          {uploaded ? "Replace File" : "Upload Document"}
        </button>
      </div>
    </div>
  );
}

// --- 5. STAT WIDGET ---
export function StatWidget({
  label,
  value,
  subtitle,
  icon: Icon,
  variant = "neutral",
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  variant?: "neutral" | "accent" | "success" | "warning";
}) {
  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 space-y-3 hover:border-stone-300 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-[#FAF9F7] border border-stone-200 flex items-center justify-center text-stone-900">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-4xl sm:text-5xl font-black text-stone-950 tracking-tight tabular-nums">{value}</div>
      {subtitle && <p className="text-xs sm:text-sm text-stone-500 font-medium">{subtitle}</p>}
    </div>
  );
}
