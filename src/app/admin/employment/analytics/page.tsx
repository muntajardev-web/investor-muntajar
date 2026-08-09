import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { getEmploymentAnalytics } from "@/lib/admin/employment-queries";
import { formatEmploymentStatus } from "@/lib/employment/format";
import {
  Users,
  CreditCard,
  FileText,
  CheckCircle2,
  Percent,
} from "lucide-react";

export default async function EmploymentAnalyticsPage() {
  const data = await getEmploymentAnalytics();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employment Analytics"
        description="Funnel, status mix, geography, revenue, and AI cost from live data."
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/employment/reports">Open reports</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Workers"
          value={data.funnel.workers}
          icon={Users}
        />
        <StatCard label="Paid" value={data.funnel.paid} icon={CreditCard} />
        <StatCard
          label="Submitted"
          value={data.funnel.submitted}
          icon={FileText}
        />
        <StatCard
          label="Completed"
          value={data.funnel.completed}
          icon={CheckCircle2}
        />
        <StatCard
          label="Conversion"
          value={`${data.funnel.conversionPct}%`}
          change="Workers → submitted"
          icon={Percent}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Pipeline status mix</h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(data.statusCounts).map(([status, count]) => {
              const total = Math.max(data.stats.applications, 1);
              const pct = Math.round((count / total) * 100);
              return (
                <li key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <StatusBadge
                      status={formatEmploymentStatus(status as never)}
                    />
                    <span className="tabular-nums text-muted-foreground">
                      {count} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground/70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Jobs by country</h2>
          <ul className="mt-3 space-y-2">
            {data.jobsByCountry.map((row) => (
              <li
                key={row.country}
                className="flex items-center justify-between text-sm"
              >
                <span>{row.country}</span>
                <span className="tabular-nums text-muted-foreground">
                  {row._count._all}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-border p-3">
              <p className="text-muted-foreground">Payment revenue</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {data.stats.paymentsRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-muted-foreground">AI cost (USD)</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                ${data.stats.aiCostUsd.toFixed(4)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
