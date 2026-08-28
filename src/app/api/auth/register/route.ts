import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib";
import { emailService } from "@/emails/email.service";
import "@/emails/templates/email-verification";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, serviceType = "STUDY" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required" },
        { status: 400 },
      );
    }

    logger.info(`[AuthRegister] Creating registration account for ${email}`);

    // Generate random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/check-eligibility?code=${verificationCode}&email=${encodeURIComponent(email)}`;

    // Create user in Neon PostgreSQL Database if not existing
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email,
          clerkId: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: name || email.split("@")[0],
          serviceType: serviceType === "EMPLOYMENT" ? "EMPLOYMENT" : "STUDY",
          role: "STUDENT",
        },
      });
    }

    // Trigger Resend email verification
    await emailService.send({
      to: email,
      template: "email-verification",
      data: {
        name: name || email.split("@")[0],
        verificationCode,
        verificationUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. Verification email sent via Resend.",
      email,
      verificationCodeSent: true,
    });
  } catch (error: any) {
    logger.error(`[AuthRegister] Error registering user: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register user" },
      { status: 500 },
    );
  }
}
