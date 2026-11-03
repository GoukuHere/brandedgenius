"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { SERVICES } from "@/content/home";
import { cn } from "@/lib/utils";

/*
  Adapted from 21st.dev "Services Stack" (ivarunchaudhary/services-stack): full-height panels stack as you scroll,
  the background photo cross-fades per service, and each card plays a looping line drawing that acts out the
  service step by step while the matching chip lights up. The agents and marketing drawings are the original's
  "AI Enablement" and "Growth" scenes translated to German; the chatbot and callbot drawings are new, in the same style.
*/

type Pt = [number, number];
type Step = [from: number, to: number, capability: string];
type Scene = { loop: number; still: number; steps: Step[]; Draw: (props: { t: number }) => ReactNode };

const W = 1280;
const H = 536;
// Light-on-glass palette: the drawings sit on frosted glass over the backdrop photos.
const INK = "#e6f0ff";
const ACCENT = "#69bff8";
const SURFACE = "#0d1a2e";
const ON_ACCENT = "#04101f";
const MONO = 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace';

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const out = (p: number) => 1 - (1 - p) ** 3;
const back = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const mix = (a: Pt, b: Pt, p: number): Pt => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
const quad = (a: Pt, c: Pt, b: Pt, p: number): Pt => mix(mix(a, c, p), mix(c, b, p), p);
const cubic = (a: Pt, c1: Pt, c2: Pt, b: Pt, p: number): Pt => quad(mix(a, c1, p), mix(c1, c2, p), mix(c2, b, p), p);
const pt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const fade = (t: number, loop: number) => prog(t, 0, 0.25) * (1 - prog(t, loop - 0.7, loop));

/** Stroke-draw a shape from 0 (nothing) to 1 (whole outline). */
const draw = (p: number) => ({ pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - p, visibility: p > 0 ? "visible" : "hidden" }) as const;

