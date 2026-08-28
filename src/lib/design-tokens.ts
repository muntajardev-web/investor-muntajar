/**
 * Muntajar Design System — Tokens
 * ─────────────────────────────────
 * 8px spacing grid · One brand accent · Accessible neutrals
 * CSS mirrors: src/app/globals.css
 */

/** Base unit: 8px. Half-step (4px) available for fine tuning. */
export const space = {
  0: "0",
  px: "1px",
  "0.5": "0.25rem", // 4px
  1: "0.5rem", // 8px
  2: "1rem", // 16px
  3: "1.5rem", // 24px
  4: "2rem", // 32px
  5: "2.5rem", // 40px
  6: "3rem", // 48px
  8: "4rem", // 64px
  10: "5rem", // 80px
  12: "6rem", // 96px
  16: "8rem", // 128px
  section: "clamp(5rem, 12vw, 10rem)",
  sectionSm: "clamp(3rem, 8vw, 6rem)",
} as const;

export const colors = {
  brand: {
    50: "#FFF7F0",
    100: "#FFEDD9",
    200: "#FFD4B0",
    300: "#FFB07A",
    400: "#F2853E",
    500: "#E85D1A",
    600: "#CC4A12",
    700: "#A83B0F",
    800: "#8A320F",
    900: "#6E2A0E",
  },
  /** @deprecated alias for brand */
  orange: {
    50: "#FFF7F0",
    100: "#FFEDD9",
    200: "#FFD4B0",
    300: "#FFB07A",
    400: "#F2853E",
    500: "#E85D1A",
    600: "#CC4A12",
    700: "#A83B0F",
    800: "#8A320F",
    900: "#6E2A0E",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#FAFAF8",
    100: "#F5F4F1",
    200: "#E8E6E1",
    300: "#D4D1CA",
    400: "#A8A49C",
    500: "#78746C",
    600: "#5C5850",
    700: "#45423C",
    800: "#2E2C28",
    900: "#1C1B18",
    950: "#0F0F0E",
  },
  /** @deprecated alias for neutral (50–900) */
  stone: {
    50: "#FAFAF8",
    100: "#F5F4F1",
    200: "#E8E6E1",
    300: "#D4D1CA",
    400: "#A8A49C",
    500: "#78746C",
    600: "#5C5850",
    700: "#45423C",
    800: "#2E2C28",
    900: "#1C1B18",
  },
  success: { DEFAULT: "#16A34A", muted: "#DCFCE7", foreground: "#FFFFFF" },
  warning: { DEFAULT: "#D97706", muted: "#FEF3C7", foreground: "#FFFFFF" },
  error: { DEFAULT: "#DC2626", muted: "#FEE2E2", foreground: "#FFFFFF" },
  info: { DEFAULT: "#2563EB", muted: "#DBEAFE", foreground: "#FFFFFF" },
} as const;

export const semantic = {
  light: {
    background: colors.neutral[50],
    foreground: colors.neutral[900],
    muted: colors.neutral[100],
    mutedForeground: colors.neutral[500],
    card: colors.neutral[0],
    cardForeground: colors.neutral[900],
    border: colors.neutral[200],
    borderSubtle: "rgba(28, 27, 24, 0.06)",
    input: colors.neutral[200],
    ring: colors.brand[500],
    accent: colors.brand[500],
    accentForeground: colors.neutral[0],
    accentMuted: colors.brand[50],
  },
  dark: {
    background: "#09090B",
    foreground: "#FAFAFA",
    muted: "#18181B",
    mutedForeground: "#A1A1AA",
    card: "#0F0F11",
    cardForeground: "#FAFAFA",
    border: "rgba(255, 255, 255, 0.08)",
    borderSubtle: "rgba(255, 255, 255, 0.04)",
    input: "rgba(255, 255, 255, 0.08)",
    ring: colors.brand[500],
    accent: colors.brand[500],
    accentForeground: colors.neutral[0],
    accentMuted: "rgba(232, 93, 26, 0.12)",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    display: "var(--font-instrument-serif), Georgia, serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
    sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0" }],
    base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "-0.01em" }],
    lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
    xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.02em" }],
    "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
    "3xl": ["2rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
    "4xl": ["2.5rem", { lineHeight: "2.75rem", letterSpacing: "-0.03em" }],
    display: [
      "clamp(2rem, 3.5vw, 3rem)",
      { lineHeight: "1.1", letterSpacing: "-0.02em" },
    ],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const radius = {
  sm: "0.375rem", // 6px
  md: "0.625rem", // 10px
  lg: "0.75rem", // 12px
  xl: "0.75rem", // 12px — primary surface radius (rounded-xl in Tailwind = 12px... actually xl is 12px in tailwind v3, let me use 12px)
  /** Primary component radius — maps to rounded-xl (12px) */
  surface: "0.75rem",
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// Tailwind rounded-xl = 0.75rem (12px). User asked rounded-xl - use 12px as default surface.

export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(28, 27, 24, 0.04)",
  sm: "0 1px 3px rgba(28, 27, 24, 0.06), 0 1px 2px rgba(28, 27, 24, 0.04)",
  md: "0 4px 12px rgba(28, 27, 24, 0.06), 0 2px 4px rgba(28, 27, 24, 0.04)",
  lg: "0 8px 24px rgba(28, 27, 24, 0.08), 0 4px 8px rgba(28, 27, 24, 0.04)",
  xl: "0 16px 48px rgba(28, 27, 24, 0.1)",
  focus: "0 0 0 3px rgba(232, 93, 26, 0.25)",
  inner: "inset 0 1px 2px rgba(28, 27, 24, 0.06)",
} as const;

export const motion = {
  duration: {
    instant: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "400ms",
  },
  easing: {
    default: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
  },
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1400px",
} as const;

export const container = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  prose: "680px",
  dashboard: "1120px",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  drawer: 350,
  toast: 400,
  command: 500,
} as const;

/** Component-specific sizing */
export const component = {
  button: {
    height: { sm: "2rem", md: "2.5rem", lg: "2.75rem" },
    paddingX: { sm: "0.75rem", md: "1rem", lg: "1.25rem" },
  },
  input: {
    height: { sm: "2rem", md: "2.5rem", lg: "2.75rem" },
  },
  icon: { sm: "1rem", md: "1.25rem", lg: "1.5rem" },
} as const;

// Legacy exports for backward compatibility
export const spacing = space;
export const grid = {
  columns: 12,
  gap: space[4],
  container: {
    default: container.xl,
    wide: "1440px",
    narrow: "720px",
    prose: container.prose,
  },
};
