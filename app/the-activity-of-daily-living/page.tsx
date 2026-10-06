import type { Metadata } from "next";
import InnerPage from "@/components/InnerPage";
import { pages } from "@/lib/site";

const p = pages.adl;

export const metadata: Metadata = {
  title: p.meta,
  description: p.paragraphs[0].slice(0, 155),
  alternates: { canonical: "/the-activity-of-daily-living/" },
  openGraph: { title: `${p.meta} – Better You home care`, images: [p.image] },
};

export default function Page() {
  return (
    <InnerPage
      eyebrow="Services"
      title={p.title}
      paragraphs={p.paragraphs}
      image={p.image}
      imageAlt="Caregiver smiling with a senior woman"
      features={p.features}
    />
  );
}
