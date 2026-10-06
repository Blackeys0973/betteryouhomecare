"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

// A full-bleed image that opens from a small circle as you scroll into it.
export default function ClipReveal({ src, alt, children, href }: { src: string; alt: string; children?: ReactNode; href?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 0.6], ["circle(12% at 50% 50%)", "circle(75% at 50% 50%)"]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.4, 1]);
  const copy = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);
  const Inner = (
    <motion.div style={{ clipPath: clip }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
    </motion.div>
  );
  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="hover" aria-label={alt}>
            {Inner}
          </a>
        ) : (
          Inner
        )}
        <motion.div style={{ opacity: copy }} className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-14 sm:px-10">
          {children}
        </motion.div>
      </div>
    </section>
  );
}
