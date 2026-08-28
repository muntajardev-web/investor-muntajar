import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireRole } from "@/server/auth/session";
import { ADMIN_ROLES } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(ADMIN_ROLES);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AdminShell user={session.user}>{children}</AdminShell>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
