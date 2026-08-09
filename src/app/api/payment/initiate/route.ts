import { NextRequest, NextResponse } from "next/server";

const SSLCOMMERZ_API_URL = process.env.SSLCOMMERZ_API_URL!;
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID!;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD!;

export async function POST(request: NextRequest) {
  try {
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

    // Generate a unique transaction ID
    const tranId = `MJR-INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";

    // Build URLSearchParams payload as required by SSLCommerz (application/x-www-form-urlencoded)
    const params = new URLSearchParams();

    // Integration credentials
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

    // Shipping info (not physical, use NO)
    params.append("shipping_method", "NO");
    params.append("num_of_item", String(tickets));

    // Pass metadata through value_a and value_b for use on success page
    params.append("value_a", String(tickets));
    params.append("value_b", customerName);
    params.append("value_c", tranId);

    // Call SSLCommerz session creation API
    const sslResponse = await fetch(SSLCOMMERZ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!sslResponse.ok) {
      console.error("SSLCommerz API error:", sslResponse.status, await sslResponse.text());
      return NextResponse.json(
        { error: "Failed to connect to SSLCommerz. Please try again." },
        { status: 502 }
      );
    }

    const sslData = await sslResponse.json();

    if (sslData.status !== "SUCCESS") {
      console.error("SSLCommerz session failed:", sslData.failedreason);
      return NextResponse.json(
        { error: sslData.failedreason || "SSLCommerz session creation failed." },
        { status: 400 }
      );
    }

    // Return the gateway URL to the client for redirect
    return NextResponse.json({
      success: true,
      gatewayUrl: sslData.GatewayPageURL,
      sessionkey: sslData.sessionkey,
      tranId,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
