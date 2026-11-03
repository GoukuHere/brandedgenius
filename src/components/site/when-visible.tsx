"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Paper shaders render at 2x the screen's pixel ratio by default (about 6 million pixels for a full-screen
 * background on a 1659px display). Their soft gradients look the same at 1x, so every shader uses this.
 */
export const SHADER_BUDGET = { minPixelRatio: 1, maxPixelCount: 1280 * 720 } as const;

/**
 * Mounts its children the first time the box comes near the screen and then keeps them mounted. Paper shaders
 * pause themselves while off screen, so keeping them avoids rebuilding the WebGL program (a visible stutter)
 * every time a section scrolls back into view.
 */
export function WhenVisible({ children, className, margin = "800px" }: { children: ReactNode; className?: string; margin?: `${number}px` }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin, once: true });
  return (
    <div ref={ref} className={className}>
      {seen ? children : null}
    </div>
  );
}
