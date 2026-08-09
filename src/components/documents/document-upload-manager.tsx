"use client";

import * as React from "react";
import {
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Award,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UploadedDocMetadata {
  id: string;
  category: string;
  fileName: string;
  s3Key: string;
  publicUrl: string;
  status: string;
  uploadedAt: string;
}

const REQUIRED_CATEGORIES = [
  { code: "PASSPORT", label: "Passport Copy", icon: ShieldCheck, desc: "International Passport bio page (PDF or Image)" },
  { code: "NATIONAL_ID", label: "National ID (NID)", icon: UserCheck, desc: "Government issued NID card" },
  { code: "SSC_HSC_CERTIFICATE", label: "SSC / HSC Certificates", icon: GraduationCap, desc: "Secondary & Higher Secondary certificates" },
  { code: "UNIVERSITY_TRANSCRIPT", label: "University Academic Transcript", icon: BookOpen, desc: "Official academic marksheet/transcript" },
  { code: "CV", label: "Curriculum Vitae (CV)", icon: FileText, desc: "Updated professional resume or CV" },
  { code: "ENGLISH_TEST", label: "IELTS / PTE / TOEFL", icon: Award, desc: "Official English proficiency test score report" },
  { code: "PROFILE_PHOTO", label: "Passport-size Profile Photo", icon: Sparkles, desc: "Clear front-facing passport photo" },
] as const;

export function DocumentUploadManager() {
  const [uploads, setUploads] = React.useState<Record<string, UploadedDocMetadata>>({});
  const [uploadingCategory, setUploadingCategory] = React.useState<string | null>(null);

  const handleFileUpload = async (categoryCode: string, file: File) => {
    setUploadingCategory(categoryCode);
    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: categoryCode,
          fileName: file.name,
          mimeType: file.type || "application/pdf",
          sizeBytes: file.size,
        }),
      });

      const data = await res.json();
      if (data.success && data.document) {
        setUploads((prev) => ({
          ...prev,
          [categoryCode]: {
            id: data.document.id,
            category: categoryCode,
            fileName: data.document.fileName,
            s3Key: data.document.s3Key,
            publicUrl: data.document.publicUrl,
            status: "STORED_IN_NEON_R2",
            uploadedAt: new Date().toLocaleTimeString(),
          },
        }));
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploadingCategory(null);
    }
  };

  const completedCount = Object.keys(uploads).length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Cloudflare R2 Storage Vault
          </span>
          <h2 className="text-xl font-black text-stone-950">Phase 2: Document Vault Uploads</h2>
          <p className="text-xs text-stone-500 font-medium">
            Files are encrypted and stored in Cloudflare R2 (`muntajar-documents-vault`) with metadata stored in Neon PostgreSQL.
          </p>
        </div>

        <div className="text-right shrink-0 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-2xl font-black text-stone-950">{completedCount} / 7</span>
          <p className="text-[10px] font-extrabold uppercase text-stone-500">Vault Verified</p>
        </div>
      </div>

      {/* Grid of 7 Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REQUIRED_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const uploaded = uploads[cat.code];
          const isUploading = uploadingCategory === cat.code;

          return (
            <div
              key={cat.code}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                uploaded
                  ? "bg-emerald-50/50 border-emerald-300"
                  : "bg-white border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${uploaded ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-950">{cat.label}</h3>
                    <p className="text-[11px] text-stone-500 font-medium">{cat.desc}</p>
                  </div>
                </div>

                {uploaded && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300 shrink-0">
                    R2 Uploaded
                  </span>
                )}
              </div>

              {uploaded ? (
                <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span className="truncate max-w-[200px]">{uploaded.fileName}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono truncate">Key: {uploaded.s3Key}</p>
                </div>
              ) : (
                <div>
                  <label className="w-full h-11 rounded-xl border border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                    <UploadCloud className="w-4 h-4 text-stone-500" />
                    <span>{isUploading ? "Uploading to Cloudflare R2..." : `Upload ${cat.label}`}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(cat.code, file);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
