"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceTable } from "@/components/admin/resource-table";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UniversityRow {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  status: string;
  acceptanceRate: number | null;
  country: { name: string; code: string };
}

interface UniversitiesClientProps {
  universities: UniversityRow[];
  countries: Array<{ id: string; name: string; code: string }>;
}

export function UniversitiesClient({
  universities,
  countries,
}: UniversitiesClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UniversityRow | null>(null);
  const [form, setForm] = useState({
    name: "",
    city: "",
    website: "",
    countryCode: countries[0]?.code ?? "",
    acceptanceRate: "",
  });

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      city: "",
      website: "",
      countryCode: countries[0]?.code ?? "",
      acceptanceRate: "",
    });
    setOpen(true);
  }

  function openEdit(row: UniversityRow) {
    setEditing(row);
    setForm({
      name: row.name,
      city: row.city ?? "",
      website: "",
      countryCode: row.country.code,
      acceptanceRate: row.acceptanceRate?.toString() ?? "",
    });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      city: form.city || null,
      website: form.website || null,
      countryCode: form.countryCode,
      acceptanceRate: form.acceptanceRate
        ? parseFloat(form.acceptanceRate)
        : null,
    };

    const res = editing
      ? await fetch(`/api/admin/universities/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/universities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (!res.ok) {
      toast.error("Failed to save university");
      return;
    }

    toast.success(editing ? "University updated" : "University created");
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(row: UniversityRow) {
    if (!confirm(`Delete ${row.name}?`)) return;
    const res = await fetch(`/api/admin/universities/${row.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("University deleted");
    router.refresh();
  }

  async function handleImport(file: File, type: "csv" | "excel") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resource", "universities");
    formData.append("type", type);
    const res = await fetch("/api/admin/import", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Import failed");
    const data = await res.json();
    toast.success(`Imported ${data.data?.imported ?? 0} universities`);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Universities"
        description="Manage partner and catalog universities."
      />
      <ResourceTable
        title="Universities"
        data={universities}
        searchPlaceholder="Search universities..."
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        onImport={handleImport}
        columns={[
          { key: "name", header: "Name", cell: (r) => r.name },
          {
            key: "country",
            header: "Country",
            cell: (r) => r.country.name,
          },
          {
            key: "city",
            header: "City",
            cell: (r) => r.city ?? "—",
          },
          {
            key: "status",
            header: "Status",
            cell: (r) => <StatusBadge status={r.status} />,
          },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit University" : "Add University"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Country</Label>
              <Select
                value={form.countryCode}
                onValueChange={(v) => setForm({ ...form, countryCode: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div>
              <Label>Acceptance Rate (%)</Label>
              <Input
                type="number"
                value={form.acceptanceRate}
                onChange={(e) =>
                  setForm({ ...form, acceptanceRate: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
