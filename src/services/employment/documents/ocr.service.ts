import {
  auditedChatCompletion,
  recordSkippedAiAction,
  summarizeAiText,
} from "@/services/ai/ai-audit.service";
import { openaiConfig } from "@/config";
import { logger } from "@/lib";

export type OcrResult = {
  text: string;
  method: "pdf-text" | "vision-ocr" | "filename-fallback";
  confidence: number;
  pageEstimate?: number;
};

function extractPdfText(buffer: Buffer): string {
  const raw = buffer.toString("latin1");
  const chunks: string[] = [];
  const regex = /BT([\s\S]*?)ET/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    const block = match[1];
    const textMatches = block.match(/\((?:\\.|[^\\)])*\)/g) ?? [];
    for (const t of textMatches) {
      const cleaned = t
        .slice(1, -1)
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\t/g, " ")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\");
      if (cleaned.trim()) chunks.push(cleaned);
    }
  }
  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

async function visionOcr(
  buffer: Buffer,
  mimeType: string,
  audit?: { userId?: string; entityId?: string },
): Promise<string> {
  if (!openaiConfig.apiKey || openaiConfig.apiKey.startsWith("sk-dev")) {
    await recordSkippedAiAction({
      action: "DOCUMENT_OCR",
      model: openaiConfig.model,
      provider: "openai",
      reason: "OpenAI not configured",
      userId: audit?.userId,
      entityType: "EmploymentDocument",
      entityId: audit?.entityId,
      inputSummary: `vision-ocr ${mimeType}`,
    });
    return "";
  }

  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const completion = await auditedChatCompletion(
    {
      action: "DOCUMENT_OCR",
      userId: audit?.userId,
      entityType: "EmploymentDocument",
      entityId: audit?.entityId,
      inputSummary: `Vision OCR · ${mimeType}`,
    },
    {
      model: openaiConfig.model,
      temperature: 0,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content:
            "You are an OCR engine. Extract all readable text from the document image. Return plain text only.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this document.",
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
    },
  );

  return completion.choices[0]?.message?.content?.trim() ?? "";
}

export async function runOcr(input: {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  userId?: string;
  documentId?: string;
}): Promise<OcrResult> {
  const { buffer, mimeType, fileName, userId, documentId } = input;

  try {
    if (mimeType === "application/pdf") {
      const text = extractPdfText(buffer);
      if (text.length > 40) {
        await recordSkippedAiAction({
          action: "DOCUMENT_OCR",
          model: "pdf-text-extract",
          provider: "local",
          reason: "Used local PDF text extraction",
          userId,
          entityType: "EmploymentDocument",
          entityId: documentId,
          inputSummary: fileName,
          outputSummary: summarizeAiText(text),
        });
        return {
          text,
          method: "pdf-text",
          confidence: 0.7,
        };
      }
    }

    if (mimeType.startsWith("image/")) {
      const text = await visionOcr(buffer, mimeType, {
        userId,
        entityId: documentId,
      });
      if (text) {
        return {
          text,
          method: "vision-ocr",
          confidence: 0.85,
        };
      }
    }

    await recordSkippedAiAction({
      action: "DOCUMENT_OCR",
      model: "filename-fallback",
      provider: "local",
      reason: "Filename fallback",
      userId,
      entityType: "EmploymentDocument",
      entityId: documentId,
      inputSummary: fileName,
    });

    return {
      text: `Document filename: ${fileName}`,
      method: "filename-fallback",
      confidence: 0.2,
    };
  } catch (error) {
    logger.warn("OCR failed, using filename fallback", { error, fileName });
    return {
      text: `Document filename: ${fileName}`,
      method: "filename-fallback",
      confidence: 0.1,
    };
  }
}
