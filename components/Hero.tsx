"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { home, site } from "@/lib/site";
import { Arrow, PhoneIcon, PillButton, SplitWords } from "./motion";

const LiquidImage = dynamic(() => import("./three/LiquidImage"), { ssr: false });

const INTRO = 2.6; // seconds, matches the preloader

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, 1], { clamp: true }), { stiffness: 90, damping: 24 });
  const leftX = useTransform(p, [0, 1], ["0vw", reduce ? "0vw" : "-18vw"]);
  const rightX = useTransform(p, [0, 1], ["0vw", reduce ? "0vw" : "18vw"]);
  const titleOpacity = useTransform(p, [0.55, 0.9], [1, 0]);
  const shade = useTransform(p, [0.4, 1], [0, 1]);
  const copyOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.55, 0.75], [60, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: INTRO }}
          className="absolute inset-0"
        >
          <LiquidImage src="/images/hug.jpg" progress={p} className="absolute inset-0" />
        </motion.div>
        <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-void via-void/85 to-transparent" />

        {/* Giant split title */}
        <motion.div style={{ opacity: titleOpacity }} className="pointer-events-none absolute inset-0 flex flex-col justify-between px-5 pb-10 pt-28 sm:px-10 sm:pt-32">
          <motion.h1 style={{ x: leftX }} className="display text-[clamp(4.2rem,15vw,17rem)] text-bone">
            <SplitWords text="High Standard" inView={false} delay={INTRO + 0.1} stagger={0.12} />
          </motion.h1>
          <motion.p style={{ x: rightX }} aria-hidden className="display self-end text-right text-[clamp(4.2rem,15vw,17rem)] italic text-bone">
            <SplitWords text="of Care!" inView={false} delay={INTRO + 0.35} stagger={0.12} accent={[1]} />
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INTRO + 1, duration: 1 }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-5 sm:px-10"
        >
          <div className="flex items-center justify-between">
            <p className="label">{home.la.title}</p>
            <p className="label hidden sm:block">{site.license}</p>
          </div>
        </motion.div>

        {/* Copy that lands once the image is full-bleed */}
        <motion.div style={{ opacity: copyOpacity, y: copyY }} className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-10 sm:pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <p className="display max-w-4xl text-[clamp(2.4rem,5.5vw,5.5rem)]">
              {home.hero.subtitle.split(" ").slice(0, 3).join(" ")} <span className="italic grad">{home.hero.subtitle.split(" ").slice(3).join(" ")}</span>
            </p>
            <div>
              <p className="max-w-md text-base leading-relaxed text-bone/75">{home.hero.text}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <PillButton href="#contact">
                  Get Started <Arrow />
                </PillButton>
                <PillButton href={site.phoneHref} variant="ghost">
                  <PhoneIcon /> {site.phone}
                </PillButton>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div style={{ opacity: hintOpacity }} className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: INTRO + 1.4 }} className="flex flex-col items-center gap-3">
            <span className="label">Scroll</span>
            <span className="relative h-14 w-px overflow-hidden bg-bone/15">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-bone"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: [0.87, 0, 0.13, 1] }}
              />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
