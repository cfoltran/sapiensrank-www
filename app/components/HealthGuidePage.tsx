import Header from "./Header";
import Footer from "./Footer";
import GuideSelector from "./GuideSelector";
import { getGuideLabels, getSources } from "./guideSources";
import { getDictionary } from "../dictionaries";
import type { Locale } from "../i18n";

export default function HealthGuidePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).guide;
  return (
    <div className="min-h-screen bg-black text-white">
      <Header locale={locale} route="guide" />

      {/* Hero */}
      <section className="px-6 pt-32 pb-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            {t.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            {t.title} <span className="text-lime-300">{t.titleAccent}</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            {t.intro.before}
            <strong className="text-white">{t.intro.ios}</strong>
            {t.intro.middle}
            <strong className="text-white">{t.intro.android}</strong>
            {t.intro.after}
          </p>
        </div>
      </section>

      {/* Selector */}
      <section className="px-6 pb-16">
        <GuideSelector sources={getSources(locale)} labels={getGuideLabels(locale)} />
      </section>

      <Footer locale={locale} />
    </div>
  );
}
