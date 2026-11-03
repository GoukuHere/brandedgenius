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
 * earlier in a quiet moment after page load (staggered by `order`). Building a WebGL program takes 50 to 100 ms
 * and blocks the page, so the early mount waits until nothing has scrolled for 600 ms and the browser reports
 * real idle time; it never forces itself into the middle of a scroll. Paper shaders pause themselves while off
 * screen, so mounting early costs nothing per frame.
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
    // Browsers without requestIdleCallback (Safari) simply mount on approach.
    if (order === undefined || !("requestIdleCallback" in window)) return;
    let idle = 0;
    let lastScroll = 0;
    const onScroll = () => {
      lastScroll = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const warmUp = (deadline: IdleDeadline) => {
      if (performance.now() - lastScroll < 600 || deadline.timeRemaining() < 30) {
        idle = window.requestIdleCallback(warmUp);
        return;
      }
      idle = 0;
      window.removeEventListener("scroll", onScroll);
      // Skip copies that are not laid out (the desktop or phone version hidden with display: none).
      if (ref.current?.getClientRects().length) setWarm(true);
    };
    const timer = window.setTimeout(() => {
      idle = window.requestIdleCallback(warmUp);
    }, 1800 + order * 900);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [order]);

  return (
    <div ref={ref} className={className}>
      {seen || warm ? children : null}
    </div>
  );
}
