import { NextResponse } from "next/server";
import { R2StorageService } from "@/services/storage/r2-storage.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const healthResult = await R2StorageService.checkHealth();

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      service: "Cloudflare R2 Storage",
      ...healthResult,
    },
    {
      status: healthResult.status === "Connected" ? 200 : 500,
    },
  );
}
