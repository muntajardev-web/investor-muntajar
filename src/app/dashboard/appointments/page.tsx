import Link from "next/link";
import { requireAuth } from "@/server/auth/session";
import { getStudentConsultations } from "@/lib/student/queries";
import {
  formatConsultationStatus,
  formatConsultationType,
  formatDateTime,
} from "@/lib/student/format";
import { PageHeader, StatusPill, EmptyPanel } from "@/components/student";
import { Button } from "@/components/ui/button";
import { Calendar, Video } from "lucide-react";

export default async function AppointmentsPage() {
  const session = await requireAuth();
  const consultations = await getStudentConsultations(session.user.id);
  const upcoming = consultations.filter(
    (c) =>
      new Date(c.scheduledAt) >= new Date() &&
      !["CANCELLED", "COMPLETED", "NO_SHOW"].includes(c.status),
  );
  const past = consultations.filter(
    (c) =>
      new Date(c.scheduledAt) < new Date() ||
      ["CANCELLED", "COMPLETED", "NO_SHOW"].includes(c.status),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointments"
        description="Consultations with your assigned advisor."
        action={
          <Button size="sm" variant="outline" disabled>
            Book session
          </Button>
        }
      />

      {consultations.length > 0 ? (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-400">
                Upcoming
              </h2>
              {upcoming.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-4 rounded-xl border border-stone-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-50">
                      <Calendar className="h-4 w-4 text-stone-500" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-stone-900">
                        {formatConsultationType(c.type)}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        with {c.agent?.user.name ?? "Advisor"} ·{" "}
                        {formatDateTime(c.scheduledAt)} · {c.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill tone="accent">
                      {formatConsultationStatus(c.status)}
                    </StatusPill>
                    {c.meetingUrl && (
                      <a
                        href={c.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Join
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {past.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-400">
                Past
              </h2>
              {past.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white px-5 py-4"
                >
                  <div>
                    <p className="text-[13px] text-stone-800">
                      {formatConsultationType(c.type)}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {formatDateTime(c.scheduledAt)}
                    </p>
                  </div>
                  <StatusPill tone="neutral">
                    {formatConsultationStatus(c.status)}
                  </StatusPill>
                </div>
              ))}
            </section>
          )}
        </div>
      ) : (
        <EmptyPanel
          title="No appointments"
          description="Book a consultation with an advisor to discuss your study abroad plans."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
