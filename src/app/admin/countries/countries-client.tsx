"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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

interface CountryRow {
  id: string;
  name: string;
  code: string;
  code3: string;
  currency: string;
  livingCost: unknown;
  status: string;
}

export function CountriesClient({ countries }: { countries: CountryRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", code3: "", currency: "USD" });

  async function handleSave() {
    const res = await fetch("/api/admin/countries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      toast.error("Failed to save");
      return;
    }
    toast.success("Country created");
    setOpen(false);
    router.refresh();
  }

  async function handleImport(file: File, type: "csv" | "excel") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resource", "countries");
    formData.append("type", type);
    const res = await fetch("/api/admin/import", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Import failed");
    toast.success("Countries imported");
    router.refresh();
  }

  return (
    <>
      <ResourceTable
        title="Countries"
        data={countries}
        onCreate={() => setOpen(true)}
        onImport={handleImport}
        columns={[
          { key: "name", header: "Name", cell: (r) => r.name },
          { key: "code", header: "Code", cell: (r) => r.code },
          { key: "currency", header: "Currency", cell: (r) => r.currency },
          {
            key: "living",
            header: "Living Cost",
            cell: (r) => (r.livingCost ? String(r.livingCost) : "—"),
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
            <DialogTitle>Add Country</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Code (2)</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div>
                <Label>Code (3)</Label>
                <Input value={form.code3} onChange={(e) => setForm({ ...form, code3: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
