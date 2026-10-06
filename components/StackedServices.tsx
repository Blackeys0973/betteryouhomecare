"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { home } from "@/lib/site";

// Cards pin and stack on top of each other; earlier ones shrink back into depth.
export default function StackedServices() {
  const ref = useRef<HTMLDivElement>(null);
  const items = home.services.items;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="relative">
      {items.map((s, i) => (
        <Card key={s.title} i={i} n={items.length} progress={scrollYProgress} {...s} />
      ))}
    </div>
  );
}

function Card({ title, text, image, i, n, progress }: { title: string; text: string; image: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - i) * 0.05]);
  const dim = useTransform(progress, [start, 1], [0, i === n - 1 ? 0 : 0.6]);
  const colors = ["from-[#13233a]", "from-[#22163a]", "from-[#122a2e]", "from-[#2a1530]"];
  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center px-5 sm:px-10">
      <motion.div
        style={{ scale, marginTop: i * 28 }}
        className={`relative grid h-[76svh] w-full max-w-[1400px] origin-top overflow-hidden rounded-[32px] border border-line bg-gradient-to-br ${colors[i % 4]} to-surface lg:grid-cols-2`}
      >
        <div className="flex flex-col justify-between p-8 sm:p-12">
          <span className="label">0{i + 1} / 0{n}</span>
          <div>
            <h3 className="display text-[clamp(2.8rem,6vw,6.5rem)]">{title}</h3>
            <p className="mt-6 max-w-md text-lg text-bone/70">{text}</p>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <Image src={image} alt={title} fill sizes="50vw" className="object-cover" />
        </div>
        <div className="relative h-40 lg:hidden">
          <Image src={image} alt={title} fill sizes="100vw" className="object-cover" />
        </div>
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-void" />
      </motion.div>
    </div>
  );
}
