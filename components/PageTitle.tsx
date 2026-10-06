"use client";

import { motion, useReducedMotion } from "framer-motion";
import { silk } from "./motion";

export default function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  return (
    <>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: silk, delay: 0.2 }} className="eyebrow">
        {eyebrow}
      </motion.p>
      <h1 className="h-display mt-6 max-w-5xl text-[clamp(2.6rem,6.5vw,5.5rem)]">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-2 pr-[0.1em] -mr-[0.1em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: silk, delay: 0.35 + i * 0.07 }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </h1>
    </>
  );
}
