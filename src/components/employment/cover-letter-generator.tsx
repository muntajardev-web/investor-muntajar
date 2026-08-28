"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, StatusPill } from "@/components/employment";
import {
  COVER_LETTER_LANGUAGES,
  COVER_LETTER_TEMPLATES,
  type CoverLetterLanguageId,
  type CoverLetterTemplateId,
} from "@/services/employment/cover-letter.service";
import { cn } from "@/lib/utils";

export type CoverLetterVersionRow = {
  id: string;
  version: number;
  template: string;
  language: string;
  jobTitle: string | null;
  company: string | null;
  country: string | null;
  content: string;
  userEdited: boolean;
  isActive: boolean;
  createdAt: string | Date;
};

type JobOption = {
  id: string;
  title: string;
  company: string;
  country: string;
};

export function CoverLetterGenerator({
  initialVersions,
  jobs,
}: {
  initialVersions: CoverLetterVersionRow[];
  jobs: JobOption[];
}) {
  const router = useRouter();
  const [versions, setVersions] = useState(initialVersions);
  const [selectedId, setSelectedId] = useState(
    initialVersions.find((v) => v.isActive)?.id ?? initialVersions[0]?.id ?? null,
  );
  const [template, setTemplate] =
    useState<CoverLetterTemplateId>("professional");
  const [language, setLanguage] = useState<CoverLetterLanguageId>("en");
  const [jobListingId, setJobListingId] = useState(jobs[0]?.id ?? "");
  const [draft, setDraft] = useState(
    initialVersions.find((v) => v.isActive)?.content ??
      initialVersions[0]?.content ??
      "",
  );
  const [dirty, setDirty] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const selected = useMemo(
    () => versions.find((v) => v.id === selectedId) ?? null,
    [versions, selectedId],
  );

  function selectVersion(id: string) {
    const v = versions.find((x) => x.id === id);
    if (!v) return;
    setSelectedId(id);
    setDraft(v.content);
    setDirty(false);
    setTemplate(
      (COVER_LETTER_TEMPLATES.find((t) => t.id === v.template)?.id ??
        "professional") as CoverLetterTemplateId,
    );
    setLanguage(
      (COVER_LETTER_LANGUAGES.find((l) => l.id === v.language)?.id ??
        "en") as CoverLetterLanguageId,
    );
  }

  async function generate() {
    setGenerating(true);
    try {
      const job = jobs.find((j) => j.id === jobListingId);
      const res = await fetch("/api/employment/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          language,
          jobListingId: jobListingId || undefined,
          jobTitle: job?.title,
          company: job?.company,
          country: job?.country,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Generate failed");
      }
      const version = json.data.version as CoverLetterVersionRow;
      setVersions((prev) => [
        version,
        ...prev.map((v) => ({ ...v, isActive: false })),
      ]);
      setSelectedId(version.id);
      setDraft(version.content);
      setDirty(false);
      toast.success(`Cover letter v${version.version} generated`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generate failed");
    } finally {
      setGenerating(false);
    }
  }

  async function saveEdits() {
    if (!selectedId) return false;
    setSaving(true);
    try {
      const res = await fetch("/api/employment/cover-letter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, content: draft }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Save failed");
      }
      const version = json.data.version as CoverLetterVersionRow;
      setVersions((prev) =>
        prev.map((v) =>
          v.id === version.id ? version : { ...v, isActive: false },
        ),
      );
      setDirty(false);
      toast.success("Edits saved");
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
    if (!selectedId) {
      toast.error("Generate a cover letter first");
      return;
    }
    setDownloading(true);
    try {
      if (dirty) {
        const ok = await saveEdits();
        if (!ok) return;
      }
      const res = await fetch(
        `/api/employment/cover-letter/pdf?id=${selectedId}`,
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error?.message ?? "PDF download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] ?? "cover-letter.pdf";
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

  return (
    <div className="space-y-6">
      <Panel>
        <p className="text-sm text-stone-600">
          Personalized from your verified profile, selected job, company,
          country, and language. Empty fields are omitted — nothing is invented.
          Each generate creates a stored version.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-stone-700">
              Template
            </span>
            <select
              value={template}
              onChange={(e) =>
                setTemplate(e.target.value as CoverLetterTemplateId)
              }
              className="h-10 w-full rounded-md border border-stone-200 bg-white px-2 text-sm"
            >
              {COVER_LETTER_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-stone-400">
              {
                COVER_LETTER_TEMPLATES.find((t) => t.id === template)
                  ?.description
              }
            </span>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-stone-700">
              Language
            </span>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as CoverLetterLanguageId)
              }
              className="h-10 w-full rounded-md border border-stone-200 bg-white px-2 text-sm"
            >
              {COVER_LETTER_LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block font-medium text-stone-700">
              Job / company / country
            </span>
            <select
              value={jobListingId}
              onChange={(e) => setJobListingId(e.target.value)}
              className="h-10 w-full rounded-md border border-stone-200 bg-white px-2 text-sm"
            >
              <option value="">General (no specific job)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} · {j.company} · {j.country}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button disabled={generating} onClick={() => void generate()}>
            {generating ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 h-4 w-4" />
            )}
            Generate cover letter
          </Button>
          <Button
            variant="outline"
            disabled={!selectedId || saving || !dirty}
            onClick={() => void saveEdits()}
          >
            {saving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save edits
          </Button>
          <Button
            variant="outline"
            disabled={!selectedId || downloading}
            onClick={() => void downloadPdf()}
          >
            {downloading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1.5 h-4 w-4" />
            )}
            Download PDF
          </Button>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Panel className="h-fit">
          <h2 className="text-base font-semibold text-stone-900">Versions</h2>
          {versions.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">
              No versions yet. Generate your first letter.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {versions.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => selectVersion(v.id)}
                    className={cn(
                      "w-full rounded-md border px-2.5 py-2 text-left text-sm transition-colors",
                      selectedId === v.id
                        ? "border-orange-300 bg-orange-50 text-orange-950"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium">v{v.version}</span>
                      {v.isActive ? (
                        <StatusPill tone="success">Active</StatusPill>
                      ) : null}
                    </span>
                    <span className="mt-1 block truncate text-xs text-stone-500">
                      {v.template}
                      {v.jobTitle ? ` · ${v.jobTitle}` : ""}
                      {v.userEdited ? " · edited" : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                {selected
                  ? `Version ${selected.version} — editable`
                  : "Cover letter"}
              </h2>
              {selected && (
                <p className="mt-1 text-xs text-stone-400">
                  {[selected.jobTitle, selected.company, selected.country]
                    .filter(Boolean)
                    .join(" · ") || "General application"}
                  {dirty ? " · unsaved edits" : ""}
                </p>
              )}
            </div>
            {dirty ? <StatusPill tone="warning">Unsaved</StatusPill> : null}
          </div>

          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setDirty(true);
            }}
            rows={20}
            disabled={!selected}
            placeholder="Generate a cover letter to start editing…"
            className="w-full rounded-md border border-stone-200 bg-stone-50/50 p-3 font-mono text-xs leading-relaxed text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-60"
          />
        </Panel>
      </div>
    </div>
  );
}
