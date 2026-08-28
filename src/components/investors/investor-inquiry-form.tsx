"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contact } from "@/lib/site-data";

export function InvestorInquiryForm() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const firm = String(data.get("firm") || "").trim();
    const note = String(data.get("note") || "").trim();

    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);

    const subject = encodeURIComponent(`Investor inquiry — ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        firm ? `Firm / Fund: ${firm}` : null,
        "",
        note || "I would like to learn more about investing in Muntajar.",
      ]
        .filter(Boolean)
        .join("\n"),
    );

    window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`, "_blank");
    toast.success("Opening email client & redirecting to your Investor Portal…");
    setTimeout(() => {
      window.location.href = `/investors/success?name=${encodeURIComponent(name)}&tickets=1&amount=20000`;
    }, 1000);
    setLoading(false);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="investor-name">Full name</Label>
        <Input
          id="investor-name"
          name="name"
          required
          placeholder="Your name"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="investor-email">Email</Label>
        <Input
          id="investor-email"
          name="email"
          type="email"
          required
          placeholder="you@firm.com"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="investor-firm">Firm / Fund</Label>
        <Input
          id="investor-firm"
          name="firm"
          placeholder="Optional"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="investor-note">Why Muntajar?</Label>
        <Textarea
          id="investor-note"
          name="note"
          rows={4}
          placeholder="Ticket size, timeline, or what you want to understand first."
        />
      </div>
      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Opening…" : "Request investor brief"}
        <ArrowRight />
      </Button>
    </form>
  );
}
