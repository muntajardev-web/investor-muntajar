import Link from "next/link";
import { PageHeader, Panel, StatusPill } from "@/components/employment";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";
import { paymentService } from "@/services/payments";
import { employmentPackageService } from "@/services/employment/package.service";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function EmploymentConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const paymentId =
    typeof params.paymentId === "string" ? params.paymentId : undefined;

  const [profile, latest, history] = await Promise.all([
    getWorkerProfile(session.user.id),
    paymentService.findCompletedPayment(session.user.id, "employment"),
    paymentService.listPaymentHistory(session.user.id, "employment"),
  ]);

  const payment =
    (paymentId
      ? history.find((p) => p.id === paymentId && p.status === "COMPLETED")
      : null) ?? latest;

  if (!payment) {
    redirect("/work/employment/payment");
  }

  const pkg = employmentPackageService.parseStored(profile?.applicationPackage);
  const invoice = payment.invoice;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment confirmation"
        description="Step 14 — Your fee is confirmed. Review the invoice, then submit your application."
      />

      <Panel>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone="success">Payment confirmed</StatusPill>
          <StatusPill tone="accent">{payment.provider}</StatusPill>
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">
              Amount
            </dt>
            <dd className="mt-1 text-lg font-semibold text-stone-900">
              {Number(payment.amount).toLocaleString()} {payment.currency}
            </dd>
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
              Invoice
            </dt>
            <dd className="mt-1 text-sm font-medium text-stone-900">
              {invoice?.invoiceNumber ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">
              Reference
            </dt>
            <dd className="mt-1 break-all text-sm text-stone-700">
              {payment.providerRef ?? payment.id}
            </dd>
          </div>
        </dl>
      </Panel>

      {pkg && (
        <Panel>
          <h2 className="text-lg font-semibold text-stone-900">
            Application package
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Your package was assembled after payment. You can still edit on the
            Application Builder before submitting.
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-stone-50 p-4 font-sans text-sm text-stone-700">
            {pkg.applicationSummary}
          </pre>
        </Panel>
      )}

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/work/employment/submission">Continue to submission</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/work/employment/builder">Edit package</Link>
        </Button>
      </div>
    </div>
  );
}
