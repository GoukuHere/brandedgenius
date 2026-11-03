"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { Check } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { TextEffect } from "@/components/ui/text-effect";
import { LINKS } from "@/content/home";
import { PillLink } from "./links";
import { SHADER_BUDGET, WhenVisible } from "./when-visible";

const POINTS = ["100 % kostenlos und unverbindlich", "Konkrete Handlungsempfehlungen", "Keine Vorbereitung nötig"];

// The reference's "Let's Talk" band: one large line over moving light, here in the brand blues.
export function CtaBand() {
  const reduce = useReducedMotion();
  const copy = useRef<HTMLDivElement>(null);
  const copyInView = useInView(copy, { once: true, margin: "-80px" });
  return (
    <section id="kontakt" className="relative flex min-h-[680px] scroll-mt-0 items-center overflow-hidden bg-[#020611] md:min-h-[800px]">
      <WhenVisible className="absolute inset-0">
        <MeshGradient
          colors={["#020611", "#004ba0", "#1a6fe0", "#69bff8", "#03163a"]}
          distortion={0.85}
          swirl={0.45}
          speed={reduce ? 0 : 0.28}
          {...SHADER_BUDGET}
          style={{ width: "100%", height: "100%" }}
        />
      </WhenVisible>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(2_6_17/0.35)_55%,rgb(0_0_0/0.85)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto max-w-[1180px] px-5 py-28 text-center md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[44px] leading-[1] font-medium tracking-[-0.05em] text-white md:text-[76px] lg:text-[92px]"
        >
          Bereit, Ihr Unternehmen <span className="accent-serif">mit KI</span> zu automatisieren?
        </motion.h2>
        <div ref={copy}>
          <TextEffect
            per="word"
            preset="fade-in-blur"
            speedReveal={2.2}
            delay={0.25}
            trigger={copyInView}
            className="mx-auto mt-8 max-w-[620px] text-[17px] leading-relaxed text-white/80 md:text-[18px]"
          >
            Erfahren Sie in einer kostenlosen Potenzialanalyse oder einem persönlichen Strategiegespräch, welche Prozesse sich in Ihrem Unternehmen am schnellsten automatisieren lassen.
          </TextEffect>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-11 flex flex-wrap justify-center gap-3"
        >
          <PillLink href={LINKS.analysis} target="_blank" rel="noopener" size="lg">
            Kostenlose KI-Potenzialanalyse
          </PillLink>
          <PillLink href={LINKS.booking} target="_blank" rel="noopener" variant="dark" size="lg">
            Strategiegespräch buchen
          </PillLink>
        </motion.div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[14px] text-white/75">
          {POINTS.map((p) => (
            <span key={p} className="flex items-center gap-2">
              <Check className="size-4 text-sky" />
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
