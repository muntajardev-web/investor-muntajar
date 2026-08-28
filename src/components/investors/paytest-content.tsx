"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, User, Mail, Phone, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

const AMOUNT = 100;

export function PayTestContent() {
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!/^[0-9+\-\s]{7,20}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickets: 1,
          amount: AMOUNT,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.gatewayUrl;
    } catch {
      toast.error("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans flex flex-col items-center justify-center px-4">
      <Toaster position="top-center" richColors />

      {/* Logo / Brand */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-stone-950 flex items-center justify-center">
            <span className="text-white font-black text-sm">M</span>
          </div>
          <span className="text-stone-950 font-black text-xl tracking-tight">Muntajar</span>
        </div>
        <p className="text-stone-500 text-xs font-medium">Secure Payment Portal</p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="w-full max-w-sm bg-white border border-stone-200 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Card top — amount display */}
        <div className="bg-stone-950 px-7 pt-7 pb-6">
          <p className="text-stone-400 text-[11px] font-black uppercase tracking-widest mb-1">
            Amount Due
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-white text-5xl font-black tracking-tight">৳{AMOUNT}</span>
            <span className="text-stone-400 text-sm font-bold">BDT</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-400 text-[11px] font-black uppercase tracking-wider">
              1 × Investor Test Ticket
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="pt-name" className="text-[11px] font-black text-stone-500 uppercase tracking-widest block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="pt-name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 text-sm font-medium placeholder:text-stone-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition disabled:opacity-50"
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-500 font-bold">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="pt-email" className="text-[11px] font-black text-stone-500 uppercase tracking-widest block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="pt-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 text-sm font-medium placeholder:text-stone-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition disabled:opacity-50"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="pt-phone" className="text-[11px] font-black text-stone-500 uppercase tracking-widest block">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="pt-phone"
                name="phone"
                type="tel"
                placeholder="+8801XXXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
                autoComplete="tel"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 text-sm font-medium placeholder:text-stone-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition disabled:opacity-50"
              />
            </div>
            {errors.phone && <p className="text-[11px] text-red-500 font-bold">{errors.phone}</p>}
          </div>

          {/* Pay button */}
          <button
            id="paytest-pay-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay ৳{AMOUNT} via SSLCommerz
              </>
            )}
          </button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-[10px] text-stone-400 font-bold">
              256-bit SSL · Secured by SSLCommerz
            </span>
          </div>
        </form>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-[11px] text-stone-400 font-medium"
      >
        <a href="/" className="hover:text-stone-600 transition-colors">← Back to Investor Page</a>
      </motion.p>
    </div>
  );
}
