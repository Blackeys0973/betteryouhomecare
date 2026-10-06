import ContactForm from "./ContactForm";
import Marquee from "./Marquee";
import { Arrow, ParallaxImage, PillButton, Reveal, ScrollFillText, Stagger, StaggerItem } from "./motion";
import PageTitle from "./PageTitle";
import { site } from "@/lib/site";

type Feature = { title: string; text: string };

export default function InnerPage({
  eyebrow,
  title,
  paragraphs,
  image,
  imageAlt,
  features,
  featuresTitle,
  featuresText,
  cta = { label: "Get Started", href: "#contact" },
  form,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  features?: Feature[];
  featuresTitle?: string;
  featuresText?: string;
  cta?: { label: string; href: string };
  form?: { title: string; lines: string[] };
}) {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-40 sm:pt-48">
        <div className="pointer-events-none absolute -right-40 top-0 h-[50vmax] w-[50vmax] rounded-full bg-plum/15 blur-[140px]" />
        <div className="wrap relative">
          <PageTitle eyebrow={eyebrow} title={title} />
        </div>
      </section>

      <section className="px-5 sm:px-10">
        <ParallaxImage src={image} alt={imageAlt} className="h-[70svh] rounded-[28px]" strength={90} priority sizes="100vw" />
      </section>

      <section className="wrap grid gap-12 py-28 lg:grid-cols-[220px_1fr] lg:py-40">
        <p className="label pt-3">{eyebrow}</p>
        <div className="space-y-10">
          {paragraphs.map((p, i) => (
            <ScrollFillText key={i} text={p} className={i === 0 ? "display text-[clamp(1.9rem,3.4vw,3.4rem)] leading-[1.1]" : "text-xl leading-relaxed"} />
          ))}
          <Reveal className="flex flex-wrap gap-3 pt-4">
            <PillButton href={cta.href}>
              {cta.label} <Arrow />
            </PillButton>
            <PillButton href={site.phoneHref} variant="ghost">
              {site.phone}
            </PillButton>
          </Reveal>
        </div>
      </section>

      {features && (
        <>
          <div className="border-y border-line">
            <Marquee items={features.map((f) => f.title)} outline />
          </div>
          <section className="wrap py-28 lg:py-36">
            {featuresTitle && (
              <Reveal className="mb-16 max-w-3xl">
                <h2 className="display text-[clamp(2.6rem,5.5vw,5.5rem)]">{featuresTitle}</h2>
                {featuresText && <p className="mt-6 text-lg text-bone/70">{featuresText}</p>}
              </Reveal>
            )}
            <Stagger className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
              {features.map((f, i) => (
                <StaggerItem key={f.title} className="group border-b border-line py-10 sm:border-r sm:px-8 sm:first:pl-0">
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-8 text-4xl transition-all duration-500 ease-silk group-hover:italic group-hover:text-lilac">{f.title}</h3>
                  <p className="mt-4 leading-relaxed text-bone/65">{f.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </>
      )}

      {form && (
        <section id="join" className="wrap scroll-mt-24 pb-32">
          <div className="grid gap-12 rounded-[32px] bg-plum-deep p-8 sm:p-14 lg:grid-cols-2">
            <Reveal>
              <h2 className="display text-[clamp(2.8rem,5.5vw,5.5rem)]">{form.title}</h2>
              {form.lines.map((l) => (
                <p key={l} className="mt-4 text-lg text-bone/70">{l}</p>
              ))}
            </Reveal>
            <Reveal delay={0.15}>
              <ContactForm subject="Job application" />
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
