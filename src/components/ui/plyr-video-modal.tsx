"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { HeroPlyrPlayer } from "./hero-plyr-player";

interface PlyrVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  title?: string;
}

export function PlyrVideoModal({
  isOpen,
  onClose,
  videoId = "2W8LBxb7K_M",
  title = "Muntajar Overview & Guide",
}: PlyrVideoModalProps) {

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-stone-100 font-bold text-base leading-tight">
                    {title}
                  </h3>
                  <p className="text-stone-400 text-xs">
                    Watch how Muntajar simplifies study abroad & visa applications
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Body */}
            <div className="p-4 sm:p-6 bg-stone-950">
              <HeroPlyrPlayer videoId={videoId} autoplay={true} />
            </div>

            {/* Footer hint */}
            <div className="px-6 py-3 bg-stone-900/80 border-t border-stone-800/80 text-center text-xs text-stone-400">
              Powered by Plyr Media Player · Press <kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-300 font-mono text-[10px]">ESC</kbd> or click backdrop to exit
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
