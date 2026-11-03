"use client";

import { Warp } from "@paper-design/shaders-react";
import { BarChart3, FlaskConical, Map, Repeat, Unplug, Users, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { PROBLEMS } from "@/content/home";
import { cn } from "@/lib/utils";
import { SHADER_BUDGET, WhenVisible } from "./when-visible";

/*
  Adapted from 21st.dev "Problem Cards Scroll Section" (uiable/content-16): a pinned stage where the problem
  cards fly in around a central headline as you scroll. Rebuilt dark, in German, with the six problems from
  brandedgenius.de. Each card is dark glass with a light edge; its colour lives only in the glow behind the icon.
*/

type Look = { icon: LucideIcon; color: string; pos: string; from: { x: number; y: number; r: number } };

const LOOKS: Look[] = [
  { icon: FlaskConical, color: "#f43f5e", pos: "lg:top-[5%] lg:left-[3%] xl:left-[6%]", from: { x: -130, y: -70, r: -5 } },
  { icon: Repeat, color: "#f59e0b", pos: "lg:top-[8%] lg:right-[3%] xl:right-[6%]", from: { x: 130, y: -60, r: 4 } },
  { icon: Unplug, color: "#30c2f3", pos: "lg:top-[38%] lg:left-[1%] xl:left-[2%]", from: { x: -170, y: 0, r: 3 } },
  { icon: Map, color: "#4f8ef7", pos: "lg:top-[42%] lg:right-[1%] xl:right-[2%]", from: { x: 170, y: 10, r: -3 } },
  { icon: Users, color: "#10b981", pos: "lg:bottom-[5%] lg:left-[7%] xl:left-[11%]", from: { x: -120, y: 90, r: 4 } },
  { icon: BarChart3, color: "#fb923c", pos: "lg:bottom-[3%] lg:right-[7%] xl:right-[11%]", from: { x: 120, y: 100, r: -4 } },
];

function ProblemCard({ i }: { i: number }) {
  const { icon: Icon, color } = LOOKS[i];
  const problem = PROBLEMS[i];
  return (
    <div
      className="group/card relative rounded-[20px] p-px shadow-[0_40px_80px_-30px_rgb(0_0_0/0.95)]"
      style={{ background: `linear-gradient(145deg, rgb(255 255 255 / 0.28), rgb(255 255 255 / 0.05) 38%, rgb(255 255 255 / 0.03) 62%, ${color}66)` }}
    >
      <div className="relative flex gap-4 overflow-hidden rounded-[19px] bg-[#090c12]/[0.93] p-5">
        <div aria-hidden className="pointer-events-none absolute -top-14 -left-12 size-44 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover/card:opacity-45" style={{ background: color }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <span
          className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05]"
          style={{ color, boxShadow: `0 0 28px -8px ${color}, inset 0 1px 0 rgb(255 255 255 / 0.12)` }}
        >
          <Icon className="size-[18px]" strokeWidth={1.8} />
        </span>
        <div className="relative">
          <h3 className="text-[16px] leading-snug font-semibold text-white">{problem.title}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-white/55">{problem.text}</p>
        </div>
      </div>
    </div>
  );
}

function FlyingCard({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const { pos, from } = LOOKS[i];
  const start = i * 0.075;
  const end = start + 0.3;
  const x = useTransform(progress, [start, end], [from.x, 0]);
  const y = useTransform(progress, [start, end], [from.y, 0]);
  const opacity = useTransform(progress, [start, start + 0.22], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.86, 1]);
  const filter = useTransform(progress, [start, start + 0.22], ["blur(12px)", "blur(0px)"]);

  return (
    <div className={cn("absolute z-20 w-[300px] xl:w-[340px]", pos)}>
      <motion.div style={{ x, y, opacity, scale, rotate: from.r, filter }} whileHover={{ rotate: 0, scale: 1.04 }} transition={{ duration: 0.3 }}>
        <ProblemCard i={i} />
      </motion.div>
    </div>
  );
}

function Headline({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-[640px] text-center", className)}>
      <h2 className="text-[34px] leading-[1.05] font-medium tracking-[-0.04em] text-white md:text-[46px] xl:text-[54px]">
        Viele Unternehmen testen KI,
        <br />
        <span className="accent-serif inline-block [text-wrap:balance]">setzen sie aber nicht produktiv um.</span>
      </h2>
      <p className="mx-auto mt-6 max-w-[460px] text-[17px] leading-relaxed text-fog/70">
        Prozesse bleiben manuell, Tools arbeiten isoliert, und es fehlt eine klare Roadmap.
      </p>
    </div>
  );
}

// A slow, dark liquid with faint red and blue currents, echoing the problem colours.
function Currents() {
  const reduce = useReducedMotion();
  return (
    <WhenVisible className="absolute inset-0 opacity-90">
      <Warp
        colors={["#030407", "#24060f", "#03122b", "#05070c"]}
        proportion={0.42}
        softness={1}
        distortion={0.22}
        swirl={0.7}
        swirlIterations={4}
        shapeScale={0.12}
        speed={reduce ? 0 : 0.35}
        {...SHADER_BUDGET}
        maxPixelCount={960 * 540}
        style={{ width: "100%", height: "100%" }}
      />
    </WhenVisible>
  );
}

export function ProblemArena() {
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: runway, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 24, restDelta: 0.001 });
  const headScale = useTransform(progress, [0, 0.5, 1], [1.06, 1, 0.96]);
  const headOpacity = useTransform(progress, [0, 0.15, 0.9, 1], [0.35, 1, 1, 0.9]);

  return (
    <section className="relative bg-black">
      {/* Desktop: a pinned runway, the cards arrive as you scroll */}
      <div ref={runway} className="relative hidden h-[230svh] lg:block">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden px-6">
          <Currents />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(0_0_0/0.35)_60%,#000_100%)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
          <div className="relative mx-auto h-[min(86svh,820px)] w-full max-w-[1480px]">
            <motion.div style={{ scale: headScale, opacity: headOpacity }} className="absolute inset-0 z-10 flex items-center justify-center">
              <Headline />
            </motion.div>
            {LOOKS.map((_, i) => (
              <FlyingCard key={i} i={i} progress={progress} />
            ))}
          </div>
        </div>
      </div>

      {/* Phones and tablets: the same cards as a list that fades in */}
      <div className="relative overflow-hidden px-5 py-24 lg:hidden">
        <Currents />
        <div aria-hidden className="absolute inset-0 bg-black/50" />
        <div className="relative">
          <Headline />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {LOOKS.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              >
                <ProblemCard i={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
