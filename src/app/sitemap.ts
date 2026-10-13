import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "gems/", "arenas/", "ranks/", "rules/", "faq/"].map((p) => ({ url: `${SITE.url}/${p}` }));
}
