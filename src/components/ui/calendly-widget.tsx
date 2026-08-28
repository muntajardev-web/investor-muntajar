import * as React from "react";
import { X } from "lucide-react";

export interface CalendlyWidgetProps {
  url?: string;
  height?: number;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
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
  isOpen,
  onClose,
}: CalendlyWidgetProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initialized = React.useRef(false);

  // If used as a controlled modal and isOpen is false, don't render
  if (isOpen !== undefined && !isOpen) {
    return null;
  }

  // Effect to load and init Calendly widget
  React.useEffect(() => {
    let script: HTMLScriptElement | null = null;

    function initWidget() {
      if (!containerRef.current || initialized.current) return;
      if (!window.Calendly) return;

      containerRef.current.innerHTML = "";
      initialized.current = true;
      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
      });
    }

    const existing = document.getElementById("calendly-script");
    if (existing) {
      initWidget();
    } else {
      script = document.createElement("script");
      script.id = "calendly-script";
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }

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
      initialized.current = false;
      if (pollInterval) clearInterval(pollInterval);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [url]);

  const widgetContent = (
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

  // If used as a modal with onClose
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          {widgetContent}
        </div>
      </div>
    );
  }

  return widgetContent;
}
