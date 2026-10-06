"use client";

import { motion } from "framer-motion";

// The original site's forms post to WordPress. Set NEXT_PUBLIC_FORM_ENDPOINT
// (e.g. a Formspree URL) on Vercel so submissions reach the business.
const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export default function ContactForm({ subject, dark = false }: { subject: string; dark?: boolean }) {
  const field = dark
    ? "border-cream/20 bg-white/5 text-cream placeholder:text-cream/50 focus:border-cream/60"
    : "border-ink/15 bg-white text-ink placeholder:text-ink/40 focus:border-brand";
  return (
    <form action={endpoint} method="POST" className="grid gap-4">
      <input type="hidden" name="_subject" value={subject} />
      <label className="sr-only" htmlFor={`${subject}-name`}>Name</label>
      <input id={`${subject}-name`} name="name" required placeholder="Name" className={`rounded-2xl border px-5 py-4 text-sm outline-none transition-colors ${field}`} />
      <label className="sr-only" htmlFor={`${subject}-email`}>Email</label>
      <input id={`${subject}-email`} name="email" type="email" required placeholder="Email" className={`rounded-2xl border px-5 py-4 text-sm outline-none transition-colors ${field}`} />
      <label className="sr-only" htmlFor={`${subject}-message`}>Message</label>
      <textarea id={`${subject}-message`} name="message" rows={4} placeholder="Message" className={`resize-none rounded-2xl border px-5 py-4 text-sm outline-none transition-colors ${field}`} />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className={`justify-self-start rounded-full px-8 py-3.5 text-sm font-semibold ${dark ? "bg-cream text-ink" : "bg-ink text-cream"}`}
      >
        Send
      </motion.button>
    </form>
  );
}
