import type { Metadata } from "next";
import PageTitle from "@/components/PageTitle";
import privacy from "@/lib/privacy.json";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy/" } };

const headings = new Set([
  "Cookie Policy Site Name",
  "What are cookies?",
  "How do we use cookies?",
  "Disable cookies",
  "Cookies we set",
  "Third Party Cookies",
  "User Engagement",
  "More information",
]);

export default function Privacy() {
  return (
    <section className="container-x pb-24 pt-36 sm:pt-44">
      <PageTitle eyebrow="Policy and Privacy" title="Privacy Policy" />
      <div className="mt-14 max-w-3xl space-y-5 text-ink/75">
        {(privacy as string[]).map((line, i) =>
          headings.has(line) ? (
            <h2 key={i} className="pt-6 font-display text-2xl text-ink">{line}</h2>
          ) : (
            <p key={i} className="leading-relaxed">{line}</p>
          ),
        )}
      </div>
    </section>
  );
}
