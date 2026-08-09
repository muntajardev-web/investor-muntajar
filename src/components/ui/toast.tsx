"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "next-themes";

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-xl border border-border bg-card text-foreground shadow-lg",
          title: "text-sm font-medium",
          description: "text-sm text-muted-foreground",
          actionButton:
            "rounded-lg bg-accent text-accent-foreground text-xs font-medium",
          cancelButton:
            "rounded-lg bg-muted text-muted-foreground text-xs font-medium",
          closeButton:
            "rounded-lg border border-border bg-card text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
