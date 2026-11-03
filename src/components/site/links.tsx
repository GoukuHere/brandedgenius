import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "light" | "dark" | "ink";
  size?: "md" | "lg";
};

const VARIANTS = {
  light: "bg-white text-[#05070b] hover:bg-[#dcefff]",
  dark: "border border-white/15 bg-white/[0.04] text-white backdrop-blur-md hover:border-white/35 hover:bg-white/[0.09]",
  ink: "bg-[#06122b] text-white hover:bg-[#0b2350]",
};

// The reference site's pill buttons: on hover the label rolls up and the arrow lifts out to the top right.
export function PillLink({ children, variant = "light", size = "md", className, ...props }: PillProps) {
  return (
    <a
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,transform] duration-300 ease-out active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky",
        size === "lg" ? "h-[58px] px-8 text-[16px]" : "h-[50px] px-7 text-[15px]",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      <span className="relative block size-4 overflow-hidden">
        <ArrowUpRight className="absolute inset-0 size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full group-hover:-translate-y-full" />
        <ArrowUpRight className="absolute inset-0 size-4 -translate-x-full translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </a>
  );
}
