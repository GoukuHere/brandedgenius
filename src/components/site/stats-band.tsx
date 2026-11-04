"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { NoBreak } from "./rolling-number";
import { useSectionProgress } from "./use-section-progress";

/*
  Modelled on the client's reference (jamescannella.com): three figures on the page's own black, with no band
  colour and no graphics, so the type carries it. One scroll-linked entrance: as the row comes up the screen,
  each figure settles down into place character by character, left to right, and its caption follows. The
  motion is tied to the scroll position (smoothed), so it plays back in reverse when scrolling up.
*/

const STATS = [
  { value: "10+", label: "Jahre Erfahrung im digitalen Marketing" },
  { value: "+74%", label: "Schnellere Anrufannahme durch KI-Telefonie in 90 Tagen" },
  { value: "−62%", label: "Weniger manueller Aufwand im Marketing" },
];

// Each figure has its own scroll progress (so stacked figures on phones land one by one), and later columns
// start later in it, so the three side by side on desktop land left to right.
const COLUMN_STEP = 0.2;
const CHAR_STEP = 0.06;
const CHAR_SPAN = 0.3;

function Char({ c, progress, start }: { c: string; progress: MotionValue<number>; start: number }) {
  const y = useTransform(progress, [start, start + CHAR_SPAN], [-46, 0]);
  const opacity = useTransform(progress, [start, start + CHAR_SPAN], [0, 1]);
  return (
    <motion.span style={{ y, opacity }} className="inline-block">
      {c}
    </motion.span>
  );
}

function Caption({ text, progress, start }: { text: string; progress: MotionValue<number>; start: number }) {
  const y = useTransform(progress, [start, start + 0.28], [-18, 0]);
  const opacity = useTransform(progress, [start, start + 0.28], [0, 1]);
  return (
    <motion.p style={{ y, opacity }} className="mt-3 max-w-[290px] text-[15px] leading-[1.45] text-white/65">
      <NoBreak text={text} />
    </motion.p>
  );
}

function Stat({ value, label, i }: { value: string; label: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // 0 when the figure's top meets the bottom of the screen, 1 when its bottom is 65% down, so it has landed
  // before it reaches the middle. The spring smooths fast flicks like a scrubbed timeline.
  const scrolled = useSectionProgress(ref, ["start end", "end 0.65"]);
  const smooth = useSpring(scrolled, { stiffness: 140, damping: 30, restDelta: 0.0005 });
  const settled = useMotionValue(1);
  const progress = reduce ? settled : smooth;
  const start = i * COLUMN_STEP;

  return (
    <div ref={ref}>
      <p className="text-[60px] leading-[1.15] font-normal tracking-[-0.065em] text-white md:text-[72px] xl:text-[88px]">
        <span className="sr-only">{value}</span>
        <span aria-hidden className="inline-flex">
          {[...value].map((c, k) => (
            <Char key={k} c={c} progress={progress} start={start + k * CHAR_STEP} />
          ))}
        </span>
      </p>
      <Caption text={label} progress={progress} start={start + 0.2} />
    </div>
  );
}

export function StatsBand() {
  return (
    <section className="relative bg-black pt-24 pb-36 md:pt-32 md:pb-56">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 md:grid-cols-3 md:gap-10 md:px-6">
        {STATS.map(({ value, label }, i) => (
          <Stat key={value} value={value} label={label} i={i} />
        ))}
      </div>
    </section>
  );
}
