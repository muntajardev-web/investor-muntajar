import { StatusPill } from "./ui";
import { formatSalary } from "@/lib/employment/format";
import { cn } from "@/lib/utils";

interface JobMatchCardProps {
  company: string;
  title: string;
  country: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  visaSponsorship: boolean;
  requirements: string[];
  matchScore: number;
  explanation?: string | null;
  strengths?: string[];
  weaknesses?: string[];
  probabilityOfSuccess?: number | null;
  className?: string;
}

export function JobMatchCard({
  company,
  title,
  country,
  salaryMin,
  salaryMax,
  salaryCurrency = "USD",
  visaSponsorship,
  requirements,
  matchScore,
  explanation,
  strengths = [],
  weaknesses = [],
  probabilityOfSuccess,
  className,
}: JobMatchCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200/80 bg-white p-5 transition-colors hover:border-stone-300",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-stone-500">{company}</p>
          <h3 className="mt-1 text-lg font-semibold text-stone-900">{title}</h3>
          <p className="mt-1 text-sm text-stone-600">{country}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums text-stone-900">
            {Math.round(matchScore)}
          </p>
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Match
          </p>
          {probabilityOfSuccess != null && (
            <p className="mt-2 text-xs text-stone-500">
              Success{" "}
              <span className="font-semibold tabular-nums text-stone-800">
                {Math.round(probabilityOfSuccess)}%
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusPill tone="accent">
          {formatSalary(salaryMin, salaryMax, salaryCurrency)}
        </StatusPill>
        <StatusPill tone={visaSponsorship ? "success" : "neutral"}>
          {visaSponsorship ? "Visa sponsorship" : "No sponsorship listed"}
        </StatusPill>
      </div>

      {requirements.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Requirements
          </p>
          <ul className="mt-2 space-y-1">
            {requirements.slice(0, 4).map((req) => (
              <li key={req} className="text-sm text-stone-600">
                • {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {strengths.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Strengths
              </p>
              <ul className="mt-2 space-y-1">
                {strengths.slice(0, 3).map((item) => (
                  <li key={item} className="text-sm text-emerald-800">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Weaknesses
              </p>
              <ul className="mt-2 space-y-1">
                {weaknesses.slice(0, 3).map((item) => (
                  <li key={item} className="text-sm text-amber-800">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {explanation && (
        <p className="mt-4 border-t border-stone-100 pt-4 text-sm leading-relaxed text-stone-600">
          <span className="font-medium text-stone-800">AI: </span>
          {explanation}
        </p>
      )}
    </div>
  );
}
