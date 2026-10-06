"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { Magnetic, PhoneIcon, expo, silk } from "./motion";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 200 && !open);
  });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const links = [{ label: "Home", href: "/" }, ...nav.flatMap((g) => g.children)];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.8, ease: silk }}
        className="fixed inset-x-0 top-0 z-[80] mix-blend-normal"
      >
        <div className="flex h-20 items-center justify-between px-5 sm:px-10">
          <Link href="/" className="relative block h-10 w-[78px] overflow-hidden rounded-lg bg-white" aria-label={site.name}>
            <Image src="/images/logo.png" alt={`${site.name} logo`} fill sizes="78px" className="object-contain p-1" priority />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Magnetic>
              <a href={site.phoneHref} className="hidden items-center gap-2 rounded-full border border-bone/20 bg-void/40 px-5 py-3 text-sm font-medium backdrop-blur-md transition hover:border-bone/60 sm:inline-flex">
                <PhoneIcon /> {site.phone}
              </a>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="flex items-center gap-3 rounded-full bg-bone px-5 py-3 text-sm font-semibold text-void"
              >
                <span className="relative block h-3 w-5">
                  <span className={`absolute left-0 h-[1.5px] w-5 bg-void transition-all duration-500 ease-silk ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 h-[1.5px] w-5 bg-void transition-all duration-500 ease-silk ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
                </span>
                <span className="w-10 text-left">{open ? "Close" : "Menu"}</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 80px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 80px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 80px) 40px)" }}
            transition={{ duration: 1, ease: expo }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-plum-deep"
          >
            <div className="pointer-events-none absolute -right-40 top-20 h-[60vmax] w-[60vmax] rounded-full bg-plum/30 blur-[140px]" />
            <div className="relative grid min-h-full gap-10 px-5 pb-10 pt-28 sm:px-10 lg:grid-cols-[1.6fr_1fr]">
              <ul className="space-y-1">
                {links.map((l, i) => (
                  <li key={l.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.9, ease: silk, delay: 0.25 + i * 0.05 }}
                    >
                      <Link href={l.href} className="group flex items-baseline gap-4 py-1">
                        <span className="label w-8">{String(i + 1).padStart(2, "0")}</span>
                        <span className="display t-lg transition-all duration-500 ease-silk group-hover:translate-x-4 group-hover:italic group-hover:text-lilac">
                          {l.label}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: silk }}
                className="flex flex-col justify-end gap-8 text-bone/75"
              >
                <div>
                  <p className="label mb-3">Contact Info</p>
                  <p>
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                  </p>
                  <a href={site.phoneHref} className="display mt-4 block text-4xl text-bone">
                    {site.phone}
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {site.social.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-bone/20 px-4 py-2 text-xs hover:border-bone">
                      {s.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
