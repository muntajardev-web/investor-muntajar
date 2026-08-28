"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Lock,
  Loader2,
  User,
  Mail,
  Phone,
  CheckCircle2,
  MessageSquareCode,
  ArrowRight,
} from "lucide-react";
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
  // Modal view step: "DETAILS" | "OTP"
  const [step, setStep] = React.useState<"DETAILS" | "OTP">("DETAILS");
  const [loading, setLoading] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setStep("DETAILS");
      setOtpCode("");
      setLoading(false);
      setErrors({});
    }
  }, [open]);

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Please enter your full legal name (min 2 characters).";
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    const phoneRe = /^[0-9+\-\s]{7,20}$/;
    if (!phoneRe.test(form.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Send OTP to email via Resend
  const handleInitiateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/investors/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email: form.email.trim(),
          name: form.name.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to send OTP code. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setStep("OTP");
      toast.success(`Verification OTP sent to ${form.email.trim()}! Please check your inbox.`);
    } catch (err) {
      console.error("OTP send error:", err);
      toast.error("Network error sending OTP. Please check your connection.");
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Connect directly to SSLCommerz Gateway
  const handleVerifyAndPay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode.trim() || otpCode.trim().length < 4) {
      toast.error("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    // Read affiliate ref from localStorage (only if within 24hr window)
    let referredBy: string | undefined;
    try {
      const raw = localStorage.getItem("muntajar_affiliate_ref");
      if (raw) {
        const entry = JSON.parse(raw);
        if (entry.ref && entry.expiresAt > Date.now()) {
          referredBy = entry.ref;
        } else {
          localStorage.removeItem("muntajar_affiliate_ref");
        }
      }
    } catch {}

    setLoading(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickets,
          amount,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
          otpCode: otpCode.trim(),
          referredBy,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.gatewayUrl) {
        toast.error(data.error || "Failed to connect to payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("OTP Verified! Redirecting to SSLCommerz Gateway…");
      // Immediately redirect user to the secure SSLCommerz payment page
      window.location.href = data.gatewayUrl;
    } catch (err) {
      console.error("Payment initiation error:", err);
      toast.error("Network error connecting to payment gateway. Please try again.");
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
      <DialogContent className="max-w-[94vw] sm:max-w-2xl p-0 overflow-hidden rounded-3xl border border-stone-200 shadow-2xl bg-white focus:outline-none text-left">
        
        {/* ── STEP 1: ENTER DETAILS ── */}
        {step === "DETAILS" && (
          <div className="p-6 sm:p-9 space-y-6 relative">
            
            {/* Header */}
            <div className="flex items-start justify-between pr-8">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFF5ED] text-[#EA580C] border border-[#FDDBC9] text-[11px] font-extrabold uppercase tracking-wider">
                  Official Equity Ticket Checkout
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight pt-1">
                  Complete Your Share Investment
                </h2>
              </div>
            </div>

            <div className="border-b border-stone-100" />

            {/* Ticket Order Summary */}
            <div className="bg-[#FAF9F7] rounded-2xl p-5 border border-stone-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider block">Order Summary</span>
                <h4 className="text-base sm:text-lg font-black text-stone-950 mt-0.5">
                  {tickets} Seed Ticket{tickets > 1 ? "s" : ""} (Class A Preferred)
                </h4>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Statutory Share Deed Issued Upon Successful Payment
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider block">Total Investment</span>
                <p className="text-2xl font-black text-[#EA580C]">
                  {currency}{amount.toLocaleString()} <span className="text-xs font-bold text-stone-500">BDT</span>
                </p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleInitiateOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Full Legal Name</span>
                </Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="rounded-xl bg-[#EFF5FF] focus:bg-white border border-stone-200 focus:border-2 focus:border-[#EA580C] py-3 text-sm font-medium text-stone-900 focus:outline-none transition-all"
                />
                {errors.name && <p className="text-xs font-bold text-rose-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Email Address (For Verification &amp; Deed)</span>
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="rounded-xl bg-[#EFF5FF] focus:bg-white border border-stone-200 focus:border-2 focus:border-[#EA580C] py-3 text-sm font-medium text-stone-900 focus:outline-none transition-all"
                  />
                  {errors.email && <p className="text-xs font-bold text-rose-600">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Phone / WhatsApp Number</span>
                  </Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 01712345678"
                    className="rounded-xl bg-[#EFF5FF] focus:bg-white border border-stone-200 focus:border-2 focus:border-[#EA580C] py-3 text-sm font-medium text-stone-900 focus:outline-none transition-all"
                  />
                  {errors.phone && <p className="text-xs font-bold text-rose-600">{errors.phone}</p>}
                </div>
              </div>

              {/* PAY BUTTON (Triggers OTP) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[#EA580C] hover:bg-[#D94E06] disabled:opacity-60 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Sending Security Verification OTP…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>CONFIRM &amp; VERIFY EMAIL ({currency}{amount.toLocaleString()} BDT) →</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1 text-[11px] text-stone-400 font-medium flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>256-bit SSL Encrypted • Email OTP Verification Required</span>
              </div>
            </form>

          </div>
        )}

        {/* ── STEP 2: ENTER OTP & PROCEED TO SSLCOMMERZ GATEWAY ── */}
        {step === "OTP" && (
          <div className="p-6 sm:p-9 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF5ED] border border-[#FDDBC9] flex items-center justify-center text-[#EA580C] mx-auto shadow-xs">
              <MessageSquareCode className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-stone-950">Enter Security Verification OTP</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                A 6-digit security code has been sent to <strong className="text-stone-950 font-bold">{form.email}</strong> via Resend. Please enter it below to proceed to SSLCommerz payment gateway.
              </p>
            </div>

            <form onSubmit={handleVerifyAndPay} className="space-y-5 max-w-sm mx-auto">
              <div>
                <Input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-Digit OTP"
                  autoFocus
                  className="text-center text-2xl font-mono tracking-widest font-black py-4 rounded-2xl bg-[#EFF5FF] border-stone-300 focus:border-[#EA580C]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#EA580C] hover:bg-[#D94E06] disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Connecting to SSLCommerz Payment Gateway…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>VERIFY OTP &amp; PAY {currency}{amount.toLocaleString()} BDT →</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("DETAILS")}
                className="text-xs text-stone-500 hover:text-stone-900 font-bold underline cursor-pointer"
              >
                ← Back to Edit Details
              </button>
            </form>

            <div className="text-center pt-2 text-[11px] text-stone-400 font-medium flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Secured by SSLCommerz 256-bit Authorized Gateway</span>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}

