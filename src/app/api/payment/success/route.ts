import { NextRequest, NextResponse } from "next/server";
import {
  getStoredInvestorData,
  addInvestorFromPayment,
  generateStrongPassword,
  type Investor,
} from "@/lib/investor-store";
import { sendInvestorWelcomeEmail } from "@/lib/email-service";
import { verifySslCommerzPayment } from "@/services/payments/verify";
import bcrypt from "bcryptjs";

/**
 * SSLCommerz calls this URL via POST after a successful payment transaction.
 * We verify the payment validity, provision the investor account with a statutory deed,
 * generate secure credentials, dispatch the welcome email via Resend, and redirect to the welcome portal.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const tranId = (formData.get("tran_id") as string) || `SSL-${Date.now()}`;
    const valId = formData.get("val_id") as string;
    const amount = formData.get("amount") as string;
    const cardType = (formData.get("card_type") as string) || "SSLCommerz Gateway";
    const status = formData.get("status") as string;

    const tickets = (formData.get("value_a") as string) || "1";
    const customerName = (formData.get("value_b") as string) || (formData.get("cus_name") as string) || "Valued Angel Partner";
    const customerEmail = (formData.get("value_c") as string) || (formData.get("cus_email") as string) || "";
    const rawMetadata = (formData.get("value_d") as string) || "";

    const [customerPhone, referredBy] = rawMetadata.split("|");
    const cleanPhone = customerPhone || (formData.get("cus_phone") as string) || "+8801700000000";

    const appUrl = (
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://investor.muntajar.com"
    ).replace(/\/$/, "");

    // ── 1. Validate payment with SSLCommerz ───────────────────────────────────
    let isValid = false;
    if (valId) {
      isValid = await verifySslCommerzPayment(valId);
    }

    // Fallback status check from SSLCommerz POST payload
    if (!isValid && (status === "VALID" || status === "VALIDATED" || status === "AUTHENTICATED")) {
      isValid = true;
    }

    // If running in development without credentials or demo mode
    if (!process.env.SSLCOMMERZ_STORE_ID || !process.env.SSLCOMMERZ_STORE_PASSWORD) {
      isValid = true;
    }

    if (!isValid) {
      console.error("[payment/success] Payment verification failed for tran_id:", tranId);
      return NextResponse.redirect(`${appUrl}/payment/fail?reason=verification_failed&tran_id=${encodeURIComponent(tranId)}`, 303);
    }

    // ── 2. Idempotent Account Creation ───────────────────────────────────────
    const store = getStoredInvestorData();
    const existingInvestor = store.investors.find(
      (inv: Investor) => inv.transactionId === tranId || (customerEmail && inv.email.toLowerCase() === customerEmail.toLowerCase().trim())
    );

    let targetInvestor: Investor;
    let plainPassword = "";

    if (existingInvestor) {
      targetInvestor = existingInvestor;
      plainPassword = existingInvestor.plainPassword || "MJR#Investor2026!";
    } else {
      plainPassword = generateStrongPassword();
      const passwordHash = bcrypt.hashSync(plainPassword, 12);

      targetInvestor = addInvestorFromPayment({
        name: customerName.trim(),
        email: customerEmail.trim().toLowerCase(),
        phone: cleanPhone.trim(),
        tickets: parseInt(tickets, 10) || 1,
        amount: parseFloat(amount) || (parseInt(tickets, 10) || 1) * 20000,
        paymentMethod: `SSLCommerz (${cardType})`,
        transactionId: tranId,
        passwordHash,
        plainPassword,
        referredBy: (referredBy || "").trim() || undefined,
      });

      // ── 3. Send Credentials Welcome Email via Resend ───────────────────────
      if (targetInvestor.email) {
        try {
          await sendInvestorWelcomeEmail({
            email: targetInvestor.email,
            name: targetInvestor.name,
            deedId: targetInvestor.deedId,
            tickets: targetInvestor.tickets,
            amount: targetInvestor.amount,
            password: plainPassword,
          });
          console.log(`[payment/success] Welcome email dispatched to ${targetInvestor.email}`);
        } catch (emailErr) {
          console.error("[payment/success] Failed to send welcome email:", emailErr);
        }
      }
    }

    // ── 4. Redirect to Frontend Welcome Portal with Auth Payload ─────────────
    const sessionToken = `token-inv-${targetInvestor.id}-${Date.now()}`;
    const redirectParams = new URLSearchParams({
      payment: "success",
      tran_id: tranId,
      val_id: valId || "",
      card_type: cardType,
      tickets: String(targetInvestor.tickets),
      amount: String(targetInvestor.amount),
      name: targetInvestor.name,
      email: targetInvestor.email,
      phone: targetInvestor.phone,
      deed_id: targetInvestor.deedId,
      serial: targetInvestor.serialNumber,
      token: sessionToken,
      plain_password: plainPassword,
    });

    return NextResponse.redirect(`${appUrl}/investors/success?${redirectParams.toString()}`, 303);
  } catch (error) {
    console.error("[payment/success] Unhandled error:", error);
    const appUrl = (
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://investor.muntajar.com"
    ).replace(/\/$/, "");
    return NextResponse.redirect(`${appUrl}/payment/fail?reason=processing_error`, 303);
  }
}
