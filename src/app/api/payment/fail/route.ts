import { NextRequest, NextResponse } from "next/server";

/**
 * SSLCommerz calls this URL via POST when a payment fails.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const errorMessage = (formData.get("error") as string) || "Payment was declined or failed.";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";
    const params = new URLSearchParams({ reason: errorMessage });
    return NextResponse.redirect(`${appUrl}/payment/fail?${params.toString()}`, 303);
  } catch {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";
    return NextResponse.redirect(`${appUrl}/payment/fail?reason=unknown_error`, 303);
  }
}
