import { env } from "@/config/env";
import type {
  ProviderSessionInput,
  ProviderSessionResult,
} from "./types";

function appUrl() {
  return env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

function demoSession(
  input: ProviderSessionInput,
  provider: string,
): ProviderSessionResult {
  const url = new URL(
    `${appUrl()}/api/employment/payments/callback`,
  );
  url.searchParams.set("paymentId", input.paymentId);
  url.searchParams.set("provider", provider);
  url.searchParams.set("demo", "1");
  url.searchParams.set("status", "success");

  return {
    checkoutUrl: url.toString(),
    providerRef: `demo_${provider.toLowerCase()}_${input.paymentId.slice(0, 8)}`,
    demoMode: true,
  };
}

export async function createStripeSession(
  input: ProviderSessionInput,
): Promise<ProviderSessionResult> {
  const secret = env.STRIPE_SECRET_KEY?.trim();
  if (!secret) return demoSession(input, "STRIPE");

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${input.successUrl}&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", input.cancelUrl);
  params.set("client_reference_id", input.paymentId);
  params.set("metadata[paymentId]", input.paymentId);
  params.set("line_items[0][quantity]", "1");
  params.set(
    "line_items[0][price_data][currency]",
    input.currency.toLowerCase(),
  );
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(Math.round(input.amount * 100)),
  );
  params.set(
    "line_items[0][price_data][product_data][name]",
    input.description,
  );
  if (input.customerEmail) {
    params.set("customer_email", input.customerEmail);
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await res.json()) as {
    id?: string;
    url?: string;
    error?: { message?: string };
  };

  if (!res.ok || !data.url || !data.id) {
    throw new Error(data.error?.message ?? "Stripe session creation failed");
  }

  return {
    checkoutUrl: data.url,
    providerRef: data.id,
    demoMode: false,
    raw: data as Record<string, unknown>,
  };
}

export async function createSslCommerzSession(
  input: ProviderSessionInput,
): Promise<ProviderSessionResult> {
  const storeId = env.SSLCOMMERZ_STORE_ID?.trim();
  const storePass = env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePass) return demoSession(input, "SSLCOMMERZ");

  const isLive = env.SSLCOMMERZ_IS_LIVE === "true";
  const endpoint = isLive
    ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

  const tranId = `ssl_${input.paymentId.replace(/-/g, "").slice(0, 20)}`;
  const body = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePass,
    total_amount: String(input.amount),
    currency: input.currency,
    tran_id: tranId,
    success_url: input.successUrl,
    fail_url: input.cancelUrl,
    cancel_url: input.cancelUrl,
    cus_name: input.customerName ?? "Customer",
    cus_email: input.customerEmail ?? "noreply@muntajar.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
    shipping_method: "NO",
    product_name: input.description,
    product_category: "Service",
    product_profile: "non-physical-goods",
    value_a: input.paymentId,
  });

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const data = (await res.json()) as {
    status?: string;
    GatewayPageURL?: string;
    failedreason?: string;
  };

  if (data.status !== "SUCCESS" || !data.GatewayPageURL) {
    throw new Error(data.failedreason ?? "SSLCommerz session creation failed");
  }

  return {
    checkoutUrl: data.GatewayPageURL,
    providerRef: tranId,
    demoMode: false,
    raw: data as Record<string, unknown>,
  };
}

export async function createBkashSession(
  input: ProviderSessionInput,
): Promise<ProviderSessionResult> {
  const appKey = env.BKASH_APP_KEY?.trim();
  const appSecret = env.BKASH_APP_SECRET?.trim();
  const username = env.BKASH_USERNAME?.trim();
  const password = env.BKASH_PASSWORD?.trim();
  if (!appKey || !appSecret || !username || !password) {
    return demoSession(input, "BKASH");
  }

  const isLive = env.BKASH_IS_LIVE === "true";
  const base = isLive
    ? "https://tokenized.pay.bka.sh/v1.2.0-beta"
    : "https://tokenized.sandbox.bka.sh/v1.2.0-beta";

  const tokenRes = await fetch(`${base}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username,
      password,
    },
    body: JSON.stringify({ app_key: appKey, app_secret: appSecret }),
  });
  const tokenData = (await tokenRes.json()) as {
    id_token?: string;
    statusMessage?: string;
  };
  if (!tokenData.id_token) {
    throw new Error(tokenData.statusMessage ?? "bKash token grant failed");
  }

  const createRes = await fetch(`${base}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: tokenData.id_token,
      "X-APP-Key": appKey,
    },
    body: JSON.stringify({
      mode: "0011",
      payerReference: " ",
      callbackURL: input.successUrl,
      amount: String(input.amount),
      currency: input.currency,
      intent: "sale",
      merchantInvoiceNumber: input.paymentId.replace(/-/g, "").slice(0, 30),
    }),
  });
  const createData = (await createRes.json()) as {
    paymentID?: string;
    bkashURL?: string;
    statusMessage?: string;
  };

  if (!createData.bkashURL || !createData.paymentID) {
    throw new Error(createData.statusMessage ?? "bKash create payment failed");
  }

  return {
    checkoutUrl: createData.bkashURL,
    providerRef: createData.paymentID,
    demoMode: false,
    raw: createData as Record<string, unknown>,
  };
}

export async function createNagadSession(
  input: ProviderSessionInput,
): Promise<ProviderSessionResult> {
  const merchantId = env.NAGAD_MERCHANT_ID?.trim();
  const privateKey = env.NAGAD_MERCHANT_PRIVATE_KEY?.trim();
  if (!merchantId || !privateKey) return demoSession(input, "NAGAD");

  // Full Nagad checkout requires RSA signing; without a complete keypair
  // setup we fall back to demo. When credentials exist but signing isn't
  // wired, prefer an explicit demo redirect rather than a half-broken live call.
  return demoSession(input, "NAGAD");
}

export async function createProviderSession(
  provider: string,
  input: ProviderSessionInput,
): Promise<ProviderSessionResult> {
  switch (provider) {
    case "STRIPE":
      return createStripeSession(input);
    case "SSLCOMMERZ":
      return createSslCommerzSession(input);
    case "BKASH":
      return createBkashSession(input);
    case "NAGAD":
      return createNagadSession(input);
    case "MANUAL":
    default:
      return demoSession(input, "MANUAL");
  }
}
