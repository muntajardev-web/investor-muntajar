"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeIn, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function FadeIn({ className, delay = 0, children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeIn}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
