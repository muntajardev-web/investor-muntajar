import { NextRequest, NextResponse } from "next/server";

/**
 * SSLCommerz calls this URL via POST after a successful payment.
 * It POSTs the payment data as form fields.
 * We extract the relevant data and redirect the user to our frontend success page.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const tranId = formData.get("tran_id") as string;
    const valId = formData.get("val_id") as string;
    const amount = formData.get("amount") as string;
    const cardType = formData.get("card_type") as string;
    const tickets = formData.get("value_a") as string;
    const customerName = formData.get("value_b") as string;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";

    // Build success page URL with payment confirmation data
    const params = new URLSearchParams({
      tickets: tickets || "1",
      amount: amount || "0",
      ...(customerName ? { name: customerName } : {}),
      tran_id: tranId || "",
      val_id: valId || "",
      card_type: cardType || "",
      payment: "success",
    });

    return NextResponse.redirect(`${appUrl}/investors/success?${params.toString()}`, 303);
  } catch (error) {
    console.error("Payment success handler error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com";
    return NextResponse.redirect(`${appUrl}/payment/fail?reason=processing_error`, 303);
  }
}
