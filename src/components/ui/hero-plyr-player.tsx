"use client";

import React, { useEffect, useRef, useState } from "react";
import "plyr/dist/plyr.css";

interface HeroPlyrPlayerProps {
  videoId?: string;
  autoplay?: boolean;
  className?: string;
  onReady?: () => void;
}

export function HeroPlyrPlayer({
  videoId = "2W8LBxb7K_M",
  autoplay = false,
  className = "",
  onReady,
}: HeroPlyrPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    let isSubscribed = true;

    async function initPlyr() {
      try {
        const Plyr = (await import("plyr")).default;

        if (!isSubscribed || !containerRef.current) return;

        // Destroy previous instance if any
        if (playerInstanceRef.current) {
          try {
            playerInstanceRef.current.destroy();
          } catch {
            // ignore cleanup errors
          }
        }

        const player = new Plyr(containerRef.current, {
          autoplay,
          muted: autoplay,
          ratio: "16:9",
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
          },
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ],
        });

        playerInstanceRef.current = player;

        player.on("ready", () => {
          if (autoplay) {
            try {
              player.play();
            } catch {
              // ignore
            }
          }
          if (isSubscribed && onReady) onReady();
        });
      } catch (err) {
        console.error("Failed to initialize Plyr player:", err);
      }
    }

    initPlyr();

    return () => {
      isSubscribed = false;
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
          playerInstanceRef.current = null;
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [videoId, autoplay, isMounted, onReady]);

  if (!isMounted) {
    return (
      <div className={`w-full aspect-video bg-stone-900 rounded-2xl animate-pulse flex items-center justify-center text-stone-500 text-sm font-medium ${className}`}>
        Loading player...
      </div>
    );
  }

  return (
    <div className={`plyr-hero-wrapper relative w-full rounded-2xl overflow-hidden shadow-2xl bg-stone-950 border border-stone-800/80 ${className}`}>
      <div
        ref={containerRef}
        data-plyr-provider="youtube"
        data-plyr-embed-id={videoId}
        className="w-full aspect-video"
      />
    </div>
  );
}
