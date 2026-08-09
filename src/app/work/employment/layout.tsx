import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { EmploymentShell } from "@/components/employment/employment-shell";
import { requireAuth } from "@/server/auth/session";
import { getEmploymentShellData } from "@/lib/employment/shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Overseas Employment",
  robots: { index: false, follow: false },
};

export default async function EmploymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { serviceType: true },
    });
  } catch {
    user = { serviceType: "EMPLOYMENT" as const };
  }

  const shell = await getEmploymentShellData(session.user.id).catch(() => ({
    unreadNotifications: 0,
    profileComplete: true,
    profileCompletion: 100,
    workflowStep: 1,
  }));

  return (
    <>
      <EmploymentShell
        user={session.user}
        unreadNotifications={shell.unreadNotifications}
        profileComplete={shell.profileComplete}
        profileCompletion={typeof shell.profileCompletion === "number" ? shell.profileCompletion : 100}
        workflowStep={typeof shell.workflowStep === "number" ? shell.workflowStep : 1}
      >
        {children}
      </EmploymentShell>
      <Toaster position="top-center" />
    </>
  );
}