const line = { fill: "none", stroke: INK, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const hair = { ...line, strokeWidth: 2, strokeOpacity: 0.3 } as const;
const mono = { fontFamily: MONO, letterSpacing: 0.5 } as const;

function Person({ at, color = INK, s = 1, opacity = 1 }: { at: Pt; color?: string; s?: number; opacity?: number }) {
  return (
    <g transform={`translate(${pt(at)}) scale(${s})`} opacity={opacity}>
      <circle cy={-12} r={8} fill={color} />
      <path d="M-13 16Q0 -4 13 16" {...line} stroke={color} />
    </g>
  );
}

/* ------------------------------------------------------------------------- *
 * KI-Agenten & Workflows: a task and connected data feed an agent; it routes *
 * the work through tools on its own, and only the rare case goes to a person.*
 * ------------------------------------------------------------------------- */

const A_AGENT: Pt = [600, 270];
const A_FEED: Pt = [410, 323];
const A_TOOLS: Pt[] = [[850, 120], [850, 270], [850, 420]];
const A_DONE: Pt = [1110, 330];
const A_TEAM: Pt = [1110, 110];
const A_SEG = 0.5;
const A_PROMPT = "> Leads qualifizieren";
const A_DATA = Array.from({ length: 16 }, (_, i) => ({
  from: [100 + ((i * 97) % 280), 210 + ((i * 53) % 240)] as Pt,
  to: [130 + (i % 4) * 80, 230 + Math.floor(i / 4) * 62] as Pt,
}));
const A_TOKENS = Array.from({ length: 14 }, (_, k) => {
  const rare = k % 5 === 3;
  const b = [1, 0, 2, 1, 2, 0][k % 6];
  const next = b === 2 ? 1 : b + 1;
  const path = rare ? [A_FEED, A_AGENT, A_TOOLS[0], A_TEAM] : k % 4 === 1 ? [A_FEED, A_AGENT, A_TOOLS[b], A_TOOLS[next], A_DONE] : [A_FEED, A_AGENT, A_TOOLS[b], A_DONE];
  const start = 4.8 + k * 0.4;
  return { rare, path, start, end: start + (path.length - 1) * A_SEG };
});

function Agents({ t }: { t: number }) {
  const typed = Math.floor(prog(t, 0.4, 2) * A_PROMPT.length);
  const cursor = t < 2.8 && (t * 2) % 1 < 0.5 ? "_" : "";
  const handled = A_TOKENS.filter((k) => !k.rare && k.end <= t).length;
  const lastDone = Math.max(-1, ...A_TOKENS.filter((k) => !k.rare && k.end <= t).map((k) => k.end));
  const lastUp = Math.max(-1, ...A_TOKENS.filter((k) => k.rare && k.end <= t).map((k) => k.end));
  const doneFlash = prog(t, lastDone, lastDone + 0.5);
  const upFlash = prog(t, lastUp, lastUp + 0.7);
  const edges = inOut(prog(t, 3.6, 4.4));
  const exits = inOut(prog(t, 4.1, 4.8));

  return (
    <g opacity={fade(t, 12)}>
      <rect x={80} y={80} width={356} height={76} rx={12} {...line} {...draw(inOut(prog(t, 0.1, 0.7)))} />
      <text x={102} y={126} fontSize={21} fill={INK} style={mono}>
        {A_PROMPT.slice(0, typed)}
        {cursor}
      </text>

      {A_DATA.map(({ from, to }, i) => {
        const [x, y] = mix(from, to, inOut(prog(t, 1.8 + i * 0.04, 2.8 + i * 0.04)));
        return <circle key={i} cx={x} cy={y} r={6} fill={INK} opacity={0.5 * prog(t, 1.1 + i * 0.03, 1.5 + i * 0.03)} />;
      })}

      <path d={`M436 118L${pt(A_AGENT)}M${pt(A_FEED)}L${pt(A_AGENT)}`} {...hair} {...draw(prog(t, 2.8, 3.5))} />
      {A_TOOLS.map((p, i) => (
        <g key={i}>
          <line x1={A_AGENT[0]} y1={A_AGENT[1]} x2={p[0]} y2={p[1]} {...hair} {...draw(edges)} />
          <line x1={p[0]} y1={p[1]} x2={A_DONE[0]} y2={A_DONE[1]} {...hair} {...draw(exits)} />
        </g>
      ))}
      <line x1={850} y1={120} x2={850} y2={420} {...hair} strokeDasharray="3 9" opacity={exits} />
      <line x1={A_TOOLS[0][0]} y1={A_TOOLS[0][1]} x2={A_TEAM[0] - 36} y2={A_TEAM[1]} {...hair} {...draw(exits)} />

      <circle cx={A_AGENT[0]} cy={A_AGENT[1]} r={38} {...line} fill={SURFACE} {...draw(inOut(prog(t, 2.6, 3.2)))} />
      <circle cx={A_AGENT[0]} cy={A_AGENT[1]} r={54} {...line} strokeWidth={2} strokeDasharray="4 12" opacity={0.5 * prog(t, 3, 3.4)} transform={`rotate(${t * 40} ${pt(A_AGENT)})`} />
      <circle cx={A_AGENT[0]} cy={A_AGENT[1]} r={8 * back(prog(t, 3, 3.3))} fill={INK} />

      {A_TOOLS.map(([x, y], i) => {
        const p = back(prog(t, 3.9 + i * 0.15, 4.3 + i * 0.15));
        const shape = [
          <rect key="s" x={-20} y={-20} width={40} height={40} rx={6} />,
          <rect key="d" x={-17} y={-17} width={34} height={34} rx={4} transform="rotate(45)" />,
          <circle key="c" r={22} />,
        ][i];
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g transform={`scale(${p})`} {...line} fill={SURFACE}>
              {shape}
            </g>
            {/* The top label sits above its node, clear of the line that runs up to the team. */}
            <text x={i === 0 ? -22 : 40} y={i === 0 ? -34 : 7} fontSize={19} fill={INK} fillOpacity={0.6} opacity={prog(t, 4.2, 4.6)} style={mono}>
              {["qualifizieren", "antworten", "buchen"][i]}
            </text>
          </g>
        );
      })}

      <g opacity={prog(t, 4.4, 4.8)}>
        <circle cx={A_DONE[0]} cy={A_DONE[1]} r={26} {...line} />
        <circle cx={A_DONE[0]} cy={A_DONE[1]} r={12} fill={INK} />
        {doneFlash > 0 && doneFlash < 1 && <circle cx={A_DONE[0]} cy={A_DONE[1]} r={26 + 20 * out(doneFlash)} {...line} strokeWidth={2} strokeOpacity={1 - doneFlash} />}
        <text x={A_DONE[0]} y={A_DONE[1] + 62} fontSize={19} textAnchor="middle" fill={INK} fillOpacity={0.55} style={mono}>
          {handled} erledigt
        </text>
        <circle cx={A_TEAM[0]} cy={A_TEAM[1] - 20} r={14} {...line} />
        <path d={`M${A_TEAM[0] - 26} ${A_TEAM[1] + 24}Q${A_TEAM[0]} ${A_TEAM[1] - 14} ${A_TEAM[0] + 26} ${A_TEAM[1] + 24}`} {...line} />
        {upFlash > 0 && upFlash < 1 && <circle cx={A_TEAM[0]} cy={A_TEAM[1]} r={40 + 24 * out(upFlash)} {...line} stroke={ACCENT} strokeWidth={2} strokeOpacity={1 - upFlash} />}
        <text x={A_TEAM[0] + 44} y={A_TEAM[1] + 7} fontSize={19} fill={INK} fillOpacity={0.55} style={mono}>
          Ihr Team
        </text>
      </g>

      {A_TOKENS.map(({ rare, path, start, end }, k) => {
        if (t < start || t > end + 0.15) return null;
        const e = Math.min((t - start) / A_SEG, path.length - 1.0001);
        const i = Math.floor(e);
        const [x, y] = mix(path[i], path[i + 1], inOut(e - i));
        return rare ? (
          <g key={k}>
            <circle cx={x} cy={y} r={12} {...line} stroke={ACCENT} strokeWidth={2} />
            <circle cx={x} cy={y} r={6} fill={ACCENT} />
          </g>
        ) : (
          <circle key={k} cx={x} cy={y} r={7} fill={INK} />
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------------- *
 * KI-Chatbots: a website opens its chat, the question is recognised, the     *
 * answer comes from the company's knowledge, the lead gets qualified, the    *
 * rare case goes to a person, and the clock keeps turning.                   *
 * ------------------------------------------------------------------------- */

const C_INTENTS: [string, number][] = [["Preis", 120], ["Termin", 205], ["Support", 290]];
const C_ROUTE: [Pt, Pt, Pt, Pt] = [[810, 92], [720, 20], [560, 30], [505, 140]];
const C_CHECKS = ["Bedarf", "Budget", "Zeitraum"];

function Chat({ t }: { t: number }) {
  const widget = back(prog(t, 1.1, 1.45));
  const panel = inOut(prog(t, 1.4, 2.1));
  const question = out(prog(t, 2.2, 2.6));
  const picked = prog(t, 3.4, 3.8);
  const reply = prog(t, 5.4, 6.1);
  const handover = inOut(prog(t, 8.3, 9));
  const ping = prog(t, 8.9, 9.6);
  const clock = inOut(prog(t, 10, 10.5));

  return (
    <g opacity={fade(t, 12)}>
      {/* Website-Chat */}
      <rect x={80} y={60} width={460} height={390} rx={14} {...line} {...draw(inOut(prog(t, 0.1, 1)))} />
      <line x1={80} y1={100} x2={540} y2={100} {...hair} {...draw(prog(t, 0.8, 1.1))} />
      {[106, 126, 146].map((x, i) => (
        <circle key={x} cx={x} cy={80} r={5} fill={INK} opacity={0.3 * prog(t, 0.9 + i * 0.08, 1.1 + i * 0.08)} />
      ))}
      <path d="M110 132H250M110 156H210" {...line} strokeWidth={2} strokeOpacity={0.4} {...draw(prog(t, 1, 1.4))} />
      <rect x={110} y={186} width={160} height={110} rx={8} {...hair} {...draw(inOut(prog(t, 1, 1.5)))} />
      <path d="M110 330H260M110 352H230M110 374H245" {...line} strokeWidth={2} strokeOpacity={0.25} {...draw(prog(t, 1.2, 1.6))} />
      <rect x={295} y={128} width={220} height={262} rx={14} {...line} fill={SURFACE} fillOpacity={panel} {...draw(panel)} />
      <circle cx={505} cy={420} r={20 * widget} fill={ACCENT} />
      <path d="M497 416h16M497 424h10" stroke={ON_ACCENT} strokeWidth={2.5} strokeLinecap="round" opacity={widget} />

      {/* Anfrage-Erkennung: the visitor's question is read and sorted */}
      <g opacity={question} transform={`translate(0 ${(1 - question) * 10})`}>
        <rect x={372} y={150} width={128} height={46} rx={16} fill={INK} fillOpacity={0.1} />
        <path d="M388 167H484M388 180H452" {...line} strokeWidth={2} strokeOpacity={0.45} />
      </g>
      {C_INTENTS.map(([label, y], i) => {
        const p = inOut(prog(t, 2.7 + i * 0.15, 3.2 + i * 0.15));
        const on = label === "Termin" ? picked : 0;
        return (
          <g key={label}>
            <path d={`M515 175C565 175 570 ${y} 620 ${y}`} {...hair} {...draw(p)} />
            <rect x={620} y={y - 22} width={140} height={44} rx={22} {...line} strokeWidth={2} fill={ACCENT} fillOpacity={on} {...draw(p)} />
            <text x={690} y={y + 7} textAnchor="middle" fontSize={19} fill={on > 0.5 ? ON_ACCENT : INK} fillOpacity={on > 0.5 ? 1 : 0.6} opacity={prog(t, 3 + i * 0.15, 3.3 + i * 0.15)} style={mono}>
              {label}
            </text>
          </g>
        );
      })}

      {/* Antwort-Workflows: the answer is written from the company's own knowledge */}
      {[0, 1, 2].map((i) => {
        const x = 830 + i * 72;
        return (
          <g key={i}>
            <rect x={x} y={56} width={54} height={70} rx={6} {...line} strokeWidth={2} fill={SURFACE} {...draw(inOut(prog(t, 4.2 + i * 0.15, 4.7 + i * 0.15)))} />
            <path d={`M${x + 11} 76H${x + 43}M${x + 11} 90H${x + 37}M${x + 11} 104H${x + 30}`} {...line} strokeWidth={2} strokeOpacity={0.35} {...draw(prog(t, 4.5 + i * 0.15, 4.9 + i * 0.15))} />
          </g>
        );
      })}
      <text x={1064} y={98} fontSize={19} fill={INK} fillOpacity={0.55} opacity={prog(t, 4.7, 5)} style={mono}>
        Wissen
      </text>
      <path d={`M${pt(C_ROUTE[0])}C${pt(C_ROUTE[1])} ${pt(C_ROUTE[2])} ${pt(C_ROUTE[3])}`} {...hair} strokeOpacity={0.35} {...draw(inOut(prog(t, 4.8, 5.4)))} />
      {t > 5.4 &&
        [0, 1].map((k) => {
          const u = ((t - 5.4) * 0.5 + k / 2) % 1;
          const [x, y] = cubic(C_ROUTE[0], C_ROUTE[1], C_ROUTE[2], C_ROUTE[3], u);
          return <circle key={k} cx={x} cy={y} r={6} fill={ACCENT} opacity={prog(t, 5.4, 5.7) * Math.sin(Math.PI * u)} />;
        })}
      <g opacity={out(reply)} transform={`translate(0 ${(1 - out(reply)) * 10})`}>
        <rect x={310} y={214} width={170} height={72} rx={16} fill={ACCENT} fillOpacity={0.14} />
        <path d="M326 236H452M326 250H462M326 264H410" {...line} stroke={ACCENT} strokeWidth={2} strokeOpacity={0.9} {...draw(prog(t, 5.6, 6.2))} />
      </g>

      {/* Lead-Qualifizierung */}
      {C_CHECKS.map((label, i) => {
        const y = 220 + i * 52;
        const s = 6.3 + i * 0.45;
        return (
          <g key={label}>
            <rect x={880} y={y - 18} width={36} height={36} rx={9} {...line} strokeWidth={2} {...draw(inOut(prog(t, s - 0.2, s + 0.1)))} />
            <path d={`M889 ${y}l6 7l12 -14`} {...line} stroke={ACCENT} strokeWidth={3} {...draw(prog(t, s + 0.15, s + 0.4))} />
            <text x={932} y={y + 7} fontSize={20} fill={INK} fillOpacity={0.7} opacity={prog(t, s, s + 0.25)} style={mono}>
              {label}
            </text>
          </g>
        );
      })}

      {/* Übergabe an Mitarbeiter: only the rare case goes to a person */}
      <path d="M515 360C700 360 900 452 1068 446" {...hair} strokeDasharray="5 9" opacity={handover} />
      {handover > 0 && handover < 1 && (() => {
        const [x, y] = cubic([515, 360], [700, 360], [900, 452], [1068, 446], handover);
        return (
          <g>
            <circle cx={x} cy={y} r={12} {...line} stroke={ACCENT} strokeWidth={2} />
            <circle cx={x} cy={y} r={6} fill={ACCENT} />
          </g>
        );
      })()}
      <Person at={[1100, 446]} s={back(prog(t, 8.1, 8.5))} />
      {ping > 0 && ping < 1 && <circle cx={1100} cy={440} r={30 + 26 * out(ping)} {...line} stroke={ACCENT} strokeWidth={2} strokeOpacity={1 - ping} />}
      <text x={1128} y={452} fontSize={19} fill={INK} fillOpacity={0.55} opacity={prog(t, 8.4, 8.7)} style={mono}>
        Ihr Team
      </text>

      {/* Rund um die Uhr */}
      <circle cx={660} cy={455} r={30} {...line} strokeWidth={2} {...draw(clock)} />
      <line x1={660} y1={455} x2={660 + 18 * Math.sin(t * 3)} y2={455 - 18 * Math.cos(t * 3)} {...line} stroke={ACCENT} opacity={clock} />
      <line x1={660} y1={455} x2={660 + 11 * Math.sin(t * 0.5)} y2={455 - 11 * Math.cos(t * 0.5)} {...line} opacity={clock} />
      <text x={706} y={462} fontSize={21} fill={INK} fillOpacity={0.65} opacity={prog(t, 10.3, 10.6)} style={mono}>
        24/7
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------------- *
 * KI-Callbots: the phone rings, the assistant answers and talks, the caller  *
 * is qualified, a slot gets booked, the call is routed, follow-ups go out.   *
 * ------------------------------------------------------------------------- */

const K_CHECKS = ["Anliegen", "Budget", "Rückruf"];
const K_CONTACTS: Pt[] = [[1130, 340], [1190, 395], [1130, 450]];

function Calls({ t }: { t: number }) {
  const talking = prog(t, 2.1, 2.5) * (1 - prog(t, 11, 11.5));
  const cal = inOut(prog(t, 6.2, 6.9));
  const booked = back(prog(t, 7.4, 7.8));
  const route = inOut(prog(t, 8.5, 9.1));
  const routePing = prog(t, 9, 9.7);

  return (
    <g opacity={fade(t, 12)}>
      {/* Eingehende Anrufe */}
      <rect x={110} y={66} width={170} height={350} rx={28} {...line} {...draw(inOut(prog(t, 0.1, 0.9)))} />
      <line x1={170} y1={88} x2={220} y2={88} {...line} strokeOpacity={0.5} {...draw(prog(t, 0.8, 1))} />
      <circle cx={195} cy={170} r={28} {...hair} {...draw(inOut(prog(t, 0.8, 1.2)))} />
      <path d="M160 222H230M170 240H220" {...line} strokeWidth={2} strokeOpacity={0.4} {...draw(prog(t, 1, 1.3))} />
      <circle cx={195} cy={348} r={22 * back(prog(t, 1.1, 1.4))} fill={ACCENT} />
      <path d="M186 344c3 6 8 11 14 14l4 -4" stroke={ON_ACCENT} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={prog(t, 1.2, 1.4)} />
      {t > 0.9 &&
        t < 2.6 &&
        [0, 1, 2].map((k) => {
          const u = ((t - 0.9) * 0.9 + k / 3) % 1;
          return <circle key={k} cx={195} cy={241} r={120 + 90 * u} {...line} stroke={ACCENT} strokeWidth={2} strokeOpacity={0.5 * (1 - u) * (1 - prog(t, 2.2, 2.6))} />;
        })}

      {/* Sprachassistent: the assistant answers, the waveform talks */}
      <line x1={290} y1={241} x2={350} y2={241} {...hair} {...draw(prog(t, 2, 2.3))} />
      {Array.from({ length: 30 }, (_, i) => {
        const x = 360 + i * 10;
        const h = 6 + 64 * Math.abs(Math.sin(t * 5.2 + i * 0.55)) * Math.abs(Math.sin(t * 1.3 + i * 0.21)) * talking;
        return <line key={i} x1={x} y1={241 - h / 2} x2={x} y2={241 + h / 2} stroke={i % 6 === 0 ? ACCENT : INK} strokeOpacity={0.85 * prog(t, 2.1, 2.4)} strokeWidth={5} strokeLinecap="round" />;
      })}

      {/* Lead-Qualifizierung */}
      {K_CHECKS.map((label, i) => {
        const y = 110 + i * 50;
        const s = 4.4 + i * 0.5;
        return (
          <g key={label}>
            <rect x={720} y={y - 18} width={36} height={36} rx={9} {...line} strokeWidth={2} {...draw(inOut(prog(t, s - 0.2, s + 0.1)))} />
            <path d={`M729 ${y}l6 7l12 -14`} {...line} stroke={ACCENT} strokeWidth={3} {...draw(prog(t, s + 0.15, s + 0.4))} />
            <text x={772} y={y + 7} fontSize={20} fill={INK} fillOpacity={0.7} opacity={prog(t, s, s + 0.25)} style={mono}>
              {label}
            </text>
          </g>
        );
      })}

      {/* Terminvereinbarung: a free slot gets booked */}
      <rect x={720} y={280} width={290} height={186} rx={14} {...line} strokeWidth={2} {...draw(cal)} />
      <line x1={720} y1={318} x2={1010} y2={318} {...hair} {...draw(prog(t, 6.6, 6.9))} />
      {Array.from({ length: 15 }, (_, k) => {
        const col = k % 5;
        const row = Math.floor(k / 5);
        const isBooked = col === 2 && row === 1;
        return (
          <rect
            key={k}
            x={738 + col * 54}
            y={334 + row * 42}
            width={42}
            height={30}
            rx={6}
            {...(isBooked && booked > 0 ? { fill: ACCENT } : hair)}
            opacity={prog(t, 6.6 + k * 0.03, 6.9 + k * 0.03)}
            transform={isBooked && booked > 0 ? `translate(${738 + col * 54 + 21} ${334 + row * 42 + 15}) scale(${booked}) translate(${-(738 + col * 54 + 21)} ${-(334 + row * 42 + 15)})` : undefined}
          />
        );
      })}
      <path d="M856 391l5 5l9 -10" stroke={ON_ACCENT} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={prog(t, 7.7, 7.9)} />

      {/* Weiterleitung: the right person takes over */}
      <line x1={880} y1={160} x2={1080} y2={148} {...hair} strokeDasharray="5 9" opacity={route} />
      <Person at={[1120, 150]} s={back(prog(t, 8.3, 8.7))} />
      {routePing > 0 && routePing < 1 && <circle cx={1120} cy={144} r={30 + 26 * out(routePing)} {...line} stroke={ACCENT} strokeWidth={2} strokeOpacity={1 - routePing} />}
      <text x={1150} y={156} fontSize={19} fill={INK} fillOpacity={0.55} opacity={prog(t, 8.6, 8.9)} style={mono}>
        Team
      </text>

      {/* Follow-ups: calls go back out to the leads */}
      {K_CONTACTS.map((c, i) => {
        const d = inOut(prog(t, 10 + i * 0.2, 10.5 + i * 0.2));
        const from: Pt = [1010, 373];
        return (
          <g key={i}>
            <line x1={from[0]} y1={from[1]} x2={c[0] - 22} y2={c[1] - 4} {...hair} {...draw(d)} />
            {t > 10.5 && (() => {
              const u = ((t - 10.5) * 0.8 + i / 3) % 1;
              const [x, y] = mix(from, [c[0] - 22, c[1] - 4], u);
              return <circle cx={x} cy={y} r={5} fill={ACCENT} opacity={Math.sin(Math.PI * u)} />;
            })()}
            <Person at={c} s={back(prog(t, 10.3 + i * 0.2, 10.6 + i * 0.2))} />
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------------- *
 * KI-Marketing & Vertrieb: find the audience on the market map, position the *
 * offer, put it on channels, personalise the content, fill the funnel, and   *
 * keep the customers coming back.                                            *
 * ------------------------------------------------------------------------- */

const G_YOU: Pt = [310, 150];
const G_BRAND: Pt = [540, 150];
const G_AXES: [label: string, x: number, y: number, anchor: "start" | "middle" | "end"][] = [
  ["Premium", 230, 74, "middle"],
  ["Budget", 230, 402, "middle"],
  ["Einsteiger", 92, 256, "start"],
  ["Profis", 368, 256, "end"],
];
const G_RIVALS: Pt[] = [[130, 130], [175, 160], [150, 195], [200, 120], [120, 290], [170, 310], [140, 345], [205, 335], [185, 280], [260, 285], [300, 325], [340, 290], [280, 350]];
const G_CHANNELS = [110, 230, 350];
const G_ICONS = [
  <>
    <rect x={-40} y={-20} width={80} height={40} rx={20} />
    <circle cx={-18} cy={-2} r={8} />
    <path d="M-12 4l6 6" />
    <path d="M2 0H24" strokeWidth={2} strokeOpacity={0.35} />
  </>,
  <>
    <rect x={-40} y={-28} width={80} height={56} rx={8} />
    <path d="M-8 -14L14 0L-8 14Z" />
  </>,
  <>
    <rect x={-40} y={-26} width={80} height={52} rx={6} />
    <path d="M-40 -26L0 4L40 -26" />
  </>,
];
const G_SPOUT: Pt = [1080, 300];
const G_LOOP = { cx: 1082, cy: 444, rx: 172, ry: 46 };
const gSlot = (k: number): Pt => [950 + k * 44, 440];
const G_WON = [0, 4, 8, 10];
const G_LEADS = Array.from({ length: 12 }, (_, i) => ({
  start: 6.3 + i * 0.18,
  from: [910, G_CHANNELS[i % 3]] as Pt,
  rim: [985 + ((i * 71) % 190), 114] as Pt,
  won: G_WON.indexOf(i),
}));
const G_REFERRERS = [1, 2, 3];

function Marketing({ t }: { t: number }) {
  const axes = inOut(prog(t, 0.1, 0.9));
  const aim = quad([150, 300], [380, 400], G_YOU, inOut(prog(t, 0.5, 1.8)));
  const lock = prog(t, 1.8, 2.2);
  const hop = inOut(prog(t, 2.3, 2.8));
  const leads = G_LEADS.filter((l) => t >= l.start + 0.7).length;

  return (
    <g opacity={fade(t, 13)}>
      <rect x={232} y={92} width={136} height={136} fill={ACCENT} fillOpacity={0.08 * lock} />
      <line x1={90} y1={230} x2={370} y2={230} {...hair} {...draw(axes)} />
      <line x1={230} y1={370} x2={230} y2={90} {...hair} {...draw(axes)} />
      {G_AXES.map(([label, x, y, anchor]) => (
        <text key={label} x={x} y={y} textAnchor={anchor} fontSize={19} fill={INK} fillOpacity={0.45} opacity={prog(t, 0.5, 0.9)} style={mono}>
          {label}
        </text>
      ))}
      {G_RIVALS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={6} fill={INK} opacity={0.28 * prog(t, 0.3 + i * 0.05, 0.6 + i * 0.05)} />
      ))}
      <g transform={`translate(${pt(aim)})`} opacity={prog(t, 0.3, 0.6) * (1 - prog(t, 2.2, 2.5))}>
        <circle r={26 - 8 * prog(t, 1.6, 1.9)} {...line} strokeWidth={2} />
        <path d="M-42 0H-32M32 0H42M0 -42V-32M0 32V42" {...line} strokeWidth={2} />
      </g>
      {lock > 0 && <circle cx={G_YOU[0]} cy={G_YOU[1]} r={9 * back(lock)} fill={INK} />}
      <text x={G_YOU[0] + 18} y={G_YOU[1] - 16} fontSize={19} fill={INK} fillOpacity={0.55} opacity={prog(t, 2, 2.3)} style={mono}>
        Zielgruppe
      </text>

      <line x1={G_YOU[0] + 14} y1={150} x2={490} y2={150} {...hair} strokeDasharray="4 8" opacity={prog(t, 2.3, 2.6)} />
      {hop > 0 && hop < 1 && <circle cx={lerp(G_YOU[0], G_BRAND[0], hop)} cy={150} r={9} fill={INK} />}
      <rect x={490} y={100} width={100} height={100} rx={22} {...line} {...draw(inOut(prog(t, 2.4, 3)))} />
      <circle cx={G_BRAND[0]} cy={G_BRAND[1]} r={24} {...line} strokeWidth={2} {...draw(inOut(prog(t, 2.6, 3)))} transform={`rotate(-90 ${pt(G_BRAND)})`} />
      <path d="M540 126A24 24 0 0 1 564 150" {...line} stroke={ACCENT} strokeWidth={6} {...draw(prog(t, 3, 3.3))} />
      <circle cx={G_BRAND[0]} cy={G_BRAND[1]} r={10 * back(prog(t, 2.8, 3.1))} fill={INK} />
      <line x1={490} y1={232} x2={580} y2={232} {...line} strokeWidth={6} {...draw(prog(t, 3.1, 3.4))} />
      <line x1={490} y1={254} x2={550} y2={254} {...line} strokeWidth={2} strokeOpacity={0.4} {...draw(prog(t, 3.3, 3.5))} />
      {[INK, ACCENT, "none"].map((fill, i) => (
        <circle key={i} cx={502 + i * 38} cy={290} r={12 * back(prog(t, 3.3 + i * 0.1, 3.6 + i * 0.1))} {...(fill === "none" ? hair : { fill })} />
      ))}

      {G_CHANNELS.map((y, i) => (
        <path key={y} d={`M590 150C640 150 640 ${y} 690 ${y}`} {...hair} strokeOpacity={0.35} {...draw(inOut(prog(t, 3.6 + i * 0.15, 4.2 + i * 0.15)))} />
      ))}
      {G_CHANNELS.map((y, i) => (
        <g key={y} transform={`translate(730 ${y}) scale(${back(prog(t, 3.9 + i * 0.15, 4.3 + i * 0.15))})`} {...line} fill={SURFACE}>
          {G_ICONS[i]}
        </g>
      ))}
      {t > 4.3 &&
        G_CHANNELS.flatMap((y, i) =>
          [0, 1].map((k) => {
            const u = ((t - 4.3) * 0.6 + k / 2 + i * 0.2) % 1;
            const [x, py] = cubic([590, 150], [640, 150], [640, y], [690, y], u);
            return <circle key={`${i}${k}`} cx={x} cy={py} r={5} fill={ACCENT} opacity={prog(t, 4.3, 4.6) * Math.sin(Math.PI * u)} />;
          })
        )}

      {G_CHANNELS.map((y, i) => {
        const s = 4.8 + i * 0.3;
        return (
          <g key={y}>
            <line x1={770} y1={y} x2={800} y2={y} {...hair} {...draw(prog(t, s - 0.1, s + 0.1))} />
            <rect x={800} y={y - 40} width={110} height={80} rx={8} {...line} strokeWidth={2} {...draw(inOut(prog(t, s, s + 0.5)))} />
            <g opacity={prog(t, s + 0.3, s + 0.6)}>
              <rect x={810} y={y - 30} width={42} height={34} rx={4} {...hair} strokeOpacity={0.4} />
              <path d={`M814 ${y}l11 -11l8 8l6 -5l9 8`} {...line} strokeWidth={2} strokeOpacity={0.5} />
              <circle cx={843} cy={y - 22} r={3.5} fill={ACCENT} />
            </g>
            <path d={`M862 ${y - 22}H898M862 ${y - 10}H886M810 ${y + 18}H898M810 ${y + 30}H868`} {...line} strokeWidth={2} strokeOpacity={0.35} {...draw(prog(t, s + 0.4, s + 0.9))} />
          </g>
        );
      })}

      <path d="M960 110H1200M960 110L1060 290V330M1200 110L1100 290V330" {...line} strokeWidth={2} strokeOpacity={0.5} {...draw(inOut(prog(t, 5.9, 6.6)))} />
      <text x={1024} y={250} textAnchor="end" fontSize={19} fill={INK} fillOpacity={0.55} opacity={prog(t, 6.4, 6.8)} style={mono}>
        {leads} Leads
      </text>
      {G_LEADS.map(({ start, from, rim, won }, i) => {
        const e = t - start;
        if (e < 0 || e > (won >= 0 ? 1.7 : 1.2)) return null;
        let pos: Pt;
        let o = prog(e, 0, 0.2);
        if (e < 0.7) pos = quad(from, [(from[0] + rim[0]) / 2, 40], rim, inOut(prog(e, 0, 0.7)));
        else if (e < 1.2) {
          pos = mix(rim, G_SPOUT, inOut(prog(e, 0.7, 1.2)));
          if (won < 0) o = 1 - prog(e, 0.8, 1.1);
        } else pos = quad(G_SPOUT, [1080, 380], [gSlot(won)[0], 428], inOut(prog(e, 1.2, 1.7)));
        return <circle key={i} cx={pos[0]} cy={pos[1]} r={7} fill={INK} opacity={o} />;
      })}
      {G_WON.map((i, k) => {
        const s = back(prog(t, G_LEADS[i].start + 1.7, G_LEADS[i].start + 2));
        return s > 0 ? <Person key={k} at={gSlot(k)} s={s} /> : null;
      })}

      <ellipse cx={G_LOOP.cx} cy={G_LOOP.cy} rx={G_LOOP.rx} ry={G_LOOP.ry} {...hair} {...draw(inOut(prog(t, 9.8, 10.5)))} />
      <path d={`M${G_LOOP.cx + G_LOOP.rx - 8} ${G_LOOP.cy - 6}l8 10l8 -10`} {...line} strokeWidth={2} strokeOpacity={0.4} opacity={prog(t, 10.4, 10.7)} />
      {[0, 1].map((k) => {
        const theta = (t - 10) * 1.4 + k * Math.PI;
        return <circle key={k} cx={G_LOOP.cx + G_LOOP.rx * Math.cos(theta)} cy={G_LOOP.cy + G_LOOP.ry * Math.sin(theta)} r={5} fill={INK} opacity={prog(t, 10.4, 10.7)} />;
      })}
      {G_REFERRERS.map((k, j) => {
        const start = 10.2 + j * 0.35;
        const ping = prog(t, start, start + 0.6);
        const p = prog(t, start + 0.3, start + 1);
        if (ping <= 0) return null;
        const from = gSlot(k);
        const to = gSlot(4 + j);
        return (
          <g key={j}>
            {ping < 1 && <circle cx={from[0]} cy={from[1] - 12} r={10 + 24 * out(ping)} {...line} stroke={ACCENT} strokeWidth={2} strokeOpacity={0.7 * (1 - ping)} />}
            {p > 0 && <Person at={quad(from, [(from[0] + to[0]) / 2, 350], to, inOut(p))} color={ACCENT} s={lerp(0.6, 1, p)} opacity={prog(t, start + 0.3, start + 0.5)} />}
          </g>
        );
      })}
    </g>
  );
}

const scenes: Record<string, Scene> = {
  agents: {
    loop: 12,
    still: 10.2,
    Draw: Agents,
    steps: [
      [0, 2, "Aufgaben definieren"],
      [2, 3.6, "Daten anbinden"],
      [3.6, 5, "KI-Agenten"],
      [5, 7, "Workflows automatisieren"],
      [7, 8.8, "Systeme verbinden"],
      [8.8, 12, "Prozesse übernehmen"],
    ],
  },
  chat: {
    loop: 12,
    still: 9.4,
    Draw: Chat,
    steps: [
      [0, 2.2, "Website-Chat"],
      [2.2, 4.2, "Anfrage-Erkennung"],
      [4.2, 6.2, "Antwort-Workflows"],
      [6.2, 8.2, "Lead-Qualifizierung"],
      [8.2, 10, "Übergabe an Mitarbeiter"],
      [10, 12, "Rund um die Uhr"],
    ],
  },
  calls: {
    loop: 12,
    still: 10.8,
    Draw: Calls,
    steps: [
      [0, 2, "Eingehende Anrufe"],
      [2, 4.2, "Sprachassistent"],
      [4.2, 6.2, "Lead-Qualifizierung"],
      [6.2, 8.4, "Terminvereinbarung"],
      [8.4, 10, "Weiterleitung"],
      [10, 12, "Follow-ups"],
    ],
  },
  marketing: {
    loop: 13,
    still: 11.9,
    Draw: Marketing,
    steps: [
      [0, 2.2, "Zielgruppenanalyse"],
      [2.2, 3.6, "Positionierung"],
      [3.6, 4.8, "Kampagnensteuerung"],
      [4.8, 6.2, "Personalisierte Inhalte"],
      [6.2, 9.8, "Leadgenerierung"],
      [9.8, 13, "Follow-ups & CRM"],
    ],
  },
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function ServiceAnimation({ id, title, onStep }: { id: string; title: string; onStep: (capability: string | undefined) => void }) {
  const scene = scenes[id];
  const svg = useRef<SVGSVGElement>(null);
  const [clock, setClock] = useState(0);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const loop = scene.loop;

  // The clock only runs while the drawing is on screen and its card is not faded out under the next one.
  useEffect(() => {
    const el = svg.current;
    if (!el || reduced) return;
    const card = el.closest<HTMLElement>("[data-card]");
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      // Covered cards are still "on screen" for the observer, but they are invisible: skip the re-render.
      if (card?.style.opacity === "0") {
        last = 0;
        return;
      }
      if (last) elapsed += Math.min(0.1, (now - last) / 1000);
      last = now;
      setClock(elapsed % loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, loop]);

  const t = reduced ? scene.still : clock;
  const step = scene.steps.find(([a, b]) => t >= a && t < b)?.[2];

  useEffect(() => {
    onStep(step);
  }, [step, onStep]);

  const { Draw, steps } = scene;
  return (
    <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={title}>
      <Draw t={t} />
      {steps.map(([a, b, name]) => {
        const o = prog(t, a, a + 0.3) * (1 - prog(t, b - 0.3, b));
        return o > 0 ? (
          <text key={name} x={90} y={514 + (1 - o) * 8} fontSize={22} fill={INK} fillOpacity={0.5} opacity={o} style={mono}>
            {name}
          </text>
        ) : null;
      })}
    </svg>
  );
}

type Service = { id: keyof typeof scenes; title: string; text: string; bg: string };

const STACK: Service[] = [
  { id: "agents", ...SERVICES.agents, bg: "/images/bg/svc-agents.webp" },
  { id: "chat", ...SERVICES.chatbots, bg: "/images/bg/svc-chat.webp" },
  { id: "calls", ...SERVICES.callbots, bg: "/images/bg/svc-calls.webp" },
  { id: "marketing", ...SERVICES.automation, bg: "/images/bg/svc-marketing.webp" },
];

function ServiceCard({ service: s }: { service: Service }) {
  const [step, setStep] = useState<string>();
  const capabilities = scenes[s.id].steps.map(([, , name]) => name);
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-[linear-gradient(155deg,rgb(255_255_255/0.13)_0%,rgb(255_255_255/0.04)_38%,rgb(6_14_30/0.45)_100%)] px-4 pt-5 shadow-[0_60px_140px_-40px_rgb(0_0_0/0.95),inset_0_1px_0_rgb(255_255_255/0.22)] backdrop-blur-xl backdrop-saturate-150 lg:max-w-[680px] lg:pt-8">
      {/* A soft highlight in the top corner and a light travelling round the rim, like light catching glass. */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-16 h-56 w-80 rotate-[-12deg] bg-white/10 blur-3xl" />
      <BorderBeam size={240} duration={9} colorFrom="#bfe6ff" colorTo="#1a6fe0" borderWidth={1.2} />
      <div className="relative px-2 lg:px-10">
        <ServiceAnimation id={s.id} title={`${s.title}: ${capabilities.join(", ")}`} onStep={setStep} />
      </div>
      <div className="relative p-5 pt-7 text-white lg:px-14 lg:py-11 lg:[@media(max-height:910px)]:py-8">
        <p className="text-[19px] leading-snug tracking-[0.002em] text-white/90 lg:max-w-[580px]">{s.text}</p>
        <p id={`service-list-${s.id}`} className="mt-9 text-[13px] font-medium text-white/55 lg:[@media(max-height:910px)]:mt-6">
          Was dazugehört
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-1.5 text-[13px] leading-tight sm:text-[15px] lg:gap-2" aria-labelledby={`service-list-${s.id}`}>
          {capabilities.map((c) => (
            <li
              key={c}
              className={cn(
                "relative flex items-baseline gap-2 rounded-lg border px-2.5 pt-2 pb-2.5 transition-[background-color,border-color,color,box-shadow] duration-500 before:size-2 before:shrink-0 before:-translate-y-[20%] before:rounded-full before:transition-colors before:duration-500",
                c === step
                  ? "border-sky/45 bg-sky/20 text-white shadow-[0_0_24px_-6px_rgb(105_191_248/0.7)] before:bg-sky"
                  : "border-white/[0.07] bg-white/[0.05] text-white/70 before:bg-white/35"
              )}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const panelClass =
  "sticky top-0 mx-auto grid min-h-svh w-full max-w-[1440px] origin-top content-center items-center px-4 py-24 sm:px-16 md:px-9 lg:grid-cols-2 lg:px-0 lg:py-20 lg:[@media(max-height:910px)]:py-10";

export function ServicesStack() {
  const root = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    let raf = 0;
    // A panel taller than the viewport sticks by its bottom edge, so the whole card stays reachable.
    const fit = () => {
      const vh = window.innerHeight;
      panels.forEach((panel) => {
        panel.style.top = `${Math.min(0, vh - panel.offsetHeight)}px`;
      });
    };
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let idx = 0;
      panels.forEach((panel, i) => {
        if (panel.getBoundingClientRect().top <= vh * 0.5) idx = i;
        const next = panels[i + 1];
        const card = cards.current[i];
        if (!card) return;
        const covered = next ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh)) : 0;
        card.style.opacity = String(Math.max(0, 1 - covered * 1.4));
        card.style.transform = `scale(${1 - covered * 0.06}) translateY(${-covered * 40}px)`;
      });
      setActive(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      fit();
      schedule();
    };
    fit();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} id="leistungen" className="relative isolate w-full scroll-mt-0 lg:px-9">
      {STACK.map((s, i) => (
        <div key={s.id} data-panel className={panelClass}>
          <div
            data-card
            className="mx-auto w-full max-w-[38rem] lg:col-start-2 lg:mx-0 lg:max-w-none"
            ref={(el) => {
              cards.current[i] = el;
            }}
            style={{ transformOrigin: "top center", willChange: "transform, opacity" }}
          >
            <h2 className="text-[28px] leading-tight font-medium tracking-[-0.02em] text-white lg:sr-only">
              <span className="block text-white/55">Wir entwickeln</span>
              <span className="block">{s.title}</span>
            </h2>
            <div className="mt-6 lg:mt-0">
              <ServiceCard service={s} />
            </div>
          </div>
        </div>
      ))}

      {/* Sticky background: the service titles on the left, the client's photos cross-fading behind */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="sticky top-0 grid h-svh w-full overflow-hidden py-20">
          <div className="mx-auto hidden w-full max-w-[1512px] grid-cols-12 px-9 text-[clamp(30px,2.6vw,46px)] leading-[1.08] font-medium tracking-[-0.03em] text-white lg:grid">
            <div className="col-span-5 flex h-full flex-col">
              <div className="flex h-1/2 flex-col justify-end pb-2">
                <p className="text-white/55">Wir entwickeln</p>
              </div>
              <div className="relative h-1/2">
                {STACK.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn("absolute inset-x-0 top-0 transition duration-500 ease-out", i !== active && (i < active ? "-translate-y-8 opacity-0" : "translate-y-10 opacity-0"))}
                  >
                    {s.title}
                  </span>
                ))}
                <div className="absolute bottom-0 left-0 flex gap-2">
                  {STACK.map((s, i) => (
                    <span key={s.id} className={cn("h-1 rounded-full transition-all duration-500", i === active ? "w-10 bg-white" : "w-4 bg-white/30")} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {STACK.map((s, i) => (
            <div key={s.id} className={cn("absolute inset-0 -z-20 overflow-hidden transition-opacity duration-1000", i !== active && "opacity-0")}>
              <Image src={s.bg} alt="" fill sizes="100vw" className="kenburns object-cover" style={{ animationDelay: `${i * -6}s` }} />
            </div>
          ))}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#020611]/88 via-[#020611]/55 to-[#020611]/60" />
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="grain-drift" />
          </div>
          <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black to-transparent" />
        </div>
      </div>
    </section>
  );
}
