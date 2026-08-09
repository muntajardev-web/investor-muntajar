"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENT_AGENT_CONFIDENCE_THRESHOLD } from "@/services/employment/documents/document-agent.types";
import type { DocumentAgentResult } from "@/services/employment/documents/document-agent.types";

type Props = {
  documentId: string;
  fileName: string;
  confidence: number | null;
  extracted: DocumentAgentResult;
};

export function ExtractionReviewPanel({
  documentId,
  fileName,
  confidence,
  extracted,
}: Props) {
  const router = useRouter();
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(extracted, null, 2),
  );
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);

  async function submit(action: "approve" | "reject") {
    setBusy(action);
    try {
      let extractedData: unknown | undefined;
      if (action === "approve") {
        try {
          extractedData = JSON.parse(jsonText);
        } catch {
          throw new Error("Extracted JSON is invalid — fix before approving");
        }
      }

      const res = await fetch(`/api/employment/documents/${documentId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          extractedData: action === "approve" ? extractedData : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Review failed");
      }

      toast.success(
        action === "approve"
          ? "Approved — profile update queued"
          : "Extraction rejected",
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Review failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-amber-950">
          Review required — AI confidence{" "}
          <span className="tabular-nums">
            {confidence ?? extracted.confidence}%
          </span>{" "}
          (below {DOCUMENT_AGENT_CONFIDENCE_THRESHOLD}%)
        </p>
        <p className="text-xs text-amber-800/80">{fileName}</p>
      </div>
      <p className="mb-3 text-xs text-amber-900/80">
        Edit the JSON if needed, then approve to update your worker profile. Reject
        leaves your profile unchanged.
      </p>

      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        spellCheck={false}
        rows={14}
        className="w-full rounded-md border border-amber-200 bg-white p-3 font-mono text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
      />

      {(extracted.unsupportedClaims?.length ?? 0) > 0 && (
        <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-amber-900/70">
          {extracted.unsupportedClaims.map((claim) => (
            <li key={claim}>{claim}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={!!busy}
          onClick={() => void submit("approve")}
        >
          {busy === "approve" ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : null}
          Approve & update profile
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!!busy}
          onClick={() => void submit("reject")}
        >
          {busy === "reject" ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : null}
          Reject
        </Button>
      </div>
    </div>
  );
}
