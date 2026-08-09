"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResourceTable, type Column } from "@/components/admin/resource-table";

interface GenericRow {
  id: string;
  [key: string]: unknown;
}

interface ColumnConfig {
  key: string;
  header: string;
  accessor?: string;
  render?: (row: GenericRow) => React.ReactNode;
}

interface GenericAdminListProps {
  resource: string;
  data: GenericRow[];
  columns: ColumnConfig[];
  searchPlaceholder?: string;
  canImport?: boolean;
}

export function GenericAdminList({
  resource,
  data,
  columns,
  searchPlaceholder,
  canImport = true,
}: GenericAdminListProps) {
  const router = useRouter();

  const tableColumns: Column<GenericRow>[] = columns.map((c) => ({
    key: c.key,
    header: c.header,
    cell: (row) =>
      c.render
        ? c.render(row)
        : String(row[c.accessor ?? c.key] ?? "—"),
  }));

  async function handleImport(file: File, type: "csv" | "excel") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resource", resource);
    formData.append("type", type);
    const res = await fetch("/api/admin/import", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Import failed");
    toast.success("Import completed");
    router.refresh();
  }

  return (
    <ResourceTable
      title={resource}
      data={data}
      columns={tableColumns}
      searchPlaceholder={searchPlaceholder}
      canCreate={false}
      canImport={canImport}
      onImport={handleImport}
    />
  );
}
