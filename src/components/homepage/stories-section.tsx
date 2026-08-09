"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { transition } from "@/lib/motion";

const STORIES = [
  {
    id: "damon",
    name: "Ayesha Rahman",
    role: "MSc & Chevening Scholar, UK",
    quote:
      "As an international student, I needed help navigating university shortlisting and scholarships. Muntajar provided not only university admissions but also strategic advice that helped my profile secure a 100% tuition grant in just one year.",
    rating: "4.9",
    reviewsCount: "+300 reviews",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "tanvir",
    name: "Tanvir Chowdhury",
    role: "Software Engineer, Germany",
    quote: "From visa guidance to direct job placement in Germany, Muntajar made the entire process smooth and stress-free. Their legal audit saved months of waiting time.",
    rating: "5.0",
    reviewsCount: "+250 reviews",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "samantha",
    name: "Samantha Yeoh",
    role: "MBA, National University of Singapore",
    quote: "The personalized coaching and embassy mock interviews gave me the confidence to secure my admission into NUS with full financial aid.",
    rating: "4.8",
    reviewsCount: "+180 reviews",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
];

export function StoriesSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const story = STORIES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? STORIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === STORIES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="stories" className="py-24 md:py-32 bg-[#FAF9F7] text-stone-900 border-t border-stone-200/60 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ── FINEDGE TESTIMONIAL HEADER (Yellow Pill + Left Title + Right Paragraph) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12">
          <div className="lg:col-span-7 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={transition.slow}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold"
            >
              <span>Testimonial</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.08 }}
              className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight"
            >
              Client success stories their Journey with us.
            </motion.h2>
          </div>

          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition.slow, delay: 0.14 }}
              className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal"
            >
              Our clients&apos; success is the foundation of everything we do. Each story represents a unique journey of overcoming admissions and visa challenges.
            </motion.p>
          </div>
        </div>

        {/* ── FINEDGE TESTIMONIAL CARD & ARROW CONTROLS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Arrow Controls (Light circle ‹ + Dark circle ›) */}
          <div className="lg:col-span-2 flex items-center lg:flex-col lg:items-start gap-3">
            <button
              onClick={handlePrev}
              type="button"
              className="w-11 h-11 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              type="button"
              className="w-11 h-11 rounded-full bg-stone-950 text-white shadow-md flex items-center justify-center hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Floating Testimonial Card */}
          <div className="lg:col-span-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={transition.slow}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                
                {/* Left Text & Ratings (7 cols) */}
                <div className="md:col-span-7 space-y-6 text-left">
                  
                  {/* Name & Role + Big Quote Mark */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
                        {story.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-stone-500 mt-1">
                        {story.role}
                      </p>
                    </div>

                    <Quote className="w-10 h-10 text-stone-300 shrink-0 rotate-180" />
                  </div>

                  {/* Quote Paragraph */}
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal">
                    &ldquo;{story.quote}&rdquo;
                  </p>

                  {/* Star Rating & Reviews Count */}
                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-stone-900">{story.rating}</span>
                    <span className="text-xs text-stone-400 font-medium">• Based on {story.reviewsCount}</span>
                  </div>

                </div>

                {/* Right Photo Frame (5 cols) */}
                <div className="md:col-span-5 relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden border border-stone-200 shadow-md">
                  <Image
                    src={story.photo}
                    alt={story.name}
                    fill
                    className="object-cover object-center"
                    unoptimized
                  />
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
