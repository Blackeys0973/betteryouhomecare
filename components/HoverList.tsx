"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { silk } from "./motion";

// Rows that reveal a floating photo following the pointer.
export default function HoverList({ items, images }: { items: string[]; images: string[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 20 });
  const sy = useSpring(y, { stiffness: 180, damping: 20 });
  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ol className="border-t border-line">
        {items.map((it, i) => (
          <motion.li
            key={it}
            onPointerEnter={() => setActive(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: silk, delay: i * 0.06 }}
            className="group flex items-baseline gap-6 border-b border-line py-6 sm:py-8"
          >
            <span className="label w-10 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="display t-md text-bone/80 transition-all duration-500 ease-silk group-hover:translate-x-4 group-hover:text-bone group-hover:italic">
              {it}
            </span>
          </motion.li>
        ))}
      </ol>
      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block">
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 8 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative -ml-36 -mt-48 h-64 w-72 overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image src={images[active % images.length]} alt="" fill sizes="288px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
