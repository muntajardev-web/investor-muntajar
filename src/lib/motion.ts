/**
 * Muntajar Motion Principles
 * ────────────────────────────
 * Consistent animation language across the platform.
 * Prefer Framer Motion for UI. Reserve GSAP for complex scroll sequences.
 */

import type { Transition, Variants } from "framer-motion";

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
  reveal: 1.0,
} as const;

export const ease = {
  default: [0.25, 0.1, 0.25, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  smooth: [0.22, 1, 0.36, 1] as const,
} as const;

export const spring = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
} as const;

export const stagger = {
  fast: 0.04,
  default: 0.08,
  slow: 0.12,
} as const;

export const transition = {
  fast: { duration: duration.fast, ease: ease.out } satisfies Transition,
  default: { duration: duration.normal, ease: ease.smooth } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.smooth } satisfies Transition,
  spring: spring.snappy satisfies Transition,
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transition.default,
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.default,
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.default,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transition.spring,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.default,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.default,
  },
};

export const revealLine: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: duration.slow, ease: ease.smooth },
  },
};

/** Viewport trigger defaults for scroll reveals */
export const viewport = {
  once: true,
  margin: "-80px",
  amount: 0.2 as const,
};

/** Reduced motion: respect user preference */
export function getReducedMotion(
  prefersReducedMotion: boolean,
): Transition | undefined {
  if (prefersReducedMotion) {
    return { duration: 0 };
  }
  return undefined;
}
