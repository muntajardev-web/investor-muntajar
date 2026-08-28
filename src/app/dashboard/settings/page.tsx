import Link from "next/link";
import { requireAuth } from "@/server/auth/session";
import { PageHeader, Panel, DataRow } from "@/components/student";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default async function SettingsPage() {
  const session = await requireAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Account preferences and security."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel padding="none">
          <div className="border-b border-stone-100 px-5 py-4">
            <h2 className="text-[13px] font-medium text-stone-900">Account</h2>
          </div>
          <div className="divide-y divide-stone-100 px-5">
            <DataRow label="Name" value={session.user.name ?? "—"} />
            <DataRow label="Email" value={session.user.email} />
            <DataRow label="Role" value={session.user.role} />
          </div>
        </Panel>

        <Panel padding="none">
          <div className="border-b border-stone-100 px-5 py-4">
            <h2 className="text-[13px] font-medium text-stone-900">Security</h2>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[13px] text-stone-700">Manage sign-in methods</p>
              <p className="mt-0.5 text-xs text-stone-500">
                Password, email, and connected accounts
              </p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-medium text-stone-900">Study profile</p>
            <p className="mt-0.5 text-xs text-stone-500">
              Update academics, test scores, and preferences
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/profile">Edit profile</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}
