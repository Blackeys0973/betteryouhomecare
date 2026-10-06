import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/site";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["opsz", "SOFT"] });
const sans = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans" });

const description =
  "Our team of caregivers are highly trained and they are available 24/7 to make sure your loved one will have all the attention and care they deserve.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s – Better You home care` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Better You home care",
    title: site.title,
    description,
    url: site.url,
    images: [{ url: "/images/hug.jpg", width: 748, height: 421, alt: site.name }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.title, description, images: ["/images/hug.jpg"] },
};

export const viewport: Viewport = { themeColor: "#faf7f2", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeHealthCareService",
  name: site.name,
  url: site.url,
  telephone: "+1-424-465-0394",
  faxNumber: "+1-424-543-1049",
  image: `${site.url}/images/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "300 N 3rd St Suite 246",
    addressLocality: "Burbank",
    addressRegion: "CA",
    postalCode: "91502",
    addressCountry: "US",
  },
  areaServed: "Los Angeles County",
  openingHours: "Mo-Su 00:00-23:59",
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
