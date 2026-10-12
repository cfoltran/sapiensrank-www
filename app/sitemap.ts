import type { MetadataRoute } from "next";
import {
  ROUTES,
  SITE_URL,
  languagesFor,
  routeLanguages,
  type Locale,
  type RouteKey,
} from "./i18n";
import { getGuidePages, guidePagePath } from "./components/guidePages";
import { GOALS, goalPath } from "./pace/pace";

// Written once at build time: the site is a static export.
export const dynamic = "force-static";

const INDEXED: { route: RouteKey; priority: number }[] = [
  { route: "home", priority: 1 },
  { route: "guide", priority: 0.8 },
  { route: "pace", priority: 0.8 },
  { route: "deleteAccount", priority: 0.2 },
  { route: "privacy", priority: 0.2 },
  { route: "terms", priority: 0.2 },
];

const absolute = (path: string) => SITE_URL + path;

const absoluteLanguages = (languages: Record<string, string>) => ({
  languages: Object.fromEntries(
    Object.entries(languages).map(([lang, path]) => [lang, absolute(path)]),
  ),
});

/** One entry per language for a page built from data, paired by hreflang. */
function pairedEntries(paths: Record<Locale, string>, priority: number, lastModified: Date) {
  const alternates = absoluteLanguages(languagesFor(paths));
  return Object.values(paths).map((path) => ({
    url: absolute(path),
    lastModified,
    priority,
    alternates,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = INDEXED.flatMap(({ route, priority }) => {
    const languages = routeLanguages(route);
    const alternates = languages && absoluteLanguages(languages);
    return Object.values(ROUTES[route]).map((path) => ({
      url: absolute(path),
      lastModified,
      priority,
      alternates,
    }));
  });

  const guides = getGuidePages("en").flatMap(({ slug }) =>
    pairedEntries(
      { en: guidePagePath("en", slug), fr: guidePagePath("fr", slug) },
      0.7,
      lastModified,
    ),
  );

  // Goal slugs differ per language (semi-marathon / half-marathon).
  const goals = GOALS.flatMap((goal) =>
    pairedEntries({ en: goalPath(goal, "en"), fr: goalPath(goal, "fr") }, 0.6, lastModified),
  );

  return [...routes, ...guides, ...goals];
}
