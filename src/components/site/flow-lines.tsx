"use client";

import { motion } from "motion/react";

// Thin lines of light that drift along long curves, after Kokonut UI's Background Paths.
function Paths({ position }: { position: number }) {
  const paths = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 8 * position} -${189 + i * 9}C-${380 - i * 8 * position} -${189 + i * 9} -${312 - i * 8 * position} ${216 - i * 9} ${152 - i * 8 * position} ${343 - i * 9}C${616 - i * 8 * position} ${470 - i * 9} ${684 - i * 8 * position} ${875 - i * 9} ${684 - i * 8 * position} ${875 - i * 9}`,
    width: 0.6 + i * 0.05,
  }));

  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 696 316" fill="none">
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.16 + path.id * 0.035}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: [0.3, 0.65, 0.3], pathOffset: [0, 1, 0] }}
          transition={{ duration: 22 + (path.id % 7) * 1.6, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

export function FlowLines({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <Paths position={1} />
      <Paths position={-1} />
    </div>
  );
}
