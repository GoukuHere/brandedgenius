"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

// Lenis eases the native scroll, so every scroll-driven section moves with weight instead of in steps.
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -80 } }}>
      {children}
    </ReactLenis>
  );
}
