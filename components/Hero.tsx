"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { home, site } from "@/lib/site";
import { Arrow, PhoneIcon, SpringButton, silk } from "./motion";

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yBack = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 120]);
  const yFront = useTransform(scrollY, [0, 800], [0, reduce ? 0 : -60]);
  const words = home.hero.title.split(" ");

  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      <div className="grain pointer-events-none absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: silk }}
        className="pointer-events-none absolute -right-32 top-10 h-[560px] w-[560px] rounded-full bg-plum/15 blur-[110px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.6, ease: silk, delay: 0.3 }}
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-brand/15 blur-[110px]"
      />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: silk, delay: 0.35 }}
            className="eyebrow"
          >
            {home.hero.subtitle}
          </motion.p>
          <h1 className="h-display mt-6 text-[clamp(3rem,8vw,6.5rem)]">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2 pr-[0.1em] -mr-[0.1em] align-bottom">
                <motion.span
                  className={`inline-block ${i === words.length - 1 ? "italic text-brand" : ""}`}
                  initial={reduce ? false : { y: "110%", rotate: 4 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 1.25, ease: silk, delay: 0.5 + i * 0.12 }}
                >
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: silk, delay: 1.1 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70"
          >
            {home.hero.text}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: silk, delay: 1.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <SpringButton href="#contact">
              Get Started <Arrow />
            </SpringButton>
            <SpringButton href={site.phoneHref} variant="ghost">
              <PhoneIcon /> {site.phone}
            </SpringButton>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
          <motion.div
            style={{ y: yBack }}
            initial={{ clipPath: "inset(100% 0 0 0 round 28px)" }}
            animate={{ clipPath: "inset(0% 0 0 0 round 28px)" }}
            transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="absolute right-0 top-0 h-[78%] w-[78%] overflow-hidden rounded-[28px] shadow-2xl shadow-ink/20"
          >
            <motion.div
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: silk, delay: 0.3 }}
              className="absolute inset-0"
            >
              <Image src="/images/hug.jpg" alt="Caregiver embracing a smiling senior woman" fill priority sizes="(min-width:1024px) 420px, 80vw" className="object-cover" />
            </motion.div>
          </motion.div>
          <motion.div
            style={{ y: yFront }}
            initial={{ clipPath: "inset(0 100% 0 0 round 24px)" }}
            animate={{ clipPath: "inset(0 0% 0 0 round 24px)" }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.9 }}
            className="absolute bottom-0 left-0 h-[48%] w-[52%] overflow-hidden rounded-3xl border-[6px] border-cream shadow-xl shadow-ink/20"
          >
            <Image src="/images/caregiver-smile.jpg" alt="Caregiver smiling with a senior man" fill sizes="280px" className="object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 1.7 }}
            className="absolute bottom-[40%] right-[-4%] rounded-2xl bg-white px-5 py-4 shadow-xl shadow-ink/10 sm:right-[-8%]"
          >
            <p className="font-display text-3xl text-brand">24/7</p>
            <p className="text-xs font-medium text-ink/60">{site.license}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
