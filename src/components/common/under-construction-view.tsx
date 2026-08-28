"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";

interface UnderConstructionViewProps {
  title?: string;
  subtitle?: string;
  pageContext?: "login" | "get-started";
}

export function UnderConstructionView({
  title = "Portal Access is Currently Private",
  subtitle = "The Muntajar candidate & advisor portal is currently in private preview. Account sign-in is restricted to verified beta partners.",
}: UnderConstructionViewProps) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [showPortalModal, setShowPortalModal] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-950 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 font-sans antialiased relative">
      {/* Subtle top border line */}
      <div className="h-1 bg-stone-950 w-full" />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-950 text-white font-bold flex items-center justify-center text-base">
            M
          </div>
          <span className="text-lg font-bold tracking-tight text-stone-950">
            Muntajar
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to main site</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl text-center space-y-8">
          
          {/* Status Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Private Alpha Stage</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 leading-tight">
              {title}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-normal">
              {subtitle}
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto pt-2 space-y-4">
            {submitted ? (
              <div className="p-4 rounded-2xl bg-stone-950 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you. We&apos;ve added your email to our private access queue.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter work or personal email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-950 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-stone-950 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  <span>Request Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <p className="text-[11px] text-stone-600 font-normal">
              Direct institution access? Contact <a href="mailto:access@muntajar.com" className="text-stone-900 underline font-medium">access@muntajar.com</a>
            </p>

            {/* TEMPORARY DEMO ACCESS TRIGGER BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPortalModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs sm:text-sm transition-all shadow-md cursor-pointer ring-2 ring-amber-400/50"
              >
                <span>⚡ Enter Temporary Access & Select Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* PORTAL SELECTION & DEMO LOGIN FORM MODAL */}
      {showPortalModal && (
        <PortalLoginFormModal onClose={() => setShowPortalModal(false)} />
      )}

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-[11px] text-stone-600 border-t border-stone-200/80 bg-[#FAF9F6]">
        Muntajar Global Mobility Platform · All Rights Reserved
      </footer>
    </div>
  );
}

function PortalLoginFormModal({ onClose }: { onClose: () => void }) {
  const [selectedRole, setSelectedRole] = React.useState<"student" | "worker" | "admin">("student");
  const [email, setEmail] = React.useState("student@muntajar.com");
  const [password, setPassword] = React.useState("muntajar2026!");
  const [loggingIn, setLoggingIn] = React.useState(false);

  const handleRoleSelect = (role: "student" | "worker" | "admin") => {
    setSelectedRole(role);
    if (role === "student") {
      setEmail("student@muntajar.com");
    } else if (role === "worker") {
      setEmail("worker@muntajar.com");
    } else {
      setEmail("admin@muntajar.com");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);

    const targetUrl =
      selectedRole === "student"
        ? "/dashboard/recommendations"
        : selectedRole === "worker"
        ? "/work/employment"
        : "/admin";

    window.location.assign(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              Temporary Preview Sign In
            </span>
            <h3 className="text-xl font-black text-stone-950 mt-1.5">Sign In to Muntajar</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-950 flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Portal Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 block">Select Portal Ecosystem:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect("student")}
              className={`p-2.5 rounded-xl border text-center font-extrabold text-xs transition-all cursor-pointer ${
                selectedRole === "student"
                  ? "bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/40"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect("worker")}
              className={`p-2.5 rounded-xl border text-center font-extrabold text-xs transition-all cursor-pointer ${
                selectedRole === "worker"
                  ? "bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-400/40"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              💼 Worker
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect("admin")}
              className={`p-2.5 rounded-xl border text-center font-extrabold text-xs transition-all cursor-pointer ${
                selectedRole === "admin"
                  ? "bg-stone-900 border-stone-950 text-white ring-2 ring-stone-950/40"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              ⚡ Admin
            </button>
          </div>
        </div>

        {/* Interactive Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-stone-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-950 focus:bg-white focus:outline-none focus:border-stone-950 transition-colors"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-stone-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-950 focus:bg-white focus:outline-none focus:border-stone-950 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loggingIn ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In to {selectedRole === "student" ? "Student Portal" : selectedRole === "worker" ? "Workforce Portal" : "Admin Panel"}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-stone-600 text-center font-normal pt-1">
          Temporary preview mode bypasses mandatory auth for verification.
        </p>

      </div>
    </div>
  );
}
