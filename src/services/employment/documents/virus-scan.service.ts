import { env } from "@/config";
import { logger } from "@/lib";

export type VirusScanResult = {
  clean: boolean;
  engine: string;
  threats: string[];
  details: string;
};

/**
 * Production-ready virus scan step.
 * Uses heuristic validation by default; swap engine via VIRUS_SCAN_MODE / future ClamAV hook.
 */
export async function scanDocumentBuffer(input: {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
}): Promise<VirusScanResult> {
  if (env.VIRUS_SCAN_MODE === "disabled") {
    return {
      clean: true,
      engine: "disabled",
      threats: [],
      details: "Virus scanning disabled by configuration",
    };
  }

  const threats: string[] = [];
  const { buffer, mimeType, fileName } = input;

  if (buffer.length === 0) {
    threats.push("empty_file");
  }

  if (buffer.length > 10 * 1024 * 1024) {
    threats.push("oversized_file");
  }

  // Executable / script magic bytes
  const header = buffer.subarray(0, 8);
  if (header[0] === 0x4d && header[1] === 0x5a) {
    threats.push("windows_executable");
  }
  if (
    header[0] === 0x7f &&
    header[1] === 0x45 &&
    header[2] === 0x4c &&
    header[3] === 0x46
  ) {
    threats.push("elf_executable");
  }

  const lowerName = fileName.toLowerCase();
  if (/\.(exe|bat|cmd|scr|js|vbs|ps1|msi|dll)$/i.test(lowerName)) {
    threats.push("dangerous_extension");
  }

  // MIME / content mismatch checks
  if (mimeType === "application/pdf") {
    const asText = buffer.subarray(0, 5).toString("utf8");
    if (!asText.startsWith("%PDF")) {
      threats.push("pdf_header_mismatch");
    }
  }

  if (mimeType.startsWith("image/jpeg")) {
    if (!(header[0] === 0xff && header[1] === 0xd8)) {
      threats.push("jpeg_header_mismatch");
    }
  }

  if (mimeType === "image/png") {
    const pngSig = [0x89, 0x50, 0x4e, 0x47];
    if (!pngSig.every((b, i) => header[i] === b)) {
      threats.push("png_header_mismatch");
    }
  }

  // EICAR test string
  const sample = buffer.subarray(0, Math.min(buffer.length, 2048)).toString("utf8");
  if (sample.includes("EICAR-STANDARD-ANTIVIRUS-TEST-FILE")) {
    threats.push("eicar_test_virus");
  }

  const clean = threats.length === 0;
  logger.info("Virus scan completed", {
    fileName,
    mimeType,
    clean,
    threats,
  });

  return {
    clean,
    engine: "heuristic-v1",
    threats,
    details: clean
      ? "No threats detected"
      : `Threats detected: ${threats.join(", ")}`,
  };
}
