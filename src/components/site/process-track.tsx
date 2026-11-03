"use client";

import { FlaskConical, GraduationCap, ListFilter, Map, ScanSearch, TrendingUp, Workflow, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { memo, useEffect, useId, useRef, useState } from "react";
import { PROCESS } from "@/content/home";
import { cn } from "@/lib/utils";
import { useSectionProgress } from "./use-section-progress";

const ICONS: LucideIcon[] = [ScanSearch, ListFilter, Map, FlaskConical, Workflow, GraduationCap, TrendingUp];
const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

type State = "on" | "passed" | "next";

function Heading() {
  return (
    <>
      <h2 className="text-[38px] leading-[1.04] font-medium tracking-[-0.045em] text-white md:text-[46px]">
        Von der <span className="whitespace-nowrap">KI-Potenzialanalyse</span> <span className="accent-serif">bis zur strukturierten Umsetzung.</span>
      </h2>
      <p className="mt-6 max-w-[420px] text-[17px] leading-relaxed text-fog/70">
        Ein klarer Prozess mit transparenten Meilensteinen, damit KI produktiv in Ihrem Unternehmen ankommt.
      </p>
    </>
  );
}

// A blueprint grid laid back in perspective, drifting toward the viewer, under a soft blue glow.
function Blueprint() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-[-40%] bottom-[-8%] h-[80%] [perspective:640px]">
        <div className="absolute inset-0 origin-bottom overflow-hidden [mask-image:linear-gradient(to_top,black_5%,transparent_80%)] [transform:rotateX(66deg)]">
          <div className="blueprint-grid" />
        </div>
      </div>
      <div className="absolute -top-56 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgb(26_111_224/0.32),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(1_5_15/0.7)_100%)]" />
    </div>
  );
}

// Memoised: when the active step changes, only the two cards whose state changed re-render.
const StepCard = memo(function StepCard({ i, state, className }: { i: number; state: State; className?: string }) {
  const Icon = ICONS[i];
  const step = PROCESS[i];
  const on = state === "on";
  const gradientId = `step-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-[28px] border p-8 transition-[border-color,background-color,box-shadow,transform] duration-700 ease-out md:p-9",
        on
          ? "-translate-y-2 border-sky/45 bg-[#0d1c3a]/[0.94] shadow-[0_0_90px_-24px_rgb(48_194_243/0.6),inset_0_1px_0_rgb(255_255_255/0.2)]"
          : "border-white/10 bg-[#07122a]/[0.88] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
        className
      )}
    >
      {/* A scan of light passes down the active card */}
      {on && (
        <motion.span
          aria-hidden
          initial={{ y: "-100%" }}
          animate={{ y: "260%" }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-sky/[0.08] to-transparent"
        />
      )}
      <div className="relative flex items-start justify-between">
        {/* SVG text: an outline that fills with the brand gradient. CSS gradient text loses its clip inside the glass cards. */}
        <svg aria-hidden viewBox="0 0 150 96" className="h-[84px] w-auto overflow-visible font-sans md:h-[94px]">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d6efff" />
              <stop offset="50%" stopColor="#30c2f3" />
              <stop offset="100%" stopColor="#1a6fe0" />
            </linearGradient>
          </defs>
          <text x="-4" y="88" fontSize="112" fontWeight={500} letterSpacing="-6" fill="none" stroke="rgb(255 255 255 / 0.28)" strokeWidth="1.5">
            {pad(i + 1)}
          </text>
          <text
            x="-4"
            y="88"
            fontSize="112"
            fontWeight={500}
            letterSpacing="-6"
            fill={`url(#${gradientId})`}
            className="transition-opacity duration-700"
            opacity={on ? 1 : state === "passed" ? 0.35 : 0}
          >
            {pad(i + 1)}
          </text>
        </svg>
        <span
          className={cn(
            "grid size-12 place-items-center rounded-2xl border transition-[background-color,color,border-color,box-shadow] duration-500",
            on ? "border-sky/50 bg-sky text-[#04101f] shadow-[0_0_30px_-6px_rgb(105_191_248/0.9)]" : "border-white/10 bg-white/[0.05] text-sky"
          )}
        >
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
      </div>
      <div className="relative">
        <h3 className={cn("text-[25px] leading-tight font-medium tracking-[-0.025em] transition-colors duration-500", on ? "text-white" : "text-white/75")}>{step.title}</h3>
        <p className={cn("mt-3 text-[15.5px] leading-relaxed transition-colors duration-500", on ? "text-white/80" : "text-white/45")}>{step.text}</p>
      </div>
    </div>
  );
});

function MobileStep({ i }: { i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { amount: 0.6 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: EASE }}>
      <StepCard i={i} state={on ? "on" : "next"} className="min-h-[320px]" />
    </motion.div>
  );
}

