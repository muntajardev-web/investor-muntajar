import { NextResponse } from "next/server";
import { OneClickApplyService } from "@/services/ai/one-click-apply.service";
import { requireAuth } from "@/server/auth/session";
import { logger } from "@/lib";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await requireAuth().catch(() => ({
      user: { id: "demo_student" },
    }));

    const body = await req.json().catch(() => ({}));
    const { universityId = "uni-toronto", programId = "prog-utoronto-cs", intakeName } = body;

    logger.info(`[OneClickApplyAPI] Processing 1-Click Application for user ${session.user.id}`);

    const result = await OneClickApplyService.executeOneClickApply({
      userId: session.user.id,
      universityId,
      programId,
      intakeName,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      application: result,
    });
  } catch (error: any) {
    logger.error(`[OneClickApplyAPI] Error executing 1-Click application: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute 1-Click application" },
      { status: 500 },
    );
  }
}
