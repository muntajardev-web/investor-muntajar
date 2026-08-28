"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, TrendingUp, Award, CheckCircle2, Maximize2, Video, User } from "lucide-react";
import { transition } from "@/lib/motion";
import { useLang } from "@/context/lang-context";
import { Logos3 } from "@/components/ui/logos3";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { HeroPlyrPlayer } from "@/components/ui/hero-plyr-player";
import { PlyrVideoModal } from "@/components/ui/plyr-video-modal";

const PARTNER_LOGOS = [
  { name: "UK Universities", label: "UK Higher Education" },
  { name: "DAAD Germany", label: "German Academic Exchange" },
  { name: "Canada Immigration", label: "Express Entry Canada" },
  { name: "Chevening", label: "UK Government Grants" },
  { name: "Erasmus+", label: "European Commission" },
];

export function HeroSection() {
  const { lang } = useLang();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [activeMediaTab, setActiveMediaTab] = React.useState<"video" | "photo">("video");

  return (
    <section className="relative bg-[#FAF9F7] text-stone-900 pt-28 sm:pt-32 lg:pt-36 pb-20 overflow-hidden">
      {/* Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">

        {/* ── TOP HERO ROW (LEFT HEADLINE & CTAS + RIGHT MEDIA PLAYER WITH OVERLAYS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Text Headline, Subtitle, CTAs & Social Proof ── */}
          <div className="lg:col-span-6 space-y-7 text-left">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition.slow}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <span>{lang === "bn" ? "মুনতাজারে স্বাগতম" : "Welcome to Muntajar"}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.08 }}
              className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.14] text-stone-950 tracking-tight"
            >
              {lang === "bn" ? (
                <>
                  উচ্চশিক্ষা, ক্যারিয়ার ও ভিসা আবেদনের{" "}
                  <span className="text-[#B45309] underline decoration-[#FDE68A] decoration-wavy decoration-2">
                    বিশ্বস্ত প্রথম ধাপ।
                  </span>
                </>
              ) : (
                <>
                  The First Step Towards Your{" "}
                  <span className="text-[#B45309] underline decoration-[#FDE68A] decoration-wavy decoration-2">
                    Future Abroad.
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.15 }}
              className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
            >
              {lang === "bn"
                ? "মুনতাজার (Muntajar) একটি আধুনিক ডিজিটাল প্ল্যাটফর্ম — যা গ্লোবাল এডুকেশন, জব প্লেসমেন্ট এবং ভিসা প্রসেসিংকে সহজ, ব্রোকার-মুক্ত ও সম্পূর্ণ স্বচ্ছ করে তুলেছে।"
                : "Muntajar empowers students, workers, and professionals with transparent, tech-enabled study, employment, and immigration pathways."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.22 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                {lang === "bn" ? "আবেদন শুরু করুন" : "Get Started Now"}
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-amber-50/80 text-stone-900 border border-stone-200 hover:border-amber-300 font-bold text-sm px-7 py-4 rounded-2xl transition-all cursor-pointer shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-amber-600" />
                </div>
                <span>{lang === "bn" ? "প্রসেস ভিডিও দেখুন" : "Watch Overview"}</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 ml-0.5">
                  Plyr HD
                </span>
              </button>
            </motion.div>

            {/* Applicants Guided Counter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.28 }}
              className="pt-4 flex items-center gap-4 border-t border-stone-200/80"
            >
              <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Applicant"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  unoptimized
                />
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Applicant"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  unoptimized
                />
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Applicant"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  unoptimized
                />
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-stone-950 font-black text-xs ring-2 ring-white">
                  +
                </div>
              </div>

              <div>
                <p className="text-sm font-extrabold text-stone-950 leading-none">
                  <AnimatedCounter to={12000} suffix="+" />
                </p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Total active applicants guided</p>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN: Interactive Media Showcase (Plyr Video Player & Portrait Toggle) ── */}
          <div className="lg:col-span-6 relative flex flex-col items-center lg:items-end">
            
            {/* Toggle Bar */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-stone-200/70 border border-stone-300/60 mb-4 z-20 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveMediaTab("video")}
                className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeMediaTab === "video"
                    ? "bg-white text-stone-950 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Video className="w-3.5 h-3.5 text-amber-600" />
                <span>Overview Video</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMediaTab("photo")}
                className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeMediaTab === "photo"
                    ? "bg-white text-stone-950 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Student Stories</span>
              </button>
            </div>

            {/* Main Media Showcase Box */}
            <div className="relative w-full max-w-[540px]">
              
              {activeMediaTab === "video" ? (
                <motion.div
                  key="video-player-container"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full bg-stone-950 rounded-3xl p-2.5 sm:p-3 border border-stone-800 shadow-2xl overflow-hidden"
                >
                  {/* Video Header Strip */}
                  <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-stone-800/80 mb-2">
                    <div className="flex items-center gap-2 text-stone-300 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Plyr Video Showcase</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsVideoModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Expand Modal</span>
                    </button>
                  </div>

                  {/* Embedded Plyr Player */}
                  <HeroPlyrPlayer videoId="2W8LBxb7K_M" />

                  <div className="px-3 pt-3 pb-1 flex items-center justify-between text-xs text-stone-400 font-medium">
                    <span>Muntajar Guide & Video Tour</span>
                    <span className="text-amber-500 font-semibold">4K / HD Support</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="portrait-photo-container"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full max-w-[480px] h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border border-stone-200 mx-auto lg:ml-auto lg:mr-0"
                >
                  <Image
                    src="/muntajar-hero.png"
                    alt="Muntajar Successful Applicant"
                    fill
                    priority
                    className="object-cover object-center"
                  />

                  {/* Light gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
                </motion.div>
              )}

              {/* Floating Overlay Card 1 (Top Left of Media Showcase) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transition.slow, delay: 0.35 }}
                className="absolute top-12 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-stone-200 flex items-center gap-3.5 max-w-[230px] z-20 shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-950">
                    <AnimatedCounter prefix="$" to={12500000} suffix="+" />
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">Scholarships Secured</p>
                  <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-0.5">
                    100% Tuition Grants
                  </span>
                </div>
              </motion.div>

              {/* Floating Overlay Card 2 (Bottom Right of Media Showcase) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transition.slow, delay: 0.42 }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-2 max-w-[250px] z-20 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Visa Success Rate</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> <AnimatedCounter to={99.4} decimals={1} suffix="%" />
                  </span>
                </div>

                <p className="text-xl font-extrabold text-stone-950">
                  <AnimatedCounter prefix="$" to={5640} suffix=" USD / Mo" />
                </p>
                <p className="text-[11px] text-stone-500 font-medium">Average post-grad salary abroad</p>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>150+ Partner Universities</span>
                </div>
              </motion.div>

            </div>

          </div>

        </div>

        {/* ── BOTTOM SOCIAL PROOF RIBBON — Auto-scrolling Logo Carousel ── */}
        <div className="mt-20 pt-10 border-t border-stone-200/80">
          <Logos3
            heading="More than 10,000+ applicants are using Muntajar."
            logos={[
              { id: "1", description: "UK Universities" },
              { id: "2", description: "DAAD Germany" },
              { id: "3", description: "Canada Immigration" },
              { id: "4", description: "Chevening" },
              { id: "5", description: "Erasmus+" },
              { id: "6", description: "British Council" },
              { id: "7", description: "IELTS Official" },
              { id: "8", description: "Cambridge" },
              { id: "9", description: "IDP Education" },
              { id: "10", description: "Study in Europe" },
            ]}
          />
        </div>

      </div>

      {/* Plyr Video Modal Component */}
      <PlyrVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="2W8LBxb7K_M"
        title={lang === "bn" ? "মুনতাজার ওভারভিউ ও গাইডলাইন" : "Muntajar Platform Overview & Video Guide"}
      />
    </section>
  );
}

