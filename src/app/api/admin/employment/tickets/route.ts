import { NextRequest } from "next/server";
import type { Prisma, SupportTicketPriority, SupportTicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:tickets:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const status = sp.get("status")?.trim();
    const priority = sp.get("priority")?.trim();

    const where: Prisma.SupportTicketWhereInput = {
      deletedAt: null,
      category: "employment",
    };
    if (status) where.status = status as SupportTicketStatus;
    if (priority) where.priority = priority as SupportTicketPriority;
    if (q) {
      where.OR = [
        { subject: { contains: q, mode: "insensitive" } },
        { body: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    return apiSuccess({ tickets });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await withAdminAuth("employment:tickets:write");
    const body = await request.json();
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: body.userId,
        assignedToId: body.assignedToId ?? session.user.id,
        subject: body.subject,
        body: body.body,
        category: "employment",
        status: body.status ?? "OPEN",
        priority: body.priority ?? "MEDIUM",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return apiSuccess({ ticket }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
