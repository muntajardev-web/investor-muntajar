"use client";

import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionShell } from "../section-shell";

type Props = {
  photoUrl?: string | null;
  photoFileName?: string | null;
  complete?: boolean;
  onUploaded: (data: {
    photoUrl: string;
    photoFileName: string;
    completion: number;
  }) => void;
  onRemoved: (completion: number) => void;
};

export function PhotoSection({
  photoUrl,
  photoFileName,
  complete,
  onUploaded,
  onRemoved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(photoUrl ?? null);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5_000_000) {
      toast.error("Image must be under 5MB");
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const res = await fetch("/api/employment/profile/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          dataUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Upload failed");
      }
      setPreview(json.data.profile.photoUrl);
      onUploaded({
        photoUrl: json.data.profile.photoUrl,
        photoFileName: json.data.profile.photoFileName,
        completion: json.data.completion,
      });
      toast.success("Photo saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    setLoading(true);
    try {
      const res = await fetch("/api/employment/profile/photo", {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Remove failed");
      }
      setPreview(null);
      onRemoved(json.data.completion);
      toast.success("Photo removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Remove failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionShell
      id="photo"
      title="Profile Photo"
      description="Upload a clear passport-style photo."
      complete={complete}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-stone-400">No photo</span>
          )}
        </div>
        <div className="space-y-2">
          {photoFileName && (
            <p className="text-sm text-stone-600">{photoFileName}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                  e.target.value = "";
                }}
              />
              <span className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
                <Upload className="h-4 w-4" />
                {loading ? "Uploading…" : "Upload photo"}
              </span>
            </label>
            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => void remove()}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
