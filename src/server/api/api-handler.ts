import { NextResponse } from "next/server";
import { isAppError, AppError } from "@/lib";
import type { ApiResponse } from "@/types";

export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  if (isAppError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode },
    );
  }

  console.error("Unhandled API error:", error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    },
    { status: 500 },
  );
}

export function apiSuccess<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, meta },
    { status },
  );
}
