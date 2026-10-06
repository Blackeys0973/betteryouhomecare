"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mark } from "./LogoMark";
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
      const k = Math.min((t - start) / 1200, 1);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) id = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          document.documentElement.style.overflow = "";
        }, 150);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="pre"
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.8, ease: expo }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-void"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: expo }}
            className="h-20 w-20"
          >
            <Mark alt="Better You Home Care" className="h-full w-full" />
          </motion.div>
          <div className="h-px w-48 bg-bone/10">
            <div className="h-px bg-gradient-to-r from-brand to-plum" style={{ width: `${n}%` }} />
          </div>
          <span className="text-xs tabular-nums tracking-[0.3em] text-bone/40">{String(n).padStart(3, "0")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
