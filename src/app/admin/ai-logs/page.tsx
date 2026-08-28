import { Suspense } from "react";
import { Activity, Coins, Cpu, Timer } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { AiAuditClient } from "@/components/admin/ai-audit-client";
import { listAiAudits } from "@/services/ai/ai-audit.service";
import type {
  AiAuditAction,
  AiAuditStatus,
  AiUserApproval,
} from "@prisma/client";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export default async function AiLogsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (key: string) => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  const filters = {
    action: (pick("action") as AiAuditAction | "ALL" | undefined) ?? "ALL",
    status: (pick("status") as AiAuditStatus | "ALL" | undefined) ?? "ALL",
    model: pick("model"),
    provider: pick("provider"),
    userApproval:
      (pick("userApproval") as AiUserApproval | "ALL" | undefined) ?? "ALL",
    from: pick("from"),
    to: pick("to"),
    q: pick("q"),
    take: 300,
  };

  const { logs, stats } = await listAiAudits(filters);

  const rows = logs.map((log) => ({
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
        title="AI Audit System"
        description="Track every AI action — tokens, cost, duration, status, and user approval."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total AI usage"
          value={stats.totalCalls.toLocaleString()}
          change={`${stats.promptTokens.toLocaleString()} prompt · ${stats.completionTokens.toLocaleString()} completion tokens`}
          icon={Activity}
        />
        <StatCard
          label="Total tokens"
          value={stats.totalTokens.toLocaleString()}
          change="Across filtered results"
          icon={Cpu}
        />
        <StatCard
          label="AI cost"
          value={formatUsd(stats.totalCostUsd)}
          change="Estimated USD"
          icon={Coins}
        />
        <StatCard
          label="Total duration"
          value={`${(stats.totalDurationMs / 1000).toFixed(1)}s`}
          change="Sum of call latency"
          icon={Timer}
        />
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
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
