"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function GenerateRecommendationsButton({
  label = "Get recommendations",
  variant = "primary",
  size = "sm",
}: {
  label?: string;
  variant?: "primary" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 60_000);

    try {
      const res = await fetch("/api/recommendations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 400) {
          toast.info(data.error || "Complete your profile first");
          router.push("/dashboard/profile");
          return;
        }
        if (res.status === 401) {
          toast.info("Please sign in to get recommendations");
          window.location.href = "https://dash-muntajarx.vercel.app";
          return;
        }
        toast.error(data.error || "Failed to generate recommendations");
        return;
      }

      if (data.count === 0) {
        toast.message(data.message || "No matches found for your profile yet.");
      } else {
        toast.success(
          `Found ${data.count} university match${data.count === 1 ? "" : "es"}`,
        );
      }
    } catch (error) {
      const aborted =
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("aborted"));
      toast.error(
        aborted
          ? "Matching took too long — refreshing in case results were saved."
          : "Connection dropped — refreshing in case results were saved.",
      );
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
      // Always refresh so a dropped response still reveals saved matches.
      router.refresh();
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={loading}
      onClick={handleGenerate}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Matching…
        </>
      ) : (
        label
      )}
    </Button>
  );
}
