"use client";

import * as React from "react";

interface CalendlyWidgetProps {
  url?: string;
  height?: number;
  className?: string;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

export function CalendlyWidget({
  url = "https://calendly.com/tashinkan360/30min?hide_event_type_details=1&hide_gdpr_banner=1",
  height = 700,
  className,
}: CalendlyWidgetProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initialized = React.useRef(false);

  React.useEffect(() => {
    let script: HTMLScriptElement | null = null;

    function initWidget() {
      if (!containerRef.current || initialized.current) return;
      if (!window.Calendly) return;

      // Clear any previous content to avoid duplicate widgets
      containerRef.current.innerHTML = "";

      initialized.current = true;
      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
      });
    }

    const existing = document.getElementById("calendly-script");
    if (existing) {
      // Script already loaded — initialize immediately
      initWidget();
    } else {
      // Inject script once, then initialize
      script = document.createElement("script");
      script.id = "calendly-script";
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }

    // Fallback: poll until Calendly global is available (handles cached script)
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    if (!window.Calendly) {
      pollInterval = setInterval(() => {
        if (window.Calendly) {
          if (pollInterval) clearInterval(pollInterval);
          initWidget();
        }
      }, 100);
    }

    return () => {
      // Cleanup on unmount — clear the container and reset the flag
      initialized.current = false;
      if (pollInterval) clearInterval(pollInterval);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div
      className={`w-full max-w-full overflow-hidden ${className ?? ""}`}
      style={{ height: `${height}px` }}
    >
      <div
        ref={containerRef}
        className="w-full h-full max-w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
