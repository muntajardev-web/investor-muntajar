import Link from "next/link";
import { PageHeader, Panel, StatusPill } from "@/components/employment";
import { ActionButton } from "@/components/employment/action-button";
import { requireAuth } from "@/server/auth/session";
import {
  getWorkerProfile,
  hasEmploymentPaid,
} from "@/lib/employment/queries";
import { employmentPackageService } from "@/services/employment/package.service";
import { employmentValidationService } from "@/services/employment/validation.service";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function EmploymentSubmissionPage() {
  const session = await requireAuth();
  const [hasPaid, profile, application] = await Promise.all([
    hasEmploymentPaid(session.user.id),
    getWorkerProfile(session.user.id),
    prisma.employmentApplication.findFirst({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!hasPaid) {
    redirect("/work/employment/payment");
  }

  if (application?.status === "SUBMITTED" || application?.submittedAt) {
    redirect(
      `/work/employment/receipt?applicationId=${application.id}`,
    );
  }

  const pkg = employmentPackageService.parseStored(profile?.applicationPackage);
  const validation = employmentValidationService.parseStored(
    profile?.validationResult,
  );
  const canSubmit = validation?.canSubmit === true;

  await prisma.workerProfile.updateMany({
    where: { userId: session.user.id, workflowStep: { lt: 15 } },
    data: { workflowStep: 15 },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Submit application"
        description="Step 15 — Final check, then send your overseas employment application."
      />

      <Panel>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone="success">Payment complete</StatusPill>
          <StatusPill tone={canSubmit ? "accent" : "danger"}>
            {canSubmit ? "Validation passed" : "Validation blocked"}
          </StatusPill>
        </div>
        <p className="mt-4 text-sm text-stone-600">
          Submitting locks this version of your package for review by the
          employment team. You can track progress afterward.
        </p>
      </Panel>

      {pkg && (
        <Panel>
          <h2 className="text-lg font-semibold text-stone-900">
            Package summary
          </h2>
          <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-stone-50 p-4 font-sans text-sm text-stone-700">
            {pkg.applicationSummary}
          </pre>
        </Panel>
      )}

      {canSubmit ? (
        <ActionButton
          endpoint="/api/employment/applications"
          label="Submit application"
          successLabel="Application submitted"
          body={{ action: "submit" }}
        />
      ) : (
        <Panel>
          <StatusPill tone="danger">Submission blocked</StatusPill>
          <p className="mt-3 text-sm text-stone-600">
            Fix validation issues before submitting.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/work/employment/review">Open validation report</Link>
          </Button>
        </Panel>
      )}
    </div>
  );
}
