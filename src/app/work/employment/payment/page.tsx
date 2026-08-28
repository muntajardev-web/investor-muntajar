import Link from "next/link";
import { PageHeader, Panel, StatusPill } from "@/components/employment";
import { PaymentCheckout } from "@/components/employment/payment-checkout";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile, hasEmploymentPaid } from "@/lib/employment/queries";
import { EMPLOYMENT_FEE } from "@/lib/employment/constants";
import { employmentValidationService } from "@/services/employment/validation.service";
import { paymentService } from "@/services/payments";
import { Button } from "@/components/ui/button";

export default async function EmploymentPaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const [hasPaid, profile, history] = await Promise.all([
    hasEmploymentPaid(session.user.id),
    getWorkerProfile(session.user.id),
    paymentService.listPaymentHistory(session.user.id, "employment"),
  ]);
  const validation = employmentValidationService.parseStored(
    profile?.validationResult,
  );
  const canPay = validation?.canSubmit === true;

  const cancelled = params.cancelled === "1";
  const failed = params.failed === "1";
  const error = params.error === "callback";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment"
        description="Step 13 — Choose Stripe, SSLCommerz, bKash, or Nagad to pay the application fee."
      />

      {(cancelled || failed || error) && (
        <Panel>
          <StatusPill tone="warning">
            {cancelled
              ? "Payment cancelled"
              : failed
                ? "Payment failed"
                : "Could not confirm payment"}
          </StatusPill>
          <p className="mt-3 text-sm text-stone-600">
            You can try again with the same or a different payment method.
          </p>
        </Panel>
      )}

      <Panel>
        {hasPaid ? (
          <div className="space-y-4">
            <StatusPill tone="success">Paid</StatusPill>
            <p className="text-sm text-stone-600">
              Your application fee is confirmed. Continue to confirmation to
              review details before submission.
            </p>
            <Button asChild size="lg">
              <Link href="/work/employment/confirmation">
                Continue to confirmation
              </Link>
            </Button>
          </div>
        ) : canPay ? (
          <PaymentCheckout
            feeLabel={EMPLOYMENT_FEE.name}
            amountLabel={`${EMPLOYMENT_FEE.amount.toLocaleString()} ${EMPLOYMENT_FEE.currency}`}
          />
        ) : (
          <div className="space-y-4">
            <StatusPill tone="warning">Validation required</StatusPill>
            <p className="text-sm text-stone-600">
              Fix validation issues on the Review page before paying.
            </p>
            <Button asChild variant="outline">
              <Link href="/work/employment/review">Complete review first</Link>
            </Button>
          </div>
        )}
      </Panel>

      <Panel>
        <h2 className="text-lg font-semibold text-stone-900">
          Payment history
        </h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">No payments yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-stone-100">
            {history.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {Number(p.amount).toLocaleString()} {p.currency}
                  </p>
                  <p className="text-xs text-stone-500">
                    {p.provider}
                    {p.invoice ? ` · ${p.invoice.invoiceNumber}` : ""}
                    {" · "}
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill
                    tone={
                      p.status === "COMPLETED"
                        ? "success"
                        : p.status === "FAILED" || p.status === "CANCELLED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {p.status}
                  </StatusPill>
                  {p.invoice && p.status === "COMPLETED" ? (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/work/employment/receipt?paymentId=${p.id}`}
                      >
                        Receipt
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
