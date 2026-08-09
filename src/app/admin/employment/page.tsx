import Link from "next/link";
import {
  Users,
  Building,
  Briefcase,
  FileText,
  CreditCard,
  Wallet,
  LifeBuoy,
  Globe,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { getEmploymentAdminOverview } from "@/lib/admin/employment-queries";
import { formatEmploymentStatus } from "@/lib/employment/format";

function money(n: number, currency = "BDT") {
  return `${n.toLocaleString()} ${currency}`;
}

export default async function EmploymentAdminOverviewPage() {
  const data = await getEmploymentAdminOverview();
  const { stats } = data;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employment Admin"
        description="Manage workers, employers, jobs, applications, payments, AI costs, and support — all from live database data."
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/employment/analytics">Analytics</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/employment/jobs">Manage jobs</Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Workers" value={stats.workers} icon={Users} />
        <StatCard
          label="Employers / Companies"
          value={stats.employers + stats.companies}
          change={`${stats.employers} employers · ${stats.companies} companies`}
          icon={Building}
        />
        <StatCard label="Jobs" value={stats.jobs} icon={Briefcase} />
        <StatCard
          label="Applications"
          value={stats.applications}
          icon={FileText}
        />
        <StatCard
          label="Payments"
          value={stats.paymentsCount}
          change={money(stats.paymentsRevenue)}
          icon={CreditCard}
        />
        <StatCard
          label="AI cost"
          value={`$${stats.aiCostUsd.toFixed(4)}`}
          change={`${stats.aiCalls} calls · ${stats.aiTokens.toLocaleString()} tokens`}
          icon={Wallet}
        />
        <StatCard
          label="Open tickets"
          value={stats.openTickets}
          icon={LifeBuoy}
        />
        <StatCard
          label="Countries / visas"
          value={`${stats.countries} / ${stats.visaPrograms}`}
          icon={Globe}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Applications by status</h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(data.statusCounts).map(([status, count]) => (
              <li
                key={status}
                className="flex items-center justify-between text-sm"
              >
                <StatusBadge status={formatEmploymentStatus(status as never)} />
                <span className="tabular-nums text-muted-foreground">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Jobs by country</h2>
          <ul className="mt-3 space-y-2">
            {data.jobsByCountry.length === 0 ? (
              <li className="text-sm text-muted-foreground">No jobs yet.</li>
            ) : (
              data.jobsByCountry.map((row) => (
                <li
                  key={row.country}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{row.country}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {row._count._all}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent applications</h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/employment/applications">View all</Link>
            </Button>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {data.recentApplications.map((app) => (
              <li key={app.id} className="py-2.5 text-sm">
                <p className="font-medium">
                  {app.user.name ?? app.user.email}
                </p>
                <p className="text-muted-foreground">
                  {app.jobListing?.title ?? "General"} ·{" "}
                  {formatEmploymentStatus(app.status)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent payments</h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/employment/payments">View all</Link>
            </Button>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {data.recentPayments.map((p) => (
              <li key={p.id} className="py-2.5 text-sm">
                <p className="font-medium">
                  {Number(p.amount).toLocaleString()} {p.currency}
                </p>
                <p className="text-muted-foreground">
                  {p.user.name ?? p.user.email} · {p.status} · {p.provider}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
