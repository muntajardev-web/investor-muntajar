"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "./ui";
import { formatDate } from "@/lib/employment/format";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  type: string;
  readAt: Date | string | null;
  createdAt: Date | string;
};

export function NotificationCenter({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(notifications);

  async function markAllRead() {
    setLoading(true);
    try {
      const res = await fetch("/api/employment/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message);
      setItems((prev) => prev.map((n) => ({ ...n, readAt: new Date() })));
      toast.success("All notifications marked read");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    try {
      const res = await fetch("/api/employment/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date() } : n)),
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  const unread = items.filter((n) => !n.readAt).length;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-stone-900">
            Notification Center
          </h2>
          {unread > 0 && (
            <StatusPill tone="accent">{unread} unread</StatusPill>
          )}
        </div>
        {unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={markAllRead}
          >
            {loading ? "Updating…" : "Mark all read"}
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-stone-500">No notifications yet.</p>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                if (!n.readAt) void markRead(n.id);
              }}
              className="w-full border-b border-stone-100 pb-3 text-left last:border-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={
                      n.readAt
                        ? "text-sm font-medium text-stone-700"
                        : "text-sm font-semibold text-stone-900"
                    }
                  >
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">{n.body}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
                {!n.readAt && <StatusPill tone="accent">New</StatusPill>}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
