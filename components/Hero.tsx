"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { home, site } from "@/lib/site";
import { Arrow, PhoneIcon, SpringButton, silk } from "./motion";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

export default function Hero() {
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : -120]);
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const words = home.hero.title.split(" ");

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-brand/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: silk, delay: 0.2 }}
        className="absolute inset-0"
      >
        <HeroScene mobile={mobile} />
      </motion.div>

      {/* Readability veil behind the copy */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0)_0%,rgba(250,247,242,0.35)_45%,#faf7f2_75%)] lg:bg-[linear-gradient(90deg,#faf7f2_0%,rgba(250,247,242,0.85)_32%,rgba(250,247,242,0)_55%)]" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="container-x pointer-events-none relative flex min-h-[100svh] flex-col justify-end pb-6 pt-32 lg:justify-center lg:pb-0"
      >
        <div className="pointer-events-auto max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: silk, delay: 0.35 }}
            className="eyebrow"
          >
            {home.hero.subtitle}
          </motion.p>
          <h1 className="h-display mt-6 text-[clamp(3.2rem,9vw,7.5rem)]">
            {words.map((w, i) => (
              <span key={i} className="-mr-[0.1em] inline-block overflow-hidden pb-2 pr-[0.1em] align-bottom">
                <motion.span
                  className={`inline-block ${i === words.length - 1 ? "bg-gradient-to-r from-brand to-plum bg-clip-text italic text-transparent" : ""}`}
                  initial={reduce ? false : { y: "110%", rotate: 6 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 1.3, ease: silk, delay: 0.55 + i * 0.13 }}
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
            transition={{ duration: 1, ease: silk, delay: 1.15 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink/75"
          >
            {home.hero.text}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: silk, delay: 1.35 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <SpringButton href="#contact">
              Get Started <Arrow />
            </SpringButton>
            <SpringButton href={site.phoneHref} variant="ghost" className="bg-cream/70 backdrop-blur">
              <PhoneIcon /> {site.phone}
            </SpringButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-11 w-7 justify-center rounded-full border border-ink/25 pt-2">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-ink/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
