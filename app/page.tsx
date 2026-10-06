import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import VideoCard from "@/components/VideoCard";
import { Arrow, ParallaxImage, Reveal, SpringButton, Stagger, StaggerItem } from "@/components/motion";
import { home, joinForm, site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  const { services, whatIs, movement, caregivers, la } = home;
  return (
    <>
      <Hero />

      {/* About */}
      <section className="container-x pb-24 lg:pb-32">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="font-display text-2xl leading-snug text-ink/85 sm:text-3xl lg:text-[2.6rem] lg:leading-[1.25]">
            {home.hero.about}
          </p>
        </Reveal>
      </section>

      {/* Pillars */}
      <section className="container-x pb-24 lg:pb-32">
        <Stagger className="grid gap-6 md:grid-cols-3" stagger={0.14}>
          {home.pillars.map((p) => (
            <StaggerItem key={p.title}>
              <Link
                href={p.href}
                className="group block overflow-hidden rounded-[28px] bg-white shadow-sm shadow-ink/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-ink/10"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-silk group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl text-ink">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{p.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand transition-all duration-500 group-hover:gap-4">
                    GET STARTED <Arrow />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Services */}
      <section className="bg-sand py-24 lg:py-32">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <Reveal>
              <p className="eyebrow">{services.eyebrow}</p>
              <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">{services.title}</h2>
            </Reveal>
            <Reveal delay={0.2} className="lg:pb-3">
              <ul className="flex flex-wrap gap-2">
                {services.conditions.map((c) => (
                  <li key={c} className="rounded-full border border-ink/10 bg-cream px-4 py-2 text-sm text-ink/75">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {services.items.map((s, i) => (
              <StaggerItem key={s.title} className="group">
                <div className="relative aspect-[27/23] overflow-hidden rounded-3xl">
                  <Image src={s.image} alt={s.title} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 font-display text-sm text-ink backdrop-blur">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-20">
            <div className="relative overflow-hidden rounded-[32px] bg-ink px-8 py-14 text-cream sm:px-14">
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-plum/40 blur-[90px]" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <p className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">{services.dementiaCta}</p>
                <SpringButton href="#contact" variant="light">
                  Get Started <Arrow />
                </SpringButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What is home care */}
      <section className="container-x grid gap-14 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        <ParallaxImage src="/images/holding-hands.jpg" alt="Caregiver holding a senior's hands" className="aspect-[4/5] rounded-[32px] lg:aspect-[5/6]" strength={50} />
        <div>
          <Reveal>
            <h2 className="h-display text-4xl sm:text-5xl">{whatIs.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">{whatIs.text}</p>
          </Reveal>
          <Stagger as="ol" className="mt-10 divide-y divide-ink/10 border-y border-ink/10" stagger={0.07}>
            {whatIs.items.map((it, i) => (
              <StaggerItem as="li" key={it} className="flex items-baseline gap-5 py-4">
                <span className="font-display text-sm text-plum">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink/85">{it}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Video */}
      <section className="container-x pb-24 lg:pb-32">
        <VideoCard href={site.video} />
      </section>

      {/* Movement */}
      <section className="relative overflow-hidden">
        <ParallaxImage src="/images/team-hands.jpg" alt="Hands joined in a circle forming hearts" className="h-[520px] sm:h-[600px]" strength={90} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-16 text-cream">
          <Reveal>
            <h2 className="max-w-3xl font-display text-4xl leading-tight sm:text-6xl">{movement.title}</h2>
            <p className="mt-5 max-w-xl text-lg text-cream/80">{movement.text}</p>
            <SpringButton href="/jobs" variant="light" className="mt-8">
              {movement.cta} <Arrow />
            </SpringButton>
          </Reveal>
        </div>
      </section>

      <Testimonials />

      {/* Caregivers */}
      <section className="bg-sand py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="h-display text-5xl sm:text-6xl">{caregivers.title}</h2>
              </Reveal>
              <div className="mt-10 grid grid-cols-2 gap-4">
                <ParallaxImage src="/images/care-chat.jpg" alt="Caregiver talking with a senior woman" className="aspect-[3/4] rounded-3xl" strength={30} sizes="25vw" />
                <ParallaxImage src="/images/started.jpg" alt="Caregiver combing a senior woman's hair" className="mt-12 aspect-[3/4] rounded-3xl" strength={45} sizes="25vw" />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {caregivers.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className={i === 0 ? "font-display text-2xl leading-snug text-ink sm:text-3xl" : "text-lg leading-relaxed text-ink/70"}>{p}</p>
              </Reveal>
            ))}
            <Reveal>
              <blockquote className="rounded-3xl border-l-4 border-plum bg-cream p-8 font-display text-xl italic leading-relaxed text-ink/85">
                {caregivers.closing}
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Los Angeles */}
      <section className="container-x grid gap-14 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="eyebrow">Locations</p>
            <h2 className="h-display mt-5 text-5xl sm:text-6xl">{la.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">{la.text}</p>
            <p className="mt-6 font-medium text-ink">
              {la.call.replace(site.phone + ".", "")}
              <a href={site.phoneHref} className="text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">
                {site.phone}
              </a>
              .
            </p>
          </Reveal>
        </div>
        <ParallaxImage src="/images/los-angeles.webp" alt="Palm-lined street in Los Angeles" className="order-1 aspect-[4/3] rounded-[32px] lg:order-2" strength={50} />
      </section>

      {/* Map */}
      <section className="container-x pb-24 lg:pb-32">
        <Reveal>
          <div className="overflow-hidden rounded-[32px] border border-ink/10 bg-white">
            <div className="grid lg:grid-cols-[1fr_2fr]">
              <div className="space-y-4 p-10">
                <p className="eyebrow">Contact Info</p>
                <p className="font-display text-2xl leading-snug">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </p>
                <p className="text-ink/70">
                  Phone : <a className="text-brand" href={site.phoneHref}>{site.phone}</a>
                  <br />
                  Fax : {site.fax}
                </p>
                <p className="text-sm text-ink/50">{site.license}</p>
              </div>
              <iframe
                title="Map: Better You Home Care, Burbank"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
                className="h-[360px] w-full border-0 lg:h-full lg:min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Join */}
      <section className="container-x pb-24 lg:pb-32">
        <div className="grid gap-12 rounded-[32px] bg-plum-soft p-8 sm:p-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="h-display text-4xl sm:text-5xl">{joinForm.title}</h2>
            {joinForm.lines.map((l) => (
              <p key={l} className="mt-4 text-lg text-ink/70">{l}</p>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <ContactForm subject="Job application" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
