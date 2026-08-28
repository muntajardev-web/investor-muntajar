"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Overline } from "@/components/typography/overline";
import { SectionReveal } from "@/components/homepage/section-reveal";
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";
import { problemPoints } from "@/lib/homepage-data";

export function ProblemSection() {
  return (
    <section id="problem" className="section-padding bg-stone-100">
      <Container>
        <SectionReveal className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <Overline accent className="mb-4 block font-bold tracking-[0.2em]">
            The reality
          </Overline>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-stone-950 leading-tight tracking-tight mb-5">
            You already know something is wrong.
          </h2>
          <p className="text-base md:text-lg font-medium text-stone-600 leading-relaxed">
            The overseas journey for Bangladeshis has been broken for decades —
            not because people lack ambition, but because the system benefits
            everyone except you.
          </p>
        </SectionReveal>

        <StaggerChildren>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-8">
            {problemPoints.map((point, i) => (
              <StaggerItem key={point.id}>
                <article className="relative h-full bg-white rounded-2xl p-7 md:p-8 border border-stone-200">
                  <span
                    aria-hidden
                    className="absolute top-4 right-5 font-mono text-5xl font-bold text-stone-100 leading-none select-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative">
                    <span className="inline-block w-8 h-1 rounded-full bg-orange-500 mb-5" />
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-3">
                      {point.tab}
                    </p>
                    <blockquote className="font-sans text-lg md:text-xl font-bold text-stone-950 leading-snug mb-4">
                      &ldquo;{point.quote}&rdquo;
                    </blockquote>
                    <p className="text-sm font-medium text-stone-600 leading-relaxed">
                      {point.detail}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </div>
        </StaggerChildren>

        <SectionReveal delay={0.2} className="mt-12 md:mt-14 text-center">
          <Link
            href="#why"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-white text-sm font-semibold px-6 py-3 hover:bg-stone-800 transition-colors"
          >
            See how Muntajar fixes this
            <ArrowRight className="w-4 h-4" />
          </Link>
        </SectionReveal>
      </Container>
    </section>
  );
}
