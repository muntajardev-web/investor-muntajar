import { env } from "./env";

export const clerkConfig = {
  publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: env.CLERK_SECRET_KEY,
  webhookSecret: env.CLERK_WEBHOOK_SECRET,
} as const;
