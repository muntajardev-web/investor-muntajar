import Link from "next/link";
import { PageHeader, Panel, StatusPill } from "@/components/employment";
import { PrintButton } from "@/components/employment/print-button";
import { requireAuth } from "@/server/auth/session";
import { paymentService } from "@/services/payments";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function EmploymentReceiptPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const paymentId =
    typeof params.paymentId === "string" ? params.paymentId : undefined;
  const applicationId =
    typeof params.applicationId === "string"
      ? params.applicationId
      : undefined;

  const [latest, history, application] = await Promise.all([
    paymentService.findCompletedPayment(session.user.id, "employment"),
    paymentService.listPaymentHistory(session.user.id, "employment"),
    applicationId
      ? prisma.employmentApplication.findFirst({
          where: {
            id: applicationId,
            userId: session.user.id,
            deletedAt: null,
          },
          include: { jobListing: true },
        })
      : prisma.employmentApplication.findFirst({
          where: { userId: session.user.id, deletedAt: null },
          include: { jobListing: true },
          orderBy: { updatedAt: "desc" },
        }),
  ]);

  const payment =
    (paymentId
      ? history.find((p) => p.id === paymentId)
      : null) ?? latest;

  if (!payment || payment.status !== "COMPLETED") {
    redirect("/work/employment/payment");
  }

  const invoice = payment.invoice;
  const lineItems = Array.isArray(invoice?.lineItems)
    ? (invoice.lineItems as {
        description?: string;
        quantity?: number;
        unitAmount?: number;
        total?: number;
      }[])
    : [];

  const submitted =
    application?.status === "SUBMITTED" || !!application?.submittedAt;

  if (submitted) {
    await prisma.workerProfile.updateMany({
      where: { userId: session.user.id, workflowStep: { lt: 16 } },
      data: { workflowStep: 16 },
    });
  }

  return (
    <div className="space-y-8 print:space-y-4">
      <PageHeader
        title="Receipt"
        description="Step 16 — Invoice and submission record for your records."
        action={
          <div className="flex flex-wrap gap-2 print:hidden">
            <PrintButton />
            <Button asChild size="lg">
              <Link href="/work/employment/tracker">Open tracker</Link>
            </Button>
          </div>
        }
      />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">
              Muntajar · Overseas Employment
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              {invoice?.invoiceNumber ?? "Payment receipt"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="success">Paid</StatusPill>
            {submitted ? (
              <StatusPill tone="accent">Submitted</StatusPill>
            ) : (
              <StatusPill tone="warning">Awaiting submission</StatusPill>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">
              Amount
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">
              {Number(payment.amount).toLocaleString()} {payment.currency}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">
              Provider
            </dt>
            <dd className="mt-1 text-sm text-stone-800">{payment.provider}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">
              Paid at
            </dt>
            <dd className="mt-1 text-sm text-stone-800">
              {payment.paidAt
                ? new Date(payment.paidAt).toLocaleString()
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">
              Payment reference
            </dt>
            <dd className="mt-1 break-all text-sm text-stone-700">
              {payment.providerRef ?? payment.id}
            </dd>
          </div>
          {application && (
            <>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  Application
                </dt>
                <dd className="mt-1 text-sm text-stone-800">
                  {application.id.slice(0, 8)}… · {application.status}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  Submitted at
                </dt>
                <dd className="mt-1 text-sm text-stone-800">
                  {application.submittedAt
                    ? new Date(application.submittedAt).toLocaleString()
                    : "Not submitted yet"}
                </dd>
              </div>
              {application.jobListing && (
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-stone-400">
                    Target role
                  </dt>
                  <dd className="mt-1 text-sm text-stone-800">
                    {application.jobListing.title} at{" "}
                    {application.jobListing.company} (
                    {application.jobListing.country})
                  </dd>
                </div>
              )}
            </>
          )}
        </dl>

        {lineItems.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-lg border border-stone-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Item</th>
                  <th className="px-4 py-2 font-medium">Qty</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} className="border-t border-stone-100">
                    <td className="px-4 py-2 text-stone-800">
                      {item.description ?? "Fee"}
                    </td>
                    <td className="px-4 py-2 tabular-nums text-stone-600">
                      {item.quantity ?? 1}
                    </td>
                    <td className="px-4 py-2 tabular-nums text-stone-900">
                      {Number(
                        item.total ?? item.unitAmount ?? 0,
                      ).toLocaleString()}{" "}
                      {payment.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {!submitted && (
        <div className="print:hidden">
          <Button asChild size="lg">
            <Link href="/work/employment/submission">Submit application</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
