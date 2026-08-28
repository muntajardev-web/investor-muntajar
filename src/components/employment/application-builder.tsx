"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Download,
  Loader2,
  Package,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, ProgressBar, StatusPill } from "@/components/employment";
import type {
  ApplicationPackage,
  PackageCollectionStatus,
  PackageDocumentItem,
} from "@/services/employment/package.service";
import { cn } from "@/lib/utils";

type VariantKey =
  | "professionalCv"
  | "atsResume"
  | "countryResume"
  | "coverLetter"
  | "applicationSummary";

const EDIT_TABS: Array<{
  key: VariantKey;
  label: string;
  pdfVariant?: "professional" | "ats" | "country" | "cover";
}> = [
  { key: "professionalCv", label: "Professional resume", pdfVariant: "professional" },
  { key: "atsResume", label: "ATS resume", pdfVariant: "ats" },
  { key: "countryResume", label: "Country resume", pdfVariant: "country" },
  { key: "coverLetter", label: "Cover letter", pdfVariant: "cover" },
  { key: "applicationSummary", label: "Package summary" },
];

const COLLECTION_ROWS: Array<{
  key: keyof Omit<PackageCollectionStatus, "readyCount" | "totalCount">;
  label: string;
  href: string;
}> = [
  { key: "resume", label: "Resume", href: "/work/employment/builder" },
  { key: "coverLetter", label: "Cover letter", href: "/work/employment/cover-letter" },
  { key: "passport", label: "Passport details", href: "/work/employment/profile" },
  { key: "passportDocument", label: "Passport document", href: "/work/employment/documents" },
  { key: "certificates", label: "Certificates", href: "/work/employment/profile" },
  { key: "experience", label: "Experience", href: "/work/employment/experience" },
  { key: "education", label: "Education", href: "/work/employment/education" },
];

function asList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

