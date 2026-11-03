"use client";

import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
// Two rounds of 0 to 9, so every digit spins at least once before it lands.
const STRIP = Array.from({ length: 20 }, (_, i) => i % 10);

type Props = {
  /** The figure as written in the content, for example "+43%" or "-62%". */
  value: string;
  play: boolean;
  delay?: number;
  className?: string;
  /** After landing, swap to plain text with a light sweeping across it. */
  sheen?: boolean;
};

/*
  A slot-machine counter. Each digit column keeps the width of its final digit, so the landed number has the
  same spacing as plain text and the sheen version can take over without a jump.
*/
export function RollingNumber({ value, play, delay = 0, className, sheen = false }: Props) {
  const text = value.replace(/^-/, "−");
  const chars = [...text];
  const lastDigit = chars.reduce((last, c, i) => (/\d/.test(c) ? i : last), -1);
  const [done, setDone] = useState(false);

  if (sheen && done) {
    return <span className={cn("sheen-text inline-flex", className)}>{text}</span>;
  }

  return (
    <span className={cn("relative inline-flex items-start", className)}>
      <span className="sr-only">{text}</span>
      {chars.map((c, i) => {
        if (!/\d/.test(c)) {
          return (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={false}
              animate={play ? { opacity: 1, y: "0%" } : { opacity: 0, y: "35%" }}
              transition={play ? { duration: 0.8, delay: delay + i * 0.07, ease: EASE } : { duration: 0 }}
            >
              {c}
            </motion.span>
          );
        }
        const d = Number(c);
        return (
          <span key={i} aria-hidden className="relative inline-block [overflow-x:visible] [overflow-y:clip]">
            <span className="invisible">{c}</span>
            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col items-center"
              initial={false}
              animate={play ? { y: `${-(10 + d) * 5}%`, opacity: 1 } : { y: "0%", opacity: 0 }}
              transition={play ? { duration: 1.6, delay: delay + i * 0.09, ease: EASE } : { duration: 0 }}
              onAnimationComplete={() => {
                if (play && sheen && i === lastDigit) setDone(true);
              }}
            >
              {STRIP.map((n, j) => (
                <span key={j} className="block">
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * The same slot counter driven purely by CSS: it rolls when an ancestor with class "case" gets data-on="true"
 * (see globals.css), so landing a use-case panel starts no JavaScript animations at all.
 */
export function RollingNumberCss({ value, delay = 0, className }: { value: string; delay?: number; className?: string }) {
  const text = value.replace(/^-/, "−");
  const chars = [...text];
  return (
    <span className={cn("relative inline-flex items-start", className)}>
      <span className="sr-only">{text}</span>
      {chars.map((c, i) =>
        /\d/.test(c) ? (
          <span key={i} aria-hidden className="relative inline-block [overflow-x:visible] [overflow-y:clip]">
            <span className="invisible">{c}</span>
            <span
              className="roll absolute inset-x-0 top-0 flex flex-col items-center"
              style={{ "--to": `${-(10 + Number(c)) * 5}%`, "--d": `${delay + i * 0.09}s` } as CSSProperties}
            >
              {STRIP.map((n, j) => (
                <span key={j} className="block">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden className="fade-up inline-block" style={{ "--d": `${delay + i * 0.07}s` } as CSSProperties}>
            {c}
          </span>
        )
      )}
    </span>
  );
}

/** Keeps hyphenated words such as "KI-Telefonie" or "Follow-ups" on one line. */
export function NoBreak({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className={word.includes("-") ? "whitespace-nowrap" : undefined}>
          {i > 0 ? " " : ""}
          {word}
        </span>
      ))}
    </>
  );
}
