"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Paper shaders render at 2x the screen's pixel ratio by default (about 6 million pixels for a full-screen
 * background on a 1659px display). The soft gradients look the same at 1x, so every shader on the page uses this.
 */
export const SHADER_BUDGET = { minPixelRatio: 1, maxPixelCount: 1600 * 900 } as const;

/**
 * Renders its children only while the box is on screen (plus a margin), so the WebGL backgrounds and
 * animated SVGs further down the page cost nothing until you get there.
 */
export function WhenVisible({ children, className, margin = "300px" }: { children: ReactNode; className?: string; margin?: `${number}px` }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin });
  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  );
}
