import ContactForm from "./ContactForm";
import { Arrow, ParallaxImage, Reveal, SpringButton, Stagger, StaggerItem } from "./motion";
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
      <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-plum/15 blur-[110px]" />
        <div className="container-x relative">
          <PageTitle eyebrow={eyebrow} title={title} />
        </div>
      </section>

      <section className="container-x grid gap-14 pb-24 lg:grid-cols-[1.1fr_1fr] lg:pb-32">
        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.06}>
              <p className={i === 0 ? "text-xl leading-relaxed text-ink/85" : "text-lg leading-relaxed text-ink/70"}>{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.3} className="flex flex-wrap gap-4 pt-4">
            <SpringButton href={cta.href}>
              {cta.label} <Arrow />
            </SpringButton>
            <SpringButton href={site.phoneHref} variant="ghost">
              {site.phone}
            </SpringButton>
          </Reveal>
        </div>
        <ParallaxImage src={image} alt={imageAlt} className="aspect-[4/3] rounded-[32px] lg:sticky lg:top-28 lg:aspect-[4/5]" strength={40} priority />
      </section>

      {features && (
        <section className="bg-sand py-24 lg:py-32">
          <div className="container-x">
            {featuresTitle && (
              <Reveal className="mb-14 max-w-2xl">
                <h2 className="h-display text-4xl sm:text-5xl">{featuresTitle}</h2>
                {featuresText && <p className="mt-5 text-lg text-ink/70">{featuresText}</p>}
              </Reveal>
            )}
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
              {features.map((f, i) => (
                <StaggerItem key={f.title}>
                  <div className="group h-full rounded-3xl bg-cream p-8 transition-all duration-500 ease-silk hover:-translate-y-1.5 hover:bg-white hover:shadow-xl hover:shadow-ink/10">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-soft font-display text-lg text-plum transition-colors duration-500 group-hover:bg-ink group-hover:text-cream">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-6 font-display text-2xl">{f.title}</h3>
                    <p className="mt-3 leading-relaxed text-ink/65">{f.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {form && (
        <section id="join" className="container-x scroll-mt-24 py-24 lg:py-32">
          <div className="grid gap-12 rounded-[32px] bg-plum-soft p-8 sm:p-14 lg:grid-cols-2">
            <Reveal>
              <h2 className="h-display text-4xl sm:text-5xl">{form.title}</h2>
              {form.lines.map((l) => (
                <p key={l} className="mt-4 text-lg text-ink/70">{l}</p>
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

