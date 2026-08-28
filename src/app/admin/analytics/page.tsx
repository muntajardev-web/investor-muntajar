import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { getAdminStats } from "@/lib/admin/queries";
import {
  Users,
  FileText,
  Building2,
  Sparkles,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AnalyticsPage() {
  const stats = await getAdminStats();

  const [byStatus, topCountries] = await Promise.all([
    prisma.application.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    }),
    prisma.university.groupBy({
      by: ["countryId"],
      where: { deletedAt: null },
      _count: true,
      orderBy: { _count: { countryId: "desc" } },
      take: 5,
    }),
  ]);

  const countryIds = topCountries.map((c) => c.countryId);
  const countries = await prisma.country.findMany({
    where: { id: { in: countryIds } },
  });
  const countryMap = new Map(countries.map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Platform metrics and performance insights."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.students} icon={Users} />
        <StatCard label="Applications" value={stats.applications} icon={FileText} />
        <StatCard label="Universities" value={stats.universities} icon={Building2} />
        <StatCard label="AI Recommendations" value={stats.recommendations} icon={Sparkles} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 text-sm font-medium">Applications by Status</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byStatus.map((row) => (
                <TableRow key={row.status}>
                  <TableCell className="capitalize">
                    {row.status.replace(/_/g, " ").toLowerCase()}
                  </TableCell>
                  <TableCell className="text-right">{row._count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 text-sm font-medium">Top Countries</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Universities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCountries.map((row) => (
                <TableRow key={row.countryId}>
                  <TableCell>{countryMap.get(row.countryId) ?? "—"}</TableCell>
                  <TableCell className="text-right">{row._count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
