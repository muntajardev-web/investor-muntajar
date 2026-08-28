"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "./empty-state";
import { MoreHorizontal, Plus, Upload, Search } from "lucide-react";
import { ImportDialog } from "./import-dialog";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  searchable?: boolean;
}

interface ResourceTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  canCreate?: boolean;
  canImport?: boolean;
  onCreate?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onImport?: (file: File, type: "csv" | "excel") => Promise<void>;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function ResourceTable<T extends { id: string }>({
  title,
  description,
  data,
  columns,
  searchPlaceholder = "Search...",
  canCreate = true,
  canImport = true,
  onCreate,
  onEdit,
  onDelete,
  onImport,
  filters,
  actions,
}: ResourceTableProps<T>) {
  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns
        .filter((c) => c.searchable !== false)
        .some((c) => {
          const val = c.cell(row);
          return String(val).toLowerCase().includes(q);
        }),
    );
  }, [data, columns, search]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters}
          {actions}
          {canImport && onImport && (
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="h-3.5 w-3.5" />
              Import
            </Button>
          )}
          {canCreate && onCreate && (
            <Button size="sm" onClick={onCreate}>
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} found`}
          description={description}
          action={
            canCreate && onCreate ? (
              <Button size="sm" onClick={onCreate}>
                Add {title.replace(/s$/, "")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.header}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="w-10" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.cell(row)}</TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(row)}>
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(row)}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {onImport && (
        <ImportDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          resource={title}
          onImport={onImport}
        />
      )}
    </div>
  );
}
