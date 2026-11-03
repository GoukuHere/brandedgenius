"use client";

import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/content/home";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_SECONDS = 6;

/*
  The four testimonials are the client's YouTube Shorts, on a 3D carousel. The active card's ring counts down to
  the next one; playing a video, hovering the carousel or scrolling away pauses it. YouTube only loads after a click.
*/
export function Voices() {
  const n = TESTIMONIALS.length;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);
  const [spacing, setSpacing] = useState(240);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const panned = useRef(false);
  const inView = useInView(section, { amount: 0.35 });
  const reduce = useReducedMotion();
  const running = inView && !playing && !hover && !reduce;

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSpacing(Math.min(250, entry.contentRect.width * 0.3)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (i: number) => {
    setPlaying(false);
    setActive(((i % n) + n) % n);
  };
  const t = TESTIMONIALS[active];

  return (
    <section ref={section} className="relative overflow-hidden bg-black py-28 md:py-36">
      {/* The active person's photo, blurred into a glow that colours the whole section */}
      <div aria-hidden className="absolute inset-0">
        {TESTIMONIALS.map((v, i) => (
          <div key={v.youtube} className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-out", i === active ? "opacity-100" : "opacity-0")}>
            <Image src={v.src} alt="" fill sizes="96px" className="scale-125 object-cover opacity-55 blur-[80px] saturate-150" />
          </div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_50%,rgb(0_0_0/0.15)_0%,rgb(0_0_0/0.6)_55%,#000_100%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 px-5 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <div className="lg:order-1">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-[40px] leading-[1.02] font-medium tracking-[-0.045em] text-white md:text-[58px]"
          >
            <span className="accent-serif">Echte Stimmen.</span> Echte Ergebnisse.
          </motion.h2>
          <p className="mt-5 max-w-[420px] text-[17px] leading-relaxed text-fog/70">Authentische Einblicke unserer Kunden in die Zusammenarbeit und messbare Projekterfolge.</p>

          <div className="relative mt-12 min-h-[230px] md:min-h-[250px]">
            <AnimatePresence mode="wait">
              <motion.figure key={active} exit={{ opacity: 0, y: -14, filter: "blur(8px)" }} transition={{ duration: 0.3 }}>
                <blockquote className="text-[28px] leading-[1.18] font-medium tracking-[-0.03em] text-white md:text-[38px]">
                  {`„${t.quote}“`.split(" ").map((word, k) => (
                    <motion.span
                      key={k}
                      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.6, delay: 0.05 + k * 0.045, ease: EASE }}
                      className="mr-[0.24em] inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4 overflow-hidden">
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.35, ease: EASE }} className="h-px w-10 origin-left bg-sky" />
                  <motion.span initial={{ y: "120%" }} animate={{ y: "0%" }} transition={{ duration: 0.7, delay: 0.45, ease: EASE }} className="block">
                    <span className="block text-[16px] font-semibold text-white">{t.name}</span>
                    <span className="block text-[14px] text-white/60">{t.designation}</span>
                  </motion.span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Vorherige Kundenstimme"
                className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/[0.1]"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Nächste Kundenstimme"
                className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/[0.1]"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((v, i) => (
                <button
                  key={v.youtube}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Kundenstimme ${i + 1} von ${n}`}
                  className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-10 bg-white" : "w-4 bg-white/30 hover:bg-white/60")}
                />
              ))}
            </div>
          </div>
          <p className="mt-8 text-[13px] text-mute">Beim Abspielen werden Inhalte von YouTube geladen.</p>
        </div>

        {/* The carousel */}
        <motion.div
          ref={stage}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          onPanStart={() => {
            panned.current = true;
          }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -50) go(active + 1);
            else if (info.offset.x > 50) go(active - 1);
          }}
          className="relative h-[480px] touch-pan-y select-none [perspective:1500px] md:h-[620px] lg:order-2"
        >
          <div className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
            {TESTIMONIALS.map((v, i) => {
              const rel = (((i - active) % n) + n) % n;
              const off = rel > n / 2 ? rel - n : rel;
              const dist = Math.abs(off);
              const isActive = off === 0;
              return (
                <motion.div
                  key={v.youtube}
                  initial={false}
                  animate={{
                    x: off * spacing,
                    rotateY: off * -34,
                    z: -dist * 190,
                    scale: 1 - dist * 0.1,
                    opacity: dist >= 2 ? 0 : dist === 1 ? 0.65 : 1,
                    filter: dist === 0 ? "brightness(1)" : "brightness(0.5)",
                  }}
                  transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.9 }}
                  style={{ zIndex: 10 - dist }}
                  className="[grid-area:1/1]"
                >
                  <div className="relative aspect-[9/16] w-[min(300px,58vw)] overflow-hidden rounded-[26px] border border-white/15 bg-ink-900 shadow-[0_60px_120px_-40px_rgb(0_0_0/0.95)] md:w-[320px]">
                    {isActive && playing ? (
                      <iframe
                        className="absolute inset-0 size-full"
                        src={`https://www.youtube-nocookie.com/embed/${v.youtube}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                        title={`Kundenstimme von ${v.name}`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (panned.current) {
                            panned.current = false;
                            return;
                          }
                          if (isActive) setPlaying(true);
                          else go(i);
                        }}
                        aria-label={isActive ? `Video von ${v.name} abspielen` : `Kundenstimme von ${v.name} anzeigen`}
                        className="group absolute inset-0 text-left"
                      >
                        <Image src={v.src} alt={v.name} fill sizes="320px" draggable={false} className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
                        {isActive && (
                          <span className="absolute top-1/2 left-1/2 grid size-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center">
                            <svg aria-hidden className="absolute inset-0 size-full -rotate-90" viewBox="0 0 76 76">
                              <circle cx="38" cy="38" r="36" fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="2" />
                              <motion.circle
                                key={active}
                                cx="38"
                                cy="38"
                                r="36"
                                fill="none"
                                stroke="#69bff8"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: running ? 1 : 0 }}
                                transition={running ? { duration: SLIDE_SECONDS, ease: "linear" } : { duration: 0.4 }}
                                onAnimationComplete={() => {
                                  if (running) go(active + 1);
                                }}
                              />
                            </svg>
                            <span className="grid size-[58px] place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                              <Play className="size-5 translate-x-px fill-white text-white" />
                            </span>
                          </span>
                        )}
                        <span className="absolute inset-x-5 bottom-5">
                          <span className="block text-[16px] font-semibold text-white">{v.name}</span>
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-white/70">{v.designation}</span>
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
