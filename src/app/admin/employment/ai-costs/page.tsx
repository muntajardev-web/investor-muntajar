import { Suspense } from "react";
import { listAiAudits } from "@/services/ai/ai-audit.service";
import { EMPLOYMENT_AI_ACTIONS } from "@/lib/admin/employment-queries";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { AiAuditClient } from "@/components/admin/ai-audit-client";
import { Activity, Coins, Cpu, Timer } from "lucide-react";
import type { AiAuditStatus, AiUserApproval } from "@prisma/client";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export default async function EmploymentAiCostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (key: string) => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  const { logs, stats } = await listAiAudits({
    action: "ALL",
    status: (pick("status") as AiAuditStatus | "ALL" | undefined) ?? "ALL",
    model: pick("model"),
    provider: pick("provider"),
    userApproval:
      (pick("userApproval") as AiUserApproval | "ALL" | undefined) ?? "ALL",
    from: pick("from"),
    to: pick("to"),
    q: pick("q"),
    take: 500,
  });

  const actionFilter = pick("action");
  const allowed = new Set<string>(EMPLOYMENT_AI_ACTIONS);

  // Keep only employment AI actions (optionally narrowed by action filter)
  const filteredLogs = logs.filter((l) => {
    if (!allowed.has(l.action)) return false;
    if (actionFilter && actionFilter !== "ALL") return l.action === actionFilter;
    return true;
  });

  const totalCost = filteredLogs.reduce(
    (s, l) => s + Number(l.costUsd ?? 0),
    0,
  );
  const totalTokens = filteredLogs.reduce((s, l) => s + l.totalTokens, 0);
  const totalDuration = filteredLogs.reduce((s, l) => s + l.durationMs, 0);

  const rows = filteredLogs.map((log) => ({
    id: log.id,
    timestamp: new Date(log.createdAt).toLocaleString(),
    user: log.user?.name ?? log.user?.email ?? "—",
    action: log.action,
    model: log.model,
    provider: log.provider,
    tokens: String(log.totalTokens),
    cost: formatUsd(Number(log.costUsd)),
    duration: `${log.durationMs} ms`,
    status: log.status,
    approval: log.userApproval,
    input: log.inputSummary ?? "—",
    output: log.outputSummary ?? "—",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employment AI Costs"
        description="Token usage and estimated cost for employment AI actions only."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="AI calls"
          value={filteredLogs.length.toLocaleString()}
          change={`of ${stats.totalCalls} matching filters`}
          icon={Activity}
        />
        <StatCard
          label="Tokens"
          value={totalTokens.toLocaleString()}
          icon={Cpu}
        />
        <StatCard
          label="Cost"
          value={formatUsd(totalCost)}
          icon={Coins}
        />
        <StatCard
          label="Duration"
          value={`${(totalDuration / 1000).toFixed(1)}s`}
          icon={Timer}
        />
      </div>
      <Suspense>
        <AiAuditClient
          rows={rows}
          initial={{
            action: pick("action"),
            status: pick("status"),
            model: pick("model"),
            provider: pick("provider"),
            userApproval: pick("userApproval"),
            from: pick("from"),
            to: pick("to"),
            q: pick("q"),
          }}
        />
      </Suspense>
    </div>
  );
}
