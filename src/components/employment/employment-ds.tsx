/**
 * Muntajar Employment Dashboard — Design System Primitives
 * Stripe/Linear/Mercury inspired. Stone palette, amber accent.
 * No gradients, no glassmorphism. Pure crisp surfaces.
 */
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Lock, AlertTriangle, ChevronRight } from "lucide-react";

// ─── Tokens ──────────────────────────────────────────────────────────────────

export const COLORS = {
  surface: "#FFFFFF",
  bg: "#FAF9F7",
  border: "border-stone-200",
  text: "text-stone-950",
  muted: "text-stone-500",
  accent: "text-amber-700",
  accentBg: "bg-amber-50",
  accentBorder: "border-amber-200",
} as const;

// ─── ECard ───────────────────────────────────────────────────────────────────

interface ECardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds a subtle left border accent */
  accent?: boolean;
  /** Makes the card look interactive on hover */
  hoverable?: boolean;
  onClick?: () => void;
}

export function ECard({ children, className, accent, hoverable, onClick }: ECardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-stone-200 p-6",
        accent && "border-l-2 border-l-amber-400",
        hoverable && "cursor-pointer hover:border-stone-300 hover:shadow-sm transition-all",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── ESection ─────────────────────────────────────────────────────────────────

interface ESectionProps {
  label: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ESection({ label, description, action, children, className }: ESectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 tracking-tight">{label}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-stone-500 leading-relaxed">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

// ─── EBadge ───────────────────────────────────────────────────────────────────

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "amber" | "blue" | "purple";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-stone-100 text-stone-700 border border-stone-200",
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border border-amber-200",
  danger: "bg-red-50 text-red-800 border border-red-200",
  amber: "bg-amber-100 text-amber-900 border border-amber-300",
  blue: "bg-blue-50 text-blue-800 border border-blue-200",
  purple: "bg-purple-50 text-purple-800 border border-purple-200",
};

interface EBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}

export function EBadge({ children, tone = "neutral", className, dot }: EBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badgeTones[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            tone === "success" && "bg-emerald-500",
            tone === "warning" && "bg-amber-500",
            tone === "danger" && "bg-red-500",
            tone === "amber" && "bg-amber-600",
            tone === "neutral" && "bg-stone-400",
            tone === "blue" && "bg-blue-500",
            tone === "purple" && "bg-purple-500",
          )}
        />
      )}
      {children}
    </span>
  );
}

// ─── EProgress ────────────────────────────────────────────────────────────────

interface EProgressProps {
  value: number; // 0–100
  label?: string;
  showPct?: boolean;
  size?: "sm" | "md";
  tone?: "amber" | "emerald" | "stone";
  className?: string;
}

