import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = ["", "/alzheimers-and-dementia-services/", "/the-activity-of-daily-living/", "/a1/", "/l-a/", "/who-we-are/", "/contact-us/", "/jobs/", "/privacy-policy/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${site.url}${r}`, lastModified: new Date() }));
}
