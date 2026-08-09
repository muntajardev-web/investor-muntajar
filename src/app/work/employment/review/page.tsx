import Link from "next/link";
import { PageHeader, Panel, StatusPill } from "@/components/employment";
import { ActionButton } from "@/components/employment/action-button";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";
import {
  employmentValidationService,
  type ValidationResult,
} from "@/services/employment/validation.service";
import { employmentPackageService } from "@/services/employment/package.service";
import { Button } from "@/components/ui/button";

function asList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

export default async function EmploymentReviewPage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);
  const result =
    employmentValidationService.parseStored(profile?.validationResult) ??
    (profile?.validationResult as ValidationResult | null);
  const pkg = employmentPackageService.parseStored(profile?.applicationPackage);
  const snapshot = pkg?.profileSnapshot;
  const education = asList(snapshot?.education);
  const experience = asList(snapshot?.experience);
  const certifications = asList(snapshot?.certifications);
  const report = result?.report;
  const blocked = result != null && !result.canSubmit;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Application Validation"
        description="Checks documents, passport, certificates, experience/education fit, languages, medical, duplicates, and unsupported claims. Failed validation blocks submission."
        action={
          <ActionButton
            endpoint="/api/employment/review"
            label={result ? "Re-run validation" : "Run validation"}
            successLabel="Validation report ready"
          />
        }
      />

      {/* Validation report */}
      {!result ? (
        <Panel>
          <p className="text-stone-600">
            Run validation to generate a full report. Submission and payment stay
            locked until all errors are cleared.
          </p>
        </Panel>
      ) : (
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Validation report
              </h2>
              <p className="mt-1 text-xs text-stone-400">
                {report?.reportId ?? "report"} ·{" "}
                {report?.generatedAt
                  ? new Date(report.generatedAt).toLocaleString()
                  : "—"}
                {report?.applicantName ? ` · ${report.applicantName}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={result.ok ? "success" : "danger"}>
                {result.ok ? "Passed" : "Failed"}
              </StatusPill>
              <StatusPill tone={result.canSubmit ? "accent" : "warning"}>
                {result.canSubmit
                  ? "Submission allowed"
                  : "Submission blocked"}
              </StatusPill>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-100 bg-stone-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Total issues
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">
                {report?.summary.totalIssues ?? result.issues.length}
              </p>
            </div>
            <div className="rounded-lg border border-red-100 bg-red-50/40 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-red-400">
                Errors
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-red-800">
                {report?.summary.errorCount ??
                  result.issues.filter((i) => i.severity === "error").length}
              </p>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50/40 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-500">
                Warnings
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-900">
                {report?.summary.warningCount ??
                  result.issues.filter((i) => i.severity === "warning").length}
              </p>
            </div>
          </div>

          {report?.targetJob?.title && (
            <p className="mt-4 text-sm text-stone-600">
              Checked against matched role:{" "}
              <span className="font-medium text-stone-800">
                {[report.targetJob.title, report.targetJob.company, report.targetJob.country]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </p>
          )}

          {blocked && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              Validation failed. Fix the errors below. Payment and application
              submission are disabled until this report passes.
            </p>
          )}

          <div className="mt-6 space-y-5">
            {(report?.categories?.length
              ? report.categories
              : [
                  {
                    category: "documents" as const,
                    label: "Issues",
                    errorCount: result.issues.filter((i) => i.severity === "error")
                      .length,
                    warningCount: result.issues.filter(
                      (i) => i.severity === "warning",
                    ).length,
                    issues: result.issues,
                  },
                ]
            ).map((cat) => (
              <div key={cat.category}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-stone-900">
                    {cat.label}
                  </h3>
                  {cat.errorCount > 0 && (
                    <StatusPill tone="danger">{cat.errorCount} errors</StatusPill>
                  )}
                  {cat.warningCount > 0 && (
                    <StatusPill tone="warning">
                      {cat.warningCount} warnings
                    </StatusPill>
                  )}
                </div>
                <ul className="space-y-2">
                  {cat.issues.map((issue) => (
                    <li
                      key={`${issue.code}-${issue.message}`}
                      className="flex items-start justify-between gap-4 border-b border-stone-100 pb-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {issue.message}
                        </p>
                        <p className="mt-0.5 text-xs uppercase tracking-wide text-stone-400">
                          {issue.code}
                          {issue.field ? ` · ${issue.field}` : ""}
                        </p>
                      </div>
                      <StatusPill
                        tone={issue.severity === "error" ? "danger" : "warning"}
                      >
                        {issue.severity}
                      </StatusPill>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {result.issues.length === 0 && (
            <p className="mt-4 text-sm text-stone-600">
              No issues detected. You can proceed to payment and submission.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {result.canSubmit ? (
              <Button asChild size="lg">
                <Link href="/work/employment/payment">Continue to payment</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="lg">
                  <Link href="/work/employment/documents">Fix documents</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/work/employment/builder">Fix package</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/work/employment/profile">Fix profile</Link>
                </Button>
              </>
            )}
          </div>
        </Panel>
      )}

      {/* Package preview */}
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">
            Package preview
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/work/employment/builder">Edit package</Link>
          </Button>
        </div>

        {!pkg ? (
          <p className="mt-3 text-sm text-stone-500">
            No application package stored yet.{" "}
            <Link
              href="/work/employment/builder"
              className="font-medium text-orange-700 hover:underline"
            >
              Generate it in Application Builder
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="accent">
                Collection {pkg.collection.readyCount}/
                {pkg.collection.totalCount}
              </StatusPill>
              {pkg.targetJob?.title && (
                <StatusPill tone="neutral">
                  {[pkg.targetJob.title, pkg.targetJob.company]
                    .filter(Boolean)
                    .join(" · ")}
                </StatusPill>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  Passport
                </p>
                <p className="mt-1 text-sm text-stone-700">
                  {snapshot?.passportNumber
                    ? `${snapshot.passportNumber}${snapshot.passportExpiry ? ` · exp ${snapshot.passportExpiry}` : ""}`
                    : "Missing"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  Documents
                </p>
                <p className="mt-1 text-sm text-stone-700">
                  {pkg.documents.length
                    ? pkg.documents.map((d) => d.label).join(", ")
                    : "None listed"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  Education ({education.length})
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-stone-700">
                  {education.length === 0 ? (
                    <li>None</li>
                  ) : (
                    education.slice(0, 3).map((e, i) => (
                      <li key={i}>
                        {[e.level, e.institution].filter(Boolean).join(" — ")}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  Experience ({experience.length})
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-stone-700">
                  {experience.length === 0 ? (
                    <li>None</li>
                  ) : (
                    experience.slice(0, 3).map((e, i) => (
                      <li key={i}>
                        {[e.position, e.employer].filter(Boolean).join(" @ ")}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  Certificates ({certifications.length})
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-stone-700">
                  {certifications.length === 0 ? (
                    <li>None</li>
                  ) : (
                    certifications.slice(0, 3).map((c, i) => (
                      <li key={i}>{String(c.name ?? "")}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
