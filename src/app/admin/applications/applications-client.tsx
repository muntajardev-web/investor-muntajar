"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ResourceTable } from "@/components/admin/resource-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ActivityTimeline } from "@/components/admin/activity-timeline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApplicationRow {
  id: string;
  status: string;
  updatedAt: Date;
  user: { id: string; name: string | null; email: string };
  university: { name: string };
  program: { name: string };
  agent: { user: { name: string | null } } | null;
}

interface ApplicationsClientProps {
  applications: ApplicationRow[];
  agents: Array<{ id: string; user: { id: string; name: string | null } }>;
}

export function ApplicationsClient({
  applications,
  agents,
}: ApplicationsClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<ApplicationRow | null>(null);
  const [status, setStatus] = useState("");
  const [agentId, setAgentId] = useState("");

  async function saveApplication() {
    if (!selected) return;
    const res = await fetch(`/api/admin/applications/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, agentId: agentId || null }),
    });
    if (!res.ok) {
      toast.error("Failed to update");
      return;
    }
    toast.success("Application updated");
    setSelected(null);
    router.refresh();
  }

  return (
    <>
      <ResourceTable
        title="Applications"
        data={applications}
        searchPlaceholder="Search applications..."
        canCreate={false}
        canImport={false}
        onEdit={(row) => {
          setSelected(row);
          setStatus(row.status);
          setAgentId("");
        }}
        columns={[
          {
            key: "student",
            header: "Student",
            cell: (r) => r.user.name ?? r.user.email,
          },
          { key: "university", header: "University", cell: (r) => r.university.name },
          { key: "program", header: "Program", cell: (r) => r.program.name },
          {
            key: "counselor",
            header: "Counselor",
            cell: (r) => r.agent?.user.name ?? "Unassigned",
          },
          {
            key: "status",
            header: "Status",
            cell: (r) => <StatusBadge status={r.status} />,
          },
        ]}
      />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <Tabs defaultValue="status">
              <TabsList>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="status" className="space-y-4">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Status</p>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "DRAFT",
                        "SUBMITTED",
                        "UNDER_REVIEW",
                        "OFFER_RECEIVED",
                        "ACCEPTED",
                        "REJECTED",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Assign Counselor
                  </p>
                  <Select value={agentId} onValueChange={setAgentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.user.name ?? "Agent"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={saveApplication} className="w-full">
                  Save Changes
                </Button>
              </TabsContent>
              <TabsContent value="timeline">
                <ActivityTimeline
                  items={[
                    {
                      id: "1",
                      title: `Status: ${selected.status}`,
                      time: new Date(selected.updatedAt).toLocaleString(),
                    },
                  ]}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
