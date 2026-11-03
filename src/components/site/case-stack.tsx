"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { CLIENTS, LINKS, USE_CASES, type UseCase } from "@/content/home";
import { FlowLines } from "./flow-lines";
import { NoBreak, RollingNumberCss } from "./rolling-number";
import { useSectionProgress } from "./use-section-progress";
import { WhenVisible } from "./when-visible";

const EASE = [0.16, 1, 0.3, 1] as const;

// One photo and one colour per use case, so the stack changes colour panel by panel like the reference's case studies.
const LOOKS = [
  { img: "/images/bg/case-marketing.webp", tint: "#0b4fb3" },
  { img: "/images/bg/case-sales.webp", tint: "#a8520a" },
  { img: "/images/bg/case-chat.webp", tint: "#0e6f8c" },
  { img: "/images/bg/case-backoffice.webp", tint: "#1c2f7a" },
  { img: "/images/bg/case-phone.webp", tint: "#04694c" },
  { img: "/images/bg/case-crm.webp", tint: "#0a5f99" },
];

/* ---------------------------------------------------------------------------------------------- *
 * Client tiles: they flip in one after another, the borders light up around the cursor, and a soft *
 * light passes over the tiles in turn while the grid is idle.                                       *
 * ---------------------------------------------------------------------------------------------- */

function ClientGrid() {
  const grid = useRef<HTMLDivElement>(null);

  const track = (e: PointerEvent<HTMLDivElement>) => {
    grid.current?.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
      tile.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };
  const clear = () => {
    grid.current?.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => {
      tile.style.setProperty("--mx", "-999px");
      tile.style.setProperty("--my", "-999px");
    });
  };

  // Flat entrance (rise, settle, un-blur) driven by the grid, so every tile is guaranteed to finish. 3D flips here
  // put each tile on its own 3D layer, which flickered and left rows half-drawn on integrated graphics.
  const tile = (i: number) => ({
    variants: {
      hidden: { opacity: 0, y: 36, scale: 0.94, filter: "blur(8px)" },
      shown: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.9, delay: i * 0.07, ease: EASE } },
    },
    style: { "--d": `${i * 0.45}s` } as CSSProperties,
  });

  return (
    <motion.div
      ref={grid}
      onPointerMove={track}
      onPointerLeave={clear}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
      className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4"
    >
      {CLIENTS.map((name, i) => (
        <motion.div key={name} data-tile {...tile(i)} className="client-tile group relative h-[110px] rounded-2xl p-px md:h-[150px]">
          <div className="client-tile-inner relative grid h-full place-items-center overflow-hidden rounded-[15px] bg-[#0b0e14] px-4 text-center">
            <span className="relative text-[16px] font-semibold tracking-[-0.02em] text-white/70 transition-[transform,color] duration-500 ease-out group-hover:scale-[1.06] group-hover:text-white md:text-[21px]">
              {name}
            </span>
          </div>
        </motion.div>
      ))}
      <motion.a
        href={LINKS.analysis}
        target="_blank"
        rel="noopener"
        data-tile
        {...tile(CLIENTS.length)}
        className="client-tile group relative h-[110px] rounded-2xl p-px md:h-[150px]"
      >
        <div className="client-tile-inner relative grid h-full place-items-center overflow-hidden rounded-[15px] bg-[#071427] px-4 text-center">
          <BorderBeam size={110} duration={6} colorFrom="#69bff8" colorTo="#004ba0" borderWidth={1.5} />
          <span className="relative flex items-center gap-1.5 text-[16px] font-medium text-sky md:text-[20px]">
            Ihr Unternehmen?
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------------------------- *
 * Use case panels: they stack as you scroll, and each one plays its own entrance when it lands.     *
 * ---------------------------------------------------------------------------------------------- */

// --d sets each element's delay in the CSS entrance (see .case in globals.css).
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Tagline({ text }: { text: string }) {
  return (
    <h3 className="mt-6 max-w-[580px] text-[32px] leading-[1.06] font-medium tracking-[-0.04em] text-white md:text-[50px]">
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, k) => (
        <span key={k} aria-hidden className="mr-[0.24em] inline-block overflow-hidden pb-[0.1em] align-bottom">
          <span className="reveal-word" style={delay(0.18 + k * 0.06)}>
            {word}
          </span>
        </span>
      ))}
    </h3>
  );
}

