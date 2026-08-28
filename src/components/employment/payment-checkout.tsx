"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CheckoutProvider } from "@/services/payments/types";

const PROVIDERS: {
  id: CheckoutProvider;
  label: string;
  description: string;
}[] = [
  {
    id: "STRIPE",
    label: "Stripe",
    description: "Cards and international wallets",
  },
  {
    id: "SSLCOMMERZ",
    label: "SSLCommerz",
    description: "Cards, mobile banking, and local gateways",
  },
  {
    id: "BKASH",
    label: "bKash",
    description: "Pay with your bKash wallet",
  },
  {
    id: "NAGAD",
    label: "Nagad",
    description: "Pay with your Nagad wallet",
  },
];

export function PaymentCheckout({
  feeLabel,
  amountLabel,
  disabled,
}: {
  feeLabel: string;
  amountLabel: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [provider, setProvider] = useState<CheckoutProvider>("SSLCOMMERZ");
  const [loading, setLoading] = useState(false);

  async function pay() {
    if (disabled) return;
    setLoading(true);
    try {
      const res = await fetch("/api/employment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(
          json?.data?.error ?? json?.error?.message ?? "Checkout failed",
        );
      }

      const data = json.data as {
        alreadyPaid?: boolean;
        checkoutUrl?: string | null;
        redirectTo?: string;
        demoMode?: boolean;
      };

      if (data.alreadyPaid) {
        toast.success("Already paid");
        router.push(data.redirectTo ?? "/work/employment/confirmation");
        return;
      }

      if (data.checkoutUrl) {
        if (data.demoMode) {
          toast.message("Demo gateway — completing payment…");
        }
        window.location.href = data.checkoutUrl;
        return;
      }

      toast.success("Payment started");
      router.push(data.redirectTo ?? "/work/employment/confirmation");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-stone-500">Application fee</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-stone-900">
          {amountLabel}
        </p>
        <p className="mt-1 text-sm text-stone-600">{feeLabel}</p>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-stone-800">
          Choose payment method
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROVIDERS.map((p) => {
            const selected = provider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={disabled || loading}
                onClick={() => setProvider(p.id)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition",
                  selected
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-800 hover:border-stone-400",
                  (disabled || loading) && "opacity-60",
                )}
              >
                <span className="block text-sm font-semibold">{p.label}</span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs",
                    selected ? "text-stone-300" : "text-stone-500",
                  )}
                >
                  {p.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        onClick={pay}
        disabled={disabled || loading}
        className="w-full sm:w-auto"
      >
        {loading ? "Redirecting…" : `Pay with ${provider === "SSLCOMMERZ" ? "SSLCommerz" : provider === "BKASH" ? "bKash" : provider === "NAGAD" ? "Nagad" : "Stripe"}`}
      </Button>

      <p className="text-xs text-stone-400">
        Without live gateway credentials, checkout runs in secure demo mode and
        still stores invoices and payment history.
      </p>
    </div>
  );
}
