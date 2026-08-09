import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("notifications:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const type = sp.get("type")?.trim();

    const where: Prisma.NotificationWhereInput = {
      status: "ACTIVE",
      OR: [
        { data: { path: ["source"], equals: "employment" } },
        { title: { contains: "employment", mode: "insensitive" } },
        { title: { contains: "Application", mode: "insensitive" } },
        { title: { contains: "Payment", mode: "insensitive" } },
        { title: { contains: "Document", mode: "insensitive" } },
      ],
    };
    if (type) where.type = type as never;
    if (q) {
      where.AND = [
        {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { body: { contains: q, mode: "insensitive" } },
          ],
        },
      ];
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    return apiSuccess({ notifications });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await withAdminAuth("notifications:write");
    const body = await request.json();
    const notification = await prisma.notification.create({
      data: {
        userId: body.userId,
        type: body.type ?? "APPLICATION_UPDATE",
        title: body.title,
        body: body.body,
        data: { source: "employment", ...(body.data ?? {}) },
      },
    });
    return apiSuccess({ notification }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
