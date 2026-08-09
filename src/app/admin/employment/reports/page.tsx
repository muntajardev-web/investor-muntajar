import { PageHeader } from "@/components/admin/page-header";
import { getEmploymentAnalytics } from "@/lib/admin/employment-queries";
import { formatEmploymentStatus } from "@/lib/employment/format";
import { prisma } from "@/lib/prisma";
import { employmentPaymentWhere } from "@/lib/admin/employment-queries";

export default async function EmploymentReportsPage() {
  const [analytics, payments, tickets] = await Promise.all([
    getEmploymentAnalytics(),
    prisma.payment.findMany({
      where: employmentPaymentWhere({ status: "COMPLETED" }),
      include: {
        user: { select: { email: true, name: true } },
        invoice: true,
      },
      orderBy: { paidAt: "desc" },
      take: 50,
    }),
    prisma.supportTicket.groupBy({
      by: ["status"],
      where: { deletedAt: null, category: "employment" },
      _count: { _all: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employment Reports"
        description="Export-ready summaries from live workers, applications, payments, and tickets."
      />

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Executive summary</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Workers</dt>
            <dd className="text-xl font-semibold">{analytics.funnel.workers}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Applications</dt>
            <dd className="text-xl font-semibold">
              {analytics.stats.applications}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Paid workers</dt>
            <dd className="text-xl font-semibold">{analytics.funnel.paid}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Revenue</dt>
            <dd className="text-xl font-semibold">
              {analytics.stats.paymentsRevenue.toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Application status report</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2">Status</th>
              <th className="py-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(analytics.statusCounts).map(([status, count]) => (
              <tr key={status} className="border-t border-border">
                <td className="py-2">
                  {formatEmploymentStatus(status as never)}
                </td>
                <td className="py-2 tabular-nums">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Support ticket report</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2">Status</th>
              <th className="py-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td className="py-2 text-muted-foreground" colSpan={2}>
                  No tickets yet.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.status} className="border-t border-border">
                  <td className="py-2">{t.status}</td>
                  <td className="py-2 tabular-nums">{t._count._all}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">
          Recent completed payments (50)
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Provider</th>
                <th className="py-2">Invoice</th>
                <th className="py-2">Paid at</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="py-2">
                    {p.user.name ?? p.user.email}
                  </td>
                  <td className="py-2 tabular-nums">
                    {Number(p.amount).toLocaleString()} {p.currency}
                  </td>
                  <td className="py-2">{p.provider}</td>
                  <td className="py-2">
                    {p.invoice?.invoiceNumber ?? "—"}
                  </td>
                  <td className="py-2">
                    {p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
