"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";

// The last line of the client's statement, revealed word by word with small marks inline, like the reference site's About text.
type Token = { word: string; accent?: boolean; after?: ReactNode };

const Mark = () => (
  <span className="ml-[0.22em] inline-grid h-[0.78em] w-[1.3em] translate-y-[0.08em] place-items-center rounded-full border border-sky/40 bg-sky/10 align-baseline">
    <img src="/brand/mark.svg" alt="" className="h-[0.42em]" />
  </span>
);

const Tools = () => (
  <span className="ml-[0.22em] inline-flex translate-y-[0.06em] align-baseline">
    {["n8n", "hubspot", "whatsapp", "slack"].map((name, i) => (
      <span
        key={name}
        className="-ml-[0.16em] grid size-[0.8em] place-items-center rounded-full border border-white/15 bg-[#0d1424] first:ml-0"
        style={{ zIndex: 4 - i }}
      >
        <span aria-hidden className="icon-mask block size-[0.4em] text-white/85" style={{ "--icon": `url(/icons/${name}.svg)` } as CSSProperties} />
      </span>
    ))}
  </span>
);

const TOKENS: Token[] = [
  { word: "Wir" },
  { word: "bringen" },
  { word: "KI", after: <Mark /> },
  { word: "dorthin," },
  { word: "wo" },
  { word: "sie" },
  { word: "echten" },
  { word: "Mehrwert" },
  { word: "schafft:" },
  { word: "in", accent: true },
  { word: "Ihre", accent: true },
  { word: "Prozesse.", accent: true, after: <Tools /> },
];

function Word({ token, i, progress }: { token: Token; i: number; progress: MotionValue<number> }) {
  const start = (i / TOKENS.length) * 0.75;
  const opacity = useTransform(progress, [start, start + 0.12], [0.12, 1]);
  const y = useTransform(progress, [start, start + 0.12], [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.24em] inline-block">
      <span className={token.accent ? "accent-serif" : undefined}>{token.word}</span>
      {token.after}
    </motion.span>
  );
}

export function BridgeStatement() {
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: runway, offset: ["start 75%", "end 60%"] });
  // The lit dots follow the reading position from left to right.
  const edge = useTransform(scrollYProgress, [0, 0.8], [-25, 110]);
  const litMask = useMotionTemplate`linear-gradient(90deg, black 0%, black ${edge}%, transparent calc(${edge}% + 22%))`;

  return (
    <section className="relative bg-black">
      <div ref={runway} className="relative h-[150svh]">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black_20%,transparent_80%)]">
            <div className="absolute inset-0 overflow-hidden">
              <div className="dot-field" />
            </div>
            <motion.div className="absolute inset-0 overflow-hidden" style={{ maskImage: litMask, WebkitMaskImage: litMask }}>
              <div className="dot-field-lit" />
            </motion.div>
          </div>
          <p className="relative mx-auto max-w-[1180px] px-5 text-[40px] leading-[1.08] font-medium tracking-[-0.04em] text-white md:px-10 md:text-[60px] lg:text-[76px]">
            {TOKENS.map((token, i) => (
              <Word key={token.word} token={token} i={i} progress={scrollYProgress} />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
