"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldCheck, CreditCard, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  tickets: number;
  amount: number;
  currency?: string;
}

export function PaymentModal({
  open,
  onClose,
  tickets,
  amount,
  currency = "৳",
}: PaymentModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (min 2 characters).";
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    const phoneRe = /^[0-9+\-\s]{7,20}$/;
    if (!phoneRe.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number (digits only, 7–20 chars).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickets,
          amount,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Payment initiation failed. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to SSLCommerz gateway
      window.location.href = data.gatewayUrl;
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white border border-stone-200 p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-stone-950 px-7 py-6">
          <DialogHeader>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-white text-lg font-black leading-tight">
                Confirm Investment & Pay
              </DialogTitle>
            </div>
            <DialogDescription className="text-stone-400 text-xs leading-relaxed">
              You are investing in{" "}
              <span className="text-white font-bold">
                {tickets} Ticket{tickets > 1 ? "s" : ""}
              </span>{" "}
              for a total of{" "}
              <span className="text-orange-400 font-black text-sm">
                {currency}
                {amount.toLocaleString()} BDT
              </span>
              . You will be redirected to SSLCommerz secure payment gateway.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          {/* Summary box */}
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
            <div>
              <p className="text-[10px] font-black text-orange-700 uppercase tracking-wider">
                Total Amount
              </p>
              <p className="text-2xl font-black text-stone-950 leading-tight">
                {currency}
                {amount.toLocaleString()}
                <span className="text-xs font-bold text-stone-500 ml-1">BDT</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-orange-700 uppercase tracking-wider">
                Tickets
              </p>
              <p className="text-2xl font-black text-stone-950">{tickets}</p>
            </div>
          </div>

          {/* Customer name */}
          <div className="space-y-1.5">
            <Label htmlFor="pay-name" className="text-xs font-black text-stone-700 uppercase tracking-wider">
              Full Name *
            </Label>
            <Input
              id="pay-name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              className="rounded-xl border-stone-200 focus:border-orange-500 focus:ring-orange-500/20 text-sm font-medium"
              autoComplete="name"
            />
            {errors.name && <p className="text-[11px] text-red-500 font-bold">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="pay-email" className="text-xs font-black text-stone-700 uppercase tracking-wider">
              Email Address *
            </Label>
            <Input
              id="pay-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="rounded-xl border-stone-200 focus:border-orange-500 focus:ring-orange-500/20 text-sm font-medium"
              autoComplete="email"
            />
            {errors.email && <p className="text-[11px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="pay-phone" className="text-xs font-black text-stone-700 uppercase tracking-wider">
              Phone Number *
            </Label>
            <Input
              id="pay-phone"
              name="phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
              className="rounded-xl border-stone-200 focus:border-orange-500 focus:ring-orange-500/20 text-sm font-medium"
              autoComplete="tel"
            />
            {errors.phone && <p className="text-[11px] text-red-500 font-bold">{errors.phone}</p>}
          </div>

          {/* Submit button */}
          <button
            id="sslcommerz-pay-button"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to SSLCommerz…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay {currency}
                {amount.toLocaleString()} Securely →
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <p className="text-[10px] text-stone-400 font-bold">
              Secured by SSLCommerz · 256-bit SSL Encryption · No card data stored on our servers
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
