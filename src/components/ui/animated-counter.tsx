"use client";

import * as React from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  comma?: boolean;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  comma,
  className = "",
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  React.useEffect(() => {
    if (!isInView || !ref.current) return;

    const node = ref.current;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth ease-out quint
      onUpdate(value) {
        const formattedNumber = value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        node.textContent = `${prefix}${formattedNumber}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration, decimals, prefix, suffix]);

  const initialFormatted = from.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}{initialFormatted}{suffix}
    </span>
  );
}
