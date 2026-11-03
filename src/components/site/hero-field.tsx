"use client";

import { useEffect, useRef } from "react";

/*
  The hero background: a field of points stretching to a horizon behind the video, rippling like a data ocean,
  with pulses of light travelling outward from the film. Drawn with Canvas 2D (a few thousand small squares per
  frame, about 1-2 ms), which is far cheaper than a full-screen WebGL shader on integrated graphics. It pauses
  whenever it is off screen or hidden behind the opened film.
*/

const COLS = 150;
const ROWS = 48;
const NEAR = 0.9;
const FAR = 9;
const SPAN = 15;
const CAMERA = 1.15;
const PULSE_EVERY = 3.2;
const BUCKETS = 10;

type Props = { className?: string; active: () => boolean };

export function HeroField({ className, active }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // The cursor lifts the field where it points (screen position, eased).
    let px = -9999;
    let py = -9999;
    let targetPx = -9999;
    let targetPy = -9999;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetPx = e.clientX - r.left;
      targetPy = e.clientY - r.top;
      if (px < -9000) {
        px = targetPx;
        py = targetPy;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const xs: number[][] = Array.from({ length: BUCKETS }, () => []);
    const ys: number[][] = Array.from({ length: BUCKETS }, () => []);
    const ss: number[][] = Array.from({ length: BUCKETS }, () => []);

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !active()) return;
      draw((now - start) / 1000);
    };

    const draw = (t: number) => {
      px += (targetPx - px) * 0.08;
      py += (targetPy - py) * 0.08;
      ctx.clearRect(0, 0, w, h);
      for (let b = 0; b < BUCKETS; b++) {
        xs[b].length = 0;
        ys[b].length = 0;
        ss[b].length = 0;
      }

      // The horizon sits just under the buttons, so the field shows around the film and between the photos.
      const cx = w / 2;
      const horizon = h * 0.4;
      const focal = h * 0.7;
      const lift = focal / FAR;
      const pulseAge = (t % PULSE_EVERY) / PULSE_EVERY;
      const pulseRadius = pulseAge * 10;
      // Where the cursor lands on the field, by projecting the screen point back onto the plane.
      const under = py - horizon + lift;
      const cursorZ = under > 4 ? (CAMERA * focal) / under : 999;
      const cursorX = ((px - cx) * cursorZ) / focal;

      for (let r = 0; r < ROWS; r++) {
        const zf = r / (ROWS - 1);
        const z = NEAR + (FAR - NEAR) * zf * zf;
        const depthFade = 1 - zf;
        const depthGlow = Math.sqrt(depthFade);
        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1) - 0.5) * 2 * SPAN;
          // Rolling waves plus a lift under the cursor.
          let y = Math.sin(x * 0.55 + t * 0.9) * 0.16 + Math.sin(z * 0.8 - t * 1.25) * 0.2 + Math.sin((x + z) * 0.35 + t * 0.6) * 0.12;
          const dxC = x - cursorX;
          const dzC = z - cursorZ;
          y += Math.exp(-(dxC * dxC + dzC * dzC) * 0.6) * 0.45;

          // A ring of light travelling outward from behind the film.
          const dist = Math.sqrt(x * x + (z - 2.6) * (z - 2.6));
          const ring = Math.exp(-((dist - pulseRadius) ** 2) * 1.6) * (1 - pulseAge);

          const sx = cx + (x * focal) / z;
          const sy = horizon + ((CAMERA - y) * focal) / z - lift;
          if (sx < -4 || sx > w + 4 || sy < 0 || sy > h + 4) continue;

          const crest = Math.max(0, y + 0.3) * 0.9;
          const alpha = Math.min(1, depthGlow * (0.3 + crest * 0.62) + ring * 0.95 * depthGlow + 0.07);
          const bucket = Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS));
          const size = 0.9 + 2.3 * depthFade + ring * 2;
          xs[bucket].push(sx);
          ys[bucket].push(sy);
          ss[bucket].push(size);
        }
      }

      for (let b = 0; b < BUCKETS; b++) {
        if (!xs[b].length) continue;
        const a = (b + 0.5) / BUCKETS;
        // Faint points sit in royal blue, bright crests and pulses turn sky blue to white.
        const lift = a * a;
        ctx.fillStyle = `rgba(${Math.round(40 + 190 * lift)}, ${Math.round(110 + 120 * lift)}, ${Math.round(220 + 35 * lift)}, ${a})`;
        const bx = xs[b];
        const by = ys[b];
        const bs = ss[b];
        for (let i = 0; i < bx.length; i++) {
          const s = bs[i];
          ctx.fillRect(bx[i] - s / 2, by[i] - s / 2, s, s);
        }
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    if (reduce) draw(1.2);
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [active]);

  return <canvas ref={canvas} aria-hidden className={className} />;
}
