import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import PaceCta from "./PaceCta";
import Stat from "./Stat";
import { getPaceCopy, type PaceCopy } from "./paceCopy";
import {
  DISTANCE_IDS,
  DISTANCE_KM,
  DISTANCE_NAME,
  GOALS,
  MILE_KM,
  capitalize,
  formatDuration,
  formatKm,
  formatPace,
  formatSpeed,
  goalPath,
  goalTimeLabel,
  splitPoints,
  typicalGoal,
  type Goal,
} from "./pace";
import { SITE_URL, routePath, type Locale } from "../i18n";

function SplitsTable({
  points,
  paceSeconds,
  locale,
  labels,
}: {
  points: number[];
  paceSeconds: number;
  locale: Locale;
  labels: PaceCopy["calc"];
}) {
  const last = points.at(-1);
  return (
    <table className="mt-4 w-full text-sm tabular-nums">
      <thead>
        <tr className="text-left text-xs text-gray-500">
          <th className="py-2 font-normal">{labels.km}</th>
          <th className="py-2 font-normal text-right">{labels.elapsed}</th>
        </tr>
      </thead>
      <tbody>
        {points.map((km) => {
          const isFinish = km === last;
          const isHalf = !isFinish && km === DISTANCE_KM.half;
          return (
            <tr key={km} className="border-t border-white/5">
              <td className={`py-2 ${isFinish ? "text-white font-medium" : "text-gray-400"}`}>
                {formatKm(km, locale)}
                {isFinish && <span className="ml-2 text-xs text-lime-300">{labels.finish}</span>}
                {isHalf && <span className="ml-2 text-xs text-gray-500">{labels.halfway}</span>}
              </td>
              <td className={`py-2 text-right ${isFinish ? "text-white font-medium" : "text-gray-300"}`}>
                {formatDuration(km * paceSeconds)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function goalCopy(goal: Goal, locale: Locale) {
  const t = getPaceCopy(locale).goal;
  const km = DISTANCE_KM[goal.distance];
  const paceSeconds = goal.seconds / km;
  const race = DISTANCE_NAME[locale][goal.distance];
  const time = goalTimeLabel(goal.seconds, locale);
  const pace = formatPace(paceSeconds);
  const mile = formatPace(paceSeconds * MILE_KM);
  const speed = formatSpeed(paceSeconds, locale);
  return {
    paceSeconds,
    pace,
    mile,
    speed,
    title: t.title(race, time, pace),
    description: t.description(race, time, pace, mile, speed),
    // "5 km" and "5K" already carry the distance; only the long races need it.
    intro: t.intro(
      race,
      time,
      goal.distance === "half" || goal.distance === "marathon" ? formatKm(km, locale) : null,
      pace,
      speed,
    ),
  };
}

export default function PaceGoalPage({ goal, locale }: { goal: Goal; locale: Locale }) {
  const copy = getPaceCopy(locale);
  const t = copy.goal;
  const c = goalCopy(goal, locale);
  const other: Locale = locale === "en" ? "fr" : "en";
  const hubPath = routePath("pace", locale);
  const names = DISTANCE_NAME[locale];

  const sameDistance = GOALS.filter(
    (g) => g.distance === goal.distance && g.seconds !== goal.seconds,
  );
  const related = [
    ...sameDistance,
    ...DISTANCE_IDS.filter((id) => id !== goal.distance).map(typicalGoal),
  ];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Sapiens Rank", path: routePath("home", locale) },
      { name: t.breadcrumb, path: hubPath },
      { name: c.title, path: goalPath(goal, locale) },
    ].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: SITE_URL + item.path,
    })),
  };

  const chip =
    "rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400 hover:border-lime-300/50 hover:text-lime-300 transition-colors";

  return (
    <div className="min-h-screen bg-black text-white">
      <JsonLd data={breadcrumb} />

      <Header locale={locale} alternate={goalPath(goal, other)} />

      {/* Hero */}
      <section className="px-6 pt-32 pb-10">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
            <Link href={hubPath} className="hover:text-lime-300 transition-colors">
              ← {t.breadcrumb}
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-6">{c.title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed">{c.intro}</p>
        </div>
      </section>

      {/* Key numbers */}
      <section className="px-6 pb-10">
        <dl className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
          {[
            { label: copy.calc.pace, value: c.pace, unit: copy.calc.perKm },
            { label: copy.calc.pace, value: c.mile, unit: copy.calc.perMile },
            { label: copy.calc.speed, value: c.speed, unit: "km/h" },
          ].map((stat) => (
            <Stat key={stat.unit} {...stat} large />
          ))}
        </dl>
      </section>

      {/* Splits */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <h2 className="text-xl font-semibold">{t.splitsTitle}</h2>
          <SplitsTable
            points={splitPoints(DISTANCE_KM[goal.distance])}
            paceSeconds={c.paceSeconds}
            locale={locale}
            labels={copy.calc}
          />
          <Link
            href={`${hubPath}?d=${goal.distance}&t=${goal.seconds}`}
            className="mt-6 inline-block text-sm text-gray-400 hover:text-lime-300 transition-colors"
          >
            {t.adjust} →
          </Link>
        </div>
      </section>

      <PaceCta locale={locale} />

      {/* Related goals, kept small: they mostly link the goal pages together */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            {t.otherGoals}
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((g) => (
              <Link key={`${g.distance}-${g.seconds}`} href={goalPath(g, locale)} className={chip}>
                {capitalize(names[g.distance])} {goalTimeLabel(g.seconds, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
