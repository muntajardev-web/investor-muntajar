"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PHASES = [
  { id: "profile", label: "Reading your profile" },
  { id: "filter", label: "Filtering universities by country & budget" },
  { id: "score", label: "Scoring academic and English fit" },
  { id: "rank", label: "Ranking your best matches" },
] as const;

export default function MatchingPage() {
  const router = useRouter();
  const started = useRef(false);
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;
    const timers: number[] = [];

    // Visual progress while the API runs
    PHASES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase(i);
        }, i * 900),
      );
    });

    async function run() {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 55_000);

      try {
        const res = await fetch("/api/recommendations/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok) {
          setError(
            data.error ||
              "We couldn't finish matching. You can retry from Recommendations.",
          );
          setPhase(PHASES.length - 1);
          return;
        }

        setCount(typeof data.count === "number" ? data.count : 0);
        setPhase(PHASES.length - 1);

        timers.push(
          window.setTimeout(() => {
            if (!cancelled) {
              router.replace("/dashboard/recommendations");
              router.refresh();
            }
          }, 1200),
        );
      } catch {
        if (cancelled) return;
        setError(
          "Matching took too long. Opening recommendations — results may still appear.",
        );
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) {
              router.replace("/dashboard/recommendations");
              router.refresh();
            }
          }, 1600),
        );
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    void run();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
        Post-payment
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">
        Analyzing universities for you
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        We&apos;re matching schools to your destination, grades, English score,
        and budget. This usually takes under a minute.
      </p>

      <ul className="mt-8 space-y-3">
        {PHASES.map((item, index) => {
          const done = index < phase || (count !== null && index <= phase);
          const active = index === phase && count === null && !error;
          return (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3.5 py-3 text-sm",
                done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : active
                    ? "border-stone-300 bg-white text-stone-900"
                    : "border-stone-100 bg-stone-50 text-stone-400",
              )}
            >
              {done && !active ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : active ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-stone-700" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-stone-300" />
              )}
              {item.label}
            </li>
          );
        })}
      </ul>

      {count !== null && !error && (
        <p className="mt-6 text-sm font-medium text-stone-700">
          Found {count} match{count === 1 ? "" : "es"} — opening your shortlist…
        </p>
      )}

      {error && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={() => router.replace("/dashboard/recommendations")}
            className="h-10 rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white"
          >
            Go to recommendations
          </button>
        </div>
      )}
    </div>
  );
}
