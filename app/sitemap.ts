import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL, routeLanguages, type RouteKey } from "./i18n";

// Written once at build time: the site is a static export.
export const dynamic = "force-static";

const INDEXED: { route: RouteKey; priority: number }[] = [
  { route: "home", priority: 1 },
  { route: "guide", priority: 0.8 },
  { route: "deleteAccount", priority: 0.2 },
  { route: "privacy", priority: 0.2 },
  { route: "terms", priority: 0.2 },
];

const absolute = (path: string) => SITE_URL + path;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return INDEXED.flatMap(({ route, priority }) => {
    const languages = routeLanguages(route);
    const alternates = languages && {
      languages: Object.fromEntries(
        Object.entries(languages).map(([lang, path]) => [lang, absolute(path)]),
      ),
    };
    return Object.values(ROUTES[route]).map((path) => ({
      url: absolute(path),
      lastModified,
      priority,
      alternates,
    }));
  });
}
