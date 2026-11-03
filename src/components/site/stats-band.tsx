"use client";

import { NeuroNoise } from "@paper-design/shaders-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { NoBreak, RollingNumber } from "./rolling-number";
import { SHADER_BUDGET, WhenVisible } from "./when-visible";

const EASE = [0.16, 1, 0.3, 1] as const;

// Three figures from the client's own site. They roll in like a slot counter, then a light sweeps across them.
const STATS = [
  { value: "10+", label: "Jahre Erfahrung im digitalen Marketing" },
  { value: "+74%", label: "Schnellere Anrufannahme durch KI-Telefonie in 90 Tagen" },
  { value: "-62%", label: "Weniger manueller Aufwand im Marketing" },
];

export function StatsBand() {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const on = useInView(section, { once: true, amount: 0.45 });

  return (
    <section ref={section} className="relative overflow-hidden bg-[#002a66] py-28 md:py-40">
      <WhenVisible className="absolute inset-0 opacity-90" order={1}>
        <NeuroNoise
          colorBack="#00225a"
          colorMid="#1a6fe0"
          colorFront="#bfe6ff"
          brightness={0.05}
          contrast={0.32}
          speed={reduce ? 0 : 0.35}
          {...SHADER_BUDGET}
          scale={1.4}
          style={{ width: "100%", height: "100%" }}
        />
      </WhenVisible>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#001a45]/70 via-transparent to-[#001a45]/80" />
      <div className="relative mx-auto grid max-w-[1320px] gap-14 px-5 md:grid-cols-3 md:gap-10 md:px-6">
        {STATS.map((s, i) => (
          <div key={s.value} className="relative pt-8">
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: on ? 1 : 0 }}
              transition={{ duration: 1.2, delay: i * 0.22, ease: EASE }}
              className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-white/70 via-white/30 to-transparent"
            />
            <p className="text-[84px] leading-[0.9] font-medium tracking-[-0.06em] text-white md:text-[112px] xl:text-[132px]">
              <RollingNumber value={s.value} play={on} delay={0.15 + i * 0.22} sheen className="flex" />
            </p>
            <span className="mt-5 block overflow-hidden">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: on ? "0%" : "105%" }}
                transition={{ duration: 0.9, delay: 0.9 + i * 0.22, ease: EASE }}
                className="block max-w-[300px] text-[16px] leading-snug text-white/80 md:text-[17px]"
              >
                <NoBreak text={s.label} />
              </motion.span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
