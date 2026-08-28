import { openaiConfig } from "@/config";
import { logger } from "@/lib";
import {
  auditedEmbedding,
  recordSkippedAiAction,
} from "@/services/ai/ai-audit.service";

export async function embedDocumentText(
  text: string,
  audit?: { userId?: string; entityType?: string; entityId?: string },
): Promise<{
  embedding: number[];
  model: string;
}> {
  const model = openaiConfig.embeddingModel;
  const input = text.slice(0, 8000) || "empty document";

  if (!openaiConfig.apiKey || openaiConfig.apiKey.startsWith("sk-dev")) {
    const embedding = localHashEmbedding(input, 64);
    await recordSkippedAiAction({
      action: "EMBEDDING",
      model: "local-hash-v1",
      provider: "local",
      reason: "OpenAI not configured — local hash embedding",
      userId: audit?.userId,
      entityType: audit?.entityType,
      entityId: audit?.entityId,
      inputSummary: input.slice(0, 200),
      outputSummary: "dims=64",
    });
    return { embedding, model: "local-hash-v1" };
  }

  try {
    const response = await auditedEmbedding(
      {
        action: "EMBEDDING",
        userId: audit?.userId,
        entityType: audit?.entityType,
        entityId: audit?.entityId,
        inputSummary: input.slice(0, 200),
      },
      { model, input },
    );
    return {
      embedding: response.data[0]?.embedding ?? localHashEmbedding(input, 64),
      model,
    };
  } catch (error) {
    logger.warn("Embedding API failed, using local hash embedding", { error });
    return { embedding: localHashEmbedding(input, 64), model: "local-hash-v1" };
  }
}

function localHashEmbedding(text: string, dims: number): number[] {
  const out = new Array<number>(dims).fill(0);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    out[i % dims] += (code % 97) / 97;
  }
  const norm = Math.sqrt(out.reduce((s, v) => s + v * v, 0)) || 1;
  return out.map((v) => Number((v / norm).toFixed(6)));
}
