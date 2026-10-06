"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { expo } from "./motion";

export default function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let id = 0;
    const tick = (t: number) => {
      const k = Math.min((t - start) / 2000, 1);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) id = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          document.documentElement.style.overflow = "";
        }, 250);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="pre"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: expo }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-void px-5 py-8 sm:px-10"
        >
          <div className="flex justify-between">
            <span className="label">Better You Home Care</span>
            <span className="label">Los Angeles County</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="display text-[clamp(5rem,22vw,22rem)] tabular-nums text-bone">{n}</span>
            <span className="display mb-4 text-[clamp(1.5rem,4vw,3.5rem)] italic grad">High Standard of Care!</span>
          </div>
          <div className="h-px w-full bg-bone/10">
            <div className="h-px bg-gradient-to-r from-brand to-plum" style={{ width: `${n}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
