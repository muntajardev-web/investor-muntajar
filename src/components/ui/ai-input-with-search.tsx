"use client";

import { Globe, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";

interface AIInputWithSearchProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string, withSearch: boolean) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function AIInputWithSearch({
  id = "ai-input-with-search",
  placeholder = "Ask Muntajar AI anything about universities, scholarships...",
  minHeight = 54,
  maxHeight = 180,
  onSubmit,
  onFileSelect,
  className
}: AIInputWithSearchProps) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  const [showSearch, setShowSearch] = useState(true);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value, showSearch);
      setValue("");
      adjustHeight(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className={cn("w-full py-2", className)}>
      <div className="relative max-w-2xl w-full mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:border-stone-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all overflow-hidden">
        <div className="flex flex-col">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <Textarea
              id={id}
              value={value}
              placeholder={placeholder}
              className="w-full px-5 py-4 bg-transparent border-none text-stone-900 text-xs sm:text-sm font-semibold placeholder:text-stone-400 resize-none focus-visible:ring-0 focus:outline-none leading-relaxed"
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
            />
          </div>

          <div className="px-4 py-2.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer rounded-xl p-2 bg-stone-100/90 hover:bg-stone-200/80 text-stone-600 hover:text-stone-900 transition-colors">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Paperclip className="w-4 h-4" />
              </label>

              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "rounded-full transition-all flex items-center gap-1.5 px-3 py-1 border text-xs font-bold h-8 cursor-pointer",
                  showSearch
                    ? "bg-orange-50 border-orange-300 text-orange-700"
                    : "bg-stone-100/90 border-transparent text-stone-500 hover:text-stone-900"
                )}
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <motion.div
                    animate={{
                      rotate: showSearch ? 180 : 0,
                      scale: showSearch ? 1.1 : 1,
                    }}
                    whileHover={{
                      rotate: showSearch ? 180 : 15,
                      scale: 1.1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                  >
                    <Globe
                      className={cn(
                        "w-3.5 h-3.5",
                        showSearch
                          ? "text-orange-600"
                          : "text-inherit"
                      )}
                    />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: "auto",
                        opacity: 1,
                      }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap text-orange-700 shrink-0"
                    >
                      Web Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim()}
                className={cn(
                  "rounded-xl px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs",
                  value.trim()
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                )}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
