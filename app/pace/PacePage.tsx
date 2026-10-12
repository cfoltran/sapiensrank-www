import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import PaceCalculator from "./PaceCalculator";
import PaceCta from "./PaceCta";
import { getPaceCopy } from "./paceCopy";
import {
  DISTANCE_IDS,
  DISTANCE_NAME,
  PREFILL_STYLE_ID,
  capitalize,
  goalPath,
  goalTimeLabel,
  typicalGoal,
} from "./pace";
import { SITE_NAME, SITE_URL, routePath, type Locale } from "../i18n";

export default function PacePage({ locale }: { locale: Locale }) {
  const t = getPaceCopy(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.meta.title,
    url: SITE_URL + routePath("pace", locale),
    description: t.meta.description,
    inLanguage: locale,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <JsonLd data={jsonLd} />

      <Header locale={locale} route="pace" />

      {/* Hero */}
      <section className="px-6 pt-32 pb-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            {t.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            {t.title} <span className="text-lime-300">{t.titleAccent}</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">{t.intro}</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Runs during parsing, before the default values paint: a goal page
              link (?d=&t=) would otherwise flash 10 km / 50:00 first. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `if(/[?&]t=/.test(location.search))document.head.insertAdjacentHTML("beforeend",'<style id="${PREFILL_STYLE_ID}">.pace-form{visibility:hidden}</style>')`,
            }}
          />
          <PaceCalculator locale={locale} copy={t.calc} />
          {/* The one link into the goal pages; they link to each other. */}
          <p className="mt-4 text-xs text-gray-500">
            {t.popularGoals}{" "}
            {DISTANCE_IDS.map((id, i) => {
              const goal = typicalGoal(id);
              return (
                <span key={id}>
                  {i > 0 && ", "}
                  <Link href={goalPath(goal, locale)} className="hover:text-lime-300 transition-colors">
                    {capitalize(DISTANCE_NAME[locale][id])} {goalTimeLabel(goal.seconds, locale)}
                  </Link>
                </span>
              );
            })}
          </p>
        </div>
      </section>

      <PaceCta locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}
