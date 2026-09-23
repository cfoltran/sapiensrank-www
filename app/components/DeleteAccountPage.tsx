import Header from "./Header";
import Footer from "./Footer";
import { getDictionary } from "../dictionaries";
import type { Locale } from "../i18n";

export default function DeleteAccountPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).deleteAccount;
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#111] text-white">
      <Header locale={locale} route="deleteAccount" />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-12 space-y-8">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>

        <p className="text-lg leading-relaxed">{t.intro}</p>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">{t.fromApp}</h2>
          <ol className="list-decimal pl-6 space-y-3 text-lg">
            {t.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">{t.help}</h2>
          <p className="text-lg leading-relaxed">
            {t.helpBefore}
            <a href="mailto:contact@pommef.com" className="text-blue-400 hover:text-blue-300">
              contact@pommef.com
            </a>
            {t.helpAfter}
          </p>
        </section>
      </div>
      <Footer locale={locale} />
    </div>
  );
}
