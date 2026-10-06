"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { silk } from "./motion";

const KEY = "byhc-cookie-consent";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (stored) return;
    // Wait for the preloader to finish.
    const t = setTimeout(() => setOpen(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.9, ease: silk }}
          className="fixed inset-x-4 bottom-4 z-[70] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[420px]"
        >
          <div className="rounded-[22px] border border-line bg-white/90 p-6 shadow-[0_30px_80px_-30px_rgba(19,35,58,0.4)] backdrop-blur-md">
            <p className="label">Cookies</p>
            <p className="mt-3 text-sm leading-relaxed text-bone/70">
              We use cookies to make this site work and to improve your experience. You can accept or decline non-essential cookies.{" "}
              <Link href="/privacy-policy" className="text-brand underline underline-offset-4">
                Learn more
              </Link>
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => choose("accepted")}
                data-cursor="hover"
                className="rounded-full bg-bone px-5 py-2.5 text-xs font-semibold tracking-wide text-void transition-colors duration-500 hover:bg-brand"
              >
                Accept
              </button>
              <button
                onClick={() => choose("declined")}
                data-cursor="hover"
                className="rounded-full border border-bone/20 px-5 py-2.5 text-xs font-semibold tracking-wide text-bone transition-colors duration-500 hover:border-bone/50"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
