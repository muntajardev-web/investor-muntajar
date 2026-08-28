"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { staggerContainer, staggerItem, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface StaggerChildrenProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number;
}

export function StaggerChildren({
  className,
  children,
  staggerDelay,
  ...props
}: StaggerChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        ...staggerContainer,
        visible: {
          transition: {
            staggerChildren: staggerDelay ?? 0.08,
            delayChildren: 0.1,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={staggerItem} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
