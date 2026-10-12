import Link from "next/link";
import Header from "./Header";
import JsonLd from "./JsonLd";
import Footer from "./Footer";
import StoreBadges from "./StoreBadges";
import GuideArticle, { OS_LABEL, SourceLogo, providedMetrics } from "./GuideArticle";
import { getGuideLabels } from "./guideSources";
import {
  getGuidePages,
  guidePagePath,
  guideSlug,
  type GuidePage,
} from "./guidePages";
import { getDictionary } from "../dictionaries";
import { SITE_URL, routePath, type Locale } from "../i18n";

/** "pas, calories et sommeil": the metrics this source sends, as prose. */
function dataPhrase(page: GuidePage, locale: Locale): string {
  const t = getDictionary(locale).guidePage;
  const names = providedMetrics(page.source).map(({ metric }) =>
    getGuideLabels(locale).metrics[metric].toLowerCase(),
  );
  if (names.length === 0) return t.yourData;
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} ${t.and} ${names.at(-1)}`;
  return `${t.your} ${list}`;
}

export function guidePageCopy(page: GuidePage, locale: Locale) {
  const t = getDictionary(locale).guidePage;
  const hub = getGuideLabels(locale).hub[page.os];
  const app = page.source.name;
  const phone = OS_LABEL[page.os];
  const data = dataPhrase(page, locale);
  return {
    title: t.title(app, hub, phone),
    description: t.description(app, hub, phone, data),
    intro: t.intro(app, hub, data),
    next: t.next(app, hub),
  };
}

export default function GuideDetailPage({
  page,
  locale,
}: {
  page: GuidePage;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const t = dict.guidePage;
  const labels = getGuideLabels(locale);
  const copy = guidePageCopy(page, locale);
  const { source, os } = page;
  const other: Locale = locale === "en" ? "fr" : "en";
  const hubPath = routePath("guide", locale);
  const path = guidePagePath(locale, page.slug);

  const otherOs = source.platforms.find((p) => p !== os);
  const siblings = getGuidePages(locale).filter(
    (p) => p.os === os && p.source.id !== source.id,
  );

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Sapiens Rank", path: routePath("home", locale) },
      { name: t.breadcrumb, path: hubPath },
      { name: copy.title, path },
    ].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: SITE_URL + item.path,
    })),
  };

  const steps = source.steps[os] ?? [];
  const shots = source.shots?.[os] ?? [];
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: copy.title,
    description: copy.description,
    inLanguage: locale,
    step: steps.map((text, i) => {
      const shot = shots.find((s) => s.step === i + 1);
      return {
        "@type": "HowToStep",
        position: i + 1,
        text,
        ...(shot && { image: SITE_URL + shot.src }),
      };
    }),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <JsonLd data={breadcrumb} />
      <JsonLd data={howTo} />

      <Header locale={locale} alternate={guidePagePath(other, page.slug)} />

      {/* Hero */}
      <section className="px-6 pt-32 pb-10">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
            <Link href={hubPath} className="hover:text-lime-300 transition-colors">
              ← {t.breadcrumb}
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-6">
            {copy.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">{copy.intro}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <GuideArticle source={source} os={os} labels={labels} heading="h2" />

          <div className="mt-8 rounded-3xl border border-white/10 px-6 py-6 sm:px-8">
            <h2 className="text-lg font-semibold mb-2">{t.nextTitle}</h2>
            <p className="text-sm leading-relaxed text-gray-400">{copy.next}</p>
          </div>
        </div>
      </section>

      {/* Related guides */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {otherOs && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                {t.otherPhoneTitle}
              </h2>
              <Link
                href={guidePagePath(locale, guideSlug(source.id, otherOs))}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm hover:border-white/25 hover:bg-white/[0.04] transition-colors"
              >
                <SourceLogo source={source} className="h-4" />
                {t.appOnPhone(source.name, OS_LABEL[otherOs])} →
              </Link>
            </div>
          )}

          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
              {t.otherApps}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {siblings.map((p) => (
                <Link
                  key={p.slug}
                  href={guidePagePath(locale, p.slug)}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 hover:border-white/25 hover:bg-white/[0.04] transition-colors"
                >
                  <SourceLogo source={p.source} className="h-5 mb-3" />
                  <span className="block text-sm font-medium">{p.source.name}</span>
                </Link>
              ))}
              <Link
                href={hubPath}
                className="flex items-center rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-gray-400 hover:border-white/25 hover:text-white transition-colors"
              >
                {t.allApps} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto rounded-3xl border border-lime-300/20 bg-lime-300/[0.04] px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold mb-3">{t.ctaTitle}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">{t.ctaText}</p>
          <StoreBadges locale={locale} />
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
