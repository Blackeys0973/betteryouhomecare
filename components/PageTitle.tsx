"use client";

import { SplitWords } from "./motion";

export default function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  const n = title.split(" ").length;
  return (
    <>
      <p className="label">{eyebrow}</p>
      <h1 className="display mt-8 max-w-[14ch] text-[clamp(3.4rem,10vw,11rem)]">
        <SplitWords text={title} inView={false} delay={0.2} stagger={0.08} accent={[n - 1]} />
      </h1>
    </>
  );
}
