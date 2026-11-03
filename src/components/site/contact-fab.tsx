"use client";

import { CalendarDays, Mail, Phone, Plus, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CONTACT, LINKS } from "@/content/home";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { label: "Kostenlose KI-Potenzialanalyse", href: LINKS.analysis, icon: Sparkles, external: true },
  { label: "Strategiegespräch buchen", href: LINKS.booking, icon: CalendarDays, external: true },
  { label: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: Mail },
  { label: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}`, icon: Phone },
];

// The reference site's round "+" button, here as a quick way to get in touch from anywhere on the page.
export function ContactFab() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="fixed right-5 bottom-5 z-50 md:right-8 md:bottom-8">
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 bottom-[72px] w-[290px] origin-bottom-right rounded-3xl border border-white/10 bg-[#0b0e14]/95 p-2 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl"
          >
            {ACTIONS.map(({ label, href, icon: Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener" } : {})}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[14.5px] text-white/90 transition-colors hover:bg-white/[0.07] hover:text-white"
                >
                  <Icon className="size-4 text-sky" />
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Kontaktmenü schließen" : "Kontakt aufnehmen"}
        className="grid size-14 place-items-center rounded-full bg-white text-[#05070b] shadow-[0_18px_50px_-12px_rgb(105_191_248/0.55)] transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <Plus className={cn("size-6 transition-transform duration-300", open && "rotate-45")} />
      </button>
    </div>
  );
}
