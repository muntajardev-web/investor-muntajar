import React from "react";
import {
  CheckCircle2,
  User,
  FileText,
  Globe,
  MapPin,
  GraduationCap,
  Languages,
  Briefcase,
  Wrench,
  Award,
  DollarSign,
  Phone,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getSectionIcon(id: string) {
  switch (id) {
    case "personal":
      return User;
    case "passport":
      return FileText;
    case "nationality":
      return Globe;
    case "address":
      return MapPin;
    case "education":
      return GraduationCap;
    case "languages":
      return Languages;
    case "experience":
      return Briefcase;
    case "skills":
      return Wrench;
    case "certifications":
      return Award;
    case "preferred-countries":
      return Globe;
    case "preferred-salary":
      return DollarSign;
    case "preferred-industries":
      return Briefcase;
    case "emergency":
      return Phone;
    case "photo":
      return Camera;
    default:
      return ShieldCheck;
  }
}

export function SectionShell({
  id,
  title,
  description,
  complete,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  complete?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const IconComp = getSectionIcon(id);

  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl border bg-white p-6 sm:p-7 transition-all duration-200 shadow-xs hover:border-stone-300",
        complete ? "border-stone-200" : "border-stone-200",
        className,
      )}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
              complete
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-stone-100 text-stone-800 border border-stone-200",
            )}
          >
            <IconComp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-stone-950 tracking-tight">
                {title}
              </h2>
            </div>
            {description && (
              <p className="mt-0.5 text-xs text-stone-500 font-medium">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all border",
              complete
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-stone-100 text-stone-600 border-stone-200",
            )}
          >
            {complete ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </>
            ) : (
              <span>Pending Input</span>
            )}
          </span>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}
