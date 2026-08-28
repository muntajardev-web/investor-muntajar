import { NextRequest, NextResponse } from "next/server";
import { verifyAndConsumeOtp } from "@/lib/otp-store";

export async function POST(request: NextRequest) {
  try {
    const SSLCOMMERZ_STORE_ID = process.env.SSLCOMMERZ_STORE_ID?.trim();
    const SSLCOMMERZ_STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";
    const SSLCOMMERZ_API_URL =
      process.env.SSLCOMMERZ_API_URL ||
      (isLive
        ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
        : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php");

    // ── Parse & validate request body ────────────────────────────────────────
    const body = await request.json();
    const {
      tickets,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      otpCode,
      referredBy,
    } = body;

    if (!tickets || !amount || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields: tickets, amount, customerName, customerEmail, customerPhone" },
        { status: 400 }
      );
    }

    const cleanEmail = (customerEmail || "").trim().toLowerCase();
    const cleanName = (customerName || "").trim();
    const cleanPhone = (customerPhone || "").trim();

    // ── Verify OTP if provided (required for investor checkout) ───────────────
    if (otpCode) {
      const isOtpValid = verifyAndConsumeOtp(cleanEmail, otpCode);
      if (!isOtpValid) {
        return NextResponse.json(
          { error: "Invalid or expired OTP verification code. Please check your email inbox." },
          { status: 400 }
        );
      }
    }

    const totalAmount = Number(amount);
    if (isNaN(totalAmount) || totalAmount < 10) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum transaction is 10 BDT." },
        { status: 400 }
      );
    }

    const tranId = `MJR-INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // ── Fallback Dev Mode: If gateway credentials are not configured ─────────
    if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
      console.log("[payment/initiate] Development mode: Bypassing SSLCommerz and redirecting to investor dashboard");
      const params = new URLSearchParams({
        tickets: String(tickets || 1),
        amount: String(amount || 20000),
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        tran_id: tranId,
        payment: "success",
        success: "true",
      });

      return NextResponse.json({
        success: true,
        gatewayUrl: `/investor-dashboard?${params.toString()}`,
        sessionkey: "dev_session_active",
        tranId,
      });
    }

    // Determine application origin dynamically for accurate callbacks
    const appUrl = (
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://investor.muntajar.com"
    ).replace(/\/$/, "");

    const params = new URLSearchParams();

    // Credentials
    params.append("store_id", SSLCOMMERZ_STORE_ID);
    params.append("store_passwd", SSLCOMMERZ_STORE_PASSWORD);

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
    params.append("cus_name", cleanName);
    params.append("cus_email", cleanEmail);
    params.append("cus_add1", "Dhaka");
    params.append("cus_city", "Dhaka");
    params.append("cus_postcode", "1000");
    params.append("cus_country", "Bangladesh");
    params.append("cus_phone", cleanPhone);

    // Shipping (non-physical product)
    params.append("shipping_method", "NO");
    params.append("num_of_item", String(tickets));

    // Custom metadata passed back to success/IPN callback
    params.append("value_a", String(tickets));
    params.append("value_b", cleanName);
    params.append("value_c", cleanEmail);
    params.append("value_d", `${cleanPhone}|${(referredBy || "").trim()}`);

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
        { error: "Failed to connect to SSLCommerz gateway. Please try again." },
        { status: 502 }
      );
    }

    const sslData = await sslResponse.json();
    console.log("[payment/initiate] SSLCommerz response status:", sslData.status);

    if (sslData.status !== "SUCCESS" || !sslData.GatewayPageURL) {
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
