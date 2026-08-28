"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  FileText,
  MessageSquare,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const milestones = [
  { label: "Profile created", done: true },
  { label: "Documents uploaded", done: true },
  { label: "Application submitted", done: true },
  { label: "Interview scheduled", done: false, active: true },
  { label: "Visa processing", done: false },
  { label: "Pre-departure", done: false },
];

export function PlatformMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200 bg-white overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-100 bg-stone-50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
        </div>
        <span className="text-xs text-stone-400 ml-2 font-mono">
          app.muntajar.com/journey
        </span>
      </div>

      <div className="grid md:grid-cols-5 min-h-[320px]">
        <div className="md:col-span-2 border-r border-stone-100 p-5 bg-stone-50/50">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">
            Your milestones
          </p>
          <ul className="space-y-3">
            {milestones.map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2.5"
              >
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                ) : (
                  <Circle
                    className={cn(
                      "w-4 h-4 shrink-0",
                      item.active
                        ? "text-orange-500 fill-orange-50"
                        : "text-stone-300",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-sm",
                    item.done
                      ? "text-stone-600"
                      : item.active
                        ? "text-stone-900 font-medium"
                        : "text-stone-400",
                  )}
                >
                  {item.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 p-5 flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
              Documents
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Passport", "Transcript", "IELTS", "Bank Statement"].map(
                (doc, i) => (
                  <div
                    key={doc}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-100"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs text-stone-700">{doc}</span>
                    {i < 3 && (
                      <CheckCircle2 className="w-3 h-3 text-orange-500 ml-auto" />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="border-2 border-dashed border-stone-200 rounded-lg p-4 flex items-center justify-center gap-2 text-stone-400">
            <Upload className="w-4 h-4" />
            <span className="text-xs">Drop files or click to upload</span>
          </div>

          <div className="mt-auto flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <MessageSquare className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-stone-900">
                Advisor Sarah
              </p>
              <p className="text-xs text-stone-600 mt-0.5">
                Your interview is confirmed for March 12. I&apos;ve uploaded the
                prep guide to your documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
