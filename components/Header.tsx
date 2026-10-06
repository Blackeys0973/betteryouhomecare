"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import { PhoneIcon, silk } from "./motion";

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: silk, delay: 0.15 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-silk ${
        scrolled ? "bg-cream/85 shadow-[0_1px_0_rgba(11,37,64,0.08)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href="/" className="relative block h-11 w-[86px] shrink-0" aria-label={site.name}>
          <Image src="/images/logo.png" alt={`${site.name} logo`} fill sizes="86px" className="object-contain" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHover(null)}>
          {nav.map((group) => (
            <div key={group.label} className="relative" onMouseEnter={() => setHover(group.label)}>
              <button className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink">
                {group.label}
              </button>
              <AnimatePresence>
                {hover === group.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="absolute left-0 top-full w-80 pt-2"
                  >
                    <div className="rounded-2xl border border-ink/5 bg-white p-2 shadow-xl shadow-ink/10">
                      {group.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block rounded-xl px-4 py-3 text-sm text-ink/80 transition-colors hover:bg-sand hover:text-ink"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            href={site.phoneHref}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream sm:inline-flex"
          >
            <PhoneIcon /> {site.phone}
          </motion.a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: silk }}
            className="overflow-hidden border-t border-ink/10 bg-cream lg:hidden"
          >
            <div className="container-x space-y-6 py-6">
              {nav.map((group, gi) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * gi + 0.1, duration: 0.5, ease: silk }}
                >
                  <p className="eyebrow mb-2">{group.label}</p>
                  {group.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 font-display text-xl text-ink"
                    >
                      {c.label}
                    </Link>
                  ))}
                </motion.div>
              ))}
              <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream">
                <PhoneIcon /> {site.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
