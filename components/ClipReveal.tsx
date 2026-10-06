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
        <motion.div style={{ opacity: copy }} className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-10 sm:pb-12">
          <div className="mx-auto max-w-[1520px] rounded-[28px] bg-white/90 p-7 shadow-[0_30px_80px_-30px_rgba(19,35,58,0.35)] backdrop-blur-md sm:p-12">{children}</div>
        </motion.div>
      </div>
    </section>
  );
}
