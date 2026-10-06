import Image from "next/image";
import Link from "next/link";
import { assist, nav, site } from "@/lib/site";
import ContactForm from "./ContactForm";
import { Reveal } from "./motion";

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-plum/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-brand/30 blur-[120px]" />

      <div className="container-x relative grid gap-14 py-20 lg:grid-cols-2 lg:py-28">
        <Reveal>
          <p className="eyebrow !text-plum-soft before:!bg-plum-soft/60">24/7</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">{assist.title}</h2>
          <p className="mt-6 max-w-md text-cream/75">{assist.text}</p>
          <a href={site.phoneHref} className="mt-8 inline-block font-display text-2xl text-cream underline decoration-plum/60 underline-offset-8 transition hover:decoration-plum">
            {assist.hotline}
          </a>
        </Reveal>
        <Reveal delay={0.15}>
          <ContactForm subject="Care request" dark />
        </Reveal>
      </div>

      <div className="container-x relative grid gap-12 border-t border-cream/10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <div className="relative h-14 w-[108px] rounded-xl bg-cream p-2">
            <Image src="/images/logo.png" alt={`${site.name} logo`} fill sizes="108px" className="object-contain p-1.5" />
          </div>
          <p className="text-sm leading-relaxed text-cream/70">{site.footerBlurb}</p>
          <div className="flex flex-wrap gap-2">
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/20 px-4 py-2 text-xs font-medium text-cream/80 transition hover:border-cream hover:text-cream"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-cream/50">Quick Links</p>
          <ul className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {nav.flatMap((g) => g.children).map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-cream/80 transition hover:text-cream">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-cream/50">Contact Info</p>
          <address className="space-y-3 text-sm not-italic text-cream/80">
            <p>
              Address:
              <br />
              {site.address.line1}
              <br />
              {site.address.line2}
            </p>
            <p>
              Phone : <a href={site.phoneHref} className="hover:text-cream">{site.phone}</a>
            </p>
            <p>Fax : {site.fax}</p>
          </address>
        </div>
      </div>

      <div className="container-x relative flex flex-col gap-3 border-t border-cream/10 py-8 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
        <p>{site.copyright}</p>
        <p>{site.license}</p>
        <Link href="/privacy-policy" className="hover:text-cream">Policy and Privacy</Link>
      </div>
    </footer>
  );
}
