import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email-service";
import {
  generateNumericOtp,
  storeOtp,
  verifyAndConsumeOtp,
} from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, name, otpCode } = body;

    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    // ── 1. ACTION: SEND OTP TO EMAIL ──
    if (action === "send") {
      const generatedOtp = generateNumericOtp();

      storeOtp(cleanEmail, generatedOtp, 10 * 60 * 1000); // 10 mins

      console.log(`[OTP GENERATED & DISPATCHED TO ${cleanEmail}]: ${generatedOtp}`);

      const emailResult = await sendOtpEmail(
        cleanEmail,
        generatedOtp,
        name || "Valued Investor"
      );

      if (!emailResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to send email to ${cleanEmail}: ${emailResult.error}`,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `OTP verification code sent to ${cleanEmail}`,
      });
    }

    // ── 2. ACTION: VERIFY OTP ──
    if (action === "verify") {
      const isValidOtp = verifyAndConsumeOtp(cleanEmail, otpCode);

      if (!isValidOtp) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid or expired OTP code. Please check your email inbox or spam.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully. Ready for payment gateway checkout.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("OTP API Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "OTP processing failed" },
      { status: 500 }
    );
  }
}
