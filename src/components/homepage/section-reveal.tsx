"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { slideUp, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionRevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function SectionReveal({
  className,
  children,
  delay = 0,
  ...props
}: SectionRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={slideUp}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
