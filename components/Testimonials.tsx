"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { home } from "@/lib/site";
import { Reveal, silk } from "./motion";

export default function Testimonials() {
  const items = home.testimonials.items;
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 9000);
    return () => clearInterval(t);
  }, [items.length]);
  const t = items[i];

  return (
    <section className="container-x py-24 lg:py-32">
      <Reveal className="text-center">
        <p className="eyebrow justify-center">Reviews</p>
        <h2 className="h-display mt-5 text-4xl sm:text-5xl">{home.testimonials.title}</h2>
      </Reveal>
      <div className="relative mx-auto mt-14 min-h-[360px] max-w-4xl text-center sm:min-h-[300px]">
        <span aria-hidden className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[10rem] leading-none text-plum/15">
          “
        </span>
        <AnimatePresence mode="wait">
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.8, ease: silk }}
            className="relative"
          >
            <blockquote className="font-display text-xl leading-relaxed text-ink/90 sm:text-2xl lg:text-[1.75rem]">{t.quote}</blockquote>
            <figcaption className="mt-10 flex items-center justify-center gap-4">
              <span className="relative h-14 w-14 overflow-hidden rounded-full ring-4 ring-white">
                <Image src={t.avatar} alt={t.name} fill sizes="56px" className="object-cover" />
              </span>
              <span className="text-left text-sm text-ink/70">{t.byline}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        {items.map((it, n) => (
          <button
            key={it.name}
            onClick={() => setI(n)}
            aria-label={it.name}
            className="relative h-2 w-10 overflow-hidden rounded-full bg-ink/10"
          >
            {n === i && (
              <motion.span
                layoutId="dot"
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
