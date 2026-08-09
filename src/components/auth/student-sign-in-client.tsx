"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Globe,
  Award,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/layout/container";

export function StudentSignInClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    document.cookie = "muntajar_demo_role=STUDY; path=/; max-age=86400";
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  const handleDemoSignIn = () => {
    setIsSubmitting(true);
    document.cookie = "muntajar_demo_role=STUDY; path=/; max-age=86400";
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <Container>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: HERO INFORMATION & HIGHLIGHTS */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            <span>Student & Scholar Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-[1.1]">
            Sign In to Student & Scholar Portal
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Welcome back! Access your international university applications, AI-powered SOP reviews, CAS & I-20 documents, and scholarship funding tracker.
          </p>

          {/* Highlights checklist */}
          <div className="space-y-3 pt-2">
            {[
              { title: "150+ Partner University Direct Portals", desc: "Track offer letters in UK, USA, Canada, Germany & Australia", icon: Globe },
              { title: "Real-Time AI SOP & Essay Review", desc: "Automated feedback on statement of purpose & motivation letters", icon: BookOpen },
              { title: "CAS, I-20 & Visa Clearance Tracker", desc: "Step-by-step guidance for embassy visa interviews", icon: ShieldCheck },
              { title: "Scholarship & Grant Payout Dashboard", desc: "Monitor institutional financial aid and merit grants", icon: Award },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-950">{item.title}</h4>
                    <p className="text-[11px] text-stone-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SIGN-IN FORM */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-7 sm:p-10 shadow-lg space-y-6">
            <div className="space-y-1 text-left border-b border-stone-100 pb-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-stone-950">Scholar Authentication</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold uppercase">
                  Secure SSO
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">Enter your credentials to enter the scholar dashboard.</p>
            </div>

            {/* Quick Demo Sign In Button */}
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-amber-400"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>{isSubmitting ? "Signing In..." : "⚡ One-Click Demo Student Sign In"}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-stone-400 shrink-0">
                Or Sign In with Email
              </span>
            </div>

            {/* Standard Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Student Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="student@muntajar.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF9F7] border border-stone-200 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">Password</label>
                  <a href="#" className="text-[11px] font-bold text-amber-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF9F7] border border-stone-200 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                <span>{isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Links */}
            <div className="pt-2 text-center border-t border-stone-100">
              <p className="text-xs text-stone-500 font-medium">
                Don't have a Student Account yet?{" "}
                <Link href="/get-started" className="font-extrabold text-amber-700 hover:underline">
                  Create Student Profile →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
