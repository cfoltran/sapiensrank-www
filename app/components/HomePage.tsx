import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import Podium from "./Podium";
import StoreBadges from "./StoreBadges";
import { getDictionary } from "../dictionaries";
import { SITE_NAME, SITE_URL, STORE_LINKS, routePath, type Locale } from "../i18n";

const screenshots = ["/1.webp", "/2.webp", "/3.webp", "/4.webp", "/5.webp"];

export default function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.home;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: SITE_NAME,
    url: SITE_URL + routePath("home", locale),
    description: dict.meta.homeDescription,
    inLanguage: locale,
    image: `${SITE_URL}/AppIcon.png`,
    screenshot: screenshots.map((src) => SITE_URL + src),
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS 16+, Android",
    installUrl: [STORE_LINKS.ios[locale], STORE_LINKS.android],
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Header locale={locale} route="home" />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            Sapiens Rank
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            {t.heroTitle} <span className="text-lime-300">{t.heroAccent}</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {t.heroText}
          </p>
          <StoreBadges locale={locale} priority />
        </div>
      </section>

      {/* Screenshots */}
      <section className="pb-20">
        <div className="overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
          <div className="flex gap-4 w-max mx-auto px-6">
            {screenshots.map((src, i) => (
              <div
                key={src}
                className="flex-shrink-0 snap-center w-[200px] sm:w-[220px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
              >
                <Image
                  src={src}
                  alt={t.screenshots[i]}
                  width={440}
                  height={952}
                  className="w-full h-auto"
                  priority={i < 3}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-white/10 mx-6 mb-20" />

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-8">
            {t.howItWorks}
          </h2>
          <ol className="flex flex-col gap-5">
            {t.steps.map((text, i) => (
              <li key={text} className="flex items-start gap-4 text-sm text-gray-300 leading-relaxed">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-lime-300/10 text-lime-300 text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
          <Link
            href={routePath("guide", locale)}
            className="mt-8 inline-block text-sm text-lime-300/80 hover:text-lime-300 transition-colors"
          >
            {t.guideLink} →
          </Link>
        </div>
      </section>

      <hr className="border-white/10 mx-6 mb-20" />

      <Podium eyebrow={dict.podium.eyebrow} title={dict.podium.title} />

      <hr className="border-white/10 mx-6 mb-20" />

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            {t.ctaTitle} <span className="text-lime-300">{t.ctaAccent}</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
            {t.ctaText}
          </p>
          <StoreBadges locale={locale} />
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-gray-600">
            {t.badges.map((badge, i) => (
              <span key={badge} className="contents">
                {i > 0 && <span>·</span>}
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
