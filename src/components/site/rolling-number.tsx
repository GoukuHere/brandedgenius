import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Two rounds of 0 to 9, so every digit spins at least once before it lands.
const STRIP = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * A slot counter driven purely by CSS: it rolls when an ancestor with class "case" gets data-on="true" (see
 * globals.css), so landing a use-case panel starts no JavaScript animations at all. Each digit column keeps the
 * width of its final digit, so the landed number has the same spacing as plain text.
 */
export function RollingNumberCss({ value, delay = 0, className }: { value: string; delay?: number; className?: string }) {
  const text = value.replace(/^-/, "−");
  const chars = [...text];
  return (
    <span className={cn("relative inline-flex items-start", className)}>
      <span className="sr-only">{text}</span>
      {chars.map((c, i) =>
        /\d/.test(c) ? (
          <span key={i} aria-hidden className="relative inline-block [overflow-x:visible] [overflow-y:clip]">
            <span className="invisible">{c}</span>
            <span
              className="roll absolute inset-x-0 top-0 flex flex-col items-center"
              style={{ "--to": `${-(10 + Number(c)) * 5}%`, "--d": `${delay + i * 0.09}s` } as CSSProperties}
            >
              {STRIP.map((n, j) => (
                <span key={j} className="block">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden className="fade-up inline-block" style={{ "--d": `${delay + i * 0.07}s` } as CSSProperties}>
            {c}
          </span>
        )
      )}
    </span>
  );
}

/** Keeps hyphenated words such as "KI-Telefonie" or "Follow-ups" on one line. */
export function NoBreak({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className={word.includes("-") ? "whitespace-nowrap" : undefined}>
          {i > 0 ? " " : ""}
          {word}
        </span>
      ))}
    </>
  );
}
