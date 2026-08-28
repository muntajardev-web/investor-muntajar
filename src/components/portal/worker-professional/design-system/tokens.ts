/**
 * Muntajar Worker & Professional Portal Design System
 * Inspired by Stripe Dashboard, Linear, Vercel, and Mercury Bank.
 * 
 * Strict 8px Spacing System
 * High Contrast & Readability
 * Document Trust Architecture
 */

export const PORTAL_TOKENS = {
  colors: {
    bg: {
      page: "#FAF9F7", // Warm off-white
      surface: "#FFFFFF", // Crisp white surface
      surfaceSubtle: "#F4F4F5", // Neutral background fill
      elevated: "#FFFFFF",
    },
    text: {
      primary: "#09090B", // High contrast dark
      secondary: "#52525B", // Muted secondary text
      tertiary: "#71717A", // Subtle label text
      inverse: "#FFFFFF",
    },
    border: {
      default: "rgba(228, 228, 231, 0.8)", // Clean flat border
      subtle: "rgba(244, 244, 245, 0.9)",
      hover: "#A1A1AA",
      active: "#09090B",
    },
    accent: {
      trust: "#0284C7", // Trust blue for verified credentials
      trustLight: "rgba(2, 132, 199, 0.08)",
      success: "#16A34A", // Emerald for completed milestones
      successLight: "rgba(22, 163, 74, 0.08)",
      warning: "#CA8A04", // Amber for pending reviews
      warningLight: "rgba(202, 138, 4, 0.08)",
      danger: "#DC2626", // Red for missing items
      dangerLight: "rgba(220, 38, 38, 0.08)",
    },
  },
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
    "2xl": "64px",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },
} as const;
