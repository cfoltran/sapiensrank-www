import { routePath, type Locale } from "../i18n";
import { getSources } from "./guideSources";
import type { OS, Source } from "./guideTypes";

// One static page per (app, phone) pair, e.g. /guide-sante/garmin-iphone, so
// each search ("sync Garmin with Apple Health") lands on its own URL. The
// generic "autre" source stays on the hub page only.

const OS_SLUG: Record<OS, string> = { ios: "iphone", android: "android" };

export type GuidePage = { slug: string; source: Source; os: OS };

export function guideSlug(sourceId: string, os: OS): string {
  return `${sourceId}-${OS_SLUG[os]}`;
}

export function guidePagePath(locale: Locale, slug: string): string {
  return `${routePath("guide", locale)}/${slug}`;
}

export function getGuidePages(locale: Locale): GuidePage[] {
  return getSources(locale)
    .filter((source) => source.id !== "autre")
    .flatMap((source) =>
      source.platforms.map((os) => ({
        slug: guideSlug(source.id, os),
        source,
        os,
      })),
    );
}

export function getGuidePage(locale: Locale, slug: string): GuidePage | undefined {
  return getGuidePages(locale).find((page) => page.slug === slug);
}

/** Per-app page URLs keyed `${sourceId}-${os}`, for the hub's selector. */
export function guidePageHrefs(locale: Locale): Record<string, string> {
  return Object.fromEntries(
    getGuidePages(locale).map(({ slug, source, os }) => [
      `${source.id}-${os}`,
      guidePagePath(locale, slug),
    ]),
  );
}
