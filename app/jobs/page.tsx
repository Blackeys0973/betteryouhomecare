import type { Metadata } from "next";
import InnerPage from "@/components/InnerPage";
import { pages, joinForm } from "@/lib/site";

const p = pages.jobs;

export const metadata: Metadata = {
  title: p.meta,
  description: p.paragraphs[0].slice(0, 155),
  alternates: { canonical: "/jobs/" },
  openGraph: { title: `${p.meta} – Better You home care`, images: [p.image] },
};

export default function Page() {
  return (
    <InnerPage
      eyebrow="About Us"
      title={p.title}
      paragraphs={p.paragraphs}
      image={p.image}
      imageAlt="Healthcare workers giving a thumbs up"
      features={p.features} featuresTitle={p.featuresTitle} featuresText={p.featuresText} cta={{ label: "Join Us", href: "#join" }} form={joinForm}
    />
  );
}
