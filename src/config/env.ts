import { z } from "zod";

const nodeEnvSchema = z
  .enum(["development", "test", "production"])
  .default("development");

const coreSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
});

const integrationSchema = z.object({
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  AWS_REGION: z.string().default("auto"),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_S3_DOCUMENTS_PREFIX: z.string().default("documents"),
  /** Cloudflare R2 S3-compatible endpoint, e.g. https://<accountid>.r2.cloudflarestorage.com */
  AWS_S3_ENDPOINT: z.string().url().optional().or(z.literal("")),
  R2_ACCOUNT_ID: z.string().optional().or(z.literal("")),
  R2_PUBLIC_URL: z.string().url().optional().or(z.literal("")),
  INNGEST_EVENT_KEY: z.string().optional().or(z.literal("")),
  INNGEST_SIGNING_KEY: z.string().optional().or(z.literal("")),
  VIRUS_SCAN_MODE: z.enum(["heuristic", "disabled"]).default("heuristic"),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4.1"),
  OPENAI_FALLBACK_MODEL: z.string().default("gpt-4.1"),
  OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  /** Resend — transactional email (application updates, document receipts, visa notifications) */
  RESEND_API_KEY: z.string().optional().or(z.literal("")),
  RESEND_FROM_EMAIL: z.string().email().default("noreply@muntajar.com").or(z.literal("")),
  /** Google Gemini — used for employment job ranking (optional; falls back to OpenAI) */
  GEMINI_API_KEY: z.string().optional().or(z.literal("")),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  RECOMMENDATION_TOP_N: z.coerce.number().int().positive().default(10),
  RECOMMENDATION_CACHE_TTL_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(3600),
  /** Payments — optional; missing credentials use demo gateway mode */
  STRIPE_SECRET_KEY: z.string().optional().or(z.literal("")),
  STRIPE_WEBHOOK_SECRET: z.string().optional().or(z.literal("")),
  SSLCOMMERZ_STORE_ID: z.string().optional().or(z.literal("")),
  SSLCOMMERZ_STORE_PASSWORD: z.string().optional().or(z.literal("")),
  SSLCOMMERZ_IS_LIVE: z
    .enum(["true", "false", ""])
    .optional()
    .or(z.literal("")),
  BKASH_APP_KEY: z.string().optional().or(z.literal("")),
  BKASH_APP_SECRET: z.string().optional().or(z.literal("")),
  BKASH_USERNAME: z.string().optional().or(z.literal("")),
  BKASH_PASSWORD: z.string().optional().or(z.literal("")),
  BKASH_IS_LIVE: z.enum(["true", "false", ""]).optional().or(z.literal("")),
  NAGAD_MERCHANT_ID: z.string().optional().or(z.literal("")),
  NAGAD_MERCHANT_PRIVATE_KEY: z.string().optional().or(z.literal("")),
  NAGAD_IS_LIVE: z.enum(["true", "false", ""]).optional().or(z.literal("")),
});

const devIntegrationDefaults = {
  UPSTASH_REDIS_REST_URL: "http://localhost:6379",
  UPSTASH_REDIS_REST_TOKEN: "dev-token",
  AWS_REGION: "auto",
  AWS_ACCESS_KEY_ID: "dev",
  AWS_SECRET_ACCESS_KEY: "dev",
  AWS_S3_BUCKET: "muntajar-documents-dev",
  AWS_S3_DOCUMENTS_PREFIX: "documents",
  AWS_S3_ENDPOINT: "",
  R2_ACCOUNT_ID: "",
  R2_PUBLIC_URL: "",
  INNGEST_EVENT_KEY: "",
  INNGEST_SIGNING_KEY: "",
  VIRUS_SCAN_MODE: "heuristic" as const,
  OPENAI_API_KEY: "sk-dev-placeholder",
  OPENAI_MODEL: "gpt-4.1",
  OPENAI_FALLBACK_MODEL: "gpt-4.1",
  OPENAI_EMBEDDING_MODEL: "text-embedding-3-small",
  RESEND_API_KEY: "",
  RESEND_FROM_EMAIL: "noreply@muntajar.com",
  GEMINI_API_KEY: "",
  GEMINI_MODEL: "gemini-2.0-flash",
  RECOMMENDATION_TOP_N: 10,
  RECOMMENDATION_CACHE_TTL_SECONDS: 3600,
  STRIPE_SECRET_KEY: "",
  STRIPE_WEBHOOK_SECRET: "",
  SSLCOMMERZ_STORE_ID: "",
  SSLCOMMERZ_STORE_PASSWORD: "",
  SSLCOMMERZ_IS_LIVE: "",
  BKASH_APP_KEY: "",
  BKASH_APP_SECRET: "",
  BKASH_USERNAME: "",
  BKASH_PASSWORD: "",
  BKASH_IS_LIVE: "",
  NAGAD_MERCHANT_ID: "",
  NAGAD_MERCHANT_PRIVATE_KEY: "",
  NAGAD_IS_LIVE: "",
} as const;

const envSchema = coreSchema.merge(integrationSchema);

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

function formatEnvErrors(errors: z.ZodError): string {
  const fields = errors.flatten().fieldErrors;
  const lines = Object.entries(fields).map(
    ([key, messages]) => `  ${key}: ${(messages ?? []).join(", ")}`,
  );
  return lines.join("\n");
}

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const defaultCore = {
    NODE_ENV: "development",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    DATABASE_URL: "postgresql://postgres:password@localhost:5432/muntajar_dev",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_placeholder",
    CLERK_SECRET_KEY: "sk_test_placeholder",
  };

  const core = coreSchema.safeParse({
    ...defaultCore,
    ...process.env,
  });

  const parsedCore = core.success ? core.data : defaultCore;

  const integrations = integrationSchema.safeParse({
    ...devIntegrationDefaults,
    ...process.env,
  });

  if (!integrations.success) {
    // Allow Netlify/prod builds without Redis/S3/OpenAI — those features stay disabled.
    console.warn(
      "[env] Optional integrations not configured — using placeholders. " +
        "Redis, S3, and OpenAI features will not work until configured.",
    );
    cachedEnv = { ...parsedCore, ...devIntegrationDefaults } as Env;
    return cachedEnv;
  }

  cachedEnv = { ...parsedCore, ...integrations.data } as Env;
  return cachedEnv;
}

/** Lazy-validated environment. Access triggers validation on first read. */
export const env: Env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return getEnv()[prop];
  },
});
