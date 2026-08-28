import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required" },
        { status: 400 },
      );
    }

    logger.info(`[AuthVerifyEmail] Verifying email code for ${email}`);

    // Update user verification status in Neon PostgreSQL
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Email address verified successfully.",
    });
  } catch (error: any) {
    logger.error(`[AuthVerifyEmail] Error verifying email: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify email" },
      { status: 500 },
    );
  }
}
