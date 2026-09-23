import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "../dictionaries";
import { routePath, type Locale, type RouteKey } from "../i18n";

export default function Header({
  locale = "en",
  route,
}: {
  locale?: Locale;
  /** Current page, used to point the language switch at its translation. */
  route?: RouteKey;
}) {
  const t = getDictionary(locale).header;
  const other: Locale = locale === "en" ? "fr" : "en";
  // Pages that exist in one language only switch to the other home page.
  const switchHref = routePath(
    route && routePath(route, other) !== routePath(route, locale) ? route : "home",
    other,
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
      <Link href={routePath("home", locale)} aria-label={t.home} className="flex items-center gap-2">
        <Image src="/AppIcon.png" alt="" width={28} height={28} className="rounded-md" />
        <span className="text-sm font-semibold tracking-tight text-white">Sapiens Rank</span>
      </Link>
      <a
        href={switchHref}
        hrefLang={other}
        lang={other}
        aria-label={t.switchLabel}
        className="text-xs font-semibold tracking-widest text-gray-500 hover:text-white transition-colors"
      >
        {t.switchShort}
      </a>
    </nav>
  );
}
