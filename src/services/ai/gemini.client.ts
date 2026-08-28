import { env } from "@/config";

export const geminiConfig = {
  apiKey: env.GEMINI_API_KEY || "",
  model: env.GEMINI_MODEL || "gemini-2.0-flash",
} as const;

export function isGeminiConfigured() {
  return Boolean(
    geminiConfig.apiKey &&
      !geminiConfig.apiKey.startsWith("dev") &&
      geminiConfig.apiKey.length > 10,
  );
}

/**
 * Call Gemini generateContent and return raw text (expects JSON in response).
 */
export async function geminiGenerateJson(prompt: string): Promise<string> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini API key not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini error ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return text;
}