export function ProcessTrack() {
  const runway = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const centers = useRef<number[]>([]);
  const focus = useRef(0);
  const [nodes, setNodes] = useState<number[]>([]);
  const [runwayHeight, setRunwayHeight] = useState<number>();
  const [active, setActive] = useState(0);

  // The runway is as tall as the track overflows its window, so scrolling down moves the steps sideways one to one.
  useEffect(() => {
    const el = track.current;
    const w = win.current;
    if (!el || !w) return;
    const measure = () => {
      const d = Math.max(0, el.offsetWidth - w.clientWidth);
      distance.set(d);
      setRunwayHeight(d + window.innerHeight);
      focus.current = w.clientWidth * 0.42;
      centers.current = Array.from(el.querySelectorAll<HTMLElement>("[data-step]")).map((c) => c.offsetLeft + c.offsetWidth / 2);
      setNodes(centers.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(w);
    return () => ro.disconnect();
  }, [distance]);

  const scrollYProgress = useSectionProgress(runway, ["start start", "end end"]);
  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  // The light on the rail sits under the reading position; the step nearest to it is the active one.
  const head = useTransform(() => {
    const c = centers.current;
    if (!c.length) return 0;
    return Math.min(c[c.length - 1], Math.max(c[0], focus.current - x.get()));
  });
  const fill = useTransform(() => {
    const c = centers.current;
    return c.length ? head.get() - c[0] : 0;
  });
  useMotionValueEvent(head, "change", (h) => {
    const c = centers.current;
    let best = 0;
    c.forEach((v, i) => {
      if (Math.abs(v - h) < Math.abs(c[best] - h)) best = i;
    });
    setActive(best);
  });

  return (
    <section id="ablauf" className="relative z-10 -mt-10 scroll-mt-0 overflow-clip rounded-[44px] bg-[#030a1c]">
      {/* Desktop: the heading stays put while the steps slide past on a lit rail */}
      <div ref={runway} className="relative hidden lg:block" style={{ height: runwayHeight ?? 2600 }}>
        <div className="sticky top-0 h-svh overflow-hidden">
          <Blueprint />
          <div className="relative mx-auto flex h-full max-w-[1680px] items-center">
            <div className="relative z-20 w-[min(40vw,620px)] shrink-0 pr-12 pl-[max(4vw,24px)]">
              <Heading />
              <div className="mt-12 max-w-[380px]">
                <div className="flex items-baseline gap-2 text-white">
                  <span className="text-[14px] text-mute">Schritt</span>
                  <span className="relative inline-block h-[1.1em] overflow-hidden text-[30px] leading-[1.1] font-medium tracking-[-0.03em]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={active}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="block"
                      >
                        {pad(active + 1)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-[16px] text-white/40">/ {pad(PROCESS.length)}</span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {PROCESS.map((_, i) => (
                    <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-sky shadow-[0_0_10px_rgb(105_191_248/0.8)]" : "bg-white/12")} />
                  ))}
                </div>
                <div className="relative mt-4 h-[28px] overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={active}
                      initial={{ y: 24, opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -24, opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="text-[19px] font-medium text-sky"
                    >
                      {PROCESS[active].title}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div ref={win} className="relative h-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_94%,transparent)]">
              <motion.div ref={track} style={{ x }} className="absolute inset-y-0 left-0 flex w-max items-center gap-6 pr-[34vw] pl-20 will-change-transform">
                {/* The rail with a node above every step and a light that runs along it */}
                <div aria-hidden className="absolute inset-x-0 top-[calc(50%-268px)] h-px">
                  <div className="absolute top-0 h-px bg-white/12" style={{ left: nodes[0] ?? 0, width: (nodes[nodes.length - 1] ?? 0) - (nodes[0] ?? 0) }} />
                  <motion.div className="absolute top-0 h-px bg-gradient-to-r from-[#1a6fe0] to-[#69bff8] shadow-[0_0_12px_rgb(105_191_248/0.9)]" style={{ left: nodes[0] ?? 0, width: fill }} />
                  {nodes.map((c, i) => (
                    <span
                      key={i}
                      className={cn(
                        "absolute top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[background-color,border-color,box-shadow] duration-500",
                        i <= active ? "border-sky bg-sky shadow-[0_0_14px_rgb(105_191_248/0.9)]" : "border-white/30 bg-[#030a1c]"
                      )}
                      style={{ left: c }}
                    />
                  ))}
                  <motion.span className="absolute top-0 -translate-x-1/2 -translate-y-1/2" style={{ left: head }}>
                    <span className="block size-4 rounded-full bg-white shadow-[0_0_24px_6px_rgb(105_191_248/0.85)]" />
                  </motion.span>
                </div>
                {PROCESS.map((_, i) => (
                  <div key={i} data-step className={cn("shrink-0", i % 2 === 1 && "translate-y-10")}>
                    <StepCard i={i} state={i === active ? "on" : i < active ? "passed" : "next"} className="h-[460px] w-[370px]" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets: the steps as a list, each lighting up as it reaches the middle */}
      <div className="relative px-5 py-24 lg:hidden">
        <Blueprint />
        <div className="relative">
          <Heading />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {PROCESS.map((_, i) => (
              <MobileStep key={i} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
