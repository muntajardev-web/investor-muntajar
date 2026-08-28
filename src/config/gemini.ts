import { env } from "@/config";

export const geminiConfig = {
  apiKey: env.GEMINI_API_KEY || "",
  model: env.GEMINI_MODEL || "gemini-2.0-flash",
} as const;
