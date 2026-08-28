"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, StatusPill } from "@/components/employment";
import type { ApplicationPackage } from "@/services/employment/package.service";
import { cn } from "@/lib/utils";

type VariantKey = "professionalCv" | "atsResume" | "countryResume" | "coverLetter";

const TABS: Array<{
  key: VariantKey;
  label: string;
  pdfVariant: "professional" | "ats" | "country" | "cover";
}> = [
  { key: "professionalCv", label: "Professional", pdfVariant: "professional" },
  { key: "atsResume", label: "ATS", pdfVariant: "ats" },
  { key: "countryResume", label: "Country-specific", pdfVariant: "country" },
  { key: "coverLetter", label: "Cover letter", pdfVariant: "cover" },
];

export function ResumeBuilderEditor({
  initial,
}: {
  initial: ApplicationPackage | null;
}) {
  const router = useRouter();
  const [pkg, setPkg] = useState<ApplicationPackage | null>(initial);
  const [active, setActive] = useState<VariantKey>("professionalCv");
  const [draft, setDraft] = useState(initial?.[active] ?? "");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPkg(initial);
    if (initial) {
      setDraft(initial[active] ?? "");
      setDirty(false);
    }
  }, [initial]);

  useEffect(() => {
    if (!pkg) return;
    setDraft(pkg[active] ?? "");
    setDirty(false);
  }, [active]);

  function updateDraft(value: string) {
    setDraft(value);
    setDirty(true);
  }

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/employment/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Generate failed");
      }
      const next = json.data.package as ApplicationPackage;
      setPkg(next);
      setDraft(next[active] ?? "");
      setDirty(false);
      toast.success("Resumes generated from verified profile data");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generate failed");
    } finally {
      setGenerating(false);
    }
  }

  async function saveEdits(showToast = true) {
    if (!pkg) return null;
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
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Save failed");
      }
      const next = json.data.package as ApplicationPackage;
      setPkg(next);
      setDirty(false);
      if (showToast) toast.success("Edits saved");
      router.refresh();
      return next;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function downloadPdf() {
    const tab = TABS.find((t) => t.key === active)!;
    setDownloading(true);
    try {
      if (dirty) {
        const saved = await saveEdits(false);
        if (!saved) return;
      }

      const res = await fetch(
        `/api/employment/package/pdf?variant=${tab.pdfVariant}`,
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(
          json?.error?.message ?? `PDF download failed (${res.status})`,
        );
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] ?? `${tab.pdfVariant}-resume.pdf`;
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

  if (!pkg) {
    return (
      <Panel>
        <p className="text-stone-600">
          Generate Professional, ATS, and country-specific resumes from your
          verified worker profile only. Empty fields are omitted — nothing is
          invented.
        </p>
        <Button
          className="mt-4"
          disabled={generating}
          onClick={() => void generate()}
        >
          {generating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Generate resumes
        </Button>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-stone-500">
              Layout:{" "}
              <span className="font-medium text-stone-800">
                {pkg.countryLabel}
              </span>
              {pkg.userEdited ? " · edited" : ""}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Generated {new Date(pkg.generatedAt).toLocaleString()} · verified
              profile fields only
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={generating}
              onClick={() => void generate()}
            >
              {generating ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : null}
              Regenerate
            </Button>
            <Button
              variant="outline"
              size="sm"
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
              disabled={downloading}
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

        {dirty && (
          <p className="mt-3 text-xs text-amber-700">
            Unsaved edits — save or download (auto-saves) before switching away.
          </p>
        )}
      </Panel>

      {pkg.applicationSummary && (
        <Panel>
          <h2 className="text-lg font-semibold text-stone-900">Summary</h2>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-stone-600">
            {pkg.applicationSummary}
          </pre>
        </Panel>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              if (dirty && pkg) {
                setPkg({ ...pkg, [active]: draft });
              }
              setActive(tab.key);
            }}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              active === tab.key
                ? "border-orange-300 bg-orange-50 text-orange-900"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
            )}
          >
            {tab.label}
          </button>
        ))}
        {dirty ? <StatusPill tone="warning">Unsaved</StatusPill> : null}
      </div>

      <Panel>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">
            {TABS.find((t) => t.key === active)?.label} — editable
          </h2>
          <p className="text-xs text-stone-400">
            Edit before download. PDF uses your saved text.
          </p>
        </div>
        <textarea
          value={draft}
          onChange={(e) => updateDraft(e.target.value)}
          rows={22}
          spellCheck={false}
          className="w-full rounded-md border border-stone-200 bg-stone-50/50 p-3 font-mono text-xs leading-relaxed text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </Panel>

      {pkg.requiredDocuments.length > 0 && (
        <Panel>
          <h2 className="text-lg font-semibold text-stone-900">
            Document checklist
          </h2>
          <ul className="mt-3 space-y-1">
            {pkg.requiredDocuments.map((doc) => (
              <li key={doc} className="text-sm text-stone-600">
                • {doc}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
