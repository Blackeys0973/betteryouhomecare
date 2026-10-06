"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { assist, nav, site } from "@/lib/site";
import ContactForm from "./ContactForm";
import { ScrollMark } from "./LogoMark";
import { Reveal, SplitWords } from "./motion";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "0%"]);
  return (
    <footer ref={ref} id="contact" className="relative overflow-hidden bg-void">
      <motion.div style={{ y }} className="relative">
        <div className="pointer-events-none absolute -left-40 top-0 h-[50vmax] w-[50vmax] rounded-full bg-brand/15 blur-[160px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[50vmax] w-[50vmax] rounded-full bg-plum/20 blur-[160px]" />
        <ScrollMark className="absolute -right-24 top-24 h-[34rem] w-[34rem] opacity-[0.06]" turns={0.4} drift={60} />

        <div className="wrap relative grid gap-16 border-t border-line pb-16 pt-28 lg:grid-cols-[1.3fr_1fr] lg:pt-40">
          <div>
            <p className="label">24/7</p>
            <h2 className="display mt-6 t-xl">
              <SplitWords text={assist.title} accent={[3, 4, 5]} />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-lg text-lg text-bone/65">{assist.text}</p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:pt-24">
            <ContactForm subject="Care request" />
          </Reveal>
        </div>

        <div className="wrap relative">
          <a href={site.phoneHref} className="group block border-y border-line py-10" data-cursor="hover">
            <span className="label">{assist.hotline.replace(site.phone, "").trim()}</span>
            <span className="display mt-4 block whitespace-nowrap t-xl transition-all duration-700 ease-silk group-hover:italic group-hover:text-lilac">
              {site.phone}
            </span>
          </a>
        </div>

        <div className="wrap relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <p className="text-sm leading-relaxed text-bone/60">{site.footerBlurb}</p>
            <div className="flex flex-wrap gap-2">
              {site.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-bone/20 px-4 py-2 text-xs text-bone/80 transition hover:border-bone hover:text-bone">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <p className="label mb-5">Quick Links</p>
            <ul className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {nav.flatMap((g) => g.children).map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-bone/70 transition hover:text-bone">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-5">Contact Info</p>
            <address className="space-y-3 text-sm not-italic text-bone/70">
              <p>
                Address:
                <br />
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
              <p>
                Phone : <a href={site.phoneHref} className="hover:text-bone">{site.phone}</a>
              </p>
              <p>Fax : {site.fax}</p>
            </address>
          </div>
        </div>

        <Reveal className="wrap relative flex justify-center border-t border-line py-16 sm:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-full.svg" alt={`${site.name} logo`} className="h-40 w-auto sm:h-56" />
        </Reveal>

        <div className="wrap relative flex flex-col gap-3 border-t border-line py-8 text-xs text-bone/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{site.copyright.replace(/\d{4}/, String(new Date().getFullYear()))}</p>
          <p>{site.license}</p>
          <Link href="/privacy-policy" className="hover:text-bone">Policy and Privacy</Link>
          <p>
            Made with <span className="text-plum" aria-label="love">♥</span> by Buzzhalo Studio
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
