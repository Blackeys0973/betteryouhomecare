import Image from "next/image";
import ClipReveal from "@/components/ClipReveal";
import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import HorizontalPillars from "@/components/HorizontalPillars";
import HoverList from "@/components/HoverList";
import { ScrollMark } from "@/components/LogoMark";
import Marquee from "@/components/Marquee";
import PhotoRing from "@/components/PhotoRing";
import StackedServices from "@/components/StackedServices";
import Testimonials from "@/components/Testimonials";
import { Arrow, Magnetic, ParallaxImage, PillButton, Reveal, ScrollFillText, SplitWords } from "@/components/motion";
import { home, joinForm, site } from "@/lib/site";

export default function HomePage() {
  const { services, whatIs, movement, caregivers, la } = home;
  return (
    <>
      <Hero />

      {/* Statement */}
      <section className="wrap py-28 text-center lg:py-40">
        <ScrollMark className="mx-auto mb-8 h-14 w-14" turns={1} drift={20} />
        <p className="label">About Us</p>
        <ScrollFillText text={home.hero.about} className="display t-lg mx-auto mt-8 max-w-4xl !leading-[1.3]" />
      </section>

      <div className="border-y border-line">
        <Marquee items={services.items.map((s) => s.title)} outline />
      </div>

      <HorizontalPillars />

      <section className="pt-24">
        <div className="wrap mb-6 flex items-end justify-between">
          <p className="label">{services.eyebrow}</p>
          <p className="label">0{services.items.length}</p>
        </div>
        <StackedServices />
      </section>

      {/* Conditions + dementia CTA */}
      <section className="wrap grid gap-16 py-32 lg:grid-cols-2 lg:py-44">
        <div>
          <h2 className="display t-lg">
            <SplitWords text={services.dementiaCta} accent={[7, 8, 9, 10, 11]} />
          </h2>
          <Reveal delay={0.3} className="mt-10">
            <PillButton href="#contact" variant="grad">
              Get Started <Arrow />
            </PillButton>
          </Reveal>
        </div>
        <ul className="self-end border-t border-line">
          {services.conditions.map((c, i) => (
            <Reveal key={c} delay={i * 0.06}>
              <li className="flex gap-6 border-b border-line py-5 text-lg text-bone/80">
                <span className="label pt-1.5">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* What is home care */}
      <section className="wrap py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 className="display t-xl">
            <SplitWords text={whatIs.title} accent={[3]} />
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-xl text-lg leading-relaxed text-bone/70">{whatIs.text}</p>
          </Reveal>
        </div>
        <div className="mt-16">
          <HoverList
            items={whatIs.items}
            images={["/images/started.jpg", "/images/forehead.jpg", "/images/shoulder.jpg", "/images/caregiver-man.jpg", "/images/care-chat.jpg", "/images/holding-hands.jpg"]}
          />
        </div>
      </section>

      {/* Video */}
      <section className="wrap pb-32">
        <a href={site.video} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="group relative block aspect-[16/9] overflow-hidden rounded-[28px]" aria-label="Watch our service overview video on YouTube">
          <div className="absolute inset-0">
            <ParallaxImage src="/images/video-cover.png" alt="Watch our service overview video" className="h-full w-full" strength={60} sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-void/10 transition-colors duration-700 group-hover:bg-void/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Magnetic strength={0.5}>
              <span className="flex h-28 w-28 items-center justify-center rounded-full bg-bone text-void transition-transform duration-700 ease-silk group-hover:scale-125 sm:h-36 sm:w-36">
                <svg width="30" height="30" viewBox="0 0 24 24" className="ml-1" aria-hidden>
                  <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
                </svg>
              </span>
            </Magnetic>
          </div>
        </a>
      </section>

      {/* Movement */}
      <ClipReveal src="/images/team-hands.jpg" alt="Hands joined in a circle forming hearts">
        <div className="pointer-events-auto grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <h2 className="display t-xl">
            {movement.title.split(". ")[0]}. <span className="italic grad">{movement.title.split(". ")[1]}</span>
          </h2>
          <div>
            <p className="max-w-md text-lg text-bone/80">{movement.text}</p>
            <div className="mt-8">
              <PillButton href="/jobs">
                {movement.cta} <Arrow />
              </PillButton>
            </div>
          </div>
        </div>
      </ClipReveal>

      {/* Caregivers */}
      <PhotoRing>
        <p className="label mb-6">Better You</p>
        <h2 className="display t-xl">
          {caregivers.title.split(" ")[0]} <span className="italic grad">{caregivers.title.split(" ")[1]}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-bone/70">{caregivers.paragraphs[0]}</p>
      </PhotoRing>

      <section className="wrap grid gap-16 py-32 lg:grid-cols-[1fr_1.2fr] lg:py-44">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-24">
            <ParallaxImage src="/images/care-chat.jpg" alt="Caregiver talking with a senior woman" className="aspect-[3/4] rounded-2xl" strength={40} sizes="25vw" />
            <ParallaxImage src="/images/started.jpg" alt="Caregiver combing a senior woman's hair" className="mt-20 aspect-[3/4] rounded-2xl" strength={70} sizes="25vw" />
          </div>
        </div>
        <div className="space-y-12">
          {caregivers.paragraphs.slice(1).map((p, i) => (
            <ScrollFillText key={i} text={p} className={i === 0 ? "display t-sm leading-[1.1]" : "text-xl leading-relaxed text-bone"} />
          ))}
          <Reveal>
            <blockquote className="border-l-2 border-lilac pl-8 font-display text-2xl italic leading-snug text-bone/85 sm:text-3xl">{caregivers.closing}</blockquote>
          </Reveal>
        </div>
      </section>

      <Testimonials />

      {/* Los Angeles */}
      <ClipReveal src="/images/los-angeles.webp" alt="Palm-lined street in Los Angeles">
        <div className="pointer-events-auto grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <h2 className="display t-xl">
            Los Angeles <span className="italic grad">County</span>
          </h2>
          <div>
            <p className="text-base leading-relaxed text-bone/80">{la.text}</p>
            <p className="mt-5 text-bone">
              {la.call.replace(site.phone + ".", "")}
              <a href={site.phoneHref} className="text-lilac underline underline-offset-4">{site.phone}</a>.
            </p>
          </div>
        </div>
      </ClipReveal>

      {/* Map */}
      <section className="wrap py-28">
        <Reveal>
          <div className="grid overflow-hidden rounded-[28px] border border-line lg:grid-cols-[1fr_2fr]">
            <div className="space-y-5 bg-surface p-10">
              <p className="label">Contact Info</p>
              <p className="display text-4xl leading-tight">
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
              <p className="text-bone/70">
                Phone : <a className="text-lilac" href={site.phoneHref}>{site.phone}</a>
                <br />
                Fax : {site.fax}
              </p>
            </div>
            <iframe
              title="Map: Better You Home Care, Burbank"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
              className="h-[380px] w-full border-0 lg:h-full lg:min-h-[420px]"
              style={{ filter: "saturate(0.85)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>

      {/* Join */}
      <section className="wrap pb-32">
        <div className="relative grid gap-12 overflow-hidden rounded-[32px] bg-plum-deep p-8 sm:p-14 lg:grid-cols-2">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-plum/30 blur-[100px]" />
          <ScrollMark className="absolute -right-16 top-10 h-72 w-72 opacity-[0.07] lg:right-[40%]" turns={0.6} />
          <div className="relative">
            <h2 className="display t-lg">
              <SplitWords text={joinForm.title} accent={[3]} />
            </h2>
            {joinForm.lines.map((l) => (
              <p key={l} className="mt-4 text-lg text-bone/70">{l}</p>
            ))}
            <div className="relative mt-10 hidden aspect-[2/1] overflow-hidden rounded-2xl lg:block">
              <Image src="/images/thumbs-up.webp" alt="Healthcare workers giving a thumbs up" fill sizes="40vw" className="object-cover" />
            </div>
          </div>
          <div className="relative">
            <ContactForm subject="Job application" />
          </div>
        </div>
      </section>
    </>
  );
}
