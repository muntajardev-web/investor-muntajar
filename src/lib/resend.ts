import { Resend } from "resend";
import { env } from "@/config";

// Singleton Resend client — only initialised when a real key is present
let _resend: Resend | null = null;

function getResendClient(): Resend {
  if (!_resend) {
    if (!env.RESEND_API_KEY) {
      throw new Error(
        "[Resend] RESEND_API_KEY is not configured. Add it to your .env file.",
      );
    }
    _resend = new Resend(env.RESEND_API_KEY);
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResendClient() as unknown as Record<PropertyKey, unknown>)[prop as string];
  },
});

export { getResendClient };
