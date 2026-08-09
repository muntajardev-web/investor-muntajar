import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { StudentShell } from "@/components/student/student-shell";
import { requireAuth } from "@/server/auth/session";
import { getStudentShellData } from "@/lib/student/shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, headerStore] = await Promise.all([
    requireAuth(),
    headers(),
  ]);
  const pathname = headerStore.get("x-pathname") ?? "";
  const isOnboarding = pathname.startsWith("/dashboard/onboarding");

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { serviceType: true },
    });
  } catch {
    user = { serviceType: "STUDY" as const };
  }

  if (user?.serviceType === "EMPLOYMENT") {
    redirect("/work/employment");
  }

  if (isOnboarding) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  const shell = await getStudentShellData(session.user.id).catch(() => ({
    profileComplete: true,
    hasPaid: true,
    unreadNotifications: 0,
  }));
  const allowedWithoutGates =
    pathname.startsWith("/dashboard/profile") ||
    pathname.startsWith("/dashboard/settings");

  if (
    pathname.startsWith("/dashboard") &&
    !allowedWithoutGates
  ) {
    if (!shell.profileComplete || !shell.hasPaid) {
      redirect("/get-started");
    }
  }

  return (
    <>
      <StudentShell
        user={session.user}
        unreadNotifications={shell.unreadNotifications}
        profileComplete={shell.profileComplete}
      >
        {children}
      </StudentShell>
      <Toaster position="top-center" />
    </>
  );
}
