import type { MetadataRoute } from "next";
import { SITE_URL } from "./i18n";

// Written once at build time: the site is a static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
