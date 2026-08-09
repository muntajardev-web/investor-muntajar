"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResourceTable } from "@/components/admin/resource-table";
import { StatusBadge } from "@/components/admin/status-badge";

interface DocRow {
  id: string;
  fileName: string;
  user: { name: string | null; email: string };
  documentType: { name: string };
  verification: { status: string } | null;
  createdAt: Date;
}

export function DocumentsClient({ documents }: { documents: DocRow[] }) {
  const router = useRouter();

  async function verify(id: string, status: "APPROVED" | "REJECTED") {
    const res = await fetch(`/api/admin/documents/${id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Verification failed");
      return;
    }
    toast.success(`Document ${status.toLowerCase()}`);
    router.refresh();
  }

  return (
    <ResourceTable
      title="Documents"
      data={documents}
      canCreate={false}
      canImport={false}
      columns={[
        { key: "file", header: "File", cell: (r) => r.fileName },
        {
          key: "student",
          header: "Student",
          cell: (r) => r.user.name ?? r.user.email,
        },
        { key: "type", header: "Type", cell: (r) => r.documentType.name },
        {
          key: "verification",
          header: "Verification",
          cell: (r) => (
            <StatusBadge status={r.verification?.status ?? "PENDING"} />
          ),
        },
        {
          key: "actions",
          header: "",
          cell: (r) => (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => verify(r.id, "APPROVED")}
                className="text-xs text-emerald-600 hover:underline"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => verify(r.id, "REJECTED")}
                className="text-xs text-red-600 hover:underline"
              >
                Reject
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}
