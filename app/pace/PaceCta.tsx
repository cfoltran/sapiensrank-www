import Image from "next/image";
import StoreBadges from "../components/StoreBadges";
import { getPaceCopy } from "./paceCopy";
import type { Locale } from "../i18n";

export default function PaceCta({ locale }: { locale: Locale }) {
  const t = getPaceCopy(locale).cta;
  return (
    <section className="px-6 pb-20">
      <div className="max-w-3xl mx-auto overflow-hidden rounded-3xl border border-lime-300/25 bg-gradient-to-br from-lime-300/[0.10] to-transparent">
        <div className="grid items-center gap-8 px-6 pt-10 sm:grid-cols-[1fr_200px] sm:px-10 sm:py-10">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-lime-300/80 mb-3">
              {t.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight mb-4">{t.title}</h2>
            <p className="text-gray-300 leading-relaxed mb-8">{t.text}</p>
            <div className="sm:[&>div]:justify-start">
              <StoreBadges locale={locale} />
            </div>
            <p className="mt-4 text-xs text-gray-500">{t.note}</p>
          </div>
          <div className="mx-auto w-[180px] sm:w-full -mb-24 sm:mb-0 overflow-hidden rounded-[28px] border border-white/10 shadow-2xl">
            <Image
              src={`/2${locale}.webp`}
              alt={t.screenshot}
              width={440}
              height={952}
              sizes="200px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
