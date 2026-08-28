"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Sparkles,
  LifeBuoy,
  Users,
  FileText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Globe,
  PhoneCall,
  Compass,
  User,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { useLang } from "@/context/lang-context";
import { cn } from "@/lib/utils";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesExpanded, setMobileResourcesExpanded] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isBn = lang === "bn";

  // Scroll listener to toggle static vs floating island pill
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 40) {
        setScrolled(true);
      } else if (currentY < 15) {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setResourcesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setResourcesOpen(false);
    }, 180);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      {/* ── Fixed / Sticky Header Wrapper ── */}
      <header className={cn("fixed top-0 left-0 right-0 z-50 pt-3 pb-2 pointer-events-none transition-all duration-200", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pointer-events-auto relative">

          <AnimatePresence mode="wait">
            {!scrolled ? (
              /* ── Unscrolled State ── */
              <motion.div
                key="top-nav"
                initial={{ opacity: 0, y: -4, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-full max-w-[94vw] md:max-w-7xl bg-white/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none px-4 sm:px-6 md:px-2 py-2 md:py-1 rounded-full md:rounded-none border md:border-none border-stone-200/80 shadow-xs md:shadow-none flex items-center justify-between"
              >
                {/* Left Logo */}
                <Link
                  href="/"
                  draggable={false}
                  className="flex items-center gap-2 focus:outline-none shrink-0 select-none pr-3 md:pr-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://i.imgur.com/2JK9HQv.png"
                    alt="Muntajar"
                    className="h-7 sm:h-8 md:h-10 w-auto object-contain select-none pointer-events-none"
                  />
                </Link>

                {/* Center Menu Pill (Desktop Only) */}
                <nav className="hidden md:flex items-center gap-1 bg-[#eeeeee]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-200/70">
                  <Link
                    href="/"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 hover:bg-white",
                      pathname === "/" ? "bg-white text-neutral-950 font-bold" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "হোম" : "Home"}
                  </Link>

                  <Link
                    href="/profile"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 hover:bg-white",
                      pathname === "/profile" ? "bg-white text-neutral-950 font-bold" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "প্রোফাইল" : "Profile"}
                  </Link>

                  <Link
                    href="/destinations"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 hover:bg-white",
                      pathname === "/destinations" || pathname === "/gallery" ? "bg-white text-neutral-950 font-bold" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "গ্যালারি" : "Gallery"}
                  </Link>

                  {/* Dropdown Menu Trigger Container for Resources */}
                  <div
                    className="relative py-0.5"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setResourcesOpen(!resourcesOpen)}
                      className={cn(
                        "flex items-center gap-1 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 focus:outline-none cursor-pointer",
                        resourcesOpen
                          ? "bg-white text-neutral-950 font-semibold"
                          : "text-neutral-700 hover:text-neutral-950 hover:bg-white"
                      )}
                    >
                      <span>{isBn ? "রিসোর্সেস" : "Resources"}</span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200 text-neutral-500",
                          resourcesOpen ? "rotate-180 text-orange-600" : ""
                        )}
                      />
                    </button>
                  </div>

                  <Link
                    href="/contact"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 hover:bg-white",
                      pathname === "/contact" ? "bg-white text-neutral-950 font-bold" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "যোগাযোগ" : "Contact"}
                  </Link>
                </nav>

                {/* Right Actions: Language Switcher + Action CTA (Desktop Only) */}
                <div className="hidden md:flex items-center gap-2.5 shrink-0 relative py-1 pl-4">
                  {/* Language Switcher Toggle */}
                  <button
                    type="button"
                    onClick={() => setLang(lang === "en" ? "bn" : "en")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eeeeee]/90 border border-neutral-200/70 text-xs font-bold text-neutral-800 hover:bg-white transition-all cursor-pointer select-none"
                    aria-label="Toggle language"
                  >
                    <Globe className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{lang.toUpperCase()}</span>
                  </button>

                  <div className="relative flex items-center">
                    <Link href="/check-eligibility">
                      <LiquidMetalButton
                        label={isBn ? "শুরু করুন" : "Get Started"}
                        width={110}
                        height={34}
                      />
                    </Link>
                  </div>
                </div>

                {/* Mobile Round Hamburger Button */}
                <div className="md:hidden flex items-center shrink-0">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center focus:outline-none transition-colors"
                    aria-label="Open Mobile Menu"
                  >
                    <Menu className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Scrolled State: Single Floating Island Capsule Pill ── */
              <motion.div
                key="island-nav"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-full max-w-[94vw] md:max-w-4xl bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-1.5 rounded-full border border-stone-200/90 shadow-xs flex items-center justify-between"
              >
                {/* Left Logo */}
                <Link
                  href="/"
                  draggable={false}
                  className="flex items-center gap-2 focus:outline-none shrink-0 select-none pr-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://i.imgur.com/2JK9HQv.png"
                    alt="Muntajar"
                    className="h-7 sm:h-8 w-auto object-contain select-none pointer-events-none"
                  />
                </Link>

                {/* Center Links Inside Island */}
                <nav className="hidden md:flex items-center gap-1">
                  <Link
                    href="/"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 hover:bg-neutral-100",
                      pathname === "/" ? "text-orange-600 font-bold bg-orange-50/60" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "হোম" : "Home"}
                  </Link>

                  <Link
                    href="/profile"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 hover:bg-neutral-100",
                      pathname === "/profile" ? "text-orange-600 font-bold bg-orange-50/60" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "প্রোফাইল" : "Profile"}
                  </Link>

                  <Link
                    href="/destinations"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 hover:bg-neutral-100",
                      pathname === "/destinations" || pathname === "/gallery" ? "text-orange-600 font-bold bg-orange-50/60" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "গ্যালারি" : "Gallery"}
                  </Link>

                  {/* Dropdown Menu Trigger Container */}
                  <div
                    className="relative py-0.5"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setResourcesOpen(!resourcesOpen)}
                      className={cn(
                        "flex items-center gap-1 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 focus:outline-none cursor-pointer",
                        resourcesOpen
                          ? "bg-neutral-100 text-neutral-950 font-semibold"
                          : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
                      )}
                    >
                      <span>{isBn ? "রিসোর্সেস" : "Resources"}</span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200 text-neutral-500",
                          resourcesOpen ? "rotate-180 text-orange-600" : ""
                        )}
                      />
                    </button>
                  </div>

                  <Link
                    href="/contact"
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 hover:bg-neutral-100",
                      pathname === "/contact" ? "text-orange-600 font-bold bg-orange-50/60" : "text-neutral-700 hover:text-neutral-950"
                    )}
                  >
                    {isBn ? "যোগাযোগ" : "Contact"}
                  </Link>
                </nav>

                {/* Right Action CTA + Language Switcher + Handwritten Tooltip */}
                <div className="hidden md:flex items-center gap-2 shrink-0 relative py-1">
                  <button
                    type="button"
                    onClick={() => setLang(lang === "en" ? "bn" : "en")}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 hover:bg-white transition-all cursor-pointer select-none"
                  >
                    <Globe className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{lang.toUpperCase()}</span>
                  </button>

                  <div className="relative flex items-center">
                    <Link href="/check-eligibility">
                      <LiquidMetalButton
                        label={isBn ? "শুরু করুন" : "Get Started"}
                        width={110}
                        height={34}
                      />
                    </Link>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center shrink-0">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center focus:outline-none transition-colors"
                    aria-label="Open Mobile Menu"
                  >
                    <Menu className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Globally Centered Mega Menu Submenu Card ── */}
          <AnimatePresence>
            {resourcesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="fixed top-[64px] left-1/2 -translate-x-1/2 w-[780px] max-w-[94vw] z-50 pointer-events-auto"
              >
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200/90 grid grid-cols-12 gap-6 backdrop-blur-xl text-left">

                  {/* Column 1: Resources Navigation */}
                  <div className="col-span-12 sm:col-span-4 space-y-4 pr-0 sm:pr-2 border-b sm:border-b-0 sm:border-r border-neutral-100 pb-4 sm:pb-0">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 px-2">
                      {isBn ? "রিসোর্স ও গাইড" : "Resources"}
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/guides"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <BookOpen className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {isBn ? "গাইড ও ডকুমেন্টেশন" : "Guides & Docs"}
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "ভিসা ও স্কলারশিপ নির্দেশিকা" : "Visas & scholarship guides"}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/check-eligibility"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <Sparkles className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {isBn ? "যোগ্যতা যাচাই" : "Eligibility AI"}
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "১ মিনিটে প্রোফাইল মূল্যায়ন" : "1-min profile assessment"}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/success-stories"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <CheckCircle2 className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {isBn ? "সফলতার গল্প" : "Success Stories"}
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "শিক্ষার্থী ও পেশাজীবীদের রিভিউ" : "Real student case studies"}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/faq"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <LifeBuoy className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {isBn ? "প্রশ্নোত্তর ও সহায়তা" : "FAQ & Help"}
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "সাধারণ প্রশ্নের উত্তর" : "Common answers & help desk"}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: Platform & Community Navigation */}
                  <div className="col-span-12 sm:col-span-4 space-y-4 pr-0 sm:pr-2 border-b sm:border-b-0 sm:border-r border-neutral-100 pb-4 sm:pb-0">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 px-2">
                      {isBn ? "প্ল্যাটফর্ম" : "Company"}
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/investor-dashboard"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <TrendingUp className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors flex items-center gap-1.5">
                            <span>{isBn ? "ইনভেস্টর ড্যাশবোর্ড" : "Investor Dashboard"}</span>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              Live
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "পোর্টফোলিও ও অ্যাফিলিয়েট হাব" : "Portfolio, Deed & Affiliate Hub"}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <User className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {isBn ? "ফাউন্ডার প্রোফাইল" : "Founder Profile"}
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "মুনতাজার ও তার ভিশন" : "Muntajar's track record"}
                          </div>
                        </div>
                      </Link>

                      <a
                        href="https://chat.whatsapp.com/BuyZDTg3CSe89U1pnAbWgv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <Users className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors flex items-center gap-1">
                            <span>{isBn ? "কমিউনিটি" : "Community"}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "হোয়াটসঅ্যাপ ইনভেস্টর গ্রুপ" : "Join 5,000+ applicants"}
                          </div>
                        </div>
                      </a>

                      <Link
                        href="/terms"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <FileText className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {isBn ? "শর্তাবলী" : "Terms"}
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "সেবার নিয়ম ও শর্ত" : "Terms of service"}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/privacy"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <ShieldCheck className="w-5 h-5 text-neutral-700 group-hover:text-[#ea580c] transition-colors shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                          </div>
                          <div className="text-xs text-neutral-500 leading-tight">
                            {isBn ? "তথ্য ও নিরাপত্তা নীতি" : "Data security & privacy"}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: Featured Consultation / Status Card */}
                  <div className="col-span-12 sm:col-span-4 bg-gradient-to-b from-orange-50/60 to-amber-50/40 rounded-2xl p-5 border border-orange-200/60 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-24 rounded-xl overflow-hidden relative border border-orange-200/80 shadow-2xs">
                        <img
                          src="/images/hero-students.jpg"
                          alt="Global Pathways"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent" />
                      </div>

                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 pt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{isBn ? "সরাসরি সাপোর্ট সক্রিয়" : "Admissions Open 2026"}</span>
                      </div>
                      <div className="text-xs font-bold text-neutral-900 leading-snug">
                        {isBn
                          ? "ইউকে, জার্মানি ও কানাডার জন্য ১০০% ব্রোকার-মুক্ত সহায়তা।"
                          : "Transparent, broker-free global pathways to top universities & visas."}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors pt-3 group"
                    >
                      <span>{isBn ? "কনসালটেশন বুক করুন" : "Book 1-on-1 session"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* ── Mobile Sidebar Drawer & Blurred Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Blurred Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md cursor-pointer"
            />

            {/* Sliding Mobile Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white border-r border-neutral-200 p-6 sm:p-7 flex flex-col justify-between shadow-2xl"
            >
              <div className="flex flex-col h-full overflow-hidden">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between pb-5 border-b border-neutral-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://i.imgur.com/2JK9HQv.png"
                    alt="Muntajar"
                    className="h-7 w-auto object-contain select-none"
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-neutral-500 hover:text-neutral-950 focus:outline-none transition-colors"
                    aria-label="Close Sidebar"
                  >
                    <X className="w-5 h-5 stroke-[2]" />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <div className="my-5 overflow-y-auto pr-1 flex-1">
                  <nav className="flex flex-col space-y-3">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-semibold transition-colors py-1",
                        pathname === "/" ? "text-[#ea580c] font-bold" : "text-neutral-900 hover:text-[#ea580c]"
                      )}
                    >
                      {isBn ? "হোম" : "Home"}
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-semibold transition-colors py-1",
                        pathname === "/profile" ? "text-[#ea580c] font-bold" : "text-neutral-900 hover:text-[#ea580c]"
                      )}
                    >
                      {isBn ? "প্রোফাইল" : "Profile"}
                    </Link>

                    <Link
                      href="/destinations"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-semibold transition-colors py-1",
                        pathname === "/destinations" || pathname === "/gallery" ? "text-[#ea580c] font-bold" : "text-neutral-900 hover:text-[#ea580c]"
                      )}
                    >
                      {isBn ? "গ্যালারি" : "Gallery"}
                    </Link>

                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-semibold transition-colors py-1",
                        pathname === "/contact" ? "text-[#ea580c] font-bold" : "text-neutral-900 hover:text-[#ea580c]"
                      )}
                    >
                      {isBn ? "যোগাযোগ" : "Contact"}
                    </Link>

                    {/* Collapsible Resources Accordion */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setMobileResourcesExpanded(!mobileResourcesExpanded)}
                        className="w-full flex items-center justify-between text-base font-semibold text-neutral-900 hover:text-[#ea580c] transition-colors focus:outline-none py-1"
                      >
                        <span>{isBn ? "রিসোর্সেস" : "Resources"}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            mobileResourcesExpanded ? "rotate-180 text-[#ea580c]" : "text-neutral-400"
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileResourcesExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden space-y-3 pl-3 border-l-2 border-orange-200 ml-1 py-1"
                          >
                            <Link
                              href="/guides"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors py-0.5"
                            >
                              <BookOpen className="w-4 h-4 text-neutral-500" />
                              {isBn ? "গাইড ও ডকুমেন্টস" : "Guides & Docs"}
                            </Link>
                            <Link
                              href="/check-eligibility"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors py-0.5"
                            >
                              <Sparkles className="w-4 h-4 text-neutral-500" />
                              {isBn ? "যোগ্যতা মূল্যায়ন" : "Check Eligibility"}
                            </Link>
                            <Link
                              href="/success-stories"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors py-0.5"
                            >
                              <CheckCircle2 className="w-4 h-4 text-neutral-500" />
                              {isBn ? "সফলতার গল্প" : "Success Stories"}
                            </Link>
                            <a
                              href="https://chat.whatsapp.com/BuyZDTg3CSe89U1pnAbWgv"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors py-0.5"
                            >
                              <Users className="w-4 h-4 text-neutral-500" />
                              {isBn ? "হোয়াটসঅ্যাপ কমিউনিটি" : "Community"}
                            </a>
                            <Link
                              href="/terms"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors py-0.5"
                            >
                              <FileText className="w-4 h-4 text-neutral-500" />
                              {isBn ? "শর্তাবলী" : "Terms"}
                            </Link>
                            <Link
                              href="/privacy"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors py-0.5"
                            >
                              <ShieldCheck className="w-4 h-4 text-neutral-500" />
                              {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link
                      href="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-semibold transition-colors py-1",
                        pathname === "/about" ? "text-[#ea580c] font-bold" : "text-neutral-900 hover:text-[#ea580c]"
                      )}
                    >
                      {isBn ? "পরিচিতি" : "About"}
                    </Link>

                    {/* Language Switcher in Mobile Drawer */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-500">{isBn ? "ভাষা পরিবর্তন" : "Language"}</span>
                      <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200">
                        <button
                          type="button"
                          onClick={() => setLang("en")}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold transition-all",
                            lang === "en" ? "bg-stone-950 text-white shadow-xs" : "text-stone-600"
                          )}
                        >
                          EN
                        </button>
                        <button
                          type="button"
                          onClick={() => setLang("bn")}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold transition-all",
                            lang === "bn" ? "bg-stone-950 text-white shadow-xs" : "text-stone-600"
                          )}
                        >
                          বাংলা
                        </button>
                      </div>
                    </div>
                  </nav>
                </div>

                {/* Sidebar Footer CTA */}
                <div className="pt-4 border-t border-neutral-100 space-y-2.5 shrink-0">
                  <Link
                    href="/check-eligibility"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 rounded-full text-sm transition-all shadow-md shadow-orange-500/20 active:scale-98"
                  >
                    <span>{isBn ? "যোগ্যতা যাচাই করুন" : "Check Eligibility"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold py-2.5 rounded-full text-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-stone-600" />
                    <span>{isBn ? "যোগাযোগ করুন" : "Book Founder Call"}</span>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
