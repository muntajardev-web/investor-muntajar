import { NextRequest, NextResponse } from "next/server";

/**
 * SSLCommerz calls this URL via POST when a user cancels the payment.
 */
export async function POST(request: NextRequest) {
  try {
    const appUrl = (
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://investor.muntajar.com"
    ).replace(/\/$/, "");
    return NextResponse.redirect(`${appUrl}/payment/fail?reason=cancelled`, 303);
  } catch {
    const appUrl = (
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://investor.muntajar.com"
    ).replace(/\/$/, "");
    return NextResponse.redirect(`${appUrl}/payment/fail?reason=cancelled`, 303);
  }
}
