"use client";

import { GodRays } from "@paper-design/shaders-react";
import { Pause, Play } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { LINKS } from "@/content/home";
import { PillLink } from "./links";
import { SHADER_BUDGET, WhenVisible } from "./when-visible";

// The client's own photos, fanned on an arc behind the video like the reference site's project cards.
const ARC = ["android", "hologram", "workshop", "hexagon", "chatbot", "team", "cubes", "desk", "tablet", "presenting"];
const ANGLES = [-110, -88, -66, -44, -22, 22, 44, 66, 88, 110];
const RADIUS = 760;
const CARD = { w: 300, h: 210 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

// Where the video sits before it opens: a 16:9 frame under the headline.
function frameAt(w: number, h: number) {
  const mobile = w < 768;
  const width = mobile ? w - 40 : Math.min(w * 0.42, 760);
  const height = (width * 9) / 16;
  const top = mobile ? Math.max(h * 0.56, 430) : Math.max(h * 0.47, 400);
  return { left: (w - width) / 2, top, width, height };
}

export function HeroCinema() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const vw = useMotionValue(1440);
  const vh = useMotionValue(900);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      vw.set(width);
      vh.set(height);
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [vw, vh]);

  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  // 1. The headline lifts away, 2. the video opens to the full screen, 3. BRANDED and GENIUS slide in, 4. the description settles.
  const grow = useTransform(p, [0.05, 0.5], [0, 1], { ease: easeInOut });
  const boxLeft = useTransform(() => lerp(frameAt(vw.get(), vh.get()).left, 0, grow.get()));
  const boxTop = useTransform(() => lerp(frameAt(vw.get(), vh.get()).top, 0, grow.get()));
  const boxWidth = useTransform(() => lerp(frameAt(vw.get(), vh.get()).width, vw.get(), grow.get()));
  const boxHeight = useTransform(() => lerp(frameAt(vw.get(), vh.get()).height, vh.get(), grow.get()));
  const boxRadius = useTransform(grow, [0, 1], [28, 0]);
  const beamOpacity = useTransform(grow, [0, 0.35], [1, 0]);
  const raysOpacity = useTransform(grow, [0, 0.55], [1, 0]);
  const reduce = useReducedMotion();
  const boxShadow = useTransform(
    grow,
    (g) => `0 0 0 1px rgb(255 255 255 / ${0.14 * (1 - g)}), 0 70px 160px -50px rgb(26 111 224 / ${0.6 * (1 - g)})`
  );

  const headOpacity = useTransform(p, [0, 0.13], [1, 0]);
  const headY = useTransform(p, [0, 0.2], [0, -120]);
  const headBlur = useTransform(p, [0, 0.13], ["blur(0px)", "blur(10px)"]);

  const ringRotate = useTransform(p, [0, 0.5], [0, -40]);
  const ringScale = useTransform(p, [0, 0.45], [1, 1.45]);
  const ringOpacity = useTransform(p, [0.06, 0.34], [1, 0]);

  const words = useTransform(p, [0.46, 0.74], [0, 1], { ease: easeOut });
  const brandedX = useTransform(() => lerp(-vw.get() * 0.55, 0, words.get()));
  const geniusX = useTransform(() => lerp(vw.get() * 0.55, 0, words.get()));
  const wordsOpacity = useTransform(p, [0.46, 0.62], [0, 1]);
  const shade = useTransform(p, [0.38, 0.7], [0, 1]);
  const caption = useTransform(p, [0.66, 0.8], [0, 1]);
  const captionY = useTransform(p, [0.66, 0.8], [26, 0]);

  // The film only decodes while the hero is on screen, and stays paused if the visitor paused it.
  const userPaused = useRef(false);
  useEffect(() => {
    const el = section.current;
    const v = video.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) v.pause();
      else if (!userPaused.current) void v.play().catch(() => {});
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleVideo = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      void v.play();
      setPaused(false);
    } else {
      userPaused.current = true;
      v.pause();
      setPaused(true);
    }
  };

  const desktop = size !== null && size.w >= 768;
  const frame = size ? frameAt(size.w, size.h) : null;
  const ringY = frame ? frame.top + frame.height / 2 + RADIUS - 140 : 0;

  return (
    <section ref={section} id="top" className="relative h-[290svh] bg-black md:h-[330svh]">
      {/* "Über uns" lands where the film is full screen with the name and the description. */}
      <div id="ueber-uns" aria-hidden className="pointer-events-none absolute top-[64%] h-px w-full" />
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden">
        {/* Light rays rising behind the frame like a stage light; they fade as the film opens */}
        <motion.div style={{ opacity: raysOpacity }} className="pointer-events-none absolute inset-0">
          <WhenVisible className="absolute inset-0">
            <GodRays
              colorBack="#000000"
              colorBloom="#1a6fe0"
              colors={["#69bff8", "#1a6fe0", "#bfe6ff", "#004ba0"]}
              density={0.3}
              spotty={0.3}
              midSize={0.2}
              midIntensity={0.35}
              intensity={0.5}
              bloom={0.4}
              offsetY={1.05}
              speed={reduce ? 0 : 0.45}
              {...SHADER_BUDGET}
              style={{ width: "100%", height: "100%" }}
            />
          </WhenVisible>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgb(0_0_0/0.75)_0%,rgb(0_0_0/0.35)_45%,transparent_75%)]" />
        </motion.div>

        {/* The arc of photo cards behind the video */}
        {desktop && frame && size && (
          <div className="pointer-events-none absolute top-0 left-0" style={{ transform: `translate(${size.w / 2}px, ${ringY}px)` }}>
            <motion.div style={{ rotate: ringRotate, scale: ringScale, opacity: ringOpacity }}>
              <div className="arc-sway">
                {ARC.map((name, i) => (
                  <div
                    key={name}
                    className="absolute top-0 left-0"
                    style={{ width: CARD.w, height: CARD.h, transform: `translate(-50%, -50%) rotate(${ANGLES[i]}deg) translateY(-${RADIUS}px)` }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 60, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1.1, delay: 0.35 + Math.abs(ANGLES[i]) / 260, ease: [0.16, 1, 0.3, 1] }}
                      className="relative size-full overflow-hidden rounded-[22px] border border-white/10 bg-ink-900 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.95)]"
                    >
                      <Image src={`/images/bg/arc-${name}.webp`} alt="" fill sizes="300px" loading="eager" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/[0.04]" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Headline and the two calls to action */}
        <motion.div style={{ opacity: headOpacity, y: headY, filter: headBlur }} className="absolute inset-x-0 top-0 z-20 px-5 pt-[112px] text-center md:pt-[128px]">
          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[1040px] text-[40px] leading-[1.02] font-medium tracking-[-0.045em] text-white sm:text-[54px] lg:text-[66px]"
          >
            KI-Automatisierung,
            <br />
            <span className="accent-serif">die Ergebnisse schafft.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <PillLink href={LINKS.analysis} target="_blank" rel="noopener">
              Kostenlose KI-Potenzialanalyse
            </PillLink>
            <PillLink href={LINKS.booking} target="_blank" rel="noopener" variant="dark">
              Strategiegespräch buchen
            </PillLink>
          </motion.div>
        </motion.div>

        {/* The client's hero loop: a framed clip that opens to the full screen as you scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: size ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          style={{ left: boxLeft, top: boxTop, width: boxWidth, height: boxHeight, borderRadius: boxRadius, boxShadow }}
          className="absolute z-10 overflow-hidden bg-black"
        >
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            src={LINKS.heroVideo}
            poster={LINKS.heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Imagefilm: Roman Tränkle, Gründer von Branded Genius"
          />
          <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/45" />
          <motion.div style={{ opacity: beamOpacity }} className="absolute inset-0 rounded-[inherit]">
            <BorderBeam size={260} duration={7} colorFrom="#69bff8" colorTo="#004ba0" borderWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* BRANDED and GENIUS close in from both sides over the full-screen video */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[7%] z-30 flex flex-col px-[4%] sm:flex-row sm:items-end sm:justify-between">
          <motion.span
            style={{ x: brandedX, opacity: wordsOpacity }}
            className="block text-[clamp(60px,11.5vw,206px)] leading-[0.82] font-medium tracking-[-0.055em] text-white"
          >
            BRANDED
          </motion.span>
          <motion.span
            style={{ x: geniusX, opacity: wordsOpacity }}
            className="block self-end text-[clamp(60px,11.5vw,206px)] leading-[0.82] font-medium tracking-[-0.055em] text-white"
          >
            GENIUS
          </motion.span>
        </div>

        {/* What Branded Genius does, as on the client's current hero */}
        <motion.div style={{ opacity: caption, y: captionY }} className="absolute top-[15%] right-[4%] z-30 hidden max-w-[440px] md:block">
          <p className="inline-block rounded-lg border border-white/30 px-3.5 py-1.5 text-[14px] text-white/90 backdrop-blur-sm">KI-Agenten &amp; Workflows</p>
          <p className="mt-4 text-[17px] leading-relaxed text-white/90">
            Branded Genius entwickelt KI-Agenten, Automatisierungen und intelligente Workflows für Marketing, Vertrieb, Kundenservice und interne
            Prozesse. Von der Potenzialanalyse bis zur Umsetzung.
          </p>
        </motion.div>
        <motion.button
          type="button"
          onClick={toggleVideo}
          style={{ opacity: caption }}
          aria-label={paused ? "Video abspielen" : "Video pausieren"}
          className="absolute top-[15%] left-[4%] z-30 flex h-10 items-center gap-2 rounded-full border border-white/25 bg-black/30 px-4 text-[13px] text-white/90 backdrop-blur-md transition-colors hover:bg-black/50"
        >
          {paused ? <Play className="size-3.5 fill-current" /> : <Pause className="size-3.5 fill-current" />}
          {paused ? "Video abspielen" : "Video pausieren"}
        </motion.button>
      </div>
    </section>
  );
}
