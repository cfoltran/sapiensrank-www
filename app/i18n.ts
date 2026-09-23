import type { Metadata } from "next";

export const SITE_URL = "https://sapiensrank.com";
export const SITE_NAME = "Sapiens Rank";

export type Locale = "en" | "fr";

// Every public page and its URL per language. A page without a `fr` entry is
// English only (the legal texts), so it gets no hreflang pair.
export const ROUTES = {
  home: { en: "/", fr: "/fr" },
  guide: { en: "/health-guide", fr: "/guide-sante" },
  deleteAccount: { en: "/delete-account", fr: "/fr/supprimer-compte" },
  privacy: { en: "/privacy" },
  terms: { en: "/terms-and-conditions" },
} satisfies Record<string, { en: string; fr?: string }>;

export type RouteKey = keyof typeof ROUTES;

export function routePath(route: RouteKey, locale: Locale): string {
  const paths: { en: string; fr?: string } = ROUTES[route];
  return paths[locale] ?? paths.en;
}

/** hreflang map for a page, or undefined when it exists in one language. */
export function routeLanguages(route: RouteKey) {
  const paths: { en: string; fr?: string } = ROUTES[route];
  if (!paths.fr) return undefined;
  return { en: paths.en, fr: paths.fr, "x-default": paths.en };
}

export const STORE_LINKS = {
  ios: {
    en: "https://apps.apple.com/app/sapiensrank/id6771508578",
    fr: "https://apps.apple.com/fr/app/sapiensrank/id6771508578",
  },
  android: "https://play.google.com/store/apps/details?id=com.pommef.sapiensrank",
};

export const APP_STORE_ID = "6771508578";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", fr: "fr_FR" };

// 1200×630 share cards in /public, one per language.
const OG_IMAGE: Record<Locale, { url: string; alt: string }> = {
  en: {
    url: "/og-en.png",
    alt: "Sapiens Rank, the fitness game that turns your health into conquest",
  },
  fr: {
    url: "/og-fr.png",
    alt: "Sapiens Rank, le jeu fitness qui transforme votre santé en conquête",
  },
};

/**
 * Page-level metadata: canonical, hreflang and social cards. Open Graph is
 * replaced (not merged) by the page, so it is rebuilt here in full.
 */
export function pageMetadata({
  route,
  locale,
  title,
  description,
  absoluteTitle = false,
}: {
  route: RouteKey;
  locale: Locale;
  title: string;
  description: string;
  /** Skip the "· Sapiens Rank" suffix (the title already carries the brand). */
  absoluteTitle?: boolean;
}): Metadata {
  const path = routePath(route, locale);
  const languages = routeLanguages(route);
  const socialTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title: socialTitle,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: languages
        ? OG_LOCALE[locale === "en" ? "fr" : "en"]
        : undefined,
      images: [{ ...OG_IMAGE[locale], width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE[locale]],
    },
  };
}
