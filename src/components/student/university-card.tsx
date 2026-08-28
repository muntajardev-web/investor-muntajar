import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import { ChanceBadge } from "./dashboard-ui";
import { cn } from "@/lib/utils";

interface UniversityCardProps {
  id: string;
  name: string;
  country?: string;
  city?: string | null;
  program?: string | null;
  matchScore?: number;
  logoUrl?: string | null;
  admissionChance?: string;
  href: string;
  className?: string;
}

export function UniversityCard({
  name,
  country,
  city,
  program,
  matchScore,
  logoUrl,
  admissionChance,
  href,
  className,
}: UniversityCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="rounded-2xl border border-stone-200/80 bg-white p-4 transition-colors hover:border-stone-300 sm:p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-stone-100 bg-white">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt=""
                width={56}
                height={56}
                className="h-[70%] w-[70%] object-contain"
              />
            ) : (
              <span className="text-xl text-stone-300">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold leading-snug text-stone-900 group-hover:text-stone-700">
                {name}
              </h3>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-stone-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-500" />
            </div>
            {(city || country) && (
              <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                <MapPin className="h-3.5 w-3.5" />
                {[city, country].filter(Boolean).join(", ")}
              </p>
            )}
            {program && (
              <p className="mt-2 text-sm font-medium text-stone-700">{program}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {matchScore !== undefined && (
                <span className="text-sm font-semibold tabular-nums text-stone-800">
                  {Math.round(matchScore)}% match
                </span>
              )}
              {admissionChance && <ChanceBadge level={admissionChance} />}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