export function EProgress({
  value,
  label,
  showPct = true,
  size = "md",
  tone = "amber",
  className,
}: EProgressProps) {
  const barColor = {
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    stone: "bg-stone-700",
  }[tone];

  const trackHeight = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showPct) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium text-stone-500">{label}</span>}
          {showPct && (
            <span className="text-xs font-semibold tabular-nums text-stone-700">
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-stone-100 overflow-hidden", trackHeight)}>
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", barColor)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

// ─── EScoreDial ───────────────────────────────────────────────────────────────

interface EScoreDialProps {
  value: number; // 0–100
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EScoreDial({ value, label, size = "md", className }: EScoreDialProps) {
  const dims = { sm: 72, md: 96, lg: 128 }[size];
  const stroke = { sm: 6, md: 8, lg: 10 }[size];
  const fontSize = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" }[size];
  const r = (dims - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  const color =
    value >= 80 ? "#10b981" : value >= 60 ? "#f59e0b" : value >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} viewBox={`0 0 ${dims} ${dims}`}>
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            fill="none"
            stroke="#f5f5f4"
            strokeWidth={stroke}
          />
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${dims / 2} ${dims / 2})`}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-black tabular-nums text-stone-900", fontSize)}>
            {Math.round(value)}
          </span>
        </div>
      </div>
      {label && <span className="text-xs font-medium text-stone-500">{label}</span>}
    </div>
  );
}

// ─── EStep ────────────────────────────────────────────────────────────────────

type StepStatus = "completed" | "active" | "pending" | "locked";

interface EStepHeaderProps {
  number: number;
  title: string;
  description?: string;
  status: StepStatus;
  className?: string;
}

const stepStatusConfig: Record<StepStatus, { icon: React.ElementType; label: string; colors: string }> = {
  completed: { icon: CheckCircle2, label: "Completed", colors: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  active: { icon: Clock, label: "In Progress", colors: "text-amber-700 bg-amber-50 border-amber-200" },
  pending: { icon: Circle, label: "Pending", colors: "text-stone-400 bg-stone-50 border-stone-200" },
  locked: { icon: Lock, label: "Locked", colors: "text-stone-300 bg-stone-50 border-stone-200" },
};

export function EStepHeader({ number, title, description, status, className }: EStepHeaderProps) {
  const cfg = stepStatusConfig[status];
  const Icon = cfg.icon;

  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 font-bold text-sm",
          status === "completed" && "border-emerald-400 bg-emerald-50 text-emerald-700",
          status === "active" && "border-amber-400 bg-amber-50 text-amber-800",
          status === "pending" && "border-stone-200 bg-stone-50 text-stone-400",
          status === "locked" && "border-stone-200 bg-stone-50 text-stone-300",
        )}
      >
        {status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-lg font-bold text-stone-900 tracking-tight">{title}</h1>
          <EBadge
            tone={
              status === "completed" ? "success" :
              status === "active" ? "amber" :
              "neutral"
            }
          >
            {cfg.label}
          </EBadge>
        </div>
        {description && (
          <p className="mt-1 text-sm text-stone-500 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}

// ─── EEmptyState ──────────────────────────────────────────────────────────────

interface EEmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EEmptyState({ icon: Icon, title, description, action, className }: EEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-[#FAF9F7] border border-stone-200 space-y-3", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 shadow-2xs">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="font-sans font-extrabold text-base text-stone-950">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

// ─── EButton ──────────────────────────────────────────────────────────────────

interface EButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ElementType;
  iconRight?: React.ElementType;
  asChild?: boolean;
}

export function EButton({
  variant = "primary",
  size = "md",
  loading,
  icon: IconLeft,
  iconRight: IconRight,
  className,
  children,
  disabled,
  ...props
}: EButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs";

  const variants = {
    primary: "bg-stone-950 text-white hover:bg-stone-800 shadow-md active:scale-[0.98]",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200",
    ghost: "bg-transparent text-stone-700 hover:bg-stone-100 shadow-none",
    danger: "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        IconLeft && <IconLeft className="w-4 h-4 shrink-0" />
      )}
      {children}
      {!loading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}

// ─── EStatCard ────────────────────────────────────────────────────────────────

interface EStatCardProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon?: React.ElementType;
  tone?: "default" | "success" | "warning" | "amber";
  className?: string;
}

export function EStatCard({ label, value, sub, icon: Icon, tone = "default", className }: EStatCardProps) {
  const iconColors = {
    default: "bg-stone-100 text-stone-500",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    warning: "bg-red-50 text-red-500 border border-red-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
  };

  return (
    <div className={cn("bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-2xs hover:border-amber-300 transition-all duration-300", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center shadow-2xs", iconColors[tone])}>
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>
      <div className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-stone-950 tabular-nums">{value}</div>
      {sub && <p className="text-xs text-stone-500 font-medium">{sub}</p>}
    </div>
  );
}

// ─── ETaskItem ────────────────────────────────────────────────────────────────

interface ETaskItemProps {
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  href?: string;
  completed?: boolean;
}

export function ETaskItem({ title, description, priority = "medium", href, completed }: ETaskItemProps) {
  const priorityDot = {
    high: "bg-red-400",
    medium: "bg-amber-400",
    low: "bg-stone-300",
  }[priority];

  const content = (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors group",
        completed && "opacity-50",
      )}
    >
      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", priorityDot)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold text-stone-900", completed && "line-through")}>{title}</p>
        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      {href && !completed && (
        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-colors shrink-0 mt-0.5" />
      )}
      {completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
    </div>
  );

  if (href && !completed) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// ─── EJourneyStepper ──────────────────────────────────────────────────────────

interface JourneyStep {
  number: number;
  title: string;
  status: StepStatus;
  href: string;
}

interface EJourneyStepperProps {
  steps: JourneyStep[];
  className?: string;
}

export function EJourneyStepper({ steps, className }: EJourneyStepperProps) {
  return (
    <div className={cn("flex items-center overflow-x-auto gap-0 no-scrollbar pb-1", className)}>
      {steps.map((step, i) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                step.status === "completed" && "border-emerald-400 bg-emerald-50 text-emerald-700",
                step.status === "active" && "border-amber-400 bg-amber-50 text-amber-800 ring-4 ring-amber-100",
                step.status === "pending" && "border-stone-200 bg-white text-stone-400",
                step.status === "locked" && "border-stone-100 bg-stone-50 text-stone-300",
              )}
            >
              {step.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold text-center leading-tight max-w-[72px]",
                step.status === "completed" && "text-emerald-700",
                step.status === "active" && "text-amber-800",
                step.status === "pending" && "text-stone-400",
                step.status === "locked" && "text-stone-300",
              )}
            >
              {step.title}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 min-w-[16px] mb-5 transition-colors",
                steps[i + 1].status === "completed" || step.status === "completed"
                  ? "bg-emerald-300"
                  : "bg-stone-200",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── ERatingBar ───────────────────────────────────────────────────────────────

interface ERatingBarProps {
  label: string;
  value: number; // 0–10
  max?: number;
}

export function ERatingBar({ label, value, max = 10 }: ERatingBarProps) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-stone-700">{label}</span>
        <span className="font-bold tabular-nums text-stone-900">{value}/{max}</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── EWorkflowStep ────────────────────────────────────────────────────────────

type WorkflowStatus = "completed" | "running" | "waiting" | "error";

interface EWorkflowStepProps {
  title: string;
  status: WorkflowStatus;
  detail?: string;
}

export function EWorkflowStep({ title, status, detail }: EWorkflowStepProps) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-stone-100 last:border-0">
      <div className="shrink-0">
        {status === "completed" && (
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        )}
        {status === "running" && (
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <svg className="animate-spin w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        {status === "waiting" && (
          <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center">
            <Circle className="w-4 h-4 text-stone-300" />
          </div>
        )}
        {status === "error" && (
          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold",
            status === "completed" && "text-stone-700",
            status === "running" && "text-stone-900",
            status === "waiting" && "text-stone-400",
            status === "error" && "text-red-800",
          )}
        >
          {title}
        </p>
        {detail && status !== "waiting" && (
          <p className="text-xs text-stone-400 mt-0.5">{detail}</p>
        )}
      </div>
      <div className="shrink-0">
        {status === "completed" && <EBadge tone="success">Done</EBadge>}
        {status === "running" && <EBadge tone="amber" dot>Running</EBadge>}
        {status === "waiting" && <EBadge tone="neutral">Waiting</EBadge>}
        {status === "error" && <EBadge tone="danger">Error</EBadge>}
      </div>
    </div>
  );
}
