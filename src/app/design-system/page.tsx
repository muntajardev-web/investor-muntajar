import type { Metadata } from "next";
import { DesignSystemShowcase } from "./design-system-showcase";

export const metadata: Metadata = {
  title: "Design System",
  description: "Muntajar design system — colors, typography, components, and motion principles.",
};

export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}
