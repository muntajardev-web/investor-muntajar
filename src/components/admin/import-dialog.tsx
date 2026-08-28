"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  resource: string;
  onImport: (file: File, type: "csv" | "excel") => Promise<void>;
}

export function ImportDialog({
  open,
  onClose,
  resource,
  onImport,
}: ImportDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>, type: "csv" | "excel") {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      await onImport(file, type);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import {resource}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="csv">
          <TabsList className="w-full">
            <TabsTrigger value="csv" className="flex-1">
              CSV
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex-1">
              Excel
            </TabsTrigger>
          </TabsList>
          <TabsContent value="csv" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with column headers matching the {resource} schema.
            </p>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 transition-colors hover:bg-muted/50">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Choose CSV file</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                disabled={loading}
                onChange={(e) => handleFile(e, "csv")}
              />
            </label>
          </TabsContent>
          <TabsContent value="excel" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload an Excel (.xlsx) file for bulk import.
            </p>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 transition-colors hover:bg-muted/50">
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Choose Excel file</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                disabled={loading}
                onChange={(e) => handleFile(e, "excel")}
              />
            </label>
          </TabsContent>
        </Tabs>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
