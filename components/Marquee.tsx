"use client";

import { motion, useScroll, useTransform, useVelocity, useSpring } from "framer-motion";

// Endless band of real copy that speeds up and skews with scroll velocity.
export default function Marquee({ items }: { items: string[] }) {
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(v, [-2000, 0, 2000], [6, 0, -6]);
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-cream py-6">
      <motion.div style={{ skewX: skew }}>
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 38, ease: "linear", repeat: Infinity }}
        >
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-3xl text-ink/85 sm:text-5xl">
              {t}
              <span className="inline-block h-3 w-3 rotate-45 bg-gradient-to-br from-brand to-plum" />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
