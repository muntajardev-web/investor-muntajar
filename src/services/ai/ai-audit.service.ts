import type {
  AiAuditAction,
  AiAuditStatus,
  AiUserApproval,
  Prisma,
} from "@prisma/client";
import type OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { openaiClient } from "@/services/ai/openai.client";
import {
  geminiGenerateJson,
  geminiConfig,
  isGeminiConfigured,
} from "@/services/ai/gemini.client";
import { logger } from "@/lib";

export type AiAuditContext = {
  action: AiAuditAction;
  userId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  userApproval?: AiUserApproval;
  metadata?: Record<string, unknown>;
  inputSummary?: string;
};

/** USD per 1M tokens — approximate list prices for audit reporting */
const PRICE_PER_1M: Record<
  string,
  { input: number; output: number }
> = {
  "gpt-4.1": { input: 2.0, output: 8.0 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4o": { input: 2.5, output: 10.0 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
  "text-embedding-3-large": { input: 0.13, output: 0 },
  "gemini-2.0-flash": { input: 0.1, output: 0.4 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "local-hash-v1": { input: 0, output: 0 },
};

function priceForModel(model: string) {
  if (PRICE_PER_1M[model]) return PRICE_PER_1M[model];
  const key = Object.keys(PRICE_PER_1M).find((k) =>
    model.toLowerCase().includes(k.toLowerCase()),
  );
  return key ? PRICE_PER_1M[key] : { input: 1.0, output: 3.0 };
}

export function estimateAiCostUsd(opts: {
  model: string;
  promptTokens: number;
  completionTokens: number;
}) {
  const price = priceForModel(opts.model);
  const cost =
    (opts.promptTokens / 1_000_000) * price.input +
    (opts.completionTokens / 1_000_000) * price.output;
  return Number(cost.toFixed(6));
}

export function summarizeAiText(value: unknown, max = 280): string {
  if (value == null) return "";
  const text =
    typeof value === "string" ? value : JSON.stringify(value);
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
}

export async function recordAiAudit(input: {
  action: AiAuditAction;
  provider: string;
  model: string;
  status: AiAuditStatus;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  costUsd?: number;
  durationMs?: number;
  inputSummary?: string | null;
  outputSummary?: string | null;
  userApproval?: AiUserApproval;
  userId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const promptTokens = input.promptTokens ?? 0;
  const completionTokens = input.completionTokens ?? 0;
  const totalTokens =
    input.totalTokens ?? promptTokens + completionTokens;
  const costUsd =
    input.costUsd ??
    estimateAiCostUsd({
      model: input.model,
      promptTokens,
      completionTokens,
    });

  try {
    return await prisma.aiAuditLog.create({
      data: {
        action: input.action,
        provider: input.provider,
        model: input.model,
        status: input.status,
        promptTokens,
        completionTokens,
        totalTokens,
        costUsd,
        durationMs: input.durationMs ?? 0,
        inputSummary: input.inputSummary ?? null,
        outputSummary: input.outputSummary ?? null,
        userApproval: input.userApproval ?? "NOT_REQUIRED",
        userId: input.userId ?? null,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        errorMessage: input.errorMessage ?? null,
        metadata: (input.metadata ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
      },
    });
  } catch (error) {
    logger.warn("Failed to persist AI audit log", { error });
    return null;
  }
}

export async function recordSkippedAiAction(
  ctx: AiAuditContext & {
    model: string;
    provider?: string;
    reason?: string;
    outputSummary?: string;
  },
) {
  return recordAiAudit({
    action: ctx.action,
    provider: ctx.provider ?? "local",
    model: ctx.model,
    status: "SKIPPED",
    inputSummary: ctx.inputSummary,
    outputSummary: ctx.outputSummary ?? ctx.reason ?? "Skipped remote AI call",
    userApproval: ctx.userApproval ?? "NOT_REQUIRED",
    userId: ctx.userId,
    entityType: ctx.entityType,
    entityId: ctx.entityId,
    metadata: { ...(ctx.metadata ?? {}), reason: ctx.reason },
  });
}

function messagesSummary(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
) {
  const parts = messages.map((m) => {
    const content =
      typeof m.content === "string"
        ? m.content
        : Array.isArray(m.content)
          ? m.content
              .map((p) =>
                typeof p === "object" && p && "text" in p
                  ? String((p as { text?: string }).text ?? "")
                  : "[part]",
              )
              .join(" ")
          : "";
    return `${m.role}: ${content}`;
  });
  return summarizeAiText(parts.join(" | "));
}

export async function auditedChatCompletion(
  ctx: AiAuditContext,
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  options?: OpenAI.RequestOptions,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const started = Date.now();
  const model = params.model;
  const inputSummary =
    ctx.inputSummary ?? messagesSummary(params.messages);

  try {
    const completion = await openaiClient.chat.completions.create(
      params,
      options,
    );
    const usage = completion.usage;
    const outputText = completion.choices[0]?.message?.content ?? "";

    await recordAiAudit({
      action: ctx.action,
      provider: "openai",
      model,
      status: "SUCCESS",
      promptTokens: usage?.prompt_tokens ?? 0,
      completionTokens: usage?.completion_tokens ?? 0,
      totalTokens: usage?.total_tokens ?? 0,
      durationMs: Date.now() - started,
      inputSummary,
      outputSummary: summarizeAiText(outputText),
      userApproval: ctx.userApproval ?? "NOT_REQUIRED",
      userId: ctx.userId,
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      metadata: ctx.metadata,
    });

    return completion;
  } catch (error) {
    await recordAiAudit({
      action: ctx.action,
      provider: "openai",
      model,
      status: "ERROR",
      durationMs: Date.now() - started,
      inputSummary,
      outputSummary: null,
      userApproval: ctx.userApproval ?? "NOT_REQUIRED",
      userId: ctx.userId,
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      metadata: ctx.metadata,
    });
    throw error;
  }
}

export async function auditedEmbedding(
  ctx: AiAuditContext,
  params: OpenAI.Embeddings.EmbeddingCreateParams,
): Promise<OpenAI.Embeddings.CreateEmbeddingResponse> {
  const started = Date.now();
  const model = params.model;
  const inputSummary =
    ctx.inputSummary ??
    summarizeAiText(
      typeof params.input === "string"
        ? params.input
        : Array.isArray(params.input)
          ? params.input.join(" ")
          : params.input,
    );

  try {
    const response = await openaiClient.embeddings.create(params);
    const usage = response.usage;
    const promptTokens = usage?.prompt_tokens ?? 0;

    await recordAiAudit({
      action: ctx.action,
      provider: "openai",
      model,
      status: "SUCCESS",
      promptTokens,
      completionTokens: 0,
      totalTokens: usage?.total_tokens ?? promptTokens,
      durationMs: Date.now() - started,
      inputSummary,
      outputSummary: `embedding dims=${response.data[0]?.embedding?.length ?? 0}`,
      userApproval: ctx.userApproval ?? "NOT_REQUIRED",
      userId: ctx.userId,
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      metadata: ctx.metadata,
    });

    return response;
  } catch (error) {
    await recordAiAudit({
      action: ctx.action,
      provider: "openai",
      model,
      status: "ERROR",
      durationMs: Date.now() - started,
      inputSummary,
      userApproval: ctx.userApproval ?? "NOT_REQUIRED",
      userId: ctx.userId,
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      metadata: ctx.metadata,
    });
    throw error;
  }
}

export async function auditedGeminiGenerateJson(
  ctx: AiAuditContext,
  prompt: string,
): Promise<string> {
  const started = Date.now();
  const model = geminiConfig.model;
  const inputSummary = ctx.inputSummary ?? summarizeAiText(prompt);

  if (!isGeminiConfigured()) {
    await recordSkippedAiAction({
      ...ctx,
      model,
      provider: "gemini",
      reason: "Gemini not configured",
      inputSummary,
    });
    throw new Error("Gemini API key not configured");
  }

  try {
    const text = await geminiGenerateJson(prompt);
    // Gemini wrapper does not expose usage yet — estimate from chars
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(text.length / 4);

    await recordAiAudit({
      action: ctx.action,
      provider: "gemini",
      model,
      status: "SUCCESS",
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      durationMs: Date.now() - started,
      inputSummary,
      outputSummary: summarizeAiText(text),
      userApproval: ctx.userApproval ?? "NOT_REQUIRED",
      userId: ctx.userId,
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      metadata: { ...(ctx.metadata ?? {}), usageEstimated: true },
    });

    return text;
  } catch (error) {
    await recordAiAudit({
      action: ctx.action,
      provider: "gemini",
      model,
      status: "ERROR",
      durationMs: Date.now() - started,
      inputSummary,
      userApproval: ctx.userApproval ?? "NOT_REQUIRED",
      userId: ctx.userId,
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      metadata: ctx.metadata,
    });
    throw error;
  }
}

export async function setAiAuditUserApproval(opts: {
  entityType: string;
  entityId: string;
  action?: AiAuditAction;
  approval: AiUserApproval;
}) {
  if (!opts.entityId) return null;

  const latest = await prisma.aiAuditLog.findFirst({
    where: {
      entityType: opts.entityType,
      entityId: opts.entityId,
      deletedAt: null,
      ...(opts.action ? { action: opts.action } : {}),
      userApproval: { in: ["PENDING", "NOT_REQUIRED"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) return null;

  return prisma.aiAuditLog.update({
    where: { id: latest.id },
    data: { userApproval: opts.approval },
  });
}

export type AiAuditFilters = {
  action?: AiAuditAction | "ALL";
  status?: AiAuditStatus | "ALL";
  model?: string;
  provider?: string;
  userApproval?: AiUserApproval | "ALL";
  userId?: string;
  from?: string;
  to?: string;
  q?: string;
  take?: number;
};

export async function listAiAudits(filters: AiAuditFilters = {}) {
  const take = Math.min(filters.take ?? 300, 500);
  const where: Prisma.AiAuditLogWhereInput = {
    deletedAt: null,
  };

  if (filters.action && filters.action !== "ALL") {
    where.action = filters.action;
  }
  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters.userApproval && filters.userApproval !== "ALL") {
    where.userApproval = filters.userApproval;
  }
  if (filters.model?.trim()) {
    where.model = { contains: filters.model.trim(), mode: "insensitive" };
  }
  if (filters.provider?.trim()) {
    where.provider = {
      contains: filters.provider.trim(),
      mode: "insensitive",
    };
  }
  if (filters.userId) {
    where.userId = filters.userId;
  }
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }
  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { inputSummary: { contains: q, mode: "insensitive" } },
      { outputSummary: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { entityType: { contains: q, mode: "insensitive" } },
      { errorMessage: { contains: q, mode: "insensitive" } },
    ];
  }

  const [logs, aggregates] = await Promise.all([
    prisma.aiAuditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.aiAuditLog.aggregate({
      where,
      _count: { _all: true },
      _sum: {
        totalTokens: true,
        promptTokens: true,
        completionTokens: true,
        costUsd: true,
        durationMs: true,
      },
    }),
  ]);

  return {
    logs,
    stats: {
      totalCalls: aggregates._count._all,
      totalTokens: aggregates._sum.totalTokens ?? 0,
      promptTokens: aggregates._sum.promptTokens ?? 0,
      completionTokens: aggregates._sum.completionTokens ?? 0,
      totalCostUsd: Number(aggregates._sum.costUsd ?? 0),
      totalDurationMs: aggregates._sum.durationMs ?? 0,
    },
  };
}

export const aiAuditService = {
  recordAiAudit,
  recordSkippedAiAction,
  auditedChatCompletion,
  auditedEmbedding,
  auditedGeminiGenerateJson,
  setAiAuditUserApproval,
  listAiAudits,
  estimateAiCostUsd,
  summarizeAiText,
};
