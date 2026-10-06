"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Reveal } from "./motion";

export default function VideoCard({ href }: { href: string }) {
  return (
    <Reveal>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover="hover"
        className="group relative block aspect-video overflow-hidden rounded-[32px] shadow-2xl shadow-ink/15"
        aria-label="Watch our service overview video on YouTube"
      >
        <motion.div variants={{ hover: { scale: 1.04 } }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image src="/images/video-cover.png" alt="Watch our service overview video" fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-ink/10 transition-colors duration-500 group-hover:bg-ink/25" />
        <motion.span
          variants={{ hover: { scale: 1.12 } }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream shadow-xl sm:h-24 sm:w-24"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-cream/40" />
          <svg width="26" height="26" viewBox="0 0 24 24" className="ml-1 text-ink" aria-hidden>
            <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
          </svg>
        </motion.span>
      </motion.a>
    </Reveal>
  );
}
