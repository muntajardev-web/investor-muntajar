import { env } from "@/config/env";

export async function verifyStripePayment(
  providerRef: string | null | undefined,
): Promise<boolean> {
  const secret = env.STRIPE_SECRET_KEY?.trim();
  if (!secret || !providerRef) return false;

  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${providerRef}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
    },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as {
    payment_status?: string;
    status?: string;
  };
  return data.payment_status === "paid" || data.status === "complete";
}

export async function verifySslCommerzPayment(
  valId: string | null | undefined,
): Promise<boolean> {
  const storeId = env.SSLCOMMERZ_STORE_ID?.trim();
  const storePass = env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePass || !valId) return false;

  const isLive = env.SSLCOMMERZ_IS_LIVE === "true";
  const endpoint = isLive
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

  const url = new URL(endpoint);
  url.searchParams.set("val_id", valId);
  url.searchParams.set("store_id", storeId);
  url.searchParams.set("store_passwd", storePass);
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());
  if (!res.ok) return false;
  const data = (await res.json()) as { status?: string };
  return data.status === "VALID" || data.status === "VALIDATED";
}

export async function verifyBkashPayment(
  paymentID: string | null | undefined,
): Promise<boolean> {
  const appKey = env.BKASH_APP_KEY?.trim();
  const appSecret = env.BKASH_APP_SECRET?.trim();
  const username = env.BKASH_USERNAME?.trim();
  const password = env.BKASH_PASSWORD?.trim();
  if (!appKey || !appSecret || !username || !password || !paymentID) {
    return false;
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
  const tokenData = (await tokenRes.json()) as { id_token?: string };
  if (!tokenData.id_token) return false;

  const execRes = await fetch(`${base}/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: tokenData.id_token,
      "X-APP-Key": appKey,
    },
    body: JSON.stringify({ paymentID }),
  });
  const execData = (await execRes.json()) as {
    transactionStatus?: string;
    statusCode?: string;
  };
  return (
    execData.transactionStatus === "Completed" || execData.statusCode === "0000"
  );
}
