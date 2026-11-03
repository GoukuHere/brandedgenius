"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Paper shaders render at 2x the screen's pixel ratio by default (about 6 million pixels for a full-screen
 * background on a 1659px display). Their soft gradients look the same at 1x, so every shader uses this.
 */
export const SHADER_BUDGET = { minPixelRatio: 1, maxPixelCount: 1280 * 720 } as const;

/**
 * Mounts its children once and keeps them. Mounting happens either when the box comes near the screen, or
 * earlier while the browser is idle after page load (staggered by `order`). Building a WebGL program takes
 * 50 to 100 ms, so doing it in idle time keeps that stall out of the middle of a scroll. Paper shaders pause
 * themselves while off screen, so mounting early costs nothing per frame.
 */
export function WhenVisible({
  children,
  className,
  margin = "800px",
  order,
}: {
  children: ReactNode;
  className?: string;
  margin?: `${number}px`;
  /** Position in the idle-time mounting queue; leave out to mount only when near. */
  order?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin, once: true });
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    if (order === undefined) return;
    let idle = 0;
    // Skip copies that are not laid out (the desktop or phone version hidden with display: none).
    const warmUp = () => {
      if (ref.current?.getClientRects().length) setWarm(true);
    };
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(warmUp, { timeout: 3000 });
      else warmUp();
    }, 1800 + order * 900);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [order]);

  return (
    <div ref={ref} className={className}>
      {seen || warm ? children : null}
    </div>
  );
}
