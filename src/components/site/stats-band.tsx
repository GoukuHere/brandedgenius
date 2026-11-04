"use client";

import { NeuroNoise } from "@paper-design/shaders-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { NoBreak, RollingNumber } from "./rolling-number";
import { SHADER_BUDGET, WhenVisible } from "./when-visible";

const EASE = [0.16, 1, 0.3, 1] as const;

/*
  Three figures from the client's own site, each with a small graphic that shows what it means. A signal runs
  along the top rules from one figure to the next every 6 seconds, and each graphic answers as it passes (CSS in
  globals.css under .stats-band; each column sets --sig, its moment in the cycle). The loops only run while the
  band is on screen (data-live) and the entrances play once (data-seen).
*/

// Ten years stacking up and an open eleventh bar: ten-plus years of experience.
function YearsGraphic() {
  return (
    <div className="flex h-full items-end justify-between">
      {Array.from({ length: 11 }, (_, j) => (
        <span
          key={j}
          className={cn(
            "year-bar relative w-[7%] max-w-[20px] rounded-t-[4px]",
            j === 10 ? "border border-b-0 border-dashed border-white/50" : "bg-white/25"
          )}
          style={{ height: j === 10 ? "100%" : `${22 + j * 7.6}%`, "--j": j } as CSSProperties}
        />
      ))}
    </div>
  );
}

// A call being answered by the AI: a voice line that keeps talking. Heights are fixed so the server and the
// browser render the same bars.
const VOICE = [3, 5, 8, 10, 9, 6, 4, 7, 9, 10, 8, 5, 3, 2, 4, 7, 10, 9, 7, 5, 8, 10, 9, 6, 4, 3, 5, 8, 9, 7, 4, 2, 3, 6, 9, 10, 8, 6, 4, 3, 5, 7, 9, 8, 6, 4, 3, 2];

function VoiceGraphic() {
  return (
    <div className="flex h-full items-center justify-between">
      {VOICE.map((v, j) => (
        <span
          key={j}
          className="wave-bar relative h-full w-[3px] rounded-full bg-white/65"
          style={
            {
              "--j": j,
              "--hi": (v / 10).toFixed(2),
              "--lo": (0.1 + ((j * 7) % 5) * 0.03).toFixed(2),
              "--dur": `${(0.5 + ((j * 3) % 7) * 0.08).toFixed(2)}s`,
              "--del": `${(-((j * 11) % 13) * 0.07).toFixed(2)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

// Manual effort falling from where it was (the dashed line) to 38% of it; the bracket on the right is the 62% saved.
const EFFORT = "M0 12 C 125 12, 190 64, 380 64";

function EffortGraphic() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className="relative h-full">
      <svg viewBox="0 0 400 100" className="block h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#69bff8" stopOpacity="0.45" />
            <stop offset="1" stopColor="#69bff8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="effort-before" d="M0 12 H400" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="3 6" />
        <path className="effort-area" d={`${EFFORT} L380 100 L0 100 Z`} fill={`url(#${id}-area)`} />
        <path className="effort-line" d={EFFORT} pathLength={1} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <path className="effort-gap" d="M394 12 V64 M388 12 H400 M388 64 H400" pathLength={1} fill="none" stroke="#69bff8" strokeWidth="1.6" />
        <path className="effort-glint" d={EFFORT} pathLength={1} fill="none" stroke="#e6f6ff" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
      <span className="effort-ping absolute top-[64%] left-[95%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
      <span className="effort-dot absolute top-[64%] left-[95%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgb(191_230_255/0.9)]" />
    </div>
  );
}

const STATS = [
  { value: "10+", label: "Jahre Erfahrung im digitalen Marketing", Graphic: YearsGraphic },
  { value: "+74%", label: "Schnellere Anrufannahme durch KI-Telefonie in 90 Tagen", Graphic: VoiceGraphic },
  { value: "-62%", label: "Weniger manueller Aufwand im Marketing", Graphic: EffortGraphic },
];

export function StatsBand() {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const on = useInView(section, { once: true, amount: 0.45 });
  const live = useInView(section);

  return (
    <section
      ref={section}
      data-seen={on ? "true" : undefined}
      data-live={live ? "true" : undefined}
      className="stats-band relative overflow-hidden bg-[#002a66] py-24 md:py-32"
    >
      <WhenVisible className="absolute inset-0 opacity-90" order={1}>
        <NeuroNoise
          colorBack="#00225a"
          colorMid="#1a6fe0"
          colorFront="#bfe6ff"
          brightness={0.05}
          contrast={0.32}
          speed={reduce ? 0 : 0.5}
          {...SHADER_BUDGET}
          scale={1.4}
          style={{ width: "100%", height: "100%" }}
        />
      </WhenVisible>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#001a45]/70 via-transparent to-[#001a45]/80" />
      <div className="relative mx-auto grid max-w-[1320px] gap-16 px-5 md:grid-cols-3 md:gap-12 md:px-6">
        {STATS.map(({ value, label, Graphic }, i) => (
          <div key={value} className="relative pt-10" style={{ "--sig": `${1.2 + i * 1.14}s` } as CSSProperties}>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: on ? 1 : 0 }}
              transition={{ duration: 1.2, delay: i * 0.22, ease: EASE }}
              className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-white/70 via-white/30 to-white/5"
            />
            <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-2 h-[17px] overflow-hidden">
              <span className="signal" />
            </span>
            <div aria-hidden className="aspect-[4/1] w-full">
              <Graphic />
            </div>
            <p className="mt-8 text-[56px] leading-[0.9] font-medium tracking-[-0.05em] text-white md:text-[64px] xl:text-[76px]">
              <RollingNumber value={value} play={on} delay={0.15 + i * 0.22} className="flex" />
            </p>
            <span className="mt-4 block overflow-hidden">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: on ? "0%" : "105%" }}
                transition={{ duration: 0.9, delay: 0.9 + i * 0.22, ease: EASE }}
                className="block max-w-[300px] text-[16px] leading-snug text-white/80 md:text-[17px]"
              >
                <NoBreak text={label} />
              </motion.span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
