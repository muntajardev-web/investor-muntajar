import type { Metadata } from "next";
import { StudentShell } from "@/components/student/student-shell";
import { requireAuth } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Student Dashboard | Muntajar",
  description: "Student & Scholar Study Abroad Dashboard",
};

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await requireAuth();
  } catch {
    session = {
      user: {
        id: "demo_student",
        email: "student@muntajar.com",
        name: "Demo Student",
        role: "STUDENT" as const,
      },
    };
  }

  const user = {
    id: session.user.id,
    clerkId: (session.user as any).clerkId ?? "demo_student_clerk_id",
    email: session.user.email,
    name: session.user.name,
    role: "STUDENT" as const,
  };

  return (
    <StudentShell user={user} unreadNotifications={2} profileComplete={true}>
      {children}
    </StudentShell>
  );
}
