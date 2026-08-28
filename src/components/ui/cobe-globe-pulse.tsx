"use client";

import React, { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface PulseMarker {
  id: string;
  location: [number, number];
  delay: number;
}

export interface GlobePulseProps {
  markers?: PulseMarker[];
  className?: string;
  speed?: number;
  dark?: number;
  baseColor?: [number, number, number];
  glowColor?: [number, number, number];
  markerColor?: [number, number, number];
  arcColor?: [number, number, number];
  arcs?: Array<{
    from: [number, number];
    to: [number, number];
  }>;
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-dhaka", location: [23.8103, 90.4125], delay: 0 }, // Dhaka, Bangladesh
  { id: "pulse-london", location: [51.5074, -0.1278], delay: 0.4 }, // London, UK
  { id: "pulse-ny", location: [40.7128, -74.006], delay: 0.8 }, // New York, USA
  { id: "pulse-dubai", location: [25.2048, 55.2708], delay: 1.2 }, // Dubai, UAE
  { id: "pulse-tokyo", location: [35.6762, 139.6503], delay: 1.6 }, // Tokyo, Japan
  { id: "pulse-sydney", location: [-33.8688, 151.2093], delay: 2.0 }, // Sydney, Australia
  { id: "pulse-toronto", location: [43.6532, -79.3832], delay: 2.4 }, // Toronto, Canada
];

const defaultArcs = [
  { from: [23.8103, 90.4125] as [number, number], to: [51.5074, -0.1278] as [number, number] },
  { from: [23.8103, 90.4125] as [number, number], to: [40.7128, -74.006] as [number, number] },
  { from: [23.8103, 90.4125] as [number, number], to: [25.2048, 55.2708] as [number, number] },
  { from: [23.8103, 90.4125] as [number, number], to: [35.6762, 139.6503] as [number, number] },
  { from: [23.8103, 90.4125] as [number, number], to: [-33.8688, 151.2093] as [number, number] },
  { from: [23.8103, 90.4125] as [number, number], to: [43.6532, -79.3832] as [number, number] },
];

export function GlobePulse({
  markers = defaultMarkers,
  arcs = defaultArcs,
  className = "",
  speed = 0.003,
  dark = 0,
  baseColor = [0.95, 0.95, 0.95],
  glowColor = [0.98, 0.98, 0.98],
  markerColor = [0.91, 0.35, 0.05], // Muntajar Brand Orange
  arcColor = [0.91, 0.35, 0.05],
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.2,
        dark,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor,
        markerColor,
        glowColor,
        markerElevation: 0.05,
        markers: markers.map((m) => ({ location: m.location, size: 0.035, id: m.id })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to })),
        arcColor,
        arcWidth: 0.6,
        arcHeight: 0.35,
        opacity: 0.85,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"), 50);
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, arcs, speed, dark, baseColor, glowColor, markerColor, arcColor]);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
    </div>
  );
}

export default GlobePulse;
