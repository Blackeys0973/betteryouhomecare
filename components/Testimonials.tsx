"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { home } from "@/lib/site";
import { SplitWords, silk } from "./motion";

export default function Testimonials() {
  const items = home.testimonials.items;
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 10000);
    return () => clearInterval(t);
  }, [items.length]);
  const t = items[i];

  return (
    <section className="bg-mist py-28 lg:py-40">
      <div className="wrap">
      <div className="flex items-end justify-between gap-8 border-b border-line pb-8">
        <h2 className="display t-lg">
          <SplitWords text={home.testimonials.title} accent={[3]} />
        </h2>
        <div className="flex gap-2">
          {items.map((it, n) => (
            <button
              key={it.name}
              onClick={() => setI(n)}
              className={`relative h-14 w-14 overflow-hidden rounded-full ring-2 transition ${n === i ? "ring-lilac" : "opacity-40 ring-transparent"}`}
              aria-label={it.name}
            >
              <Image src={it.avatar} alt={it.name} fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="relative mt-16 min-h-[22rem]">
        <AnimatePresence mode="wait">
          <motion.figure key={i} exit={{ opacity: 0, y: -30, filter: "blur(10px)" }} transition={{ duration: 0.6, ease: silk }}>
            <blockquote className="display t-md leading-[1.1] text-bone/90">
              <SplitWords text={t.quote} stagger={0.018} inView={false} />
            </blockquote>
            <motion.figcaption initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="label mt-10 normal-case tracking-[0.1em]">
              {t.byline}
            </motion.figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      </div>
    </section>
  );
}
