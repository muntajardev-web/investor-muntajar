import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EMPLOYMENT_STATUS_FLOW } from "@/lib/employment/format";

const EMPLOYMENT_AI_ACTIONS = [
  "DOCUMENT_OCR",
  "DOCUMENT_AGENT",
  "EMBEDDING",
  "EMPLOYMENT_ANALYSIS",
  "JOB_RANKING",
  "CAREER_ADVISOR",
] as const;

export async function getEmploymentAdminOverview() {
  const [
    workers,
    employers,
    companies,
    jobs,
    applications,
    openTickets,
    countries,
    visaPrograms,
    paymentAgg,
    aiAgg,
    appsByStatus,
    jobsByCountry,
    recentApplications,
    recentPayments,
  ] = await Promise.all([
    prisma.workerProfile.count({ where: { deletedAt: null } }),
    prisma.employer.count({
      where: { deletedAt: null, kind: "EMPLOYER" },
    }),
    prisma.employer.count({
      where: { deletedAt: null, kind: "COMPANY" },
    }),
    prisma.jobListing.count({ where: { deletedAt: null } }),
    prisma.employmentApplication.count({ where: { deletedAt: null } }),
    prisma.supportTicket.count({
      where: {
        deletedAt: null,
        category: "employment",
        status: { in: ["OPEN", "IN_PROGRESS", "WAITING_USER"] },
      },
    }),
    prisma.country.count({ where: { deletedAt: null } }),
    prisma.visaProgram.count({ where: { deletedAt: null } }),
    prisma.payment.aggregate({
      where: {
        deletedAt: null,
        status: "COMPLETED",
        metadata: { path: ["source"], equals: "employment" },
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.aiAuditLog.aggregate({
      where: {
        deletedAt: null,
        action: { in: [...EMPLOYMENT_AI_ACTIONS] },
      },
      _sum: { costUsd: true, totalTokens: true },
      _count: { _all: true },
    }),
    prisma.employmentApplication.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
    prisma.jobListing.groupBy({
      by: ["country"],
      where: { deletedAt: null },
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    }),
    prisma.employmentApplication.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { name: true, email: true } },
        jobListing: { select: { title: true, company: true, country: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.payment.findMany({
      where: {
        deletedAt: null,
        metadata: { path: ["source"], equals: "employment" },
      },
      include: {
        user: { select: { name: true, email: true } },
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const statusCounts = Object.fromEntries(
    EMPLOYMENT_STATUS_FLOW.map((s) => [s, 0]),
  ) as Record<string, number>;
  statusCounts.REJECTED = 0;
  for (const row of appsByStatus) {
    statusCounts[row.status] = row._count._all;
  }

  return {
    stats: {
      workers,
      employers,
      companies,
      jobs,
      applications,
      openTickets,
      countries,
      visaPrograms,
      paymentsCount: paymentAgg._count._all,
      paymentsRevenue: Number(paymentAgg._sum.amount ?? 0),
      aiCalls: aiAgg._count._all,
      aiTokens: aiAgg._sum.totalTokens ?? 0,
      aiCostUsd: Number(aiAgg._sum.costUsd ?? 0),
    },
    statusCounts,
    jobsByCountry,
    recentApplications,
    recentPayments,
  };
}

export async function getEmploymentAnalytics() {
  const [overview, submitted, completed, paidWorkers] = await Promise.all([
    getEmploymentAdminOverview(),
    prisma.employmentApplication.count({
      where: { deletedAt: null, submittedAt: { not: null } },
    }),
    prisma.employmentApplication.count({
      where: { deletedAt: null, status: "COMPLETED" },
    }),
    prisma.payment.findMany({
      where: {
        deletedAt: null,
        status: "COMPLETED",
        metadata: { path: ["source"], equals: "employment" },
      },
      select: { userId: true },
      distinct: ["userId"],
    }),
  ]);

  const conversion =
    overview.stats.workers > 0
      ? Math.round((submitted / overview.stats.workers) * 100)
      : 0;

  return {
    ...overview,
    funnel: {
      workers: overview.stats.workers,
      paid: paidWorkers.length,
      submitted,
      completed,
      conversionPct: conversion,
    },
  };
}

export function employmentPaymentWhere(
  extra: Prisma.PaymentWhereInput = {},
): Prisma.PaymentWhereInput {
  return {
    deletedAt: null,
    metadata: { path: ["source"], equals: "employment" },
    ...extra,
  };
}

export { EMPLOYMENT_AI_ACTIONS };
