"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { home, site } from "@/lib/site";
import { Arrow, PhoneIcon, PillButton, SplitWords, silk } from "./motion";

const LiquidImage = dynamic(() => import("./three/LiquidImage"), { ssr: false });

const INTRO = 1.6; // seconds, matches the preloader

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92]);
  const smallY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-void pb-20 pt-32 sm:pt-36 lg:pb-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-mist blur-[60px]" />
      <div className="pointer-events-none absolute -left-60 bottom-0 h-[420px] w-[420px] rounded-full bg-plum/[0.06] blur-[100px]" />

      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: silk, delay: INTRO }}
            className="label"
          >
            {home.hero.subtitle}
          </motion.p>
          <h1 className="display t-hero mt-6 max-w-xl text-bone">
            <SplitWords text={home.hero.title} inView={false} delay={INTRO + 0.1} stagger={0.09} accent={[2]} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: silk, delay: INTRO + 0.5 }}
            className="mt-7 max-w-md text-[17px] leading-relaxed text-bone/65"
          >
            {home.hero.text}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: silk, delay: INTRO + 0.65 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <PillButton href="#contact">
              Get Started <Arrow />
            </PillButton>
            <PillButton href={site.phoneHref} variant="ghost">
              <PhoneIcon /> {site.phone}
            </PillButton>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: INTRO + 0.9 }}
            className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6 text-sm"
          >
            {["24Hr/7 Days Support", home.la.title, site.license].map((t) => (
              <div key={t} className="leading-snug">
                <dd className="font-medium text-bone/80">{t}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="relative">
          <motion.div
            style={{ y: imgY, scale: imgScale }}
            initial={{ clipPath: "inset(100% 0 0 0 round 28px)" }}
            animate={{ clipPath: "inset(0% 0 0 0 round 28px)" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: INTRO - 0.2 }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-mist shadow-[0_40px_100px_-40px_rgba(19,35,58,0.45)] sm:aspect-[5/5] lg:aspect-[4/5]"
          >
            <LiquidImage src="/images/hug.jpg" className="absolute inset-0" />
          </motion.div>
          <motion.div
            style={{ y: smallY }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: silk, delay: INTRO + 0.8 }}
            className="absolute -bottom-10 -left-6 hidden w-[42%] overflow-hidden rounded-2xl border-[6px] border-void shadow-xl shadow-bone/10 sm:block lg:-left-14"
          >
            <div className="relative aspect-[4/3]">
              <Image src="/images/caregiver-smile.jpg" alt="Caregiver smiling with a senior man" fill sizes="240px" className="object-cover" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: INTRO + 1.1 }}
            className="absolute -right-3 top-8 rounded-2xl bg-white/90 px-5 py-4 shadow-lg shadow-bone/10 backdrop-blur sm:-right-6"
          >
            <p className="text-xs text-bone/50">Call Our 24/7 Hotline</p>
            <a href={site.phoneHref} className="mt-1 block font-medium text-brand">
              {site.phone}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