export function ApplicationBuilder({
  initialPackage,
  initialCollection,
  initialDocuments,
}: {
  initialPackage: ApplicationPackage | null;
  initialCollection: PackageCollectionStatus;
  initialDocuments: PackageDocumentItem[];
}) {
  const router = useRouter();
  const [pkg, setPkg] = useState(initialPackage);
  const [collection, setCollection] = useState(initialCollection);
  const [documents] = useState(initialDocuments);
  const [active, setActive] = useState<VariantKey>("professionalCv");
  const [draft, setDraft] = useState(initialPackage?.[active] ?? "");
  const [dirty, setDirty] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(!!initialPackage);

  const pct = useMemo(() => {
    if (!collection.totalCount) return 0;
    return Math.round((collection.readyCount / collection.totalCount) * 100);
  }, [collection]);

  function switchTab(key: VariantKey) {
    if (pkg && dirty) {
      setPkg({ ...pkg, [active]: draft });
    }
    setActive(key);
    setDraft(pkg?.[key] ?? "");
    setDirty(false);
  }

  async function assemble() {
    setGenerating(true);
    try {
      const res = await fetch("/api/employment/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Assemble failed");
      }
      const next = json.data.package as ApplicationPackage;
      setPkg(next);
      setCollection(next.collection);
      setDraft(next[active] ?? "");
      setDirty(false);
      setPreviewOpen(true);
      toast.success("Final application package generated and stored");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Assemble failed");
    } finally {
      setGenerating(false);
    }
  }

  async function saveEdits() {
    if (!pkg) return false;
    setSaving(true);
    try {
      const res = await fetch("/api/employment/package", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalCv:
            active === "professionalCv" ? draft : pkg.professionalCv,
          atsResume: active === "atsResume" ? draft : pkg.atsResume,
          countryResume:
            active === "countryResume" ? draft : pkg.countryResume,
          coverLetter: active === "coverLetter" ? draft : pkg.coverLetter,
          applicationSummary:
            active === "applicationSummary"
              ? draft
              : pkg.applicationSummary,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Save failed");
      }
      const next = json.data.package as ApplicationPackage;
      setPkg(next);
      setCollection(next.collection);
      setDirty(false);
      toast.success("Package edits saved");
      router.refresh();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function downloadPdf() {
    const tab = EDIT_TABS.find((t) => t.key === active);
    if (!tab?.pdfVariant) {
      toast.error("Select a resume or cover letter tab to download PDF");
      return;
    }
    setDownloading(true);
    try {
      if (dirty) {
        const ok = await saveEdits();
        if (!ok) return;
      }
      const res = await fetch(
        `/api/employment/package/pdf?variant=${tab.pdfVariant}`,
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error?.message ?? "PDF failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] ?? `${tab.pdfVariant}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF failed");
    } finally {
      setDownloading(false);
    }
  }

  const snapshot = pkg?.profileSnapshot;
  const education = asList(snapshot?.education);
  const experience = asList(snapshot?.experience);
  const certifications = asList(snapshot?.certifications);

  return (
    <div className="space-y-6">
      {/* Collect */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              Collect application materials
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Resume, cover letter, passport, certificates, experience, and
              education — organized into one stored package.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums text-stone-900">
              {collection.readyCount}/{collection.totalCount}
            </p>
            <p className="text-xs uppercase tracking-wide text-stone-400">
              Ready
            </p>
          </div>
        </div>
        <ProgressBar value={pct} className="mt-4" />

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {COLLECTION_ROWS.map((row) => {
            const ready = collection[row.key];
            return (
              <li key={row.key}>
                <Link
                  href={row.href}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                    ready
                      ? "border-emerald-200 bg-emerald-50/50 text-emerald-900"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {ready ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-stone-300" />
                    )}
                    {row.label}
                  </span>
                  <StatusPill tone={ready ? "success" : "warning"}>
                    {ready ? "Ready" : "Add"}
                  </StatusPill>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button disabled={generating} onClick={() => void assemble()}>
            {generating ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Package className="mr-1.5 h-4 w-4" />
            )}
            {pkg ? "Regenerate final package" : "Generate final package"}
          </Button>
          {pkg && (
            <Button
              variant="outline"
              onClick={() => setPreviewOpen((v) => !v)}
            >
              {previewOpen ? "Hide preview" : "Preview package"}
            </Button>
          )}
        </div>
      </Panel>

      {/* Live document inventory */}
      <Panel>
        <h2 className="text-lg font-semibold text-stone-900">
          Uploaded documents
        </h2>
        {documents.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            No documents uploaded yet.{" "}
            <Link
              href="/work/employment/documents"
              className="font-medium text-orange-700 hover:underline"
            >
              Upload passport & certificates
            </Link>
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(pkg?.documents?.length ? pkg.documents : documents).map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2 text-sm last:border-0"
              >
                <span className="text-stone-800">{d.label}</span>
                <span className="truncate text-stone-500">{d.fileName}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {!pkg ? (
        <Panel>
          <p className="text-stone-600">
            Complete the sections above, then generate the final application
            package to preview, edit, and store it for submission.
          </p>
        </Panel>
      ) : (
        previewOpen && (
          <>
            {/* Organized preview */}
            <Panel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">
                    Package preview
                  </h2>
                  <p className="mt-1 text-xs text-stone-400">
                    Generated {new Date(pkg.generatedAt).toLocaleString()}
                    {pkg.userEdited ? " · edited" : ""} · stored on your
                    profile
                  </p>
                </div>
                {pkg.targetJob?.title && (
                  <StatusPill tone="accent">
                    {[pkg.targetJob.title, pkg.targetJob.company, pkg.targetJob.country]
                      .filter(Boolean)
                      .join(" · ")}
                  </StatusPill>
                )}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Passport
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">
                    {snapshot?.passportNumber
                      ? `${snapshot.passportNumber}${snapshot.passportExpiry ? ` · exp ${snapshot.passportExpiry}` : ""}`
                      : "No passport details on profile"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Contact
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">
                    {[snapshot?.fullName, snapshot?.email, snapshot?.phone]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Education ({education.length})
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-stone-600">
                    {education.length === 0 ? (
                      <li>None on file</li>
                    ) : (
                      education.slice(0, 4).map((e, i) => (
                        <li key={i}>
                          • {[e.level, e.institution, e.graduationYear]
                            .filter(Boolean)
                            .join(" — ")}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Experience ({experience.length})
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-stone-600">
                    {experience.length === 0 ? (
                      <li>None on file</li>
                    ) : (
                      experience.slice(0, 4).map((e, i) => (
                        <li key={i}>
                          • {[e.position, e.employer ? `at ${e.employer}` : null]
                            .filter(Boolean)
                            .join(" ")}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Certificates ({certifications.length})
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-stone-600">
                    {certifications.length === 0 ? (
                      <li>None on file</li>
                    ) : (
                      certifications.slice(0, 4).map((c, i) => (
                        <li key={i}>
                          • {[c.name, c.issuer].filter(Boolean).join(" — ")}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Skills
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">
                    {snapshot?.skills?.length
                      ? snapshot.skills.join(", ")
                      : "None on file"}
                  </p>
                </div>
              </div>
            </Panel>

            {/* Editable package text */}
            <Panel>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-stone-900">
                  Edit before submission
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={saving || !dirty}
                    onClick={() => void saveEdits()}
                  >
                    {saving ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Save edits
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={downloading || active === "applicationSummary"}
                    onClick={() => void downloadPdf()}
                  >
                    {downloading ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {EDIT_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => switchTab(tab.key)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium",
                      active === tab.key
                        ? "border-orange-300 bg-orange-50 text-orange-900"
                        : "border-stone-200 bg-white text-stone-600",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
                {dirty ? <StatusPill tone="warning">Unsaved</StatusPill> : null}
              </div>

              <textarea
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setDirty(true);
                }}
                rows={18}
                className="w-full rounded-md border border-stone-200 bg-stone-50/50 p-3 font-mono text-xs leading-relaxed text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/work/employment/cover-letter">
                    Open cover letter generator
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/work/employment/review">
                    Preview & validate for submission
                  </Link>
                </Button>
              </div>
            </Panel>
          </>
        )
      )}
    </div>
  );
}
