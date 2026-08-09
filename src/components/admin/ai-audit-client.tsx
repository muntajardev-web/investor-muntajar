"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuditRow = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  model: string;
  provider: string;
  tokens: string;
  cost: string;
  duration: string;
  status: string;
  approval: string;
  input: string;
  output: string;
};

const ACTIONS = [
  "ALL",
  "DOCUMENT_OCR",
  "DOCUMENT_AGENT",
  "EMBEDDING",
  "EMPLOYMENT_ANALYSIS",
  "JOB_RANKING",
  "CAREER_ADVISOR",
  "STUDY_ABROAD_ANALYSIS",
  "JUSTIFICATION",
  "OTHER",
] as const;

const STATUSES = ["ALL", "SUCCESS", "ERROR", "FALLBACK", "SKIPPED"] as const;
const APPROVALS = [
  "ALL",
  "NOT_REQUIRED",
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;

export function AiAuditClient({
  rows,
  initial,
}: {
  rows: AuditRow[];
  initial: {
    action?: string;
    status?: string;
    model?: string;
    provider?: string;
    userApproval?: string;
    from?: string;
    to?: string;
    q?: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [action, setAction] = useState(initial.action ?? "ALL");
  const [status, setStatus] = useState(initial.status ?? "ALL");
  const [approval, setApproval] = useState(initial.userApproval ?? "ALL");
  const [model, setModel] = useState(initial.model ?? "");
  const [provider, setProvider] = useState(initial.provider ?? "");
  const [from, setFrom] = useState(initial.from ?? "");
  const [to, setTo] = useState(initial.to ?? "");
  const [q, setQ] = useState(initial.q ?? "");

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, value: string) => {
      if (!value || value === "ALL") params.delete(key);
      else params.set(key, value);
    };
    setOrDelete("action", action);
    setOrDelete("status", status);
    setOrDelete("userApproval", approval);
    setOrDelete("model", model.trim());
    setOrDelete("provider", provider.trim());
    setOrDelete("from", from);
    setOrDelete("to", to);
    setOrDelete("q", q.trim());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clearFilters() {
    setAction("ALL");
    setStatus("ALL");
    setApproval("ALL");
    setModel("");
    setProvider("");
    setFrom("");
    setTo("");
    setQ("");
    startTransition(() => router.push(pathname));
  }

  const columns: Column<AuditRow>[] = useMemo(
    () => [
      { key: "timestamp", header: "Timestamp", cell: (r) => r.timestamp },
      { key: "user", header: "User", cell: (r) => r.user },
      { key: "action", header: "Action", cell: (r) => r.action },
      { key: "model", header: "Model", cell: (r) => r.model },
      { key: "provider", header: "Provider", cell: (r) => r.provider },
      { key: "tokens", header: "Tokens", cell: (r) => r.tokens },
      { key: "cost", header: "Cost", cell: (r) => r.cost },
      { key: "duration", header: "Duration", cell: (r) => r.duration },
      {
        key: "status",
        header: "Status",
        cell: (r) => <StatusBadge status={r.status} />,
      },
      {
        key: "approval",
        header: "User Approval",
        cell: (r) => <StatusBadge status={r.approval} />,
      },
      {
        key: "input",
        header: "Input Summary",
        cell: (r) => (
          <span className="line-clamp-2 max-w-[220px] text-xs text-muted-foreground">
            {r.input}
          </span>
        ),
      },
      {
        key: "output",
        header: "Output Summary",
        cell: (r) => (
          <span className="line-clamp-2 max-w-[220px] text-xs text-muted-foreground">
            {r.output}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <ResourceTable
      title="AI audit history"
      description="Every AI action with tokens, cost, duration, and approval state."
      data={rows}
      columns={columns}
      searchPlaceholder="Search summaries, models…"
      canCreate={false}
      canImport={false}
      filters={
        <div className="flex w-full flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-muted-foreground">
              Action
              <select
                className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Status
              <select
                className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              User approval
              <select
                className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                value={approval}
                onChange={(e) => setApproval(e.target.value)}
              >
                {APPROVALS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Provider
              <Input
                className="mt-1"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="openai / gemini"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Model
              <Input
                className="mt-1"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gpt-4.1"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              From
              <Input
                className="mt-1"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label className="text-xs text-muted-foreground">
              To
              <Input
                className="mt-1"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Search
              <Input
                className="mt-1"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Input / output text"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={applyFilters} disabled={pending}>
              {pending ? "Filtering…" : "Apply filters"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={clearFilters}
              disabled={pending}
            >
              Clear
            </Button>
          </div>
        </div>
      }
    />
  );
}
