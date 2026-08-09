import Link from "next/link";
import { Panel, StatusPill, ProgressBar } from "@/components/employment";
import { Button } from "@/components/ui/button";
import type { WorkerAnalysisResult } from "@/lib/employment/analysis.types";
import { formatSalary } from "@/lib/employment/format";

type Props = {
  analysis: WorkerAnalysisResult | null;
  readinessScore: number | null;
};

export function WorkerAnalysisPanel({ analysis, readinessScore }: Props) {
  if (!analysis) {
    return (
      <Panel>
        <h2 className="text-lg font-semibold text-stone-900">
          AI Worker Analysis
        </h2>
        <p className="mt-3 text-sm text-stone-500">
          Run the analysis engine to generate strengths, gaps, eligible markets,
          salary estimate, and profile readiness.
        </p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/work/employment/analysis">Run analysis</Link>
        </Button>
      </Panel>
    );
  }

  const salaryLabel =
    analysis.salaryEstimate != null
      ? formatSalary(
          analysis.salaryEstimate.monthlyMin,
          analysis.salaryEstimate.monthlyMax,
          analysis.salaryEstimate.currency,
        )
      : null;

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              AI Worker Analysis
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">
              {analysis.careerSummary || analysis.summary}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Readiness
            </p>
            <p className="text-3xl font-semibold tabular-nums text-stone-900">
              {readinessScore ?? analysis.profileReadinessScore}%
            </p>
          </div>
        </div>
        <ProgressBar
          value={readinessScore ?? analysis.profileReadinessScore}
          className="mt-4"
        />
        <Button asChild variant="outline" className="mt-4" size="sm">
          <Link href="/work/employment/analysis">View full analysis</Link>
        </Button>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h3 className="text-base font-semibold text-stone-900">Strengths</h3>
          <ul className="mt-3 space-y-2">
            {analysis.strengths.slice(0, 5).map((item) => (
              <li key={item} className="text-sm text-stone-600">
                • {item}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h3 className="text-base font-semibold text-stone-900">Weaknesses</h3>
          <ul className="mt-3 space-y-2">
            {analysis.weaknesses.slice(0, 5).map((item) => (
              <li key={item} className="text-sm text-stone-600">
                • {item}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel>
          <h3 className="text-base font-semibold text-stone-900">
            Eligible Countries
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.eligibleCountries.length === 0 ? (
              <p className="text-sm text-stone-500">None yet</p>
            ) : (
              analysis.eligibleCountries.slice(0, 6).map((c) => (
                <StatusPill key={c.name} tone="accent">
                  {c.name}
                  {typeof c.score === "number" ? ` · ${c.score}%` : ""}
                </StatusPill>
              ))
            )}
          </div>
        </Panel>
        <Panel>
          <h3 className="text-base font-semibold text-stone-900">
            Eligible Industries
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.eligibleIndustries.length === 0 ? (
              <p className="text-sm text-stone-500">None yet</p>
            ) : (
              analysis.eligibleIndustries.slice(0, 6).map((i) => (
                <StatusPill key={i.name} tone="neutral">
                  {i.name}
                  {typeof i.score === "number" ? ` · ${i.score}%` : ""}
                </StatusPill>
              ))
            )}
          </div>
        </Panel>
        <Panel>
          <h3 className="text-base font-semibold text-stone-900">
            Salary Estimate
          </h3>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900">
            {salaryLabel ?? "—"}
          </p>
          <p className="mt-1 text-xs text-stone-500">Monthly range</p>
          {analysis.salaryEstimate?.note && (
            <p className="mt-2 text-xs leading-relaxed text-stone-500">
              {analysis.salaryEstimate.note}
            </p>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h3 className="text-base font-semibold text-stone-900">
            Missing Skills
          </h3>
          {analysis.missingSkills.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">No critical skill gaps.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill) => (
                <StatusPill key={skill} tone="warning">
                  {skill}
                </StatusPill>
              ))}
            </div>
          )}
        </Panel>
        <Panel>
          <h3 className="text-base font-semibold text-stone-900">
            Missing Documents
          </h3>
          {analysis.missingDocuments.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">
              No critical document gaps from analysis.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.missingDocuments.map((doc) => (
                <StatusPill key={doc} tone="danger">
                  {doc}
                </StatusPill>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
