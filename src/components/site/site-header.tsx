"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { LINKS, NAV } from "@/content/home";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setFloating(y > 40));

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-6 md:pt-4">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex w-full items-center justify-between gap-6 rounded-full border px-4 transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-out md:px-5",
          floating || open
            ? "h-[64px] max-w-[1120px] border-white/10 bg-[#07090d]/75 shadow-[0_20px_60px_-25px_rgb(0_0_0/0.9)] backdrop-blur-xl"
            : "h-[72px] max-w-[1320px] border-transparent bg-transparent"
        )}
      >
        <a href="#top" aria-label="Branded Genius, zum Seitenanfang" className="shrink-0 rounded-md pl-1">
          <BrandLogo className="h-[38px] md:h-[40px]" />
        </a>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative block px-4 py-2 text-[15px] text-fog/80 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan to-royal transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={LINKS.analysis}
            target="_blank"
            rel="noopener"
            className="hidden h-10 items-center rounded-full bg-white px-5 text-[14px] font-medium text-ink-950 transition-[background-color,transform] duration-200 hover:bg-sky active:scale-[0.98] sm:inline-flex"
          >
            Potenzialanalyse anfragen
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="relative grid size-10 place-items-center rounded-full border border-white/12 transition-colors duration-200 hover:bg-white/[0.06] lg:hidden"
          >
            <span className={cn("absolute h-px w-[18px] bg-white transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute h-px w-[18px] bg-white transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-3 top-[84px] rounded-3xl border border-white/10 bg-[#07090d]/95 p-6 backdrop-blur-xl lg:hidden"
          >
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setOpen(false)} className="block py-2.5 text-[24px] font-medium text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={LINKS.analysis}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-white text-[15px] font-medium text-ink-950"
            >
              Kostenlose KI-Potenzialanalyse
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
