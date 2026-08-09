"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export type FilterField = {
  key: string;
  label: string;
  type?: "text" | "select" | "date";
  options?: Array<{ value: string; label: string }>;
};

export type FormField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox";
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
};

type Row = { id: string; [key: string]: unknown };

export function EmploymentCrudClient({
  title,
  description,
  rows,
  columns,
  filters = [],
  formFields = [],
  createUrl,
  updateUrl,
  deleteEnabled = true,
  canCreate = true,
  canEdit = true,
  extraActions,
  detailRender,
}: {
  title: string;
  description?: string;
  rows: Row[];
  columns: Array<{
    key: string;
    header: string;
    badge?: boolean;
  }>;
  filters?: FilterField[];
  formFields?: FormField[];
  createUrl?: string;
  updateUrl?: (id: string) => string;
  deleteEnabled?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  extraActions?: React.ReactNode;
  detailRender?: (row: Row) => React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Row | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(
    () => {
      const init: Record<string, string> = {};
      for (const f of filters) {
        init[f.key] = searchParams.get(f.key) ?? "";
      }
      init.q = searchParams.get("q") ?? "";
      return init;
    },
  );

  const tableColumns: Column<Row>[] = useMemo(
    () =>
      columns.map((c) => ({
        key: c.key,
        header: c.header,
        cell: (row) =>
          c.badge ? (
            <StatusBadge status={String(row[c.key] ?? "—")} />
          ) : (
            String(row[c.key] ?? "—")
          ),
      })),
    [columns],
  );

  function applyFilters() {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(localFilters)) {
      if (v && v !== "ALL") params.set(k, v);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function openCreate() {
    setEditing(null);
    const next: Record<string, string> = {};
    for (const f of formFields) next[f.key] = "";
    setForm(next);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    const next: Record<string, string> = {};
    for (const f of formFields) {
      const val = row[f.key];
      next[f.key] =
        val == null
          ? ""
          : Array.isArray(val)
            ? val.join(", ")
            : String(val);
    }
    setForm(next);
    setOpen(true);
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {};
    for (const f of formFields) {
      const raw = form[f.key] ?? "";
      if (f.type === "number") {
        payload[f.key] = raw === "" ? null : Number(raw);
      } else if (f.type === "checkbox") {
        payload[f.key] = raw === "true" || raw === "1";
      } else if (
        f.key === "skills" ||
        f.key === "requirements" ||
        f.key === "languages" ||
        f.key === "preferredCountries"
      ) {
        payload[f.key] = raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        payload[f.key] = raw === "" ? null : raw;
      }
    }
    return payload;
  }

  async function handleSave() {
    if (!createUrl && !updateUrl) return;
    const payload = buildPayload();
    const res = editing
      ? await fetch(updateUrl!(editing.id), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(createUrl!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      toast.error(json?.error?.message ?? "Save failed");
      return;
    }
    toast.success(editing ? "Updated" : "Created");
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(row: Row) {
    if (!updateUrl || !deleteEnabled) return;
    if (!confirm("Delete this record?")) return;
    const res = await fetch(updateUrl(row.id), { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description}>
        {extraActions}
      </PageHeader>

      <ResourceTable
        title={title}
        data={rows}
        columns={tableColumns}
        searchPlaceholder="Search…"
        canCreate={canCreate && !!createUrl}
        canImport={false}
        onCreate={canCreate && createUrl ? openCreate : undefined}
        onEdit={
          canEdit && updateUrl
            ? (row) => openEdit(row)
            : detailRender
              ? (row) => setDetail(row)
              : undefined
        }
        onDelete={
          deleteEnabled && updateUrl ? (row) => handleDelete(row) : undefined
        }
        filters={
          filters.length > 0 || true ? (
            <div className="flex w-full flex-col gap-3">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-xs text-muted-foreground">
                  Search
                  <Input
                    className="mt-1"
                    value={localFilters.q ?? ""}
                    onChange={(e) =>
                      setLocalFilters((s) => ({ ...s, q: e.target.value }))
                    }
                    placeholder="Search…"
                  />
                </label>
                {filters.map((f) => (
                  <label
                    key={f.key}
                    className="text-xs text-muted-foreground"
                  >
                    {f.label}
                    {f.type === "select" ? (
                      <select
                        className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                        value={localFilters[f.key] ?? ""}
                        onChange={(e) =>
                          setLocalFilters((s) => ({
                            ...s,
                            [f.key]: e.target.value,
                          }))
                        }
                      >
                        <option value="">All</option>
                        {(f.options ?? []).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        className="mt-1"
                        type={f.type === "date" ? "date" : "text"}
                        value={localFilters[f.key] ?? ""}
                        onChange={(e) =>
                          setLocalFilters((s) => ({
                            ...s,
                            [f.key]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={applyFilters} disabled={pending}>
                  {pending ? "Filtering…" : "Apply filters"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const cleared: Record<string, string> = { q: "" };
                    for (const f of filters) cleared[f.key] = "";
                    setLocalFilters(cleared);
                    startTransition(() => router.push(pathname));
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : undefined
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Create"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {formFields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label>{f.label}</Label>
                {f.type === "textarea" ? (
                  <textarea
                    className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={form[f.key] ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                  />
                ) : f.type === "select" ? (
                  <select
                    className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                    value={form[f.key] ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                  >
                    <option value="">Select…</option>
                    {(f.options ?? []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    value={form[f.key] ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {detailRender && (
        <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Details</DialogTitle>
            </DialogHeader>
            {detail ? detailRender(detail) : null}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
