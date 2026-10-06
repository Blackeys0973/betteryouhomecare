"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

// Endless band that skews with scroll velocity.
export default function Marquee({ items, outline = false, reverse = false }: { items: string[]; outline?: boolean; reverse?: boolean }) {
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(v, [-2500, 0, 2500], [8, 0, -8]);
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6">
      <motion.div style={{ skewX: skew }}>
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap"
          animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
          transition={{ duration: 45, ease: "linear", repeat: Infinity }}
        >
          {row.map((t, i) => (
            <span key={i} className={`display flex items-center gap-10 text-[clamp(3rem,8vw,9rem)] ${outline && i % 2 ? "outline-text" : ""}`}>
              {t}
              <span className="inline-block h-4 w-4 rotate-45 bg-gradient-to-br from-brand to-plum sm:h-6 sm:w-6" />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
