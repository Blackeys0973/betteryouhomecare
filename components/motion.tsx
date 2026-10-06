"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { Fragment, useRef, type ReactNode } from "react";

export const silk = [0.22, 1, 0.36, 1] as const;
export const expo = [0.87, 0, 0.13, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 40,
  duration = 1.1,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: silk }}
    >
      {children}
    </motion.div>
  );
}

/** Each word slides up out of its own mask, staggered. */
export function SplitWords({
  text,
  className,
  accent,
  delay = 0,
  stagger = 0.06,
  inView = true,
}: {
  text: string;
  className?: string;
  accent?: number[];
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // Watch the whole line: each word starts clipped by its mask, so it can't observe itself.
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const words = text.split(" ");
  const show = !inView || seen;
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.12em] -mr-[0.08em] inline-block overflow-hidden pb-[0.12em] pr-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${accent?.includes(i) ? "italic grad pr-[0.05em]" : ""}`}
              initial={reduce ? false : { y: "115%", rotate: 5 }}
              animate={show ? { y: "0%", rotate: 0 } : undefined}
              transition={{
                duration: 1.2,
                ease: silk,
                delay: delay + i * stagger,
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}

/** Words light up one by one as the block scrolls through the viewport. */
export function ScrollFillText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <FillWord
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {w}
        </FillWord>
      ))}
    </p>
  );
}

function FillWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

const parent: Variants = {
  hidden: {},
  show: (stagger: number = 0.09) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

export const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: silk } },
};

export function Stagger({
  children,
  className,
  stagger = 0.09,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={parent}
      custom={stagger}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}

export function ParallaxImage({
  src,
  alt,
  className,
  strength = 80,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [-strength, strength],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1.12, 1.25]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        style={{ y, scale }}
        className="absolute -inset-y-[15%] inset-x-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}

/** Element drifts toward the pointer while hovered. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });
  return (
    <motion.div
      className={`inline-block ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function PillButton({
  href,
  children,
  variant = "light",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "light" | "ghost" | "grad";
  className?: string;
}) {
  const styles = {
    light: "bg-bone text-void",
    ghost: "border border-bone/25 text-bone",
    grad: "bg-gradient-to-r from-brand via-lilac to-plum text-void",
  }[variant];
  const external = href.startsWith("http");
  return (
    <Magnetic>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-cursor="hover"
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold tracking-wide ${styles} ${className ?? ""}`}
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-plum transition-transform duration-700 ease-silk group-hover:translate-y-0" />
        <span className="relative flex items-center gap-3 transition-colors duration-500 group-hover:text-void">
          {children}
        </span>
      </a>
    </Magnetic>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
