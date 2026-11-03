"use client";

/* eslint-disable @next/next/no-img-element */

import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";

// Magic UI's scroll-based velocity rows: the service names run faster the faster you scroll, and flip with the direction.
const WORDS = ["KI-Agenten", "KI-Chatbots", "KI-Callbots", "Workflows", "Automatisierung", "KI-Workshops"];

export function VelocityBand() {
  return (
    <section
      aria-label="Leistungen im Überblick"
      className="relative overflow-hidden bg-black py-16 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] md:py-28"
    >
      <ScrollVelocityContainer className="space-y-1 md:space-y-3">
        <ScrollVelocityRow baseVelocity={2.4} direction={1}>
          {WORDS.map((w) => (
            <span key={w} className="mx-5 inline-flex items-center gap-10 text-[64px] leading-none font-medium tracking-[-0.055em] text-white md:mx-8 md:gap-16 md:text-[140px]">
              {w}
              <img src="/brand/mark.svg" alt="" className="h-[0.3em] opacity-80" />
            </span>
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={2.4} direction={-1}>
          {WORDS.map((w) => (
            <span key={w} className="mx-5 inline-flex items-center gap-10 text-[64px] leading-none md:mx-8 md:gap-16 md:text-[140px]">
              <span className="accent-serif">{w}</span>
              <span className="size-[0.16em] rounded-full bg-sky/70" />
            </span>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  );
}
