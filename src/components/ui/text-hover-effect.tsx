"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

// Aceternity's TextHoverEffect, re-tuned for a long brand name: wide viewBox, brand gradient, Jost, draw-in on first view.
export const TextHoverEffect = ({
  text,
  duration,
  viewBox = "0 0 1560 200",
  fontSize = 168,
}: {
  text: string;
  duration?: number;
  viewBox?: string;
  fontSize?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, amount: 0.4 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({ cx: `${cxPercentage}%`, cy: `${cyPercentage}%` });
    }
  }, [cursor]);

  const textProps = {
    x: "50%",
    y: "52%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    style: { fontSize, fontWeight: 700, letterSpacing: "-0.02em" },
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none font-sans"
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={viewBox.split(" ")[2]} y2="0">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#30c2f3" />
              <stop offset="30%" stopColor="#69bff8" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="72%" stopColor="#2b7fe0" />
              <stop offset="100%" stopColor="#004ba0" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="18%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>
      <text {...textProps} strokeWidth="1.2" className="fill-transparent stroke-white/10" style={{ ...textProps.style, opacity: hovered ? 0.7 : 0 }}>
        {text}
      </text>
      <motion.text
        {...textProps}
        strokeWidth="1.2"
        className="fill-transparent stroke-white/20"
        initial={{ strokeDashoffset: 2400, strokeDasharray: 2400 }}
        animate={inView ? { strokeDashoffset: 0, strokeDasharray: 2400 } : undefined}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>
      <text {...textProps} stroke="url(#textGradient)" strokeWidth="1.6" mask="url(#textMask)" className="fill-transparent">
        {text}
      </text>
    </svg>
  );
};
