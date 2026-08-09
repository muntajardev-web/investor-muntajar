"use client";

import Link from "next/link";
import {
  Users,
  FileText,
  Building2,
  GraduationCap,
  Calendar,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { ActivityTimeline } from "@/components/admin/activity-timeline";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardClientProps {
  stats: {
    students: number;
    applications: number;
    universities: number;
    programs: number;
    consultations: number;
    pendingDocs: number;
    recommendations: number;
  };
  activity: {
    audits: Array<{
      id: string;
      action: string;
      entityType: string;
      createdAt: Date;
      user: { name: string | null; email: string } | null;
    }>;
    applications: Array<{
      id: string;
      status: string;
      updatedAt: Date;
      user: { name: string | null; email: string };
      university: { name: string };
    }>;
  };
}

export function DashboardClient({ stats, activity }: DashboardClientProps) {
  const timelineItems = [
    ...activity.audits.map((a) => ({
      id: a.id,
      title: `${a.action} ${a.entityType}`,
      description: a.user?.name ?? a.user?.email ?? "System",
      time: new Date(a.createdAt).toLocaleString(),
    })),
  ].slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={stats.students} icon={Users} />
        <StatCard
          label="Applications"
          value={stats.applications}
          icon={FileText}
        />
        <StatCard
          label="Universities"
          value={stats.universities}
          icon={Building2}
        />
        <StatCard label="Programs" value={stats.programs} icon={GraduationCap} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-1">
          <StatCard
            label="Consultations"
            value={stats.consultations}
            icon={Calendar}
          />
          <StatCard
            label="Pending Docs"
            value={stats.pendingDocs}
            icon={FolderOpen}
          />
          <StatCard
            label="AI Recommendations"
            value={stats.recommendations}
            icon={Sparkles}
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent Applications</h2>
            <Link
              href="/admin/applications"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
          {activity.applications.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No applications yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="text-sm">
                      {app.user.name ?? app.user.email}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {app.university.name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-medium">Activity Log</h2>
        <ActivityTimeline items={timelineItems} />
      </div>
    </div>
  );
}
