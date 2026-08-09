export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || "",
  model: process.env.OPENAI_MODEL || "openai/gpt-4o-mini",
  fallbackModel: process.env.OPENAI_FALLBACK_MODEL || "google/gemini-2.0-flash-001",
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  maxTokens: 2048,
  temperature: 0.3,
} as const;
