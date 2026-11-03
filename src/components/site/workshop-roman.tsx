"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { LINKS, WORKSHOP } from "@/content/home";
import { cn } from "@/lib/utils";
import { PillLink } from "./links";

const EASE = [0.16, 1, 0.3, 1] as const;

// One photo per workshop format, in the order of WORKSHOP.formats.
const MEDIA = [
  { src: "/images/bg/roman-workshop.webp", alt: "Roman Tränkle leitet einen KI- und Automatisierungs-Workshop vor Ort" },
  { src: "/images/bg/roman-desk.webp", alt: "Roman Tränkle am Schreibtisch bei Branded Genius" },
  { src: "/images/bg/roman-presenting.webp", alt: "Roman Tränkle präsentiert vor Führungskräften" },
  { src: "/images/bg/team-group.webp", alt: "Das Team von Branded Genius" },
];

// The pinned frame: the active format's photo wipes up over the last one, settles from a zoom, and a light passes over it.
function Frame({ active }: { active: number }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 140, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 140, damping: 18 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 9);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="[perspective:1400px]" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative h-[min(74svh,760px)] w-full overflow-hidden rounded-[30px] will-change-transform border border-white/12 bg-ink-900 shadow-[0_60px_140px_-50px_rgb(26_111_224/0.55)]"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", zIndex: 2 }}
            exit={{ zIndex: 1, transition: { duration: 1 } }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute inset-0"
          >
            <motion.div initial={{ scale: 1.22 }} animate={{ scale: 1.02 }} transition={{ duration: 1.6, ease: EASE }} className="absolute inset-0">
              <Image src={MEDIA[active].src} alt={MEDIA[active].alt} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
            </motion.div>
            <motion.span
              aria-hidden
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
              className="pointer-events-none absolute inset-y-0 w-2/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
          </motion.div>
        </AnimatePresence>

        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        {/* Counter and the active format's name */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-[13px] text-white backdrop-blur-md">
          <span className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={active} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.5, ease: EASE }} className="block">
                {String(active + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-white/50">/ {String(MEDIA.length).padStart(2, "0")}</span>
        </div>
        <div className="absolute inset-x-6 bottom-6 z-20 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={active}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-[30px] leading-tight font-medium tracking-[-0.03em] text-white"
            >
              {WORKSHOP.formats[active].title}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export function WorkshopRoman() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  // A format becomes active when it crosses the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="ki-workshop" className="relative -mt-10 scroll-mt-24 overflow-clip bg-black pt-40 pb-28 md:pb-40">
      {/* Stage light: soft beams swaying down from the top left (CSS gradients moved on the GPU, no shader to compile) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-56 -left-56 size-[760px] rounded-full bg-[radial-gradient(circle,rgb(105_191_248/0.22),rgb(26_111_224/0.08)_40%,transparent_68%)]" />
        <span className="spot-beam" style={{ "--r": "26deg", "--w": "30vw", "--dur": "12s", "--a": "0.2" } as CSSProperties} />
        <span className="spot-beam" style={{ "--r": "40deg", "--w": "18vw", "--dur": "15s", "--a": "0.16" } as CSSProperties} />
        <span className="spot-beam" style={{ "--r": "14deg", "--w": "14vw", "--dur": "18s", "--a": "0.13" } as CSSProperties} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black" />

      <div className="relative mx-auto grid max-w-[1320px] gap-16 px-5 md:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-[38px] leading-[1.03] font-medium tracking-[-0.045em] text-white md:text-[58px]"
          >
            Buchen Sie Roman Tränkle <span className="accent-serif">als KI-Trainer</span> für Ihr Unternehmen.
          </motion.h2>
          <p className="text-electric mt-7 text-[22px] font-medium tracking-[-0.01em]">{WORKSHOP.tagline}</p>
          <p className="mt-3 max-w-[520px] text-[17px] leading-relaxed text-fog/70">{WORKSHOP.text}</p>

          <ul className="mt-14">
            {WORKSHOP.formats.map((f, i) => {
              const on = i === active;
              return (
                <li
                  key={f.title}
                  data-index={i}
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  className="relative border-t border-white/10 py-9 last:border-b lg:py-14"
                >
                  <span
                    aria-hidden
                    className={cn("absolute top-[-1px] left-0 h-px bg-gradient-to-r from-sky to-transparent transition-[width] duration-700 ease-out", on ? "w-full" : "w-0")}
                  />
                  <div className="lg:hidden">
                    <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10">
                      <Image src={MEDIA[i].src} alt={MEDIA[i].alt} fill sizes="90vw" className="object-cover" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-5">
                    <span className={cn("text-[14px] tabular-nums transition-colors duration-500", on ? "text-sky" : "text-white/30")}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3
                        className={cn(
                          "text-[26px] leading-tight font-medium tracking-[-0.03em] transition-[color,transform] duration-500 ease-out md:text-[32px]",
                          on ? "translate-x-1 text-white" : "text-white/35"
                        )}
                      >
                        {f.title}
                      </h3>
                      <p className={cn("mt-2 max-w-[440px] text-[16px] leading-relaxed transition-colors duration-500", on ? "text-fog/80" : "text-white/30")}>{f.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 flex flex-wrap gap-2">
            {WORKSHOP.topics.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-fog/80"
              >
                {t}
              </motion.span>
            ))}
          </div>

          <blockquote className="mt-12 border-l-2 border-sky/50 pl-6 text-[20px] leading-snug text-white/90">
            „{WORKSHOP.quote}“
            <span className="mt-3 block text-[14px] text-mute">Roman Tränkle, Gründer und KI-Trainer</span>
          </blockquote>

          <PillLink href={LINKS.booking} target="_blank" rel="noopener" className="mt-10">
            Workshop-Termin vereinbaren
          </PillLink>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-[13svh]">
            <Frame active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
