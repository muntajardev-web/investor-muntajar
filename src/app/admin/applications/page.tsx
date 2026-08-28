import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { ApplicationsClient } from "./applications-client";

export default async function ApplicationsPage() {
  const [applications, agents] = await Promise.all([
    prisma.application.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
        university: { select: { name: true } },
        program: { select: { name: true } },
        agent: { include: { user: { select: { name: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.agent.findMany({
      where: { deletedAt: null },
      include: { user: { select: { id: true, name: true } } },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track, assign counselors, and manage application status."
      />
      <ApplicationsClient applications={applications} agents={agents} />
    </div>
  );
}
