import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // ── Guard: ensure credentials are configured on the server ──────────────
    const SSLCOMMERZ_API_URL = process.env.SSLCOMMERZ_API_URL;
    const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
    const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;

    if (!SSLCOMMERZ_API_URL || !STORE_ID || !STORE_PASSWORD) {
      console.error(
        "[payment/initiate] Missing env vars:",
        { SSLCOMMERZ_API_URL: !!SSLCOMMERZ_API_URL, STORE_ID: !!STORE_ID, STORE_PASSWORD: !!STORE_PASSWORD }
      );
      return NextResponse.json(
        { error: "Payment gateway is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // ── Parse & validate request body ────────────────────────────────────────
    const body = await request.json();
    const { tickets, amount, customerName, customerEmail, customerPhone } = body;

    if (!tickets || !amount || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields: tickets, amount, customerName, customerEmail, customerPhone" },
        { status: 400 }
      );
    }

    const totalAmount = Number(amount);
    if (isNaN(totalAmount) || totalAmount < 10) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum transaction is 10 BDT." },
        { status: 400 }
      );
    }

    // ── Build transaction ─────────────────────────────────────────────────────
    const tranId = `MJR-INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";

    const params = new URLSearchParams();

    // Credentials
    params.append("store_id", STORE_ID);
    params.append("store_passwd", STORE_PASSWORD);

    // Transaction info
    params.append("total_amount", totalAmount.toFixed(2));
    params.append("currency", "BDT");
    params.append("tran_id", tranId);
    params.append("product_name", `Muntajar Angel Investment Ticket x${tickets}`);
    params.append("product_category", "Investment");
    params.append("product_profile", "non-physical-goods");

    // Callback URLs
    params.append("success_url", `${appUrl}/api/payment/success`);
    params.append("fail_url", `${appUrl}/api/payment/fail`);
    params.append("cancel_url", `${appUrl}/api/payment/cancel`);
    params.append("ipn_url", `${appUrl}/api/payment/ipn`);

    // Customer info
    params.append("cus_name", customerName);
    params.append("cus_email", customerEmail);
    params.append("cus_add1", "Dhaka");
    params.append("cus_city", "Dhaka");
    params.append("cus_postcode", "1000");
    params.append("cus_country", "Bangladesh");
    params.append("cus_phone", customerPhone);

    // Shipping (non-physical product)
    params.append("shipping_method", "NO");
    params.append("num_of_item", String(tickets));

    // Custom metadata passed back on success
    params.append("value_a", String(tickets));
    params.append("value_b", customerName);
    params.append("value_c", tranId);

    // ── Call SSLCommerz session API ───────────────────────────────────────────
    console.log("[payment/initiate] Calling SSLCommerz:", SSLCOMMERZ_API_URL, "tran_id:", tranId);

    const sslResponse = await fetch(SSLCOMMERZ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!sslResponse.ok) {
      const errText = await sslResponse.text();
      console.error("[payment/initiate] SSLCommerz HTTP error:", sslResponse.status, errText);
      return NextResponse.json(
        { error: "Failed to connect to SSLCommerz. Please try again." },
        { status: 502 }
      );
    }

    const sslData = await sslResponse.json();
    console.log("[payment/initiate] SSLCommerz response status:", sslData.status);

    if (sslData.status !== "SUCCESS") {
      console.error("[payment/initiate] SSLCommerz session failed:", sslData.failedreason);
      return NextResponse.json(
        { error: sslData.failedreason || "SSLCommerz session creation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      gatewayUrl: sslData.GatewayPageURL,
      sessionkey: sslData.sessionkey,
      tranId,
    });

  } catch (error) {
    console.error("[payment/initiate] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
