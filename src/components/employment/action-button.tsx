"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ActionButton({
  endpoint,
  method = "POST",
  body,
  label,
  successLabel,
  redirectTo,
  variant = "primary",
}: {
  endpoint: string;
  method?: string;
  body?: unknown;
  label: string;
  successLabel?: string;
  redirectTo?: string;
  variant?: "primary" | "outline" | "secondary";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(
          json?.data?.error ?? json?.error?.message ?? "Request failed",
        );
      }

      const data = json.data as {
        checkoutUrl?: string | null;
        redirectTo?: string;
      } | null;

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      toast.success(successLabel ?? "Done");
      const next = data?.redirectTo ?? redirectTo;
      if (next) router.push(next);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
      setLoading(false);
    }
  }

  return (
    <Button onClick={run} disabled={loading} size="lg" variant={variant}>
      {loading ? "Working…" : label}
    </Button>
  );
}
