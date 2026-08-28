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
 * SSLCommerz IPN (Instant Payment Notification) listener
 * Called asynchronously server-to-server by SSLCommerz to ensure fulfillment
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const tranId = (formData.get("tran_id") as string) || "";
    const valId = formData.get("val_id") as string;
    const amount = formData.get("amount") as string;
    const cardType = (formData.get("card_type") as string) || "SSLCommerz IPN";
    const status = formData.get("status") as string;

    const tickets = (formData.get("value_a") as string) || "1";
    const customerName = (formData.get("value_b") as string) || (formData.get("cus_name") as string) || "Valued Angel Partner";
    const customerEmail = (formData.get("value_c") as string) || (formData.get("cus_email") as string) || "";
    const rawMetadata = (formData.get("value_d") as string) || "";

    const [customerPhone, referredBy] = rawMetadata.split("|");
    const cleanPhone = customerPhone || (formData.get("cus_phone") as string) || "+8801700000000";

    // ── 1. Validate payment with SSLCommerz ───────────────────────────────────
    let isValid = false;
    if (valId) {
      isValid = await verifySslCommerzPayment(valId);
    }
    if (!isValid && (status === "VALID" || status === "VALIDATED" || status === "AUTHENTICATED")) {
      isValid = true;
    }
    if (!process.env.SSLCOMMERZ_STORE_ID || !process.env.SSLCOMMERZ_STORE_PASSWORD) {
      isValid = true;
    }

    if (!isValid) {
      console.warn("[payment/ipn] Unverified IPN rejected for tran_id:", tranId);
      return NextResponse.json({ status: "UNVERIFIED" }, { status: 400 });
    }

    // ── 2. Idempotent Account Creation ───────────────────────────────────────
    const store = getStoredInvestorData();
    const existingInvestor = store.investors.find(
      (inv: Investor) => inv.transactionId === tranId || (customerEmail && inv.email.toLowerCase() === customerEmail.toLowerCase().trim())
    );

    if (!existingInvestor) {
      const plainPassword = generateStrongPassword();
      const passwordHash = bcrypt.hashSync(plainPassword, 12);

      const targetInvestor = addInvestorFromPayment({
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
          console.log(`[payment/ipn] Welcome email dispatched via IPN to ${targetInvestor.email}`);
        } catch (emailErr) {
          console.error("[payment/ipn] Email dispatch error:", emailErr);
        }
      }
    }

    return NextResponse.json({ status: "OK", tran_id: tranId });
  } catch (error) {
    console.error("[payment/ipn] IPN processing error:", error);
    return NextResponse.json({ error: "Internal IPN failure" }, { status: 500 });
  }
}
