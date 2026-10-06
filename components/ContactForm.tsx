"use client";

import { Magnetic } from "./motion";

// The original site's forms post to WordPress. Set NEXT_PUBLIC_FORM_ENDPOINT
// (e.g. a Formspree URL) on Vercel so submissions reach the business.
const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

const field =
  "w-full border-0 border-b border-bone/20 bg-transparent px-0 py-4 text-lg text-bone outline-none transition-colors placeholder:text-bone/35 focus:border-lilac focus:ring-0";

export default function ContactForm({ subject }: { subject: string }) {
  const id = subject.replace(/\s+/g, "-").toLowerCase();
  return (
    <form action={endpoint} method="POST" className="grid gap-2">
      <input type="hidden" name="_subject" value={subject} />
      <label className="sr-only" htmlFor={`${id}-name`}>Name</label>
      <input id={`${id}-name`} name="name" required placeholder="Name" className={field} />
      <label className="sr-only" htmlFor={`${id}-email`}>Email</label>
      <input id={`${id}-email`} name="email" type="email" required placeholder="Email" className={field} />
      <label className="sr-only" htmlFor={`${id}-message`}>Message</label>
      <textarea id={`${id}-message`} name="message" rows={3} placeholder="Message" className={`${field} resize-none`} />
      <div className="mt-6">
        <Magnetic>
          <button type="submit" className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-bone text-sm font-semibold text-void">
            <span className="absolute inset-0 scale-0 rounded-full bg-plum transition-transform duration-700 ease-silk group-hover:scale-100" />
            <span className="relative">Send</span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}
