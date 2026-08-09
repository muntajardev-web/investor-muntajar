"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SettingsClientProps {
  rolePermissions: Array<{
    role: string;
    permissions: string[];
  }>;
}

export function SettingsClient({ rolePermissions }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-medium">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <Label>Dark Mode</Label>
            <p className="text-xs text-muted-foreground">
              Use dark theme across the admin console
            </p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-medium">Role Permissions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rolePermissions.map((r) => (
              <TableRow key={r.role}>
                <TableCell className="font-medium capitalize">
                  {r.role.toLowerCase()}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {r.permissions.length} permissions configured
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-medium">Platform</h2>
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Environment</dt>
            <dd>{process.env.NODE_ENV}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Recommendation Engine</dt>
            <dd>Active</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
