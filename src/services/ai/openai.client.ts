import OpenAI from "openai";
import { openaiConfig } from "@/config";

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

function createOpenAIClient(): OpenAI {
  const apiKey = openaiConfig.apiKey;
  // OpenRouter keys need their base URL; plain OpenAI keys use the default host.
  const isOpenRouter = apiKey.startsWith("sk-or-");
  return new OpenAI({
    apiKey,
    ...(isOpenRouter
      ? {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
            "X-Title": "Muntajar",
          },
        }
      : {}),
  });
}

export const openaiClient = globalForOpenAI.openai ?? createOpenAIClient();

if (process.env.NODE_ENV !== "production") {
  globalForOpenAI.openai = openaiClient;
}