function CasePanel({ u, i, progress }: { u: UseCase; i: number; progress: MotionValue<number> }) {
  const n = USE_CASES.length;
  const { img, tint } = LOOKS[i];
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.035]);
  const zoom = useTransform(progress, [Math.max(0, (i - 1) / n), (i + 1) / n], [1.18, 1]);
  const panel = useRef<HTMLAnchorElement>(null);

  // Landing plays the entrance by flipping one attribute; no React render and no JS animations.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.on = String(entry.isIntersecting && entry.intersectionRatio >= 0.5);
    }, { threshold: [0, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A pill follows the cursor, like the reference's "View Project", and flips side near the edges so it never clips.
  const [hover, setHover] = useState(false);
  const pill = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 380, damping: 32 });
  const y = useSpring(my, { stiffness: 380, damping: 32 });
  const place = (e: MouseEvent<HTMLAnchorElement>, jump: boolean) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const k = r.width / el.offsetWidth || 1;
    const lx = (e.clientX - r.left) / k;
    const ly = (e.clientY - r.top) / k;
    const w = pill.current?.offsetWidth ?? 240;
    const h = pill.current?.offsetHeight ?? 40;
    const px = lx + 18 + w > el.offsetWidth - 14 ? lx - w - 18 : lx + 18;
    const py = ly + 18 + h > el.offsetHeight - 14 ? ly - h - 18 : ly + 18;
    if (jump) {
      mx.jump(px);
      my.jump(py);
      x.jump(px);
      y.jump(py);
    } else {
      mx.set(px);
      my.set(py);
    }
  };

  return (
    <div className="py-2 md:sticky md:top-0 md:flex md:h-svh md:items-center md:py-0">
      <motion.a
        ref={panel}
        href={LINKS.analysis}
        target="_blank"
        rel="noopener"
        onMouseMove={(e) => place(e, false)}
        onMouseEnter={(e) => {
          place(e, true);
          setHover(true);
        }}
        onMouseLeave={() => setHover(false)}
        style={{ scale, top: i * 26 }}
        className="case relative mx-auto block w-full max-w-[1320px] origin-top rounded-[30px] will-change-transform md:h-[min(660px,80svh)]"
      >
        {/*
          will-change keeps the zoom on the GPU: without it Chrome repainted six large photos every frame (31 fps here,
          60 with it). The photo gets its own rounded clip and the panel has none: a rounded clip around more than one
          GPU layer makes Chrome draw the whole panel offscreen first, for every stacked panel on every frame.
        */}
        <div className="absolute inset-0 overflow-hidden rounded-[30px]">
          <motion.div style={{ scale: zoom }} className="absolute inset-0 will-change-transform">
            <Image src={img} alt="" fill sizes="(min-width: 1320px) 1320px, 100vw" className="object-cover" />
          </motion.div>
        </div>
        <div className="absolute inset-0 rounded-[30px]" style={{ background: `linear-gradient(110deg, ${tint}f5 0%, ${tint}dc 38%, ${tint}a8 66%, ${tint}8c 100%)` }} />
        <div className="absolute inset-0 rounded-[30px] bg-gradient-to-t from-black/60 via-black/10 to-black/15" />

        <div className="relative z-10 grid h-full gap-10 p-6 md:p-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col">
            <span className="pop w-fit origin-left rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-[13px] font-medium text-white" style={delay(0.05)}>
              {u.name}
            </span>
            <Tagline text={u.tagline} />
            <p className="fade-up mt-5 max-w-[470px] text-[16px] leading-relaxed text-white/80 md:text-[17px]" style={delay(0.5)}>
              {u.text}
            </p>
            <blockquote className="relative mt-8 hidden max-w-[460px] pl-5 text-[16px] leading-relaxed text-white/90 md:mt-auto md:block">
              <span aria-hidden className="draw-y absolute inset-y-0 left-0 w-[2px] rounded-full bg-white/45" style={delay(0.7)} />
              <span className="slide-in-left block" style={delay(1.05)}>
                „{u.quote}“<span className="mt-2 block text-[13px] text-white/60">{u.role}</span>
              </span>
            </blockquote>
          </div>
          <div className="flex flex-col justify-end lg:pl-6">
            {u.metrics.map((m, k) => (
              <div key={m.label} className="relative flex items-baseline justify-between gap-6 py-4">
                <span aria-hidden className="draw-x absolute inset-x-0 top-0 h-px bg-white/30" style={delay(0.3 + k * 0.14)} />
                <RollingNumberCss
                  value={`${m.sign}${m.value}%`}
                  delay={0.4 + k * 0.16}
                  className="text-[44px] leading-[1] font-medium tracking-[-0.05em] text-white md:text-[64px]"
                />
                <span className="slide-in max-w-[220px] text-right text-[14px] leading-snug text-white/80" style={delay(0.75 + k * 0.16)}>
                  <NoBreak text={m.label} />
                </span>
              </div>
            ))}
            <div className="mt-4 flex flex-wrap gap-2">
              {u.tools.map((tool, k) => (
                <span key={tool} className="pop rounded-full bg-black/30 px-3 py-1.5 text-[12.5px] text-white/85" style={delay(1.1 + k * 0.07)}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <motion.span
          ref={pill}
          aria-hidden
          style={{ x, y }}
          animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute top-0 left-0 z-20 hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[14px] font-medium whitespace-nowrap text-[#05070b] shadow-xl md:flex"
        >
          Ähnliches Projekt anfragen <ArrowUpRight className="size-4" />
        </motion.span>
      </motion.a>
    </div>
  );
}

export function CaseStack() {
  const stack = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSectionProgress(stack, ["start start", "end end"]);

  return (
    <section id="use-cases" className="relative scroll-mt-24 bg-black pt-28 md:pt-40">
      {/* Flowing lines of light behind the heading and the client grid */}
      <WhenVisible className="pointer-events-none absolute inset-x-0 top-0 h-[1150px] text-[#5aaef7] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_65%,transparent)]">
        <FlowLines className="absolute inset-0" />
      </WhenVisible>

      <div className="relative mx-auto max-w-[1320px] px-5 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-[860px] text-[40px] leading-[1.02] font-medium tracking-[-0.045em] text-white md:text-[66px]"
        >
          <span className="accent-serif">Praxisbeispiele.</span> Echte Ergebnisse.
        </motion.h2>
        <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-fog/70">
          KI, die im Unternehmen wirkt. So bringen wir Unternehmen mit maßgeschneiderter KI-Automatisierung messbar voran.
        </p>

        <p className="mt-16 text-[14px] text-mute">Ausgewählte Kunden von Branded Genius</p>
        <ClientGrid />
      </div>

      <div ref={stack} className="relative mt-20 px-3 pb-10 md:mt-28 md:px-6 md:pb-24">
        {USE_CASES.map((u, i) => (
          <CasePanel key={u.name} u={u} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
