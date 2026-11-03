import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Jost } from "next/font/google";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

// next/font downloads every family at build time and serves it from this site, so no visitor request goes to Google.
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ variable: "--font-instrument", weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "KI-Automatisierung, die Ergebnisse schafft | Branded Genius",
  description:
    "Branded Genius entwickelt KI-Agenten, Automatisierungen und intelligente Workflows für Marketing, Vertrieb, Kundenservice und interne Prozesse. Von der Potenzialanalyse bis zur Umsetzung.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`dark ${jost.variable} ${serif.variable} ${geistMono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[60]" />
      </body>
    </html>
  );
}
