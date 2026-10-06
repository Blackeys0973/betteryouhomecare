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
    <section className="wrap pb-32 pt-40 sm:pt-48">
      <PageTitle eyebrow="Policy and Privacy" title="Privacy Policy" />
      <div className="mt-14 max-w-3xl space-y-5 text-bone/70">
        {(privacy as string[]).map((line, i) =>
          headings.has(line) ? (
            <h2 key={i} className="pt-6 display text-4xl text-bone">{line}</h2>
          ) : (
            <p key={i} className="leading-relaxed">{line}</p>
          ),
        )}
      </div>
    </section>
  );
}
