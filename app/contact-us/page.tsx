import type { Metadata } from "next";
import InnerPage from "@/components/InnerPage";
import { pages } from "@/lib/site";

const p = pages.contact;

export const metadata: Metadata = {
  title: p.meta,
  description: p.paragraphs[0].slice(0, 155),
  alternates: { canonical: "/contact-us/" },
  openGraph: { title: `${p.meta} – Better You home care`, images: [p.image] },
};

export default function Page() {
  return (
    <InnerPage
      eyebrow="About Us"
      title={p.title}
      paragraphs={p.paragraphs}
      image={p.image}
      imageAlt="Caregiver talking with a senior woman"
      
    />
  );
}
