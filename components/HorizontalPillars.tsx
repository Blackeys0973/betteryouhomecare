"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { home } from "@/lib/site";
import { Arrow } from "./motion";

// Pinned section whose panels slide sideways as you scroll down.
export default function HorizontalPillars() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 26 });
  const x = useTransform(p, [0, 1], [0, -dist]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative bg-void" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-6 px-5 sm:gap-10 sm:px-10">
          <div className="flex w-[80vw] shrink-0 flex-col justify-end pb-10 sm:w-[42vw]">
            <p className="label">{home.services.eyebrow}</p>
            <p className="display mt-6 t-xl">
              {home.services.title.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="italic grad">{home.services.title.split(" ").slice(2).join(" ")}</span>
            </p>
          </div>
          {home.pillars.map((pl, i) => (
            <Panel key={pl.title} i={i} {...pl} progress={p} />
          ))}
        </motion.div>
        <div className="absolute bottom-8 left-5 right-5 h-px bg-bone/10 sm:left-10 sm:right-10">
          <motion.div style={{ width: bar }} className="h-px bg-gradient-to-r from-brand to-plum" />
        </div>
      </div>
    </section>
  );
}

function Panel({
  title,
  text,
  href,
  image,
  i,
  progress,
}: {
  title: string;
  text: string;
  href: string;
  image: string;
  i: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const imgX = useTransform(progress, [0, 1], ["-12%", "12%"]);
  return (
    <Link href={href} data-cursor="hover" className="group relative flex h-[78svh] w-[86vw] shrink-0 flex-col overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(14,26,43,0.35)] sm:w-[62vw] lg:w-[48vw]">
      <div className="relative h-[62%] overflow-hidden">
        <motion.div style={{ x: imgX }} className="absolute -inset-x-[15%] inset-y-0">
          <Image src={image} alt={title} fill sizes="60vw" className="object-cover transition-transform duration-[1.6s] ease-silk group-hover:scale-110" />
        </motion.div>
        <span className="display absolute left-6 top-4 t-lg text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">0{i + 1}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <h3 className="display t-md">{title}</h3>
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-md text-bone/65">{text}</p>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-bone/25 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-bone group-hover:text-void">
            <Arrow />
          </span>
        </div>
        <span className="sr-only">GET STARTED</span>
      </div>
    </Link>
  );
}
