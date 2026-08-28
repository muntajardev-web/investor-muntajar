"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { slideUp, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SlideUpProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function SlideUp({ className, delay = 0, children, ...props }: SlideUpProps) {
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
