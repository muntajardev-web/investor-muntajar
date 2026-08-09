import Link from "next/link";
import { requireAuth } from "@/server/auth/session";
import { getStudentApplications } from "@/lib/student/queries";
import {
  formatApplicationStatus,
  applicationStatusTone,
  formatDate,
} from "@/lib/student/format";
import { PageHeader, StatusPill, EmptyPanel } from "@/components/student";
import { Button } from "@/components/ui/button";

export default async function ApplicationsPage() {
  const session = await requireAuth();
  const applications = await getStudentApplications(session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Applications"
        description="Track every university application in one place."
      />

      {applications.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-stone-200/80 bg-white">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400">
                <th className="px-5 py-3 font-medium">University</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Program</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-stone-900">{app.university.name}</p>
                    <p className="mt-0.5 text-xs text-stone-500 md:hidden">
                      {app.program.name}
                    </p>
                  </td>
                  <td className="hidden px-5 py-4 text-stone-600 md:table-cell">
                    {app.program.name}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill tone={applicationStatusTone(app.status)}>
                      {formatApplicationStatus(app.status)}
                    </StatusPill>
                  </td>
                  <td className="hidden px-5 py-4 tabular-nums text-stone-500 sm:table-cell">
                    {formatDate(app.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyPanel
          title="No applications yet"
          description="When you apply to a university, it will appear here with live status updates."
          action={
            <Button asChild size="sm">
              <Link href="/dashboard/recommendations">Find universities</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
