"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { transition } from "@/lib/motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { ...transition.slow, delay },
});

/** Full-bleed brand film used under the investor pitch */
export const INVESTOR_HERO_VIDEO =
  "/video/lv_0_20260822142854.mp4";

export const INVESTOR_HERO_POSTER =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80";

export function InvestorHero() {
  return (
    <section className="relative overflow-hidden bg-[#0f0f0e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,93,26,0.18),transparent_55%)]" />

      <Container className="relative z-10 pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            {...fadeUp(0.05)}
            className="font-display text-3xl text-white sm:text-4xl md:text-[2.75rem]"
          >
            Muntajar
          </motion.p>

          <motion.h1
            {...fadeUp(0.18)}
            className="mt-6 font-sans text-[2.15rem] font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.35rem]"
          >
            First Ever Manpower Ecosystem in Bangladesh.
          </motion.h1>

          <motion.p
            {...fadeUp(0.24)}
            className="mt-4 text-stone-300 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Muntajar is not just another startup; it&apos;s a movement to transform the fate of aspiring youth &amp; NRBs, empower their dreams, and reshape Bangladesh&apos;s future for the world.
          </motion.p>

          <motion.div {...fadeUp(0.32)} className="mt-6 text-left max-w-2xl mx-auto space-y-2">
            {[
              "Transforming Manpower Sector Digitally.",
              "AI-Powered & Fully Automated.",
              "Middleman-free Platform.",
              "Transparency.",
              "Candidates & Students can communicate directly with Recruiters / University Representatives.",
              "Cost Minimization up to 60%",
              "No more Illegal Migration or unskilled migrants.",
            ].map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-stone-200 py-0.5"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{bullet}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            {...fadeUp(0.46)}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button size="lg" asChild>
              <Link href="#investor-inquiry">
                Start a conversation
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="#thesis">Read the thesis</Link>
            </Button>
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.slow, delay: 0.55 }}
        className="relative z-10 w-full"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden border-t border-white/10 bg-stone-900 md:aspect-[21/9]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={INVESTOR_HERO_POSTER}
            aria-label="Muntajar investor overview film"
          >
            <source src={INVESTOR_HERO_VIDEO} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f0f0e]/70 via-transparent to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
