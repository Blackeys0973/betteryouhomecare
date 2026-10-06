"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

const photos = [
  "/images/hug.jpg",
  "/images/care-chat.jpg",
  "/images/forehead.jpg",
  "/images/caregiver-man.jpg",
  "/images/started.jpg",
  "/images/holding-hands.jpg",
  "/images/pointing.jpg",
  "/images/shoulder.jpg",
  "/images/caregiver-smile.jpg",
  "/images/service-4.jpg",
];

// Pinned section: real photos on a 3D cylinder that turns as you scroll.
export default function PhotoRing({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const rotate = useTransform(p, [0, 1], [0, reduce ? 0 : -300]);
  const tilt = useTransform(p, [0, 0.5, 1], [-14, -6, -14]);
  const scale = useTransform(p, [0, 0.15, 0.85, 1], [0.8, 1, 1, 0.9]);
  const n = photos.length;
  const step = 360 / n;

  return (
    <section ref={ref} className="relative h-[260vh] bg-ink">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum/30 blur-[120px]" />
        <div className="relative z-10 px-5 text-center text-cream">{children}</div>
        <motion.div style={{ scale }} className="relative mt-10 h-[38vmin] w-full" >
          <div className="absolute inset-0" style={{ perspective: "1400px" }}>
            <motion.div
              style={{ rotateX: tilt, rotateY: rotate, transformStyle: "preserve-3d" }}
              className="absolute left-1/2 top-1/2 h-0 w-0"
            >
              {photos.map((src, i) => (
                <div
                  key={src}
                  className="absolute overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10"
                  style={{
                    width: "clamp(140px, 22vmin, 260px)",
                    height: "clamp(180px, 30vmin, 340px)",
                    transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(clamp(300px, 52vmin, 620px))`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Image src={src} alt="" fill sizes="260px" className="object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
