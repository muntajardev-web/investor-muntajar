"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceTable } from "@/components/admin/resource-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EMPLOYMENT_STATUS_FLOW } from "@/lib/employment/format";

type AppRow = {
  id: string;
  worker: string;
  email: string;
  job: string;
  company: string;
  country: string;
  status: string;
  paidAt: string;
  submittedAt: string;
  notes: string;
  timeline: Array<{ id: string; title: string; description: string | null; occurredAt: string }>;
};

const STATUSES = [...EMPLOYMENT_STATUS_FLOW, "REJECTED"] as const;

export function EmploymentApplicationsClient({
  applications,
}: {
  applications: AppRow[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AppRow | null>(null);
  const [status, setStatus] = useState("SUBMITTED");
  const [notes, setNotes] = useState("");
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("status") ?? "",
  );
  const [country, setCountry] = useState(searchParams.get("country") ?? "");

  function applyFilters() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (filterStatus) params.set("status", filterStatus);
    if (country) params.set("country", country);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  async function save() {
    if (!selected) return;
    const res = await fetch(
      `/api/admin/employment/applications/${selected.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: notes || undefined }),
      },
    );
    if (!res.ok) {
      toast.error("Failed to update application");
      return;
    }
    toast.success("Application updated — worker notified");
    setSelected(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employment Applications"
        description="Pipeline management with status transitions, timeline, and notifications."
      />
      <ResourceTable
        title="Applications"
        data={applications}
        columns={[
          { key: "worker", header: "Worker", cell: (r) => r.worker },
          { key: "email", header: "Email", cell: (r) => r.email },
          { key: "job", header: "Job", cell: (r) => r.job },
          { key: "company", header: "Company", cell: (r) => r.company },
          { key: "country", header: "Country", cell: (r) => r.country },
          {
            key: "status",
            header: "Status",
            cell: (r) => <StatusBadge status={r.status} />,
          },
          { key: "submittedAt", header: "Submitted", cell: (r) => r.submittedAt },
        ]}
        canCreate={false}
        canImport={false}
        onEdit={(row) => {
          setSelected(row);
          setStatus(row.status);
          setNotes(row.notes === "—" ? "" : row.notes);
        }}
        filters={
          <div className="grid w-full gap-2 sm:grid-cols-4">
            <Input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="rounded-md border border-border bg-background px-2 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <Button onClick={applyFilters} disabled={pending}>
              Apply filters
            </Button>
          </div>
        }
      />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update application</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selected.worker} · {selected.job} @ {selected.company}
              </p>
              <label className="block text-xs text-muted-foreground">
                Status
                <select
                  className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-muted-foreground">
                Notes
                <textarea
                  className="mt-1 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto text-sm">
                  {selected.timeline.length === 0 ? (
                    <li className="text-muted-foreground">No events</li>
                  ) : (
                    selected.timeline.map((t) => (
                      <li key={t.id}>
                        <p className="font-medium">{t.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.occurredAt}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <Button onClick={save} className="w-full">
                Save & notify worker
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
