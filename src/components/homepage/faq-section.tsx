"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ArrowRight, PhoneCall } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { transition } from "@/lib/motion";
import { faqItems } from "@/lib/homepage-data";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { ...transition.slow, delay },
});

export function FaqSection() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-white text-stone-950 border-t border-stone-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
          <div className="lg:col-span-7 space-y-4">
            <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Frequently Asked Questions</span>
            </motion.div>
            <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
              Questions We Hear Often.
            </motion.h2>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              Still unsure about university shortlisting, broker fees, or visa compliance? Talk directly with a senior counsellor.
            </motion.p>
            <motion.div {...fadeUp(0.2)}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-stone-950 text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md"
              >
                <span>Ask an Advisor Directly</span>
                <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Accordion Container */}
        <motion.div {...fadeUp(0.25)} className="max-w-4xl mx-auto">
          <div className="bg-[#FAF9F7] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${i}`}
                  className="border border-stone-200/80 rounded-2xl bg-white px-5 sm:px-6 py-2 transition-all"
                >
                  <AccordionTrigger className="text-left text-base font-bold text-stone-950 hover:text-amber-700 hover:no-underline py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal pt-1 pb-4 border-t border-stone-100">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
