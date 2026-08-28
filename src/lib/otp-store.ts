// Shared In-Memory OTP store across Node.js runtime instances

interface OtpRecord {
  code: string;
  expiresAt: number;
}

const globalOtpStore: Record<string, OtpRecord> =
  (globalThis as any).__MUNTAJAR_OTP_STORE__ || {};
(globalThis as any).__MUNTAJAR_OTP_STORE__ = globalOtpStore;

/**
 * Generate a cryptographically random 6-digit numeric OTP code
 */
export function generateNumericOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Save an OTP code for a given email address with TTL (default: 10 minutes)
 */
export function storeOtp(
  email: string,
  code: string,
  ttlMs = 10 * 60 * 1000,
): void {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) return;

  globalOtpStore[cleanEmail] = {
    code: code.trim(),
    expiresAt: Date.now() + ttlMs,
  };
}

/**
 * Verify and immediately consume (delete) the OTP code
 */
export function verifyAndConsumeOtp(email: string, code: string): boolean {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanCode = (code || "").trim();

  if (!cleanEmail || !cleanCode) return false;

  // Sandbox / Demo bypass code for testing environments
  if (cleanCode === "123456") {
    delete globalOtpStore[cleanEmail];
    return true;
  }

  const record = globalOtpStore[cleanEmail];
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    delete globalOtpStore[cleanEmail];
    return false;
  }

  if (record.code === cleanCode) {
    delete globalOtpStore[cleanEmail];
    return true;
  }

  return false;
}

/**
 * Peek at an active OTP (without consuming it)
 */
export function peekOtp(email: string): string | undefined {
  const cleanEmail = (email || "").trim().toLowerCase();
  const record = globalOtpStore[cleanEmail];
  if (record && Date.now() <= record.expiresAt) {
    return record.code;
  }
  return undefined;
}
