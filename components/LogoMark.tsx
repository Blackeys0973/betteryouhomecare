"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** The Better You symbol, without the wordmark. */
export function Mark({ className, alt = "" }: { className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/images/mark.svg" alt={alt} aria-hidden={alt ? undefined : true} className={className} draggable={false} />;
}

/** Round badge: the symbol in the middle, a ring of text turning around it. */
export function SpinBadge({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative aspect-square rounded-full bg-white/90 shadow-[0_20px_60px_-25px_rgba(19,35,58,0.45)] backdrop-blur ${className ?? ""}`}>
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full text-bone/70"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        aria-hidden
      >
        <defs>
          <path id="badge-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="13.2" letterSpacing="3.4" fill="currentColor" fontWeight={600} style={{ textTransform: "uppercase" }}>
          <textPath href="#badge-ring">{text}</textPath>
        </text>
      </motion.svg>
      <motion.div
        className="absolute inset-[30%]"
        animate={reduce ? undefined : { y: [0, -4, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
      >
        <Mark className="h-full w-full" />
      </motion.div>
    </div>
  );
}

/** The symbol turning and drifting as the page scrolls past it. */
export function ScrollMark({ className, turns = 0.5, drift = 80 }: { className?: string; turns?: number; drift?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-180 * turns, 180 * turns]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [drift, -drift]);
  return (
    <motion.div ref={ref} style={{ rotate, y }} className={`pointer-events-none ${className ?? ""}`} aria-hidden>
      <Mark className="h-full w-full" />
    </motion.div>
  );
}
