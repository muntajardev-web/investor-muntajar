import { NextRequest, NextResponse } from "next/server";

/**
 * SSLCommerz calls this URL via POST when a user cancels the payment.
 */
export async function POST(request: NextRequest) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";
    return NextResponse.redirect(`${appUrl}/payment/fail?reason=cancelled`, 303);
  } catch {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";
    return NextResponse.redirect(`${appUrl}/payment/fail?reason=cancelled`, 303);
  }
}
