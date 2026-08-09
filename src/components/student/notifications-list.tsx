"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { NotificationType } from "@prisma/client";
import { formatNotificationType, formatRelative } from "@/lib/student/format";
import { cn } from "@/lib/utils";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string | Date;
  readAt: string | Date | null;
};

export function NotificationsList({
  initial,
}: {
  initial: NotificationRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();

  async function mark(body: { id?: string; all?: boolean }) {
    const res = await fetch("/api/student/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return;

    setItems((prev) =>
      prev.map((n) => {
        if (body.all || n.id === body.id) {
          return { ...n, readAt: n.readAt ?? new Date().toISOString() };
        }
        return n;
      }),
    );
    startTransition(() => router.refresh());
  }

  const unread = items.filter((n) => !n.readAt).length;

  return (
    <div className="space-y-4">
      {unread > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={() => void mark({ all: true })}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 disabled:opacity-50"
          >
            Mark all as read
          </button>
        </div>
      )}

      <div className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-white">
        {items.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              if (!n.readAt) void mark({ id: n.id });
            }}
            className={cn(
              "flex w-full items-start gap-4 px-4 py-3.5 text-left transition-colors",
              !n.readAt ? "bg-stone-50" : "hover:bg-stone-50/80",
            )}
          >
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                n.readAt ? "bg-transparent" : "bg-orange-500",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-stone-500">
                  {formatNotificationType(n.type as NotificationType)}
                </span>
                <span className="text-xs text-stone-400">
                  {formatRelative(
                    n.createdAt instanceof Date
                      ? n.createdAt
                      : new Date(n.createdAt),
                  )}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-semibold text-stone-900">
                {n.title}
              </p>
              <p className="mt-0.5 text-sm leading-snug text-stone-600">
                {n.body}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
